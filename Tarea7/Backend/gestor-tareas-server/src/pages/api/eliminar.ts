export const prerender = false;

import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("tareas.json");

export async function POST({ request }: { request: Request }) {
  try {
    const url = new URL(request.url);
    const tableroId = url.searchParams.get("tablero");
    const { id } = await request.json();

    if (!tableroId || !id) {
      return new Response(JSON.stringify({ error: "Faltan datos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await fs.readFile(filePath, "utf-8");
    const tareasPorTablero = JSON.parse(data);

    const tareas = tareasPorTablero[tableroId];

    if (!Array.isArray(tareas)) {
      return new Response(JSON.stringify({ error: "Tablero no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Eliminamos la tarea
    const nuevasTareas = tareas.filter((t) => t.id !== id);
    tareasPorTablero[tableroId] = nuevasTareas;

    await fs.writeFile(filePath, JSON.stringify(tareasPorTablero, null, 2), "utf-8");

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    return new Response(JSON.stringify({ error: "No se pudo eliminar" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
