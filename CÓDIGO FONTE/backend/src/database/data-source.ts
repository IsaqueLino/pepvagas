import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
dotenv.config({ path: __dirname + "/../.env" });


const port = process.env.DB_PORT as number | undefined;

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost", // deploy -> host: "mysql-pepvagas"
  port: 3306,
  username: "root",
  password: "pa168645", // deploy -> password: "SnFlaA9BAVCXNBZVtmOS4kgZlspmHNgeAVTcVS"
  database: "db_pepvagas",
  migrationsRun: true,
  synchronize: true,
  logging: false,
  entities: [__dirname + "/models/*.{ts,js}"],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
  subscribers: [],
});
