const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const authMiddleware = require('../middlewares/authMiddleware');
const verificarPermiso = require('../middlewares/verificarPermiso');
const { verificarToken } = require('../middlewares/verificarToken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


// Crear tarea → solo owner o editor
router.post(
  '/',
  authMiddleware,
  verificarPermiso(['owner', 'editor']),
  tareasController.crearTarea
);

// Obtener tareas → cualquier rol: owner, editor o viewer
router.get(
  '/',
  authMiddleware,
  verificarPermiso(['owner', 'editor', 'viewer']),
  tareasController.obtenerTareas
);

// Marcar como completada → solo owner o editor
router.patch(
  '/:id',
  authMiddleware,
  verificarPermiso(['owner', 'editor']),
  tareasController.marcarTarea
);


// Eliminar tareas completadas → solo owner o editor
router.delete(
  '/completadas',
  authMiddleware,
  verificarPermiso(['owner', 'editor']),
  async (req, res) => {
    const tableroId = parseInt(req.query.tableroId);

    try {
      const resultado = await prisma.tarea.deleteMany({
        where: {
          completada: true,
          tableroId: tableroId,
        },
      });

      res.json({
        msg: 'Tareas completadas eliminadas',
        cantidadEliminadas: resultado.count,
      });
    } catch (error) {
      console.error('Error al eliminar tareas completadas:', error);
      res.status(500).json({ error: 'No se pudieron eliminar las tareas completadas' });
    }
  }
);

// Eliminar tarea individual → solo owner o editor
router.delete(
  '/:id',
  authMiddleware,
  verificarPermiso(['owner', 'editor']),
  async (req, res) => {
    const tareaId = parseInt(req.params.id);

    if (isNaN(tareaId)) {
      return res.status(400).json({ error: 'ID de tarea inválido' });
    }

    try {
      // Obtenemos la tarea sin verificar permisos manualmente (porque ya lo hicimos con el middleware)
      const tarea = await prisma.tarea.findUnique({
        where: { id: tareaId }
      });

      if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }

      await prisma.tarea.delete({
        where: { id: tareaId }
      });

      res.json({ msg: 'Tarea eliminada' });
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      res.status(500).json({ error: 'Error del servidor' });
    }
  }
);
// router.get('/api/tareas', verificarToken, verificarPermiso, async (req, res) => {
//   const { tableroId } = req.query;

//   if (!tableroId) {
//     return res.status(400).json({ error: 'Falta el tableroId en la query' });
//   }

//   try {
//     const tareas = await prisma.tarea.findMany({
//       where: {
//         tableroId: Number(tableroId),
//         usuarioId: req.user.id, // ← esto es clave
//       },
//     });

//     res.json({ tareas });
//   } catch (error) {
//     console.error('Error al obtener tareas:', error);
//     res.status(500).json({ error: 'Error al obtener tareas' });
//   }
// });

// router.patch('/api/tareas/:id', verificarToken, async (req, res) => {
//   const { id } = req.params;

//   try {
//     const tarea = await prisma.tarea.findUnique({
//       where: { id: Number(id) },
//       include: { tablero: true },
//     });

//     if (!tarea) {
//       return res.status(404).json({ error: 'Tarea no encontrada' });
//     }

//     // Verificar que el usuario tenga permiso sobre el tablero de la tarea
//     const permiso = await prisma.permiso.findFirst({
//       where: {
//         usuarioId: req.user.id,
//         tableroId: tarea.tableroId,
//       },
//     });

//     if (!permiso) {
//       return res.status(403).json({ error: 'No tenés permiso para modificar esta tarea' });
//     }

//     // Actualizar estado de completado
//     const tareaActualizada = await prisma.tarea.update({
//       where: { id: Number(id) },
//       data: { completado: !tarea.completado },
//     });

//     res.json({ tarea: tareaActualizada });
//   } catch (error) {
//     console.error('Error al marcar tarea como completada:', error);
//     res.status(500).json({ error: 'Error interno del servidor' });
//   }
// });

module.exports = router;
