const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Esta función recibe una lista de roles permitidos
function autorizarPorRol(rolesPermitidos = []) {
  return async (req, res, next) => {
    const usuarioId = req.user.id;
    const tableroId = Number(req.params.tableroId || req.body.tableroId);

    if (!tableroId) {
      return res.status(400).json({ error: 'Falta el tableroId en la ruta o el cuerpo' });
    }

    // Buscamos el permiso del usuario en ese tablero
    const permiso = await prisma.permiso.findFirst({
      where: {
        usuarioId,
        tableroId
      }
    });

    if (!permiso) {
      return res.status(403).json({ error: 'No tenés acceso a este tablero' });
    }

    if (!rolesPermitidos.includes(permiso.rol)) {
      return res.status(403).json({ error: `Se requiere uno de los siguientes roles: ${rolesPermitidos.join(', ')}` });
    }

    // Si pasa todos los filtros, continúa con la ruta
    next();
  };
}

module.exports = autorizarPorRol;