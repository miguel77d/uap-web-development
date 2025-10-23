import Link from "next/link";
import Image from "next/image";
import { GoogleBookItem } from "@/types/book";

function preview(text?: string, max = 140) {
  if (!text) return "";
  const clean = text.replace(/<[^>]*>/g, "");
  return clean.length > max ? clean.slice(0, max).trim() + "…" : clean;
}

export default function BookCard({ book }: { book: GoogleBookItem }) {
  const v = book.volumeInfo;
  const img = v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail;

  return (
    <Link
      href={`/book/${book.id}`}
      className="block border rounded p-3 hover:shadow transition"
    >
      <div className="flex gap-3">
        <Image
          src={img || "https://via.placeholder.com/128x190?text=Sin+imagen"}
          alt={v.title || "Libro"}
          width={96}   // 👈 obligatorios en next/image
          height={144}
          className="w-24 h-36 object-cover rounded"
        />
        <div className="flex-1">
          <h3 className="font-semibold">{v.title || "Sin título"}</h3>
          {v.authors && (
            <p className="text-sm text-gray-600">{v.authors.join(", ")}</p>
          )}
          {!!v.description && (
            <p className="text-sm mt-2">{preview(v.description)}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
