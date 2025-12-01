import Link from 'next/link';
import { getBookById } from '../../lib/googleBooks';
import ClientReviews from '../../components/ClientReviews';

type Params = { id: string };

export default async function BookDetailPage(
  props: { params: Promise<Params> }          // 👈 params es Promise
) {
  const { id } = await props.params;           // 👈 hay que hacer await
  const book = await getBookById(id);

  if (!book) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <p>No se encontró el libro.</p>
        <Link href="/" className="underline">Volver</Link>
      </main>
    );
  }

  const info = book.volumeInfo ?? {};
  const img =
    info.imageLinks?.large ||
    info.imageLinks?.medium ||
    info.imageLinks?.thumbnail ||
    info.imageLinks?.smallThumbnail;

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <Link href="/" className="underline">← Volver</Link>

      <header className="flex gap-4">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={info.title ?? ''} className="w-40 h-56 object-cover rounded" />
        ) : (
          <div className="w-40 h-56 bg-slate-700 rounded" />
        )}
        <div>
          <h1 className="text-2xl font-bold">{info.title ?? '—'}</h1>
          <p className="opacity-80">
            {Array.isArray(info.authors) ? info.authors.join(', ') : 'Autor desconocido'}
          </p>
          <div className="mt-2 text-sm opacity-80 space-y-1">
            <div><strong>Páginas:</strong> {info.pageCount ?? '—'}</div>
            <div><strong>Categorías:</strong> {Array.isArray(info.categories) ? info.categories.join(', ') : '—'}</div>
            <div><strong>Editorial:</strong> {info.publisher ?? '—'}</div>
            <div><strong>Publicado:</strong> {info.publishedDate ?? '—'}</div>
            <div><strong>Idioma:</strong> {info.language ?? '—'}</div>
          </div>
        </div>
      </header>

      <section>
        <h2 className="text-xl font-semibold">Descripción</h2>
        <p className="mt-2 opacity-90 whitespace-pre-line">
          {info.description
            ? info.description.replace(/<[^>]+>/g, '') // borra etiquetas
            : 'Sin descripción.'}
        </p>
      </section>

      {/* Reseñas */}
      <ClientReviews volumeId={id} />
    </main>
  );
}
