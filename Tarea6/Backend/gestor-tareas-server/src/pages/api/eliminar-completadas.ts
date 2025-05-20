export const prerender = false;

import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("tareas.json");

export async function POST() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    const tareas = JSON.parse(data);

    const tareasFiltradas = tareas.filter((t: any) => !t.completada);

    await fs.writeFile(filePath, JSON.stringify(tareasFiltradas, null, 2), "utf-8");

    return new Response(null, { status: 204 }); // No content
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
