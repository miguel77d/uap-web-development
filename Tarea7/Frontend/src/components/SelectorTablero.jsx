import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function SelectorTablero() {
  const [tableros, setTableros] = useState([]);
  const [nuevo, setNuevo] = useState('');
  const navigate = useNavigate();
  const { tableroId } = useParams();

  useEffect(() => {
    fetch('/api/tableros')
      .then((res) => res.json())
      .then((data) => setTableros(data.tableros));
  }, []);

  const crearTablero = async () => {
    if (!nuevo.trim()) return;
    await fetch('/api/tableros', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevo }),
    });
    setTableros((prev) => [...prev, nuevo]);
    setNuevo('');
  };

  const eliminarTablero = async (nombre) => {
    await fetch('/api/tableros', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre }),
    });
    setTableros((prev) => prev.filter((t) => t !== nombre));
    if (nombre === tableroId) navigate('/');
  };

  return (
    <div className="bg-gray-800 p-4 rounded-md shadow-md max-w-md mx-auto mt-4">
      <h2 className="text-white font-semibold mb-2">Tableros</h2>
      <div className="flex flex-wrap gap-2 mb-3">
        {tableros.map((nombre) => (
          <div
            key={nombre}
            className={`flex items-center px-3 py-1 rounded-md border
              ${nombre === tableroId
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'}`}
          >
            <button onClick={() => navigate(`/tablero/${nombre}`)} className="mr-2">
              {nombre}
            </button>
            <button
              onClick={() => eliminarTablero(nombre)}
              className="text-purple-400 hover:text-purple-600 font-bold"
              title="Eliminar tablero"
              disabled={nombre === tableroId}
            >
              ✖
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={nuevo}
          onChange={(e) => setNuevo(e.target.value)}
          placeholder="Nuevo tablero"
          className="flex-1 bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
        />
        <button
          onClick={crearTablero}
          className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 text-sm"
        >
          Crear
        </button>
      </div>
    </div>
  );
}
