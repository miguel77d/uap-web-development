// app/api/reviews/route.ts  (GET lista, POST crea)
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Review from "@/models/Review";
import { reviewCreateSchema } from "@/lib/validators";
import { getUserFromRequest, requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  await connectToDB();
  const bookId = req.nextUrl.searchParams.get("bookId");
  const query: any = {};
  if (bookId) query.bookId = bookId;

  const reviews = await Review.find(query).sort({ createdAt: -1 }).lean();
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  await connectToDB();
  const user = requireAuth(req);
  if (!(user as any).userId) return user as any;

  const body = await req.json();
  const parse = reviewCreateSchema.safeParse(body);
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });

  const created = await Review.create({ ...parse.data, userId: (user as any).userId });
  return NextResponse.json(created, { status: 201 });
}
