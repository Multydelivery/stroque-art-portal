import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;

type CachedConnection = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongoose = globalThis as typeof globalThis & {
  mongooseCache?: CachedConnection;
};

const cached = globalForMongoose.mongooseCache ?? { conn: null, promise: null };
globalForMongoose.mongooseCache = cached;

export async function connectToDatabase() {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // Mongoose keeps API routes fast in development by reusing this connection.
    cached.promise = mongoose.connect(uri!, {
      dbName: "stroque-art-portal"
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
