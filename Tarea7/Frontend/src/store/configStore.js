import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useConfigStore = create(
  persist(
    (set) => ({
      intervaloRefetch: 10000,
      mayusculas: false,

      setIntervaloRefetch: (valor) => {
        const ms = Number(valor) * 1000;
        if (!isNaN(ms) && ms > 0) {
          set({ intervaloRefetch: ms });
        }
      },

      setMayusculas: (valor) => set({ mayusculas: valor }),
    }),
    {
      name: 'config-storage', // nombre clave en localStorage
    }
  )
);
