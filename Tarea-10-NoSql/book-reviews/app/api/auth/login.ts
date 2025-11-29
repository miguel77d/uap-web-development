// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { User } from "../../../models/user";
import { verifyPassword, createAuthToken } from "../../../lib/auth";
import { loginSchema } from "../../../lib/validation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    await connectToDatabase();

    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return res.status(400).json({ message: "Datos inválidos", errors });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Credenciales inválidas (email)" });
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return res
        .status(401)
        .json({ message: "Credenciales inválidas (password)" });
    }

    const token = createAuthToken(user);

    res.setHeader(
      "Set-Cookie",
      `auth_token=${encodeURIComponent(
        token
      )}; Path=/; HttpOnly; SameSite=Lax`
    );

    return res.status(200).json({
      message: "Login exitoso",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error en /api/auth/login", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
