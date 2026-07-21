import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

// Module-level cache to reuse connection across hot-reloads in dev
// and across serverless function invocations in prod
declare global {
  // eslint-disable-next-line no-var
  var _mongooseConn: typeof mongoose | null;
}

let cached = global._mongooseConn ?? null;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached) return cached;

  cached = await mongoose.connect(MONGODB_URI, {
    bufferCommands: false,
  });

  global._mongooseConn = cached;
  return cached;
}
