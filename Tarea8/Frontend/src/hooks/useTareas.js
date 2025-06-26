import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useUIStore } from '../store/uiStore';

// --- FETCHERS ---
// Siempre incluimos cookies con cada request
const fetchTareas = async (tableroId, pagina = 1, estado, q, limit = 10) => {
  const paginaNumerica = parseInt(pagina) || 1;
  const paginaSegura = Math.max(1, Math.min(paginaNumerica, 100));

  const params = new URLSearchParams();

  if (tableroId) params.append('tableroId', tableroId);
  params.append('page', paginaSegura);
  if (estado) params.append('estado', estado);
  if (q) params.append('q', q);
  if (limit) params.append('limit', limit); 

  const res = await fetch(`/api/tareas?${params.toString()}`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('Error al obtener tareas');
  return res.json(); // { tareas, total }
};


const crearTarea = async ({ texto, tableroId }) => {
  const res = await fetch('/api/tareas', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descripcion: texto, tableroId }),
  });
  if (!res.ok) throw new Error('Error al agregar tarea');
  return res.json();
};

const editarTarea = async ({ id, texto }) => {
  const res = await fetch(`/api/tareas/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ descripcion: texto }), // CAMBIO CLAVE AQUÍ
  });

  if (!res.ok) throw new Error('Error al editar tarea');
  return res.json();
};

const toggleTarea = async (id) => {
  const res = await fetch(`/api/tareas/${id}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completada: true }), // o false según lógica
  });
  if (!res.ok) throw new Error('Error al cambiar estado');
  return res.json();
};

const eliminarTarea = async (id) => {
  const res = await fetch(`/api/tareas/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al eliminar tarea');
  return res.json();
};

const eliminarCompletadas = async (tableroId) => {
  const res = await fetch(`/api/tareas/completadas?tableroId=${tableroId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al eliminar completadas');
  return res.json();
};

const fetchTableros = async () => {
  const res = await fetch('/api/tableros', {
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al obtener tableros');
  return res.json();
};

const eliminarTablero = async (id) => {
  const res = await fetch(`/api/tableros/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Error al eliminar tablero');
  return res.json();
};

// --- HOOKS ---

export function useTareas(tableroId, pagina, estado, q, intervaloRefetch, limit = 10) {
  return useQuery({
    queryKey: ['tareas', tableroId, pagina, estado, q, limit],
    queryFn: () => fetchTareas(tableroId, pagina, estado, q, limit), 
    refetchInterval: intervaloRefetch,
  });
}

export function useAgregarTarea(tableroId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (texto) => crearTarea({ texto, tableroId }),
    onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['tareas'], exact: false });
}
  });
}

export function useEditarTarea(tableroId) {
  const queryClient = useQueryClient();
  const toast = useUIStore.getState().showToast;

  return useMutation({
    mutationFn: editarTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['tareas'],
        exact: false, // 🔥 esta línea es clave para que refresque todas las variantes de la query
      });
      toast({ type: 'success', msg: 'Tarea editada' });
    },
    onError: () => {
      toast({ type: 'error', msg: 'No se pudo editar' });
    },
  });
}



export function useToggleTarea(tableroId) {
  const queryClient = useQueryClient();
  const toast = useUIStore.getState().showToast;

  return useMutation({
    mutationFn: toggleTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas', tableroId] });
      toast({ type: 'success', msg: 'Tarea actualizada' });
    },
    onError: () => {
      toast({ type: 'error', msg: 'Error al actualizar tarea' });
    },
  });
}

export function useEliminarTarea(tableroId) {
  const queryClient = useQueryClient();
  const toast = useUIStore.getState().showToast;

  return useMutation({
    mutationFn: eliminarTarea,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas', tableroId] });
      toast({ type: 'success', msg: 'Tarea eliminada' });
    },
    onError: () => {
      toast({ type: 'error', msg: 'Error al eliminar tarea' });
    },
  });
}

export function useEliminarCompletadas(tableroId) {
  const queryClient = useQueryClient();
  const toast = useUIStore.getState().showToast;

  return useMutation({
    mutationFn: () => eliminarCompletadas(tableroId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tareas', tableroId] });
      toast({ type: 'success', msg: 'Completadas eliminadas' });
    },
    onError: () => {
      toast({ type: 'error', msg: 'No se pudo limpiar tareas' });
    },
  });
}

export function useTableros() {
  return useQuery({
    queryKey: ['tableros'],
    queryFn: fetchTableros,
  });
}

export function useEliminarTablero() {
  const queryClient = useQueryClient();
  const toast = useUIStore.getState().showToast;

  return useMutation({
    mutationFn: eliminarTablero,
    onSuccess: () => {
      queryClient.invalidateQueries(['tableros']);
      toast({ type: 'success', msg: 'Tablero eliminado' });
    },
    onError: () => {
      toast({ type: 'error', msg: 'No se pudo eliminar tablero' });
    },
  });
}
