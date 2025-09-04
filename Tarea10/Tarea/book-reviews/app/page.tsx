'use client';

import { useState } from 'react';
import { searchBooks } from './lib/googleBooks';
import { GoogleBookItem } from './types/book';
import SearchBar from './components/SearchBar';
import ResultsGrid from './components/ResultsGrid';

export default function HomePage() {
  const [items, setItems] = useState<GoogleBookItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSearch(args: { title?: string; author?: string; isbn?: string }) {
    try {
      setError(null);
      setLoading(true);
      const { items } = await searchBooks({ ...args, maxResults: 12 });
      setItems(items);
    } catch (e) {
      console.error(e);
      setError('No se pudo completar la búsqueda. Reintentá en unos segundos.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Buscador de libros (Google Books)</h1>
      <SearchBar onSearch={handleSearch} />
      {loading && <p className="mt-6">Cargando…</p>}
      {error && <p className="mt-6 text-red-600">{error}</p>}
      {!loading && !error && <ResultsGrid items={items} />}
    </main>
  );
}
