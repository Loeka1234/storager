import "reflect-metadata";
import { getConnectionOptions, createConnection } from "typeorm";
import { __prod__, PORT, COOKIE_SECRET, COOKIE_NAME, CORS } from "./constants";
import { User } from "./entities/User";
import { File } from "./entities/File";
import { Action, useExpressServer } from "routing-controllers";
import { UserController } from "./controllers/UserController";
import { TestController } from "./controllers/TestController";
import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { MeController } from "./controllers/MeController";
import { FileController } from "./controllers/FileController";

const main = async () => {
  const connectionOptions = await getConnectionOptions();

  Object.assign(connectionOptions, {
    synchronize: !__prod__,
    logging: !__prod__,
    entities: [User, File],
  });

  try {
    const conn = await createConnection(connectionOptions);

    if (__prod__) conn.runMigrations();

    const app = express();

    const RedisStore = connectRedis(session);
    const redisClient = redis.createClient();

    app.use(
      session({
        secret: COOKIE_SECRET,
        name: COOKIE_NAME,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
          httpOnly: true,
          secure: __prod__,
          sameSite: __prod__ ? "none" : "lax",
        },
        saveUninitialized: false,
        resave: false,
        store: new RedisStore({
          client: redisClient,
          disableTouch: true,
        }),
      })
    );

    app.use(
      cors({
        credentials: true,
        origin: CORS,
      })
    );

    app.use(morgan(__prod__ ? "tiny" : "dev"));

    useExpressServer(app, {
      controllers: [
        UserController,
        TestController,
        MeController,
        FileController,
      ],
      authorizationChecker: async (action: Action) => {
        if (action.request.session.user) return true;
        else return false;
      },
      currentUserChecker: async (action: Action) => {
        return action.request.session.user;
      },
    }).listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.log("Error while starting server: ", err);
  }
};

main();
