// src/controllers/boards.controller.js
const { prisma } = require("../prisma");

/**
 * Arma el objeto de tablero "público"
 */
function toPublicBoard(board) {
  return {
    id: board.id,
    title: board.title,
    description: board.description,
    ownerId: board.ownerId,
    createdAt: board.createdAt,
    updatedAt: board.updatedAt
  };
}

/**
 * GET /api/boards
 * Lista los tableros donde el usuario actual es miembro.
 */
async function listBoards(req, res) {
  try {
    const userId = req.user.id;

    const boards = await prisma.board.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json({
      boards: boards.map(toPublicBoard)
    });
  } catch (error) {
    console.error("Error en listBoards:", error);
    return res.status(500).json({
      error: { message: "Error interno al listar tableros." }
    });
  }
}

/**
 * POST /api/boards
 * Crea un nuevo tablero para el usuario actual.
 * Body esperado: { title, description? }
 */
async function createBoard(req, res) {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        error: { message: "El título del tablero es obligatorio." }
      });
    }

    const board = await prisma.board.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: "OWNER"
          }
        }
      }
    });

    return res.status(201).json({
      message: "Tablero creado correctamente.",
      board: toPublicBoard(board)
    });
  } catch (error) {
    console.error("Error en createBoard:", error);
    return res.status(500).json({
      error: { message: "Error interno al crear tablero." }
    });
  }
}

/**
 * DELETE /api/boards/:id
 * Solo el OWNER puede borrar el tablero.
 */
async function deleteBoard(req, res) {
  try {
    const userId = req.user.id;
    const boardId = Number(req.params.id);

    if (Number.isNaN(boardId)) {
      return res.status(400).json({
        error: { message: "ID de tablero inválido." }
      });
    }

    // ¿Existe y soy owner?
    const board = await prisma.board.findUnique({
      where: { id: boardId },
      include: {
        members: {
          where: { userId, role: "OWNER" }
        }
      }
    });

    if (!board) {
      return res.status(404).json({
        error: { message: "Tablero no encontrado." }
      });
    }

    if (board.members.length === 0) {
      return res.status(403).json({
        error: { message: "No tenés permiso para borrar este tablero." }
      });
    }

    await prisma.board.delete({
      where: { id: boardId }
    });

    return res.json({
      message: "Tablero eliminado correctamente."
    });
  } catch (error) {
    console.error("Error en deleteBoard:", error);
    return res.status(500).json({
      error: { message: "Error interno al borrar tablero." }
    });
  }
}

module.exports = {
  listBoards,
  createBoard,
  deleteBoard
};
