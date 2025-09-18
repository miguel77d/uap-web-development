// app/api/favorites/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import { favoriteSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectToDB();
  const user = requireAuth(req);
  if (!(user as any).userId) return user as any;

  const favs = await Favorite.find({ userId: (user as any).userId }).lean();
  return NextResponse.json(favs);
}

export async function POST(req: NextRequest) {
  await connectToDB();
  const user = requireAuth(req);
  if (!(user as any).userId) return user as any;

  const body = await req.json();
  const parse = favoriteSchema.safeParse(body);
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });

  const created = await Favorite.create({ ...parse.data, userId: (user as any).userId });
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  await connectToDB();
  const user = requireAuth(req);
  if (!(user as any).userId) return user as any;

  const bookId = req.nextUrl.searchParams.get("bookId");
  if (!bookId) return NextResponse.json({ error: "Falta bookId" }, { status: 400 });

  await Favorite.findOneAndDelete({ userId: (user as any).userId, bookId });
  return NextResponse.json({ ok: true });
}
