import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
//dotenv.config({ path: __dirname + "/../.env" });
dotenv.config();



const port = process.env.DB_PORT as number | undefined;

export const AppDataSource = new DataSource({
  type: "mysql",
  host:  process.env.HOST, // deploy -> host: "mysql-pepvagas"
  port: 3306,
  username: process.env.USER,
  password: process.env.PASS, // deploy -> password: "SnFlaA9BAVCXNBZVtmOS4kgZlspmHNgeAVTcVS"
  database:  process.env.DATABASE,
  migrationsRun: true,
  synchronize: true,
  logging: false,
  entities: [__dirname + "/models/*.{ts,js}"],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
  subscribers: [],
});
