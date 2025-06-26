const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const usuarioId = 1; // ← ID de tucorreo@ejemplo.com
  const tableroId = 1;

  // Lo eliminamos primero (opcional, por seguridad)
  await prisma.permiso.deleteMany({
    where: {
      usuarioId,
      tableroId,
    },
  });

  // Luego lo creamos limpio
  const permiso = await prisma.permiso.create({
    data: {
      usuarioId,
      tableroId,
      rol: 'owner',
    },
  });

  console.log('✅ Ahora sí, sos owner del tablero:', permiso);
  process.exit();
}

main();
