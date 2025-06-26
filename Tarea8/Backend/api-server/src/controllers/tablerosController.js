const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.crearTablero = async (req, res) => {
  const { nombre } = req.body;
  const userId = req.user.id;

  if (!nombre?.trim()) {
    return res.status(400).json({ error: 'El nombre del tablero es obligatorio' });
  }

  try {
    // 1. Crear el tablero
    const nuevo = await prisma.tablero.create({
      data: {
        nombre,
        propietarioId: userId
      }
    });

    // 2. Crear permiso owner para el usuario que lo creó
    await prisma.permiso.create({
      data: {
        usuarioId: userId,
        tableroId: nuevo.id,
        rol: 'owner'
      }
    });

    // 3. Devolver respuesta
    res.status(201).json({ msg: 'Tablero creado', tablero: nuevo });
  } catch (error) {
    console.error('Error al crear tablero:', error);
    res.status(500).json({ error: 'Error al crear el tablero' });
  }
};
exports.obtenerTableros = async (req, res) => {
  const userId = req.user.id;

  try {
    // Buscamos todos los permisos del usuario
    const permisos = await prisma.permiso.findMany({
      where: {
        usuarioId: userId
      },
      include: {
        tablero: true  // Trae el tablero completo
      }
    });

    // Extraemos solo los tableros
    const tableros = permisos.map(p => ({
  ...p.tablero,
  rol: p.rol
}));

    res.json({ tableros });
  } catch (error) {
    console.error('Error al obtener tableros:', error);
    res.status(500).json({ error: 'Error al obtener tableros' });
  }
};

exports.compartirTablero = async (req, res) => {
  const propietarioId = req.user.id;
  const tableroId = parseInt(req.params.id);
  const { email, rol } = req.body;

  if (!email || !rol) {
    return res.status(400).json({ error: 'Faltan datos: email y rol' });
  }

  // Solo se permiten ciertos roles
  const rolesPermitidos = ['viewer', 'editor'];
  if (!rolesPermitidos.includes(rol)) {
    return res.status(400).json({ error: 'Rol no válido' });
  }

  try {
    // Verificamos que el tablero pertenezca al usuario actual
    const tablero = await prisma.tablero.findUnique({
      where: { id: tableroId }
    });

    if (!tablero || tablero.propietarioId !== propietarioId) {
      return res.status(403).json({ error: 'No sos el dueño del tablero' });
    }

    // Buscamos al usuario al que se va a compartir
    const usuario = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Evitamos que se comparta a uno mismo o se duplique
    if (usuario.id === propietarioId) {
      return res.status(400).json({ error: 'No podés compartirte el tablero a vos mismo' });
    }

    // Creamos o actualizamos el permiso
    const permiso = await prisma.permiso.upsert({
      where: {
        usuarioId_tableroId: {
          usuarioId: usuario.id,
          tableroId
        }
      },
      update: { rol },
      create: {
        usuarioId: usuario.id,
        tableroId,
        rol
      }
    });

    res.json({ msg: 'Tablero compartido correctamente', permiso });
  } catch (error) {
    console.error('Error al compartir tablero:', error);
    res.status(500).json({ error: 'Error del servidor al compartir tablero' });
  }
};
exports.eliminarTablero = async (req, res) => {
  const userId = req.user.id;
  const id = parseInt(req.params.id);

  if (isNaN(id)) return res.status(400).json({ error: 'ID inválido' });

  try {
    // Buscamos el tablero
    const tablero = await prisma.tablero.findUnique({ where: { id } });

    // Verificamos que el usuario sea el propietario
    if (!tablero || tablero.propietarioId !== userId) {
      return res.status(403).json({ error: 'No tenés permiso para eliminar este tablero' });
    }

    // Eliminamos los permisos relacionados
    await prisma.permiso.deleteMany({ where: { tableroId: id } });

    // Eliminamos las tareas del tablero
    await prisma.tarea.deleteMany({ where: { tableroId: id } });

    // Eliminamos el tablero
    await prisma.tablero.delete({ where: { id } });

    res.json({ msg: 'Tablero eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar tablero:', error);
    res.status(500).json({ error: 'No se pudo eliminar el tablero' });
  }
};