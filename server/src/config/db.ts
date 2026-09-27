import mongoose from 'mongoose';
import { env } from './env.js';

let replSetInstance: any = null;

export const connectDatabase = async (): Promise<boolean> => {
  try {
    mongoose.set('strictQuery', true);

    // Attempt connecting to specified MONGODB_URI with a 3s timeout
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`✅ MongoDB connected successfully to ${env.MONGODB_URI}`);
    return true;
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB connection failed (${(error as Error).message}).`);

    // In development or test mode, launch MongoMemoryReplSet to support MongoDB Transactions natively
    if (env.NODE_ENV === 'development' || env.NODE_ENV === 'test') {
      try {
        console.log('ℹ️ Launching MongoMemoryReplSet for local development & transaction support...');
        const { MongoMemoryReplSet } = await import('mongodb-memory-server');
        replSetInstance = await MongoMemoryReplSet.create({
          replSet: { count: 1, storageEngine: 'wiredTiger' },
        });
        const mongoUri = replSetInstance.getUri();

        await mongoose.connect(mongoUri);
        console.log(`✅ MongoDB ReplicaSet connected successfully via MongoMemoryReplSet at ${mongoUri}`);
        return true;
      } catch (memError) {
        console.error('❌ MongoMemoryReplSet fallback failed:', (memError as Error).message);
        return false;
      }
    }

    return false;
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await mongoose.disconnect();
  if (replSetInstance) {
    await replSetInstance.stop();
    replSetInstance = null;
  }
};

export const getDatabaseStatus = () => {
  const readyStateMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  const stateCode = mongoose.connection.readyState;
  const state = readyStateMap[stateCode] || 'unknown';

  return {
    isConnected: stateCode === 1,
    state,
    dbName: mongoose.connection.name || null,
    host: mongoose.connection.host || null,
    isReplicaSet: !!replSetInstance || stateCode === 1,
  };
};
