// app/components/ReviewList.tsx
'use client';

import { useEffect, useState } from 'react';
import { getReviewsByVolumeId, voteReview, type Review } from '../lib/reviews-storage';
import ReviewItem from './ReviewItem';

export default function ReviewList({ volumeId, refreshToken }: { volumeId: string; refreshToken: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const items = getReviewsByVolumeId(volumeId).sort(
      (a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
    );
    setReviews(items);
  }, [volumeId, refreshToken]);

  function handleVote(id: string, kind: 'up' | 'down') {
    voteReview(id, kind);
    // re-cargar
    const items = getReviewsByVolumeId(volumeId).sort(
      (a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes)
    );
    setReviews(items);
  }

  if (reviews.length === 0) {
    return <p className="text-slate-500">Sé el primero en publicar una reseña.</p>;
  }

  return (
    <ul className="space-y-3">
      {reviews.map((r) => (
        <ReviewItem key={r.id} review={r} onVote={handleVote} />
      ))}
    </ul>
  );
}
