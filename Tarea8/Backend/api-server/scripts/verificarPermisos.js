const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verificar() {
  const permisos = await prisma.permiso.findMany({
    where: { tableroId: 1 },
    include: { usuario: true },
  });

  console.log('📋 Permisos del tablero 1:');
  permisos.forEach((permiso) => {
    console.log(`- ${permiso.usuario.email} → rol: ${permiso.rol}`);
  });

  process.exit();
}

verificar();
