-- CreateTable
CREATE TABLE "ConfiguracionUsuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "refetchSegs" INTEGER NOT NULL DEFAULT 10,
    "mayusculas" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "ConfiguracionUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracionUsuario_usuarioId_key" ON "ConfiguracionUsuario"("usuarioId");
