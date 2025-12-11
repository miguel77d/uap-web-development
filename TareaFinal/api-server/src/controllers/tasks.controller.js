// src/controllers/tasks.controller.js

const { prisma } = require("../prisma");

function toPublicTask(task) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    completed: task.completed,
    boardId: task.boardId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt
  };
}

/**
 * GET /api/boards/:boardId/tasks
 * Lista todas las tareas de un tablero.
 * - requireAuth + requireBoardAccess ya corrieron antes.
 */
async function listTasks(req, res) {
  try {
    const boardId = req.boardId; // viene del middleware requireBoardAccess

    const tasks = await prisma.task.findMany({
      where: { boardId },
      orderBy: { createdAt: "desc" }
    });

    return res.json({
      tasks: tasks.map(toPublicTask)
    });
  } catch (error) {
    console.error("Error en listTasks:", error);
    return res.status(500).json({
      error: { message: "Error interno al listar tareas." }
    });
  }
}

/**
 * POST /api/boards/:boardId/tasks
 * Crea una tarea en un tablero.
 */
async function createTask(req, res) {
  try {
    const boardId = req.boardId;
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        error: { message: "El título de la tarea es obligatorio." }
      });
    }

    const task = await prisma.task.create({
      data: {
        boardId,
        title: title.trim(),
        description: description?.trim() || null
      }
    });

    return res.status(201).json({
      message: "Tarea creada correctamente.",
      task: toPublicTask(task)
    });
  } catch (error) {
    console.error("Error en createTask:", error);
    return res.status(500).json({
      error: { message: "Error interno al crear tarea." }
    });
  }
}

/**
 * PATCH /api/tasks/:id
 * Edita una tarea (título, descripción, completed).
 * - Requiere: estar logueado.
 * - Permisos: OWNER o EDITOR del tablero al que pertenece la tarea.
 */
async function updateTask(req, res) {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.id;

    if (isNaN(taskId)) {
      return res.status(400).json({
        error: { message: "ID de tarea inválido." }
      });
    }

    // 1) Buscar la tarea
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({
        error: { message: "Tarea no encontrada." }
      });
    }

    // 2) Verificar que el usuario tenga permisos sobre el tablero de esa tarea
    const membership = await prisma.boardMember.findFirst({
      where: {
        boardId: task.boardId,
        userId
      }
    });

    if (!membership) {
      return res.status(403).json({
        error: { message: "No tenés acceso a esta tarea." }
      });
    }

    if (membership.role === "VIEWER") {
      return res.status(403).json({
        error: { message: "No tenés permisos para modificar tareas en este tablero." }
      });
    }

    const { title, description, completed } = req.body;

    // 3) Construir objeto de actualización
    const dataToUpdate = {};

    if (typeof title === "string") {
      if (title.trim().length === 0) {
        return res.status(400).json({
          error: { message: "El título no puede estar vacío." }
        });
      }
      dataToUpdate.title = title.trim();
    }

    if (typeof description === "string") {
      dataToUpdate.description = description.trim() || null;
    }

    if (typeof completed === "boolean") {
      dataToUpdate.completed = completed;
    }

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({
        error: { message: "No se enviaron cambios válidos para la tarea." }
      });
    }

    // 4) Actualizar la tarea
    const updated = await prisma.task.update({
      where: { id: taskId },
      data: dataToUpdate
    });

    return res.json({
      message: "Tarea actualizada correctamente.",
      task: toPublicTask(updated)
    });
  } catch (error) {
    console.error("Error en updateTask:", error);
    return res.status(500).json({
      error: { message: "Error interno al actualizar tarea." }
    });
  }
}

/**
 * DELETE /api/tasks/:id
 * Elimina una tarea.
 * - Requiere: estar logueado.
 * - Permisos: OWNER o EDITOR del tablero.
 */
async function deleteTask(req, res) {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user.id;

    if (isNaN(taskId)) {
      return res.status(400).json({
        error: { message: "ID de tarea inválido." }
      });
    }

    // 1) Buscar la tarea
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return res.status(404).json({
        error: { message: "Tarea no encontrada." }
      });
    }

    // 2) Verificar permisos
    const membership = await prisma.boardMember.findFirst({
      where: {
        boardId: task.boardId,
        userId
      }
    });

    if (!membership) {
      return res.status(403).json({
        error: { message: "No tenés acceso a esta tarea." }
      });
    }

    if (membership.role === "VIEWER") {
      return res.status(403).json({
        error: { message: "No tenés permisos para eliminar tareas en este tablero." }
      });
    }

    // 3) Eliminar
    await prisma.task.delete({
      where: { id: taskId }
    });

    return res.json({
      message: "Tarea eliminada correctamente."
    });
  } catch (error) {
    console.error("Error en deleteTask:", error);
    return res.status(500).json({
      error: { message: "Error interno al eliminar tarea." }
    });
  }
}

/**
 * DELETE /api/boards/:boardId/tasks/completed
 * Elimina todas las tareas completadas de un tablero.
 * - Requiere: requireAuth + requireBoardAccess (ya aplicado en ruta).
 * - Permisos: OWNER o EDITOR.
 */
async function deleteCompletedTasks(req, res) {
  try {
    const boardId = req.boardId;
    const membership = req.boardMember; // seteado en requireBoardAccess

    if (membership.role === "VIEWER") {
      return res.status(403).json({
        error: { message: "No tenés permisos para eliminar tareas en este tablero." }
      });
    }

    const result = await prisma.task.deleteMany({
      where: {
        boardId,
        completed: true
      }
    });

    return res.json({
      message: "Tareas completadas eliminadas correctamente.",
      deletedCount: result.count
    });
  } catch (error) {
    console.error("Error en deleteCompletedTasks:", error);
    return res.status(500).json({
      error: { message: "Error interno al eliminar tareas completadas." }
    });
  }
}

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask,
  deleteCompletedTasks
};
