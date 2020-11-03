import express from "express";
import { getConnectionOptions, createConnection } from "typeorm";
import { __prod__, PORT } from "./constants";
import { User } from "./entities/User";

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

    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  } catch (err) {
    console.log("Error while starting server: ", err);
  }
};

main();
