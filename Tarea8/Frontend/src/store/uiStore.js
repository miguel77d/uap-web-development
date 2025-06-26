import { create } from 'zustand';

export const useUIStore = create((set) => ({
  editingId: null,
  setEditingId: (id) => set({ editingId: id }),
  clearEditingId: () => set({ editingId: null }),

  toast: null,
  showToast: (toast) => set({ toast }),
  clearToast: () => set({ toast: null }),

  // Estado de la página actual
  paginaActual: 1,
  setPaginaActual: (pagina) => set({ paginaActual: pagina }),
}));
