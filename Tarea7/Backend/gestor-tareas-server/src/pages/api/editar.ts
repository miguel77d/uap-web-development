export const prerender = false;

import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("tareas.json");

export async function POST({ request }: { request: Request }) {
  try {
    const { id, texto, tableroId } = await request.json();

    if (!id || !texto || !tableroId || typeof texto !== "string") {
      throw new Error("Datos inválidos");
    }

    const data = await fs.readFile(filePath, "utf-8");
    const json = JSON.parse(data);

    const tareas = json[tableroId];
    if (!Array.isArray(tareas)) {
      throw new Error("Tablero no encontrado");
    }

    const nuevasTareas = tareas.map((t: any) =>
      t.id === id ? { ...t, texto } : t
    );

    json[tableroId] = nuevasTareas;

    await fs.writeFile(filePath, JSON.stringify(json, null, 2), "utf-8");

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error al editar tarea:", error);
    return new Response(
      JSON.stringify({ error: "No se pudo editar la tarea" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
