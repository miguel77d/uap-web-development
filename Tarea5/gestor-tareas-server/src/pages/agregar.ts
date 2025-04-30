import type { APIRoute } from "astro";
import { readFileSync, writeFileSync, existsSync } from "fs";

export const POST: APIRoute = async ({ request, redirect }) => {
  const body = await request.formData();
  const nuevaTarea = body.get("tarea")?.toString().trim();

  if (!nuevaTarea) {
    return new Response("Tarea inválida", { status: 400 });
  }

  let tareas = [];

  if (existsSync("./tareas.json")) {
    tareas = JSON.parse(readFileSync("./tareas.json", "utf-8"));
  }

  tareas.push({ texto: nuevaTarea, completada: false });

  writeFileSync("./tareas.json", JSON.stringify(tareas, null, 2));

  return redirect("/", 303);
};
export const prerender = false;
