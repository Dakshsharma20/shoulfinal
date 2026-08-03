import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

/**
 * In serverless environments (Vercel/Netlify) and in Next.js dev mode
 * with hot reload, modules can be re-evaluated on every request. Without
 * caching the connection on the global object, each request would open
 * a brand new MongoDB connection, quickly exhausting the connection
 * pool. This is the standard pattern recommended by both Mongoose and
 * Next.js docs.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
if (!global._mongooseCache) {
  global._mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (!MONGODB_URI) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.local.example to .env.local and add your MongoDB Atlas connection string."
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    throw err;
  }

  return cached.conn;
}

export default connectDB;
