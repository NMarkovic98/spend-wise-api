import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../entities/user";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: false,
  entities: [User],
  ssl: {
    rejectUnauthorized: false,
  },
});
