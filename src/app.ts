import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import 'express-async-errors';

import {
  subjectRouter,
  projectRouter,
  authRouter,
  userRouter,
  firstAccessRouter,
} from './routes';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/project', projectRouter);
app.use('/subject', subjectRouter);
app.use('/auth', authRouter);
app.use('/firstAccess', firstAccessRouter);
app.use('/user', userRouter);

export default app;
