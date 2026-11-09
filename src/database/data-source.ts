import 'dotenv/config';
import { DataSource } from 'typeorm';
import { STERINOVA_ENTITIES } from './entities.js';
import { DATABASE_MIGRATIONS } from './migration-registry.js';

export const AppDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: STERINOVA_ENTITIES,
  migrations: DATABASE_MIGRATIONS,
  migrationsTableName: 'typeorm_migrations',
  migrationsTransactionMode: 'each',
  synchronize: false,
});
