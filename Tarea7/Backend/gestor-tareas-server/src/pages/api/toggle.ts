export const prerender = false;

import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("tareas.json");

export async function POST({ request }: { request: Request }) {
  try {
    // Leer parámetros de la URL
    const url = new URL(request.url);
    const tableroId = url.searchParams.get("tablero");

    if (!tableroId) {
      return new Response(JSON.stringify({ error: "Falta el tableroId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Leer el ID desde el body
    const { id } = await request.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "Falta el id de la tarea" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Leer y parsear el archivo
    const data = await fs.readFile(filePath, "utf-8");
    const tareasPorTablero = JSON.parse(data);
    const tareas = tareasPorTablero[tableroId];

    if (!Array.isArray(tareas)) {
      return new Response(JSON.stringify({ error: "Tablero no encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Buscar y hacer toggle
    const tarea = tareas.find((t: any) => t.id === id);
    if (!tarea) {
      return new Response(JSON.stringify({ error: "Tarea no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    tarea.completada = !tarea.completada;

    // Guardar todo el objeto actualizado
    await fs.writeFile(filePath, JSON.stringify(tareasPorTablero, null, 2), "utf-8");

    return new Response(JSON.stringify(tarea), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (error: unknown) {
    const mensaje = error instanceof Error ? error.message : "Error al hacer toggle";
    return new Response(JSON.stringify({ error: mensaje }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
