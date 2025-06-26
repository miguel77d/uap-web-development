-- CreateTable
CREATE TABLE "Permiso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "usuarioId" INTEGER NOT NULL,
    "tableroId" INTEGER NOT NULL,
    "rol" TEXT NOT NULL,
    CONSTRAINT "Permiso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Permiso_tableroId_fkey" FOREIGN KEY ("tableroId") REFERENCES "Tablero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Permiso_usuarioId_tableroId_key" ON "Permiso"("usuarioId", "tableroId");
