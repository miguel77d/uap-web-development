import * as storage from '@/lib/reviews-storage';

function mockLocalStorage() {
  let store: Record<string, string> = {};
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
    key: (i: number) => Object.keys(store)[i] ?? null,
    get length() { return Object.keys(store).length; },
  } as any);
  return () => { store = {}; };
}

describe('reviews-storage', () => {
  const reset = mockLocalStorage();

  beforeEach(() => {
    reset();
    localStorage.clear();
  });

  test('addReview agrega y persiste', () => {
    const r: storage.Review = {
      id: '1',
      volumeId: 'V1',
      rating: 5,
      comment: 'hola',
      upvotes: 0,
      downvotes: 0,
      createdAt: new Date().toISOString(),
    };
    storage.addReview(r);
    const res = storage.getReviewsByVolumeId('V1');
    expect(res).toHaveLength(1);
    expect(res[0].comment).toBe('hola');
  });

  test('getReviewsByVolumeId filtra por volumen', () => {
    const base = (id: string, vol: string): storage.Review => ({
      id, volumeId: vol, rating: 4, comment: '', upvotes: 0, downvotes: 0, createdAt: new Date().toISOString()
    });
    storage.addReview(base('1', 'A'));
    storage.addReview(base('2', 'A'));
    storage.addReview(base('3', 'B'));
    expect(storage.getReviewsByVolumeId('A')).toHaveLength(2);
    expect(storage.getReviewsByVolumeId('B')).toHaveLength(1);
  });

  test('voteReview suma up y down; ignora IDs inexistentes', () => {
    const r: storage.Review = {
      id: '1', volumeId: 'V', rating: 3, comment: '', upvotes: 0, downvotes: 0, createdAt: new Date().toISOString()
    };
    storage.addReview(r);
    storage.voteReview('1', 'up');
    storage.voteReview('1', 'down');
    const [after] = storage.getReviewsByVolumeId('V');
    expect(after.upvotes).toBe(1);
    expect(after.downvotes).toBe(1);

    expect(() => storage.voteReview('XYZ', 'up')).not.toThrow();
  });
});
