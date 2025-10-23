'use client';

import { useState, FormEvent } from 'react';
import { addReview, type Review } from '../lib/reviews-storage';
import { v4 as uuid } from 'uuid';

export default function ReviewForm({ volumeId, onAdded }: { volumeId: string; onAdded: () => void }) {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [error, setError] = useState<string | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      setError('La calificación debe ser de 1 a 5.');
      return;
    }
    if (!comment.trim()) {
      setError('Escribí un comentario.');
      return;
    }
    const review: Review = {
      id: uuid(),
      volumeId,
      rating: rating as 1 | 2 | 3 | 4 | 5,
      comment: comment.trim(),
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
    };
    addReview(review);
    setComment('');
    setRating(5);
    setError(null);
    onAdded(); // para refrescar la lista
  }

  return (
    <form onSubmit={submit} className="border rounded p-4 bg-neutral-900/40 space-y-3">
      <div className="flex items-center gap-2">
        <label className="w-24">Calificación</label>
        <select
          className="text-black rounded px-2 py-1"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} ⭐
            </option>
          ))}
        </select>
      </div>

      <div>
        <textarea
          className="w-full h-24 text-white rounded px-3 py-2"
          placeholder="Escribí tu reseña…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {error && <p className="text-red-400">{error}</p>}

      <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
  Publicar reseña
</button>
    </form>
  );
}
