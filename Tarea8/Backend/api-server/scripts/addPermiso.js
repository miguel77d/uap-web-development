const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const usuarioId = 1; // ← reemplazá por el ID real de tu usuario
const tableroId = 1;
const rol = 'owner'; // puede ser 'owner', 'editor', 'viewer'

async function main() {
  await prisma.permiso.create({
    data: {
      usuarioId,
      tableroId,
      rol
    }
  });

  console.log('Permiso creado con éxito');
}

main().finally(() => prisma.$disconnect());
