import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ListaTareas from './components/ListaTareas';
import SelectorTablero from './components/SelectorTablero';
import Configuracion from './pages/Configuracion'; 
import MenuTableros from './components/MenuTableros';

export default function App() {
  const location = useLocation();
  console.log('Ruta activa:', location.pathname);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-5xl font-bold text-white text-center -mb-2 mt-4">
    Gestor de Tareas
  </h1>

      <Routes>
        <Route path="/" element={<Navigate to="/tablero/personal" replace />} />
        <Route path="/tablero/:tableroId" element={<ListaTareas />} />
        <Route path="/configuracion" element={<Configuracion />} /> 
      </Routes>
    </div>
  );
}
