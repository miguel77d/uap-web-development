export const prerender = false;

import fs from "fs/promises";
import path from "path";

const filePath = path.resolve("tareas.json");

export async function GET() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return new Response(data, {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error en GET:", error);
    return new Response(
      JSON.stringify({ error: "No se pudieron obtener las tareas" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST({ request }: { request: Request }) {
  try {
    const body = await request.json(); 

    if (!body.texto || typeof body.texto !== "string") {
      throw new Error("Texto inválido");
    }

    const data = await fs.readFile(filePath, "utf-8");
    const tareas = JSON.parse(data);

    if (!Array.isArray(tareas)) {
      throw new Error("Contenido inválido: no es un array");
    }

    const nuevaTarea = {
      id: Date.now(),
      texto: body.texto,
      completada: false
    };

    tareas.push(nuevaTarea);
    await fs.writeFile(filePath, JSON.stringify(tareas, null, 2), "utf-8");

    return new Response(JSON.stringify(nuevaTarea), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error: unknown) {
  console.error("Error en POST:", error);

  const mensaje =
    error instanceof Error ? error.message : "No se pudo guardar la tarea";

  return new Response(
    JSON.stringify({ error: mensaje }),
    { status: 500, headers: { "Content-Type": "application/json" } }
  );
  }
}
