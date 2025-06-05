export const prerender = false;

import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('tareas.json');

export async function POST({ request }) {
  try {
    const { nombre } = await request.json();

    if (!nombre || typeof nombre !== 'string') {
      return new Response(JSON.stringify({ error: 'Nombre inválido' }), { status: 400 });
    }

    const data = await fs.readFile(filePath, 'utf-8');
    const tareas = JSON.parse(data);

    if (!tareas[nombre]) {
      return new Response(JSON.stringify({ error: 'Tablero no existe' }), { status: 404 });
    }

    delete tareas[nombre];

    await fs.writeFile(filePath, JSON.stringify(tareas, null, 2), 'utf-8');

    return new Response(JSON.stringify({ mensaje: 'Tablero eliminado' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error al eliminar tablero:", error);
    return new Response(JSON.stringify({ error: 'No se pudo eliminar el tablero' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
