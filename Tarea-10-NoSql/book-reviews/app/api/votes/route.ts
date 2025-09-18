// app/api/votes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Vote from "@/models/Vote";
import { voteSchema } from "@/lib/validators";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectToDB();
  const user = requireAuth(req);
  if (!(user as any).userId) return user as any;

  const body = await req.json();
  const parse = voteSchema.safeParse(body);
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });

  const { reviewId, value } = parse.data;
  const updated = await Vote.findOneAndUpdate(
    { reviewId, userId: (user as any).userId },
    { value },
    { upsert: true, new: true }
  );

  return NextResponse.json(updated, { status: 201 });
}
