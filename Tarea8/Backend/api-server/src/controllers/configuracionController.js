const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.obtenerConfiguracion = async (req, res) => {
  const userId = req.user.id;

  try {
    let config = await prisma.configuracionUsuario.findUnique({
      where: { usuarioId: userId }
    });

    // Si no tiene configuración aún, crear una por defecto
    if (!config) {
      config = await prisma.configuracionUsuario.create({
        data: { usuarioId: userId }
      });
    }

    res.json({ configuracion: config });
  } catch (error) {
    console.error('Error al obtener configuración:', error);
    res.status(500).json({ error: 'Error al obtener configuración' });
  }
};

exports.actualizarConfiguracion = async (req, res) => {
  const userId = req.user.id;
  const { refetchSegs, mayusculas } = req.body;

  try {
    const config = await prisma.configuracionUsuario.upsert({
      where: { usuarioId: userId },
      update: {
        refetchSegs: refetchSegs ?? undefined,
        mayusculas: mayusculas ?? undefined
      },
      create: {
        usuarioId: userId,
        refetchSegs: refetchSegs ?? 10,
        mayusculas: mayusculas ?? false
      }
    });

    res.json({ msg: 'Configuración actualizada', configuracion: config });
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
};
