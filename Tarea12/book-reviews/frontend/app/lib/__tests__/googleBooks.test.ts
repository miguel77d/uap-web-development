import { searchBooks, getBookById } from '@/lib/googleBooks';

describe('googleBooks lib', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('searchBooks arma la URL y mapea items', async () => {
    const fake = {
      totalItems: 123,
      items: [
        { id: 'A1', volumeInfo: { title: 'T1' } },
        { id: 'A2', volumeInfo: { title: 'T2' } },
      ],
    };
    const fetchSpy = vi.spyOn(global, 'fetch' as any).mockResolvedValueOnce(
      new Response(JSON.stringify(fake), { status: 200 })
    );

    const res = await searchBooks({ title: 'harry', author: 'rowling', maxResults: 5, startIndex: 10 });

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const url = fetchSpy.mock.calls[0][0] as string;
    expect(url).toContain('q=intitle:harry+inauthor:rowling');
    expect(url).toContain('maxResults=5');
    expect(url).toContain('startIndex=10');

    expect(res.totalItems).toBe(123);
    expect(res.items).toHaveLength(2);
    expect(res.items[0].id).toBe('A1');
  });

  test('searchBooks maneja respuesta vacía', async () => {
    vi.spyOn(global, 'fetch' as any).mockResolvedValueOnce(
      new Response(JSON.stringify({ totalItems: 0 }), { status: 200 })
    );
    const res = await searchBooks({ title: 'x' });
    expect(res.totalItems).toBe(0);
    expect(res.items).toEqual([]);
  });

  test('getBookById devuelve null si la API falla', async () => {
    vi.spyOn(global, 'fetch' as any).mockResolvedValueOnce(
      new Response('err', { status: 500 })
    );
    const book = await getBookById('BAD');
    expect(book).toBeNull();
  });

  test('getBookById mapea item', async () => {
    const fake = { id: 'ID1', volumeInfo: { title: 'Nice' } };
    vi.spyOn(global, 'fetch' as any).mockResolvedValueOnce(
      new Response(JSON.stringify(fake), { status: 200 })
    );
    const book = await getBookById('ID1');
    expect(book?.id).toBe('ID1');
    expect(book?.volumeInfo.title).toBe('Nice');
  });
});
