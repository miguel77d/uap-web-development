// src/middlewares/auth.middleware.js

const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma");

/**
 * Middleware para requerir que el usuario esté autenticado.
 * - Lee el token desde la cookie "token" (o header Authorization como backup).
 * - Verifica y decodifica el JWT.
 * - Carga el usuario desde la base de datos en req.user.
 */
async function requireAuth(req, res, next) {
  try {
    // 1) Leer el token
    let token = null;

    // Preferimos cookie (frontend con credenciales)
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Opcional: permitir también Authorization: Bearer <token>
    if (!token && req.headers.authorization) {
      const [scheme, value] = req.headers.authorization.split(" ");
      if (scheme === "Bearer" && value) {
        token = value;
      }
    }

    if (!token) {
      return res.status(401).json({
        error: {
          message: "No estás autenticado."
        }
      });
    }

    // 2) Verificar y decodificar el token
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("Falta JWT_SECRET en .env");
      return res.status(500).json({
        error: {
          message: "Configuración de servidor inválida (JWT)."
        }
      });
    }

    let payload;
    try {
      payload = jwt.verify(token, secret); // lanza error si está vencido o es inválido
    } catch (err) {
      console.error("Error verificando token:", err);
      return res.status(401).json({
        error: {
          message: "Token inválido o expirado."
        }
      });
    }

    // 3) Buscar el usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });

    if (!user) {
      return res.status(401).json({
        error: {
          message: "Usuario no encontrado."
        }
      });
    }

    // 4) Guardar el usuario en req.user y seguir
    req.user = user;
    next();
  } catch (error) {
    console.error("Error en requireAuth:", error);
    return res.status(500).json({
      error: {
        message: "Error interno de autenticación."
      }
    });
  }
}

module.exports = {
  requireAuth
};
