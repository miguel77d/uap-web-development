// app/lib/googleBooks.ts
export type GoogleBookItem = {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
      small?: string;
      medium?: string;
      large?: string;
    };
    publishedDate?: string;
    publisher?: string;
    pageCount?: number;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    language?: string;
  };
};

type GoogleBooksListResponse = {
  items?: GoogleBookItem[];
  totalItems?: number;
};

const BASE = 'https://www.googleapis.com/books/v1/volumes';

// Arma el parámetro q= según filtros
function buildQuery(opts: { title?: string; author?: string; isbn?: string }) {
  const parts: string[] = [];
  if (opts.title)  parts.push(`intitle:${encodeURIComponent(opts.title)}`);
  if (opts.author) parts.push(`inauthor:${encodeURIComponent(opts.author)}`);
  if (opts.isbn)   parts.push(`isbn:${encodeURIComponent(opts.isbn)}`);
  return parts.length ? parts.join('+') : 'programming';
}

// Normaliza un item de la API a nuestro tipo (campos mínimos)
function mapItem(raw: any): GoogleBookItem {
  return {
    id: raw?.id,
    volumeInfo: raw?.volumeInfo ?? {},
  };
}

// Búsqueda por filtros (título/autor/isbn)
export async function searchBooks(
  opts: { title?: string; author?: string; isbn?: string; startIndex?: number; maxResults?: number } = {}
) {
  const q = buildQuery(opts);
  const startIndex = opts.startIndex ?? 0;
  const maxResults = opts.maxResults ?? 12;

  const url = `${BASE}?q=${q}&startIndex=${startIndex}&maxResults=${maxResults}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Google Books error ${res.status}`);

  const data = (await res.json()) as GoogleBooksListResponse & { items?: any[] };
  const items = (data.items ?? []).map(mapItem);

  return { totalItems: data.totalItems ?? 0, items };
}

// Obtener un libro por ID
export async function getBookById(id: string): Promise<GoogleBookItem | null> {
  if (!id) return null;
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return mapItem(data);
}
