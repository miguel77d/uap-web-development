// lib/reviews-storage.ts
export type Review = {
  id: string;
  volumeId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
};

const KEY = 'reviews';

function readAll(): Review[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Review[]) : [];
  } catch {
    return [];
  }
}

function writeAll(reviews: Review[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(KEY, JSON.stringify(reviews));
}

export function getReviewsByVolumeId(volumeId: string): Review[] {
  return readAll().filter((r) => r.volumeId === volumeId);
}

export function addReview(review: Review) {
  const all = readAll();
  all.push(review);
  writeAll(all);
}

export function voteReview(id: string, kind: 'up' | 'down') {
  const all = readAll();
  const i = all.findIndex((r) => r.id === id);
  if (i >= 0) {
    if (kind === 'up') all[i].upvotes += 1;
    else all[i].downvotes += 1;
    writeAll(all);
  }
}
