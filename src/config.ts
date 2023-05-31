import dotenv from 'dotenv';

dotenv.config();

export const DBhost = process.env.DBhost;
export const DBuser = process.env.DBuser;
export const DBpassword = process.env.DBpassword;
export const database = process.env.database;
