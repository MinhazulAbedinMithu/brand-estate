import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable in .env.local'
  );
}

/**
 * Cached connection stored on the `global` object to survive
 * hot-reload between requests in Next.js development mode.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Augment the NodeJS global type to hold the cache
declare global {
  var _mongooseCache: MongooseCache | undefined; // eslint-disable-line no-var
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };

if (!global._mongooseCache) {
  global._mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI as string, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
