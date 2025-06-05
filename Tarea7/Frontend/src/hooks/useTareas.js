import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '../store/uiStore';
import { useConfigStore } from '../store/configStore';
// -------- FETCH ----------

const fetchTareas = async (pagina = 1, limit = 5) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = await fetch(`/api/tareas?page=${pagina}&limit=${limit}`);
  //const res = await fetch(`/api/tareas-mala?page=${pagina}&limit=${limit}`); = prueba (NO cargan las tareas)
  if (!res.ok) throw new Error('Error al obtener tareas paginadas');
  return res.json(); // Retorna { tareas, total }
};

const postTarea = async (texto, tableroId) => {
  const res = await fetch(`/api/tareas?tablero=${tableroId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texto }),
  });

  if (!res.ok) throw new Error('Error al agregar tarea');
  return res.json();
};



const toggleTarea = async (id, tableroId) => {
  const res = await fetch(`/api/toggle?tablero=${tableroId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error('Error al cambiar estado');
  return res.json();
};


const eliminarTarea = async ({ id, tableroId }) => {
  const res = await fetch(`/api/eliminar?tablero=${tableroId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });

  if (!res.ok) throw new Error('Error al eliminar tarea');
  return res.json();
};


const eliminarCompletadas = async (tableroId) => {
  const res = await fetch(`/api/eliminar-completadas?tablero=${tableroId}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Error al eliminar completadas');
  return res.json();
};


const editarTarea = async ({ id, texto, tableroId }) => {
  const res = await fetch(`/api/editar`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, texto, tableroId }), 
  });

  if (!res.ok) {
    const mensaje = await res.text();
    console.error('Error al editar tarea:', mensaje);
    throw new Error('Error al editar tarea');
  }

  return res.json();
};

const eliminarTablero = async (nombre) => {
  const res = await fetch('/api/tableros', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre }), 
  });

  if (!res.ok) throw new Error('Error al eliminar tablero');
  return res.json();
};


// -------- HOOKS ----------

export function useTareas(tableroId, intervaloRefetch) {
  const paginaActual = useUIStore((state) => state.paginaActual);

  return useQuery({
    queryKey: ['tareas', tableroId, paginaActual],
    queryFn: async () => {
      const res = await fetch(`/api/tareas?tablero=${tableroId}&pagina=${paginaActual}`);
      if (!res.ok) throw new Error('Error al cargar tareas');
      return res.json(); // debe devolver { tareas, total }
    },
    refetchInterval: intervaloRefetch,
  });
}





export function useAgregarTarea(tableroId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (texto) => {
      const res = await fetch(`/api/tareas?tablero=${tableroId}`, {
        method: 'POST',
        body: JSON.stringify({ texto }),
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Error al agregar tarea');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tareas', tableroId]);
    },
  });
}

export const useToggleTarea = (tableroId) => {
  const queryClient = useQueryClient();
  const showToast = useUIStore.getState().showToast;

  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/toggle?tablero=${tableroId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error('Error al marcar como completada');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas', tableroId] });
      showToast({ type: 'success', msg: 'Tarea marcada como completada' });
    },
    onError: () => {
      showToast({ type: 'error', msg: 'No se pudo marcar como completada' });
    },
  });
};




export const useEliminarTarea = () => {
  const queryClient = useQueryClient();
  const showToast = useUIStore((state) => state.showToast);

  return useMutation({
    mutationFn: eliminarTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      showToast({ type: 'success', msg: 'Tarea eliminada' });
    },
    onError: () => {
      showToast({ type: 'error', msg: 'No se pudo eliminar tarea' });
    },
  });
};


export const useEliminarCompletadas = (tableroId) => {
  const queryClient = useQueryClient();
  const showToast = useUIStore((state) => state.showToast); 

  return useMutation({
    mutationFn: () => eliminarCompletadas(tableroId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas', tableroId] });
      showToast({ type: 'success', msg: 'Tareas completadas eliminadas' }); 
    },
    onError: () => {
      showToast({ type: 'error', msg: 'No se pudieron eliminar completadas' }); 
    },
  });
};


export const useEditarTarea = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, texto, tableroId }) => editarTarea({ id, texto, tableroId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas'] });
      useUIStore.getState().showToast({ type: 'success', msg: 'Tarea editada' });
    },
    onError: () => {
      useUIStore.getState().showToast({ type: 'error', msg: 'No se pudo editar tarea' });
    },
  });
};
export function useTableros() {
  return useQuery({
    queryKey: ['tableros'],
    queryFn: async () => {
      const res = await fetch('/api/tableros');
      if (!res.ok) throw new Error('Error al cargar tableros');
      return res.json();
    },
  });
}


export const useEliminarTablero = () => {
  const queryClient = useQueryClient();
  const showToast = useUIStore.getState().showToast;

  return useMutation({
    mutationFn: async (nombre) => {
      const res = await fetch('/api/tableros', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre }),
      });

      if (!res.ok) throw new Error('Error al eliminar tablero');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tableros']);
      showToast({ type: 'success', msg: 'Tablero eliminado' });
    },
    onError: () => {
      showToast({ type: 'error', msg: 'No se pudo eliminar el tablero' });
    },
  });
};
