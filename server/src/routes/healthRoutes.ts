import { Router, Request, Response } from 'express';
import { getDatabaseStatus } from '../config/db.js';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  const dbStatus = getDatabaseStatus();

  res.status(200).json({
    success: true,
    message: 'Feedants API is running',
    timestamp: new Date().toISOString(),
    services: {
      api: { status: 'healthy' },
      database: {
        status: dbStatus.isConnected ? 'healthy' : 'disconnected',
        state: dbStatus.state,
        dbName: dbStatus.dbName,
      },
    },
  });
});

export default router;
