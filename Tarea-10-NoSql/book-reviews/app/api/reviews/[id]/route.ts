// app/api/reviews/[id]/route.ts  (PATCH/DELETE una review)
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/db";
import Review from "@/models/Review";
import { requireAuth } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB();
  const user = requireAuth(req);
  if (!(user as any).userId) return user as any;

  const rev = await Review.findById(params.id);
  if (!rev) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  if (String(rev.userId) !== (user as any).userId) return NextResponse.json({ error: "Sin permiso" }, { status: 403 });

  const body = await req.json();
  if (body.rating !== undefined) rev.rating = body.rating;
  if (body.comment !== undefined) rev.comment = body.comment;
  await rev.save();

  return NextResponse.json(rev);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB();
  const user = requireAuth(req);
  if (!(user as any).userId) return user as any;

  const rev = await Review.findById(params.id);
  if (!rev) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  if (String(rev.userId) !== (user as any).userId) return NextResponse.json({ error: "Sin permiso" }, { status: 403 });

  await rev.deleteOne();
  return NextResponse.json({ ok: true });
}
