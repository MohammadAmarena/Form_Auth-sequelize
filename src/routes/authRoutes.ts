import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  currentUser?: string;
}

const router = Router();
const salt = 10;

const verifyUser = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ error: 'Not Authenticated' });
  }

  jwt.verify(token, 'm1', (err: any, decoded: any) => {
    if (err) {
      return res.json({ error: 'Token is not valid' });
    }

    req.currentUser = decoded.name;
    next();
  });
};

router.get('/', verifyUser, (req: CustomRequest, res: Response) => {
  res.json({ Status: 'Success', name: req.currentUser });
});

router.get('/me', verifyUser, (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.cookies.token;

  if (!token) {
    return res.json({ error: 'Not Authenticated' });
  }

  jwt.verify(token, 'm1', (err: any, decoded: any) => {
    if (err) {
      return res.json({ error: 'Token is not valid' });
    }

    req.currentUser = decoded.name;
    next();
  });
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const hash = await bcrypt.hash(password, salt);
    await User.create({ name, email, password: hash });
    res.json({ status: 'Success' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      const match = await bcrypt.compare(password, user.password);

      if (match) {
        const token = jwt        .sign({ name: user.name }, 'm1', { expiresIn: '1d' });
        res.cookie('token', token);
        res.json({ status: 'Success' });
      } else {
        res.json({ error: 'Password not matched' });
      }
    } else {
      res.json({ error: 'No email exists' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/logout', (req: Request, res: Response) => {
  res.clearCookie('token');
  res.json({ Status: 'Success' });
});

export default router;
