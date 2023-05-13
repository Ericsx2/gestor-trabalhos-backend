import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { subjectRouter, projectRouter, authRouter, userRouter } from './routes';

const app = express();
app.use(express.json());
app.use(cors());

app.use('/projects', projectRouter);
app.use('/subjects', subjectRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);

export default app;
