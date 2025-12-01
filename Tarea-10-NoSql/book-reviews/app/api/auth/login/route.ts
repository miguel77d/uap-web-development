// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDB } from "@/lib/db";
import User from "@/models/User";
import { loginSchema } from "@/lib/validators";
import { signSession, setSessionCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  await connectToDB();
  const body = await req.json();
  const parse = loginSchema.safeParse(body);
  if (!parse.success) return NextResponse.json({ error: parse.error.flatten() }, { status: 400 });

  const { email, password } = parse.data;

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });

  const token = signSession({ userId: String(user._id) });
  setSessionCookie(token);

  return NextResponse.json({ message: "Login ok", user: { _id: user._id, email: user.email, name: user.name } });
}
