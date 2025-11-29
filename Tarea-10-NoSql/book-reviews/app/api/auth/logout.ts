// pages/api/auth/logout.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método no permitido" });
  }

  // "Borramos" la cookie seteando Max-Age=0
  res.setHeader(
    "Set-Cookie",
    "auth_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax"
  );

  return res.status(200).json({ message: "Logout exitoso" });
}
