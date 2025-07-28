import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL n'est pas définie dans le .env");
  process.exit(1); // Stoppe l'application
}

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  logging: false, // désactive les logs SQL
});

export default sequelize;
