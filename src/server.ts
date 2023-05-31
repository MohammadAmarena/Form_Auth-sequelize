import express from 'express';
import { sequelize } from './config/database';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';

const app = express();
const port = 3111;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cors());
app.use(cookieParser());
app.use('/', authRoutes);

app.listen(port, async () => {
  console.log(`Listening on http://localhost:${port}`);

  try {
    await sequelize.sync();
    console.log('Database synced');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
});
