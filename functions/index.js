import { setGlobalOptions } from 'firebase-functions';
import { onRequest } from 'firebase-functions/https';
import express from 'express';
import cors from 'cors';
import next from 'next';

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

// Cloud Run Gen 2 consome o stream antes do body-parser — usa rawBody quando disponível
app.use((req, res, next) => {
  if (req.rawBody) {
    try { req.body = JSON.parse(req.rawBody.toString()); } catch { req.body = {}; }
    return next();
  }
  express.json({ limit: '15mb' })(req, res, next);
});

// Rotas sem prefixo (emulador: função recebe /articles)
// Rotas com prefixo /api (produção via Hosting rewrite: função recebe /api/articles)
const rotas = [
  ['/articles', artigosRouter],
  ['/faq', faqRouter],
  ['/projects', projetosRouter],
  ['/areas', areasRouter],
  ['/materials', materiaisRouter],
  ['/events', eventsRouter],
  ['/upload', uploadRouter],
  ['/adminUsers', adminUsersRouter],
];

for (const [path, router] of rotas) {
  app.use(path, router);
  app.use(`/api${path}`, router);
}

export const api = onRequest(app);

// Next SSR
const nextApp = next({ dev: false, conf: { distDir: '.next' } });
const nextReady = nextApp.prepare();
const nextHandler = nextApp.getRequestHandler();

export const nextServer = onRequest(
  { timeoutSeconds: 120, memory: '512MiB' },
  async (req, res) => {
    await nextReady;
    return nextHandler(req, res);
  }
);
