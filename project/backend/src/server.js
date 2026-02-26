import express from 'express';
import cors from 'cors';
import analyzeRoutes from './routes/analyzeRoutes.js';
import { env } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

const app = express();

app.use(
  cors({
    origin: env.allowedOrigin
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: env.nodeEnv });
});

app.use('/api', analyzeRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Backend server running on http://localhost:${env.port}`);
});
