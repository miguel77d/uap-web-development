export const prerender = false;

import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("tareas.json");

export async function POST({ request }) {
  try {
    const url = new URL(request.url);
    const tableroId = url.searchParams.get("tablero");

    if (!tableroId) {
      return new Response(JSON.stringify({ error: "Falta el tableroId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Leemos el archivo JSON
    const data = await fs.readFile(filePath, "utf-8");
    const tareasPorTablero = JSON.parse(data);

    const tareas = tareasPorTablero[tableroId];

    if (!Array.isArray(tareas)) {
      return new Response(JSON.stringify({ error: "El tablero no existe o está vacío" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Filtramos las tareas no completadas
    const tareasFiltradas = tareas.filter((t) => !t.completada);

    // Actualizamos solo el tablero correspondiente
    tareasPorTablero[tableroId] = tareasFiltradas;

    // Guardamos todo de nuevo
    await fs.writeFile(filePath, JSON.stringify(tareasPorTablero, null, 2), "utf-8");

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error al eliminar completadas:", error);
    return new Response(
      JSON.stringify({ error: "No se pudieron eliminar las tareas completadas" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
