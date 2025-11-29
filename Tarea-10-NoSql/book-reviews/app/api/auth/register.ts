// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "../../../lib/db";
import { User } from "../../../models/user";
import { hashPassword, createAuthToken } from "../../../lib/auth";
import { registerSchema } from "../../../lib/validation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  try {
    await connectToDatabase();

    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      return res.status(400).json({ message: "Datos inválidos", errors });
    }

    const { email, password } = parsed.data;

    // Verificar si ya existe un usuario con ese email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    // Hashear la contraseña
    const passwordHash = await hashPassword(password);

    const user = await User.create({ email, passwordHash });

    // Crear token JWT
    const token = createAuthToken(user);

    // Guardar token en cookie httpOnly
    res.setHeader(
      "Set-Cookie",
      `auth_token=${encodeURIComponent(
        token
      )}; Path=/; HttpOnly; SameSite=Lax`
    );

    return res.status(201).json({
      message: "Usuario registrado correctamente",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Error en /api/auth/register", err);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}
