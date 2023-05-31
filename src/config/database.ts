import { Sequelize } from 'sequelize-typescript';
import * as config from './config.js';
import { User } from '../models/User';

export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: config.DBhost || 'localhost',
  username: config.DBuser || 'root',
  password: config.DBpassword || '',
  database: config.database,
  logging: false,
  models: [User], // Add the User model to the models array
});

export default sequelize;
