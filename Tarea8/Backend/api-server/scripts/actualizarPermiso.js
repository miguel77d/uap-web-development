const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.permiso.update({
    where: {
      usuarioId_tableroId: {
        usuarioId: 1,
        tableroId: 1,
      },
    },
    data: {
      rol: 'owner', // o 'editor'
    },
  });

  console.log("✅ Permiso actualizado correctamente");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
