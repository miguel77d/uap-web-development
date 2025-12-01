import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  userAddress?: string
}

const JWT_SECRET = process.env.JWT_SECRET || 'changeme'

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const header = req.headers.authorization
  if (!header) {
    return res.status(401).json({ error: 'Falta header Authorization' })
  }

  const [scheme, token] = header.split(' ')
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Formato de Authorization inválido' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { address: string }
    req.userAddress = payload.address
    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
