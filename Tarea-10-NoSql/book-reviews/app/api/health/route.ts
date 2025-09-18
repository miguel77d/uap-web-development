export const runtime = "nodejs";
import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";

export async function GET() {
  try {
    const conn = await connectToDB();
    const dbName = conn.connection.db.databaseName;
    return NextResponse.json({ ok: true, envHasUri: !!process.env.MONGODB_URI, db: dbName });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
