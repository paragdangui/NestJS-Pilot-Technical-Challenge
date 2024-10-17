import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';
import { User } from './user/entities/user.entity';
import { List } from './list/entities/list.entity';
import { ListItem } from './list-item/entities/list-item.entity';

dotenv.config(); // Load environment variables

export const AppDataSource = new DataSource({
  type: 'mysql', // or another database type
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'root',
  database: 'list_management',
  entities: [User, List, ListItem],
  migrations: [join(__dirname + '/migrations/*.ts')], // Point to your migrations folder
  synchronize: false, // Must be false when using migrations
});

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
