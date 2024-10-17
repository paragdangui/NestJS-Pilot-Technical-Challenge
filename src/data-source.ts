import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config(); // Load environment variables

export const AppDataSource = new DataSource({
  type: 'mysql', // or another database type
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT, 10),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [join(__dirname + '/migrations/*.ts')], // Point to your migrations folder
  synchronize: false, // Must be false when using migrations
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    console.log(process.env.DB_HOST, 'process.env.DB_HOST');
    console.log(process.env.DB_PORT, 'process.env.DB_PORT');
    console.log(process.env.DB_USERNAME, 'process.env.DB_PORT');
    console.log(process.env.DB_PASSWORD, 'process.env.DB_PORT');
    console.log(process.env.DB_DATABASE, 'process.env.DB_PORT');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
