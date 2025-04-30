export const prerender = false;

import type { APIRoute } from "astro";
import { readFileSync, writeFileSync, existsSync } from "fs";

export const POST: APIRoute = async ({ request, redirect }) => {
  const body = await request.formData();
  const index = parseInt(body.get("index")?.toString() ?? "", 10);

  if (isNaN(index)) {
    return new Response("Índice inválido", { status: 400 });
  }

  let tareas = [];

  if (existsSync("./tareas.json")) {
    tareas = JSON.parse(readFileSync("./tareas.json", "utf-8"));
  }

  if (!tareas[index]) {
    return new Response("Tarea no encontrada", { status: 404 });
  }

  tareas.splice(index, 1); // Elimina la tarea

  writeFileSync("./tareas.json", JSON.stringify(tareas, null, 2));

  return redirect("/", 303);
};
