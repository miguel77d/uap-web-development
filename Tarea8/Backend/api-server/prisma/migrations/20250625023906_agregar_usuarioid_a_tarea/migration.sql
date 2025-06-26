PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "descripcion" TEXT NOT NULL,
    "completada" BOOLEAN NOT NULL DEFAULT false,
    "tableroId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    CONSTRAINT "Tarea_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Tarea_tableroId_fkey" FOREIGN KEY ("tableroId") REFERENCES "Tablero" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Asignamos usuarioId = 1 a todas las tareas
INSERT INTO "new_Tarea" ("completada", "descripcion", "id", "tableroId", "usuarioId")
SELECT "completada", "descripcion", "id", "tableroId", 1 FROM "Tarea";

DROP TABLE "Tarea";
ALTER TABLE "new_Tarea" RENAME TO "Tarea";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
