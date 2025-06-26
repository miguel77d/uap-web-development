const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREAR TAREA → (solo para owner y editor)
const crearTarea = async (req, res) => {
  const { descripcion, tableroId } = req.body;
  const userId = req.user.id;

  if (!descripcion?.trim()) {
    return res.status(400).json({ error: 'La descripción es obligatoria' });
  }

  try {
    const nueva = await prisma.tarea.create({
      data: {
        descripcion,
        tableroId: parseInt(tableroId),
        usuarioId: userId
      }
    });

    res.status(201).json({ msg: 'Tarea creada', tarea: nueva });
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error al crear tarea' });
  }
};

// OBTENER TAREAS → cualquier rol
const obtenerTareas = async (req, res) => {
  console.log('✅ Entró a obtenerTareas con query:', req.query);
  const userId = req.user.id;
  const {
    tableroId,
    page = 1,
    limit = 10,
    estado = 'todas',
    q = ''
  } = req.query;

  if (!tableroId) {
    return res.status(400).json({ error: 'Falta el ID del tablero' });
  }

  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);
  const skip = (pageInt - 1) * limitInt;
  if (isNaN(pageInt) || isNaN(limitInt) || pageInt < 1 || limitInt < 1) {
  console.log('❌ Parámetros inválidos:', { pageInt, limitInt }); // 🔍 Esto es lo que queremos ver
  return res.status(400).json({ error: 'Parámetros de paginación inválidos' });
}

  const where = {
    tableroId: parseInt(tableroId),
    ...(estado !== 'todas' && {
      completada: estado === 'completadas'
    }),
    ...(q && {
      descripcion: {
        contains: q
      }
    })
  };

  try {
    const config = await prisma.configuracionUsuario.findUnique({
      where: { usuarioId: userId }
    });

    const total = await prisma.tarea.count({ where });
    const totalPaginas = Math.ceil(total / limitInt);

    // Agregamos control para páginas inválidas
    if (pageInt > totalPaginas && totalPaginas > 0) {
      return res.json({
        tareas: [],
        total,
        totalPaginas,
        paginaActual: pageInt
      });
    }

    const tareas = await prisma.tarea.findMany({
      where,
      skip,
      take: limitInt,
      orderBy: { id: 'desc' }
    });

    let tareasFinales = tareas;
    if (config?.mayusculas) {
      tareasFinales = tareas.map((t) => ({
        ...t,
        descripcion: t.descripcion.toUpperCase()
      }));
    }

    res.json({
      tareas: tareasFinales,
      total,
      totalPaginas,
      paginaActual: pageInt
    });
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error al obtener tareas' });
  }
};


// MARCAR COMO COMPLETADA → (solo owner/editor)
const marcarTarea = async (req, res) => {
  const tareaId = parseInt(req.params.id);

  try {
    const tarea = await prisma.tarea.findUnique({
      where: { id: tareaId }
    });

    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    const actualizada = await prisma.tarea.update({
      where: { id: tareaId },
      data: { completada: !tarea.completada }
    });

    res.json({ msg: 'Tarea actualizada', tarea: actualizada });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error al actualizar tarea' });
  }
};

// LISTAR TAREAS (versión simplificada)
const listarTareas = async (req, res) => {
  const { tableroId, estado, page = 1, limit = 10 } = req.query;
  console.log('⚠️ Entró a listarTareas con query:', req.query);
  const usuarioId = req.user.id;

  if (!tableroId) {
    return res.status(400).json({ error: 'Falta el tableroId en la query' });
  }

  const pageInt = parseInt(page);
  const limitInt = parseInt(limit);
  const skip = (pageInt - 1) * limitInt;

  try {
    const where = {
      tableroId: parseInt(tableroId),
    };

    if (estado === 'completada') {
      where.completada = true;
    } else if (estado === 'pendiente') {
      where.completada = false;
    }

    const tareas = await prisma.tarea.findMany({
      where,
      skip,
      take: limitInt,
      orderBy: { id: 'desc' },
    });

    res.json({ tareas });
  } catch (error) {
    console.error('Error al listar tareas', error);
    res.status(500).json({ error: 'Error al listar tareas' });
  }
};

// ✅ EXPORTAMOS TODO CON UNA SOLA ESTRUCTURA
module.exports = {
  crearTarea,
  obtenerTareas,
  marcarTarea,
  listarTareas
};
