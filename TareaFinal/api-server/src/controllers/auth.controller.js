// src/controllers/auth.controller.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { prisma } = require("../prisma");

/**
 * Función de ayuda para armar el objeto de usuario "público"
 * (sin passwordHash ni campos sensibles).
 */
function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt
  };
}

/**
 * Controlador para registrar un nuevo usuario.
 * Ruta: POST /api/auth/register
 */
async function register(req, res) {
  try {
    const { email, password, name } = req.body;

    // 1) Validación básica del input
    if (!email || !password) {
      return res.status(400).json({
        error: {
          message: "Email y contraseña son obligatorios."
        }
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: {
          message: "La contraseña debe tener al menos 6 caracteres."
        }
      });
    }

    // 2) Verificar si ya existe un usuario con ese email
    const existing = await prisma.user.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(409).json({
        error: {
          message: "Ya existe un usuario registrado con ese email."
        }
      });
    }

    // 3) Hashear la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4) Crear el usuario en la base de datos
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name
      }
    });

    // 5) Devolver respuesta sin exponer la contraseña
    return res.status(201).json({
      message: "Usuario registrado correctamente.",
      user: toPublicUser(user)
    });
  } catch (error) {
    console.error("Error en register:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al registrar usuario."
      }
    });
  }
}

/**
 * Controlador para login de usuario.
 * Ruta: POST /api/auth/login
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1) Validación básica
    if (!email || !password) {
      return res.status(400).json({
        error: {
          message: "Email y contraseña son obligatorios."
        }
      });
    }

    // 2) Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: {
          message: "Credenciales inválidas."
        }
      });
    }

    // 3) Comparar contraseña
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        error: {
          message: "Credenciales inválidas."
        }
      });
    }

    // 4) Generar JWT
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("Falta JWT_SECRET en .env");
      return res.status(500).json({
        error: {
          message: "Configuración de servidor inválida (JWT)."
        }
      });
    }

    const payload = {
      userId: user.id,
      email: user.email
    };

    const token = jwt.sign(payload, secret, {
      expiresIn: "7d"
    });

    // 5) Guardar token en cookie HTTP-only
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // en producción debería ser true con HTTPS
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
    });

    // 6) Responder con datos del usuario
    return res.json({
      message: "Login exitoso.",
      user: toPublicUser(user)
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al hacer login."
      }
    });
  }
}

/**
 * Controlador para logout.
 * Ruta: POST /api/auth/logout
 */
async function logout(req, res) {
  try {
    // Borrar la cookie "token"
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });

    return res.json({
      message: "Logout exitoso."
    });
  } catch (error) {
    console.error("Error en logout:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al hacer logout."
      }
    });
  }
}

/**
 * Controlador para obtener el usuario actual.
 * Ruta: GET /api/auth/me
 * Requiere que un middleware (requireAuth) haya seteado req.user
 */
async function me(req, res) {
  try {
    // En el próximo paso vamos a hacer que requireAuth ponga el user en req.user
    if (!req.user) {
      return res.status(401).json({
        error: {
          message: "No estás autenticado."
        }
      });
    }

    return res.json({
      user: toPublicUser(req.user)
    });
  } catch (error) {
    console.error("Error en me:", error);
    return res.status(500).json({
      error: {
        message: "Error interno al obtener usuario actual."
      }
    });
  }
}

module.exports = {
  register,
  login,
  logout,
  me
};
