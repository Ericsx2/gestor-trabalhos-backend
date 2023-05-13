import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { subjectRouter, projectRouter, authRouter, userRouter, firstAccessRouter } from './routes';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/projects', projectRouter);
app.use('/subjects', subjectRouter);
app.use('/auth', authRouter);
app.use('/user', userRouter);
app.use('/firstAccess', firstAccessRouter);

export default app;
