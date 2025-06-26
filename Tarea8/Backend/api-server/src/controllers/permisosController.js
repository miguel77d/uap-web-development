const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.crearPermiso = async (req, res) => {
  const { tableroId, email, rol } = req.body;

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const nuevoPermiso = await prisma.permiso.create({
      data: {
        tableroId: Number(tableroId),
        usuarioId: usuario.id,
        rol,
      },
    });

    res.json(nuevoPermiso);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear permiso' });
  }
};

exports.modificarPermiso = async (req, res) => {
  const id = Number(req.params.id);
  const { rol } = req.body;

  try {
    const permiso = await prisma.permiso.update({
      where: { id },
      data: { rol },
    });

    res.json(permiso);
  } catch (err) {
    res.status(500).json({ error: 'Error al modificar permiso' });
  }
};

exports.eliminarPermiso = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.permiso.delete({ where: { id } });
    res.json({ mensaje: 'Permiso eliminado' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar permiso' });
  }
};
