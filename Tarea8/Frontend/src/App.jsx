import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import ListaTareas from './components/ListaTareas';
import Configuracion from './pages/Configuracion';
import RutaProtegida from './RutaProtegida';
import Login from './pages/Login';
import MenuTableros from './components/MenuTableros';
import Registro from './pages/Registro';
import RedirectAlPrimerTablero from './pages/RedirectAlPrimerTablero';
import Toast from './components/Toast'; // ✅ IMPORTANTE: importamos el toast

export default function App() {
  const location = useLocation();
  const cargarUsuario = useAuthStore((s) => s.cargarUsuario);

  useEffect(() => {
    cargarUsuario(); // Cargar sesión al iniciar
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-5xl font-bold text-white text-center -mb-2 mt-4">
        Gestor de Tareas
      </h1>

      <MenuTableros />

      {/* ✅ Mostramos el Toast globalmente */}
      <Toast />

      <Routes>
        <Route path="/register" element={<Registro />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/tablero/:tableroId"
          element={
            <RutaProtegida>
              <ListaTareas />
            </RutaProtegida>
          }
        />

        <Route
          path="/configuracion"
          element={
            <RutaProtegida>
              <Configuracion />
            </RutaProtegida>
          }
        />

        <Route
          path="/"
          element={
            <RutaProtegida>
              <RedirectAlPrimerTablero />
            </RutaProtegida>
          }
        />
      </Routes>
    </div>
  );
}
