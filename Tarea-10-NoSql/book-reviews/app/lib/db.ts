// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

// Usamos una variable global para evitar múltiples conexiones en dev (Next recarga mucho)
let cached = (global as any).mongoose as
  | { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null }
  | undefined;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    cached!.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("✅ Conectado a MongoDB");
      return mongoose;
    });
  }

  cached!.conn = await cached!.promise;
  return cached!.conn;
}
