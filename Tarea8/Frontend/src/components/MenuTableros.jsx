import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import { Link } from 'react-router-dom';

export default function MenuTableros() {
  const [tableros, setTableros] = useState([]);
  const [nuevo, setNuevo] = useState('');
  const navigate = useNavigate();
  const { tableroId } = useParams();
  const showToast = useUIStore((state) => state.showToast);

  useEffect(() => {
  fetch('/api/tableros', {
    credentials: 'include',
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Error ${res.status}: ${res.statusText}`);
      }
      return res.json();
    })
    .then((data) => {
      if (!data?.tableros) {
        throw new Error('Respuesta inesperada del servidor');
      }
      setTableros(data.tableros);
    })
    .catch((error) => {
      console.error('Error al cargar tableros:', error.message);
    });
}, []);

  const crearTablero = async () => {
    if (!nuevo.trim()) return;

    const res = await fetch('/api/tableros', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevo }),
    });

    if (!res.ok) return;

    const nuevoTablero = await res.json(); // devuelve { id, nombre }

    setTableros((prev) => [...prev, nuevoTablero]);
    setNuevo('');
    showToast({ type: 'success', msg: `Tablero "${nuevo}" creado` });
  };

  const eliminarTablero = async (id) => {
    const confirmar = confirm(`¿Eliminar este tablero?`);
    if (!confirmar) return;

    await fetch(`/api/tableros/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });

    setTableros((prev) => prev.filter((t) => t.id !== id));

    if (`${id}` === tableroId) navigate('/');
    showToast({ type: 'success', msg: `Tablero eliminado` });
  };

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md max-w-md mx-auto mt-12">
      <h2 className="text-white font-semibold mb-2">Tableros</h2>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          placeholder="Nuevo tablero"
          className="flex-1 bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm"
        />
        <button
          onClick={crearTablero}
          className="bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
        >
          Crear
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tableros.map(({ id, nombre }) => (
          <div
            key={id}
            className={`flex items-center px-3 py-1 rounded-md border
              ${String(id) === tableroId
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-colors'}`}
          >
            <button
              onClick={() => navigate(`/tablero/${id}`)}
              className="mr-2"
            >
              {nombre}
            </button>
            <button
              onClick={() => eliminarTablero(id)}
              className="text-purple-400 hover:text-purple-600 font-bold"
              title="Eliminar tablero"
              disabled={String(id) === tableroId}
            >
              ✖
            </button>
          </div>
        ))}
      </div>
       <div className="mt-4 text-center">
        <Link
          to="/configuracion"
          className="text-blue-400 hover:text-blue-300 flex items-center justify-center gap-2"
        >
          <span className="text-xl">⚙</span> <span>Configuración</span>
        </Link>
      </div>
    </div>
  );
}
