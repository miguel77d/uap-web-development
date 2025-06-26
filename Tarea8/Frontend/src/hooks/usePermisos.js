import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function usePermisos(tableroId) {
  return useQuery({
    queryKey: ['permisos', tableroId],
    queryFn: async () => {
      const res = await fetch(`/api/permisos?tableroId=${tableroId}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Error al cargar permisos');
      return res.json(); // [{ id, usuario: { nombre, email }, rol }]
    },
  });
}
