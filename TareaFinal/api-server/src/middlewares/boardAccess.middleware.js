// src/middlewares/boardAccess.middleware.js

const { prisma } = require("../prisma");

/**
 * Middleware que verifica que el usuario tenga acceso al tablero.
 * - Usa req.params.boardId
 * - Usa req.user.id (ya chequeado por requireAuth)
 */
async function requireBoardAccess(req, res, next) {
  try {
    const boardId = Number(req.params.boardId);
    const userId = req.user.id;

    if (isNaN(boardId)) {
      return res.status(400).json({
        error: { message: "ID de tablero inválido." }
      });
    }

    // Buscamos si este usuario es miembro del tablero
    const membership = await prisma.boardMember.findFirst({
      where: {
        boardId,
        userId
      }
    });

    if (!membership) {
      return res.status(403).json({
        error: { message: "No tenés acceso a este tablero." }
      });
    }

    // Guardamos la membresía encontrada para usar en el controlador si hace falta
    req.boardMember = membership;
    req.boardId = boardId;

    next();
  } catch (error) {
    console.error("Error en requireBoardAccess:", error);
    return res.status(500).json({
      error: { message: "Error interno validando acceso al tablero." }
    });
  }
}

module.exports = {
  requireBoardAccess
};
