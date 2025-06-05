// src/api/tableros/index.ts
import fs from 'fs/promises';
import path from 'path';

const filePath = path.resolve('tareas.json');

export async function POST({ request }) {
  const { nombre } = await request.json();

  if (!nombre || typeof nombre !== 'string') {
    return new Response(JSON.stringify({ error: 'Nombre inválido' }), { status: 400 });
  }

  const data = await fs.readFile(filePath, 'utf-8');
  const tareas = JSON.parse(data);

  if (tareas[nombre]) {
    return new Response(JSON.stringify({ error: 'Tablero ya existe' }), { status: 409 });
  }

  tareas[nombre] = [];
  await fs.writeFile(filePath, JSON.stringify(tareas, null, 2), 'utf-8');

  return new Response(JSON.stringify({ mensaje: 'Tablero creado' }), { status: 201 });
}
export async function GET() {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const tareas = JSON.parse(data);
    const tableros = Object.keys(tareas);

    return new Response(JSON.stringify({ tableros }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Error al leer tableros:", error);
    return new Response(JSON.stringify({ error: 'No se pudieron obtener los tableros' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
//BORRAR TABLERO
export const prerender = false;

export async function DELETE({ request }) {
  let nombre = '';
  try {
    const body = await request.json();
    nombre = body.nombre;
  } catch {
    return new Response(JSON.stringify({ error: 'Cuerpo inválido o vacío' }), { status: 400 });
  }

  if (!nombre || typeof nombre !== 'string') {
    return new Response(JSON.stringify({ error: 'Nombre inválido' }), { status: 400 });
  }

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const tareas = JSON.parse(data);

    if (!tareas[nombre]) {
      return new Response(JSON.stringify({ error: 'Tablero no encontrado' }), { status: 404 });
    }

    delete tareas[nombre];

    await fs.writeFile(filePath, JSON.stringify(tareas, null, 2), 'utf-8');

    return new Response(JSON.stringify({ mensaje: 'Tablero eliminado' }), { status: 200 });
  } catch (error) {
    console.error('Error al eliminar tablero:', error);
    return new Response(JSON.stringify({ error: 'No se pudo eliminar el tablero' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

