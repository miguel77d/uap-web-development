'use client';

import { useState } from 'react';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

export default function ClientReviews({ volumeId }: { volumeId: string }) {
  const [refresh, setRefresh] = useState(0);

  return (
    <section className="mt-6 space-y-4">
      <h2 className="text-xl font-semibold">Reseñas</h2>
      <ReviewForm volumeId={volumeId} onAdded={() => setRefresh((n) => n + 1)} />
      <ReviewList volumeId={volumeId} refreshToken={refresh} />
    </section>
  );
}
