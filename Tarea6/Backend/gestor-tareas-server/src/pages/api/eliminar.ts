export const prerender = false;

import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("tareas.json");

export async function POST({ request }: { request: Request }) {
  try {
    const { id } = await request.json();

    const data = await fs.readFile(filePath, "utf-8");
    const tareas = JSON.parse(data);

    const nuevasTareas = tareas.filter((t: any) => t.id !== id);

    await fs.writeFile(filePath, JSON.stringify(nuevasTareas, null, 2), "utf-8");

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error al eliminar tarea:", error);
    return new Response(JSON.stringify({ error: "No se pudo eliminar" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
