// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import { registerSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  await connectToDB();
  const body = await req.json();
  const parse = registerSchema.safeParse(body);
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });

  const { email, password, name } = parse.data;

  const exists = await User.findOne({ email });
  if (exists) return NextResponse.json({ error: "Email ya registrado" }, { status: 409 });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, passwordHash, name });
  return NextResponse.json({ _id: user._id, email: user.email, name: user.name }, { status: 201 });
}
