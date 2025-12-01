// app/components/ReviewItem.tsx
'use client';

import type { Review } from '../lib/reviews-storage';

export default function ReviewItem({
  review,
  onVote,
}: {
  review: Review;
  onVote: (id: string, kind: 'up' | 'down') => void;
}) {
  const score = review.upvotes - review.downvotes;
  return (
    <li className="border rounded p-3 bg-neutral-900/40">
      <div className="flex items-center justify-between">
        <div className="font-medium">
          {'⭐'.repeat(review.rating)} <span className="text-slate-400 text-sm">({review.rating}/5)</span>
        </div>
        <div className="text-sm opacity-80">
          {new Date(review.createdAt).toLocaleString()}
        </div>
      </div>

      <p className="mt-2">{review.comment}</p>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => onVote(review.id, 'up')}
          className="px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
        >
          👍 {review.upvotes}
        </button>
        <button
          onClick={() => onVote(review.id, 'down')}
          className="px-2 py-1 rounded bg-rose-600 text-white hover:bg-rose-700"
        >
          👎 {review.downvotes}
        </button>
        <span className="ml-2 text-sm opacity-80">Score: {score}</span>
      </div>
    </li>
  );
}
