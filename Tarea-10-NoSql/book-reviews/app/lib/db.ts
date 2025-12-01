// lib/db.ts
import mongoose from "mongoose";

let cached = (global as any).mongoose as { conn: typeof mongoose | null, promise: Promise<typeof mongoose> | null } | undefined;

if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

export async function connectToDB() {
  if (cached!.conn) return cached!.conn;
  if (!cached!.promise) {
    const uri = process.env.MONGODB_URI!;
    cached!.promise = mongoose.connect(uri, { dbName: "bookreviews" });
  }
  cached!.conn = await cached!.promise;
  return cached!.conn;
}
