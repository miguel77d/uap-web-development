import { create } from 'zustand';
import axios from 'axios';

axios.defaults.withCredentials = true; // 👈 IMPORTANTE: enviar cookies

const API = 'http://localhost:3000/api'; // ajustá si cambia el puerto

export const useAuthStore = create((set) => ({
  usuario: null,
  cargando: true,

  cargarUsuario: async () => {
    try {
      const res = await axios.get(`${API}/perfil`);
      set({ usuario: res.data, cargando: false });
    } catch {
      set({ usuario: null, cargando: false });
    }
  },

  login: async ({ email, password }) => {
  try {
    await axios.post(`${API}/login`, { email, password });
    const res = await axios.get(`${API}/perfil`);
    set({ usuario: res.data });
  } catch (error) {
    throw error;
  }
},

  logout: async () => {
    await axios.post(`${API}/logout`);
    set({ usuario: null });
  },
}));
