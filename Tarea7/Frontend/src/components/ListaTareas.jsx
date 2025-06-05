import React, { useState } from 'react';
import MenuTableros from './MenuTableros';
import { useParams } from 'react-router-dom';
import { useConfigStore } from '../store/configStore';

import {
  useTareas,
  useAgregarTarea,
  useToggleTarea,
  useEliminarTarea,
  useEliminarCompletadas,
  useEditarTarea,
} from '../hooks/useTareas';
import { useUIStore } from '../store/uiStore';
import Toast from './Toast';

function Paginacion({ totalPaginas }) {
  const paginaActual = useUIStore((state) => state.paginaActual);
  const setPaginaActual = useUIStore((state) => state.setPaginaActual);

  const irA = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  return (
    <div className="flex gap-2 justify-center mt-4">
      <button onClick={() => irA(paginaActual - 1)} disabled={paginaActual === 1}>
        ← Anterior
      </button>
      {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          onClick={() => irA(n)}
          className={paginaActual === n ? 'font-bold underline' : ''}
        >
          {n}
        </button>
      ))}
      <button onClick={() => irA(paginaActual + 1)} disabled={paginaActual === totalPaginas}>
        Siguiente →
      </button>
    </div>
  );
}

function ListaTareas() {
  const { tableroId } = useParams();
  console.log("tableroId:", tableroId);

  const intervaloRefetch = useConfigStore((state) => state.intervaloRefetch);
  const mayusculas = useConfigStore((state) => state.mayusculas);

  if (!tableroId) {
    return (
      <main className="min-h-screen flex justify-center items-center text-white bg-gray-900">
        <p className="text-red-500">No se encontró el ID del tablero</p>
      </main>
    );
  }
  const { data = { tareas: [], totalPaginas: 1 }, isLoading, isError, error } = useTareas(tableroId, intervaloRefetch);

  const agregar = useAgregarTarea(tableroId);
  const toggle = useToggleTarea(tableroId);
const eliminar = useEliminarTarea(tableroId);
const eliminarCompletadas = useEliminarCompletadas(tableroId);
const editar = useEditarTarea(tableroId);

  const [nueva, setNueva] = useState('');
  const [filtro, setFiltro] = useState('todas');

  const {
    editingId,
    setEditingId,
    clearEditingId,
    showToast,
  } = useUIStore();

  const tareasFiltradas = data.tareas.filter((t) => {
    if (filtro === 'completadas') return t.completada;
    if (filtro === 'pendientes') return !t.completada;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const textoFinal = nueva.trim();
    if (!textoFinal) return;

    if (editingId) {
      editar.mutate(
  { id: editingId, texto: textoFinal, tableroId },
  {
    onSuccess: () => {
      showToast({ type: 'success', msg: 'Tarea actualizada' });
      clearEditingId();
      setNueva('');
    },
    onError: () =>
      showToast({ type: 'error', msg: 'Error al editar tarea' }),
  }
);

    } else {
      agregar.mutate(textoFinal, {
        onSuccess: () => {
          showToast({ type: 'success', msg: 'Tarea añadida' });
          setNueva('');
        },
        onError: () =>
          showToast({ type: 'error', msg: 'Error al agregar tarea' }),
      });
    }
  };

 const totalPaginas = data.totalPaginas || 1;
 // límite de 5 tareas por página
  if (isLoading) {
  return (
    <main className="min-h-screen flex justify-center items-center text-white bg-gray-900">
      <p className="text-gray-400">Cargando tareas...</p>
    </main>
  );
}

if (isError) {
  console.error(error); //detalles en consola
  return (
    <main className="min-h-screen flex justify-center items-center text-white bg-gray-900">
      <p className="text-red-500">Error al cargar las tareas</p>
    </main>
  );
}

  return (
    <main className="min-h-screen bg-gray-900 text-white flex justify-center items-center px-4">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg space-y-5">
        <>
  <MenuTableros />


        <form onSubmit={handleSubmit} className="flex gap-2">
  <input
    type="text"
    value={nueva}
    onChange={(e) => setNueva(e.target.value)}
    placeholder="Nueva tarea"
    className="flex-1 px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-sm"
  />
  <button
    type="submit"
    className="bg-blue-600 px-3 py-2 text-sm rounded-md hover:bg-blue-700 transition"
  >
    {editingId ? 'Guardar' : 'Añadir'}
  </button>
  
</form>
    
        <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
          <div className="space-x-1">
            {['todas', 'pendientes', 'completadas'].map((f) => (
              <button
                key={f}
                onClick={() => setFiltro(f)}
                className={`px-2 py-1 rounded-md border ${
                  filtro === f
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              eliminarCompletadas.mutate(undefined, {
                onSuccess: () =>
                  showToast({
                    type: 'success',
                    msg: 'Completadas eliminadas',
                  }),
              })
            }
            className="bg-red-600 px-2 py-1 text-sm rounded-md hover:bg-red-700 transition"
          >
            Eliminar completadas
          </button>
        </div>

        <ul className="space-y-2">
          {tareasFiltradas.map((tarea) => (
            <li
              key={tarea.id}
              className="flex items-center justify-between bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-sm"
            >
              <label className="flex items-center gap-2 w-full cursor-pointer">
                <input
                  type="checkbox"
                  checked={tarea.completada}
                  onChange={() =>
                    toggle.mutate(tarea.id, {
                      onError: () =>
                        showToast({
                          type: 'error',
                          msg: 'No se pudo cambiar estado',
                        }),
                    })
                  }
                  className="accent-blue-500"
                />
                <span
                  className={`flex-1 ${
                     tarea.completada ? 'line-through text-gray-400' : ''
                       }`}
                  >
                  {mayusculas ? tarea.texto.toUpperCase() : tarea.texto}
                </span>

              </label>
              <div className="flex gap-1">
                {editingId === tarea.id ? (
                  <button
                    onClick={clearEditingId}
                    className="text-yellow-400 hover:text-yellow-600"
                  >
                    Cancelar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingId(tarea.id);
                      setNueva(tarea.texto);
                    }}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    Editar
                  </button>
                )}
                <button
                  onClick={() =>
                    eliminar.mutate({ id: tarea.id, tableroId }, {
                      onSuccess: () =>
                        showToast({
                          type: 'success',
                          msg: 'Tarea eliminada',
                        }),
                    })
                  }
                  className="text-red-400 hover:text-red-600 text-base ml-2"
                  title="Eliminar"
                >
                  ✖
                </button>
              </div>
            </li>
          ))}
        </ul>

        <Paginacion totalPaginas={totalPaginas} />
        </><div className="text-center mb-4">
  <a
    href="/configuracion"
    className="inline-block text-blue-400 hover:text-blue-600 underline transition"
  >
    ⚙️ Configuración
  </a>
</div>
      </div>
      <Toast />
    </main>
  );
}

export default ListaTareas;
