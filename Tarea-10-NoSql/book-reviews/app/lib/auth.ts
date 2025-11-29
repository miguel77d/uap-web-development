// lib/auth.ts
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextApiRequest } from "next";
import { User, IUser } from "../models/user";

const JWT_SECRET = process.env.JWT_SECRET!;

// Hashea una contraseña en texto plano
export async function hashPassword(plainPassword: string) {
  const saltRounds = 10;
  return bcrypt.hash(plainPassword, saltRounds);
}

// Compara una contraseña en texto plano con el hash guardado
export async function verifyPassword(
  plainPassword: string,
  hashedPassword: string
) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Crea un JWT con info básica del usuario
export function createAuthToken(user: IUser) {
  const payload = {
    userId: user._id.toString(),
    email: user.email,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

// Lee la cookie auth_token de la request y devuelve los datos del usuario
export function getUserFromRequest(req: NextApiRequest) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [k, v] = c.trim().split("=");
      return [k, decodeURIComponent(v)];
    })
  );

  const token = cookies["auth_token"];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: string;
      email: string;
    };
    return decoded;
  } catch (err) {
    return null;
  }
}
