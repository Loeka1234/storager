import "reflect-metadata";
import { getConnectionOptions, createConnection } from "typeorm";
import { __prod__, PORT, COOKIE_SECRET, COOKIE_NAME } from "./constants";
import { User } from "./entities/User";
import { useExpressServer } from "routing-controllers";
import { UserController } from "./controllers/UserController";
import { TestController } from "./controllers/TestController";
import session from "express-session";
import redis from "redis";
import connectRedis from "connect-redis";
import express from "express";

const main = async () => {
  const connectionOptions = await getConnectionOptions();

  Object.assign(connectionOptions, {
    synchronize: !__prod__,
    logging: !__prod__,
    entities: [User],
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

    useExpressServer(app, {
      controllers: [UserController, TestController],
    }).listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.log("Error while starting server: ", err);
  }
};

main();
