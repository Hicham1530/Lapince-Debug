import { Sequelize } from "sequelize";
import * as dotenv from "dotenv";
dotenv.config();

console.log("Chargement .env réussi");
console.log("DATABASE_URL =", process.env.DATABASE_URL);

let sequelize;

if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "postgres",
      logging: false,
    }
  );
}

export default sequelize;
