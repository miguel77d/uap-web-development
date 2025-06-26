// scripts/resetPermisos.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.permiso.deleteMany(); // ⚠️ Borra TODOS los permisos de la tabla
  console.log("✅ Permisos eliminados correctamente");
}

main()
  .catch(e => console.error("❌ Error:", e))
  .finally(() => prisma.$disconnect());