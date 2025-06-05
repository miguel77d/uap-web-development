import React from 'react';
import { useConfigStore } from '../store/configStore';

export default function Configuracion() {
  const intervalo = useConfigStore((state) => state.intervaloRefetch);
  const setIntervaloRefetch = useConfigStore((state) => state.setIntervaloRefetch);
  const mayusculas = useConfigStore((state) => state.mayusculas);
  const setMayusculas = useConfigStore((state) => state.setMayusculas);

  return (
    <div className="p-6 max-w-xl mx-auto bg-gray-800 rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold">Configuración</h1>

      <div>
        <label className="block mb-1 font-semibold">⏱ Intervalo de refetch (segundos):</label>
        <input
          type="number"
          min="1"
          value={intervalo / 1000}
          onChange={(e) => setIntervaloRefetch(Number(e.target.value))} 
          className="w-full px-3 py-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          onClick={() => console.log('Intervalo actual en ms:', intervalo)}
        >
          Verificar intervalo
        </button>
      </div>

      <div>
        <label className="block mb-1 font-semibold">🔠 Mostrar descripciones en mayúsculas:</label>
        <input
          type="checkbox"
          checked={mayusculas}
          onChange={(e) => setMayusculas(e.target.checked)}
          className="mr-2 accent-blue-500"
        />
        <span>{mayusculas ? 'Activado' : 'Desactivado'}</span>
      </div>
    </div>
  );
}
