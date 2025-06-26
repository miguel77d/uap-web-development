const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const permiso = await prisma.permiso.findUnique({
    where: { id: 6 }, // Cambiar si querés otro ID
    include: {
      tablero: {
        include: {
          permisos: {
            include: { usuario: true },
          },
        },
      },
    },
  });

  console.log(`🔍 Permiso que querés modificar:`);
  console.log(`- ID: ${permiso.id}`);
  console.log(`- Tablero ID: ${permiso.tableroId}`);
  console.log(`- Usuario actual: ${permiso.usuarioId}`);

  console.log(`👑 Usuarios con permisos en el tablero ${permiso.tableroId}:`);
  permiso.tablero.permisos.forEach((p) => {
    console.log(`- ${p.usuario.email} → ${p.rol}`);
  });

  process.exit();
}

main();
