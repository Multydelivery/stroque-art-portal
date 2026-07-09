import Image from "next/image";
import Link from "next/link";
import { currency } from "@/lib/format";
import type { ArtistProfile } from "@/types/entities";

const fallback =
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=900&q=80";

export function ArtistCard({ artist }: { artist: ArtistProfile }) {
  return (
    <Link href={`/artists/${artist._id}`} className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-soft transition hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] bg-stone-100">
        <Image
          src={artist.portfolioImages[0] || fallback}
          alt={`${artist.displayName} portfolio preview`}
          fill
          className="object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="space-y-3 p-5">
        <div>
          <h3 className="text-lg font-semibold">{artist.displayName}</h3>
          <p className="text-sm text-stone-600">{artist.location}</p>
        </div>
        <p className="line-clamp-2 text-sm text-stone-700">{artist.bio}</p>
        <div className="flex flex-wrap gap-2">
          {artist.styles.slice(0, 3).map((style) => (
            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs" key={style}>
              {style}
            </span>
          ))}
        </div>
        <p className="text-sm font-semibold">Starts at {currency(artist.startingPrice)}</p>
      </div>
    </Link>
  );
}
