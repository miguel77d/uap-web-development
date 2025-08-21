'use client';

import Link from 'next/link';

type Props = { items: any[] };

export default function ResultsGrid({ items }: Props) {
  if (!items || items.length === 0) {
    return <p className="text-slate-500">No se encontraron resultados.</p>;
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((it) => {
        const info = it.volumeInfo ?? {};
        const img =
          info.imageLinks?.thumbnail ||
          info.imageLinks?.small ||
          info.imageLinks?.smallThumbnail;

        return (
          <li key={it.id} className="border rounded p-3 bg-neutral-900/40">
            <Link href={`/book/${it.id}`} className="block hover:opacity-90">
              <div className="flex gap-3">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt={info.title} className="w-20 h-28 object-cover rounded" />
                ) : (
                  <div className="w-20 h-28 bg-slate-700 rounded" />
                )}
                <div>
                  <div className="font-semibold">{info.title ?? '—'}</div>
                  <div className="text-sm opacity-80">
                    {Array.isArray(info.authors) ? info.authors.join(', ') : 'Autor desconocido'}
                  </div>
                  <p className="mt-2 text-sm line-clamp-3 opacity-90">
                    {info.description ?? 'Sin descripción'}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
