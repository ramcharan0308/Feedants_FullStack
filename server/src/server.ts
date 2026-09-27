import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { seedDatabase } from './database/seed.js';
import healthRoutes from './routes/healthRoutes.js';
import competitionRoutes from './routes/competitionRoutes.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

// Security and utility middlewares
app.use(helmet());
app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

// General Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: { success: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests from this IP' } }
});
app.use('/api', limiter);

// Routes
app.use('/api/v1', healthRoutes);
app.use('/api/v1', competitionRoutes);

// Centralized Error Handling
app.use(errorHandler);

// Database connection & Server initialization
export const startServer = async () => {
  await connectDatabase();
  await seedDatabase();
  return app.listen(env.PORT, () => {
    console.log(`🚀 Feedants Server running on http://localhost:${env.PORT}`);
    console.log(`🏥 Health check available at http://localhost:${env.PORT}/api/v1/health`);
  });
};

const isTestEnv = process.env.NODE_ENV === 'test' || process.argv.some((arg) => arg.includes('test'));

if (!isTestEnv) {
  startServer();
}

export default app;
