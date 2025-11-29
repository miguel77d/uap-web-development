// lib/requireAuth.ts
import type { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import { getUserFromRequest } from "./auth";

export function requireAuth(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const user = getUserFromRequest(req);

    if (!user) {
      return res.status(401).json({ message: "No autenticado" });
    }

    // Guardamos info del usuario para que la ruta pueda usarla
    (req as any).user = user;

    return handler(req, res);
  };
}
