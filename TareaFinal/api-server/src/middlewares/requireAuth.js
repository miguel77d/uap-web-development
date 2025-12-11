// src/middlewares/requireAuth.js
const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma");

/**
 * Middleware de autenticación.
 * - Lee el JWT desde la cookie "token"
 * - Verifica la firma con JWT_SECRET
 * - Carga el usuario y lo guarda en req.user
 */
async function requireAuth(req, res, next) {
  try {
    // 1) Leer token desde cookie
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        error: { message: "No estás autenticado (falta token)." }
      });
    }

    // 2) Verificar y decodificar
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Asumimos que en el JWT guardaste algo como { id, email }
    const userId = payload.id || payload.userId;

    if (!userId) {
      return res.status(401).json({
        error: { message: "Token inválido." }
      });
    }

    // 3) Buscar usuario en la BD (opcional pero recomendable)
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(401).json({
        error: { message: "Usuario no encontrado." }
      });
    }

    // 4) Guardar usuario en la request para usar en controladores
    req.user = {
      id: user.id,
      email: user.email,
      name: user.name
    };

    return next();
  } catch (error) {
    console.error("Error en requireAuth:", error);
    return res.status(401).json({
      error: { message: "Token inválido o expirado." }
    });
  }
}

module.exports = requireAuth;
