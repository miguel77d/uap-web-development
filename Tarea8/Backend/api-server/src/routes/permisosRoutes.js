const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const requireAuth = require('../middlewares/authMiddleware');

// POST /api/permisos → Crear o actualizar permiso
router.post('/', requireAuth, async (req, res) => {
  const { tableroId, email, rol } = req.body;

  if (!tableroId || !email || !rol) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  // Verificar que el usuario actual es owner del tablero
  const permisoActual = await prisma.permiso.findUnique({
    where: {
      usuarioId_tableroId: {
        usuarioId: req.user.id,
        tableroId,
      },
    },
  });

  if (!permisoActual || permisoActual.rol !== 'owner') {
    return res.status(403).json({ error: 'No sos owner del tablero' });
  }

  // Buscar al usuario destino por email
  const usuarioDestino = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuarioDestino) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Crear o actualizar permiso
  const nuevoPermiso = await prisma.permiso.upsert({
    where: {
      usuarioId_tableroId: {
        usuarioId: usuarioDestino.id,
        tableroId,
      },
    },
    update: { rol },
    create: {
      usuarioId: usuarioDestino.id,
      tableroId,
      rol,
    },
  });

  res.json({ msg: 'Permiso asignado', permiso: nuevoPermiso });
});

// GET /api/permisos?tableroId=...
router.get('/', requireAuth, async (req, res) => {
  const tableroId = parseInt(req.query.tableroId);

  if (isNaN(tableroId)) {
    return res.status(400).json({ error: 'Falta o es inválido el tableroId' });
  }

  try {
    const permisos = await prisma.permiso.findMany({
      where: { tableroId },
      include: {
        usuario: {
          select: {
            id: true,
            nombre: true,
            email: true,
          }
        }
      }
    });

    res.json(permisos);
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    res.status(500).json({ error: 'Error interno' });
  }
});

// PATCH /api/permisos/:id → Modificar el rol de un permiso
router.patch('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);
  const { rol } = req.body;

  if (!rol) return res.status(400).json({ error: 'Falta el nuevo rol' });

  try {
    const permiso = await prisma.permiso.update({
      where: { id },
      data: { rol },
    });

    res.json({ msg: 'Rol actualizado', permiso });
  } catch (error) {
    console.error('Error al actualizar permiso:', error);
    res.status(500).json({ error: 'Error interno al actualizar permiso' });
  }
});

// DELETE /api/permisos/:id → Eliminar un permiso
router.delete('/:id', requireAuth, async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await prisma.permiso.delete({
      where: { id },
    });

    res.json({ msg: 'Permiso eliminado' });
  } catch (error) {
    console.error('Error al eliminar permiso:', error);
    res.status(500).json({ error: 'Error interno al eliminar permiso' });
  }
});

module.exports = router;
