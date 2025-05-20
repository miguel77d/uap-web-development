export const prerender = false;

import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("tareas.json");

export async function POST({ request }: { request: Request }) {
  try {
    const { id } = await request.json();

    const data = await fs.readFile(filePath, "utf-8");
    const tareas = JSON.parse(data);

    const tarea = tareas.find((t: any) => t.id === id);
    if (!tarea) {
      return new Response(JSON.stringify({ error: "Tarea no encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    tarea.completada = !tarea.completada;

    await fs.writeFile(filePath, JSON.stringify(tareas, null, 2), "utf-8");

    return new Response(JSON.stringify(tarea), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: unknown) {
    const mensaje =
      error instanceof Error ? error.message : "Error al hacer toggle";
    return new Response(JSON.stringify({ error: mensaje }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

