const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const requireAuth = require('../middlewares/authMiddleware');

router.post('/', requireAuth, async (req, res) => {
  const { tableroId, email, rol } = req.body;

  if (!tableroId || !email || !rol) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  // Verificamos que el usuario que hace el pedido sea owner del tablero
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

  // Buscamos el usuario al que se va a compartir
  const usuarioDestino = await prisma.usuario.findUnique({
    where: { email },
  });

  if (!usuarioDestino) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }

  // Creamos o actualizamos el permiso
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
// GET /api/permisos?tableroId=8
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
module.exports = router;
