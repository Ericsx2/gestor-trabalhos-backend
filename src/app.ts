import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import { studentRouter, teacherRouter, projectRouter, matterRouter } from './routes';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/students', studentRouter);
app.use('/teachers', teacherRouter);
app.use('/projects', projectRouter);
app.use('/matters', matterRouter);

export default app;
