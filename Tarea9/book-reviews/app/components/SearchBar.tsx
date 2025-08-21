'use client';
import { useState, FormEvent } from 'react';

type Props = {
  onSearch: (args: { title?: string; author?: string; isbn?: string }) => void;
};

export default function SearchBar({ onSearch }: Props) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [isbn, setIsbn] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const payload: { title?: string; author?: string; isbn?: string } = {};
    if (title.trim()) payload.title = title.trim();
    if (author.trim()) payload.author = author.trim();
    if (isbn.trim()) payload.isbn = isbn.trim();

    if (Object.keys(payload).length === 0) {
      // al menos un campo
      return;
    }
    onSearch(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded px-3 py-2 text-white"
      />
      <input
        placeholder="Autor"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        className="border rounded px-3 py-2 text-white"
      />
      <input
        placeholder="ISBN"
        value={isbn}
        onChange={(e) => setIsbn(e.target.value)}
        className="border rounded px-3 py-2 text-white"
      />
      <button type="submit" className="border rounded px-3 py-2 hover:opacity-80">
        Buscar
      </button>
    </form>
  );
}
