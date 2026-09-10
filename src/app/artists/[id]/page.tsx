import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ButtonLink";
import { ProjectRequestForm } from "@/components/ProjectRequestForm";
import { currency } from "@/lib/format";
import { connectToDatabase } from "@/lib/db";
import { getTestArtist } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";
import type { ArtistProfile as ArtistProfileType } from "@/types/entities";

export const dynamic = "force-dynamic";

export default async function ArtistProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const demoMode = isTestDataEnabled();
  const artist = demoMode
    ? getTestArtist(id)
    : (JSON.parse(JSON.stringify(await connectToDatabase().then(() => ArtistProfile.findById(id).lean()))) as ArtistProfileType | null);
  if (!artist) notFound();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link className="text-sm font-semibold text-stone-600 hover:text-ink focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:text-stone-300 dark:hover:text-stone-100 dark:focus-visible:ring-offset-[#121214]" href="/artists">
        Back to artists
      </Link>
      <section className="mt-6 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {(artist.portfolioImages.length
              ? artist.portfolioImages
              : ["https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80"]
            ).slice(0, 4).map((image, index) => (
              <div className={`relative overflow-hidden rounded-lg bg-stone-100 dark:bg-[#1f1f26] ${index === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"}`} key={image}>
                <Image src={image} alt={`${artist.displayName} portfolio image`} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">{artist.location}</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight text-stone-100">{artist.displayName}</h1>
            <p className="mt-5 text-lg leading-8 text-stone-200">{artist.bio}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-white/20 dark:bg-[#16161c]/95">
              <p className="text-sm text-stone-500 dark:text-stone-300">Starting price</p>
              <p className="mt-1 font-semibold text-stone-900 dark:text-stone-100">{currency(artist.startingPrice)}</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-white p-4 dark:border-white/20 dark:bg-[#16161c]/95 sm:col-span-2">
              <p className="text-sm text-stone-500 dark:text-stone-300">Services</p>
              <p className="mt-1 font-semibold text-stone-900 dark:text-stone-100">{artist.services.join(", ")}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-stone-100">Styles</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {artist.styles.map((style) => (
                <span className="rounded-full bg-white px-3 py-1 text-sm text-stone-800 shadow-sm dark:bg-[#1f1f26] dark:text-stone-100" key={style}>{style}</span>
              ))}
            </div>
          </div>
          {!demoMode && <ButtonLink href={`/artists/${artist._id}/request`}>Send Project Request</ButtonLink>}
        </div>
      </section>
      {demoMode && (
        <section className="mt-12 rounded-lg border border-stone-200 bg-white p-6 shadow-soft dark:border-white/20 dark:bg-[#16161c]/95" id="demo-project-request">
          <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Demo project request</h2>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
            This prefilled test form submits an in-memory request without MongoDB or login.
          </p>
          <div className="mt-8">
            <ProjectRequestForm artistId={artist._id} demoMode stayOnSuccess initialValues={{ projectId: "test-project-1" }} />
          </div>
        </section>
      )}
    </main>
  );
}
