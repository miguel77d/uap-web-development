const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = function verificarPermiso(rolesPermitidos) {
  return async (req, res, next) => {
    const userId = req.user.id;

    // Determinar tableroId dependiendo del tipo de ruta
    let tableroId;

    // Si la ruta es sobre una tarea individual (PATCH /:id, DELETE /:id)
    if (req.params.id && !req.query.tableroId) {
      const tareaId = parseInt(req.params.id);
      if (isNaN(tareaId)) {
        return res.status(400).json({ error: 'Falta el ID de la tarea' });
      }

      // Buscar la tarea y extraer tableroId
      const tarea = await prisma.tarea.findUnique({
        where: { id: tareaId },
      });

      if (!tarea) {
        return res.status(404).json({ error: 'Tarea no encontrada' });
      }

      tableroId = tarea.tableroId;
    } else {
      // En rutas como GET /api/tareas?tableroId=8
      tableroId = parseInt(
        req.params.id || req.body?.tableroId || req.query?.tableroId
      );
    }

    if (isNaN(tableroId)) {
      return res.status(400).json({ error: 'Falta el ID del tablero' });
    }

    try {
      const tablero = await prisma.tablero.findUnique({
        where: { id: tableroId },
      });

      if (tablero?.propietarioId === userId) {
        req.permisoRol = 'owner';
        return next();
      }

      const permiso = await prisma.permiso.findUnique({
        where: {
          usuarioId_tableroId: {
            usuarioId: userId,
            tableroId: tableroId,
          },
        },
      });

      if (!permiso || !rolesPermitidos.includes(permiso.rol)) {
        return res.status(403).json({ error: 'No tenés permiso para esta acción' });
      }

      req.permisoRol = permiso.rol;
      next();
    } catch (error) {
      console.error('Error en verificarPermiso:', error);
      res.status(500).json({ error: 'Error al verificar permisos' });
    }
  };
};
