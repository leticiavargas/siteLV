import { setGlobalOptions } from 'firebase-functions';
import { onRequest } from 'firebase-functions/https';
import express from 'express';
import cors from 'cors';

import artigosRouter from './src/routes/articles.js';
import faqRouter from './src/routes/faq.js';
import projetosRouter from './src/routes/projects.js';
import areasRouter from './src/routes/areas.js';
import materiaisRouter from './src/routes/materials.js';
import eventsRouter from './src/routes/events.js';
import uploadRouter from './src/routes/upload.js';
import adminUsersRouter from './src/routes/adminUsers.js';

setGlobalOptions({ maxInstances: 10 });

const app = express();
app.use(cors());
app.use(express.json({ limit: '15mb' }));

app.use('/articles', artigosRouter);
app.use('/faq', faqRouter);
app.use('/projects', projetosRouter);
app.use('/areas', areasRouter);
app.use('/materials', materiaisRouter);
app.use('/events', eventsRouter);
app.use('/upload', uploadRouter);
app.use('/adminUsers', adminUsersRouter);

export const api = onRequest(app);
