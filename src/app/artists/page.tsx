import { ArtistCard } from "@/components/ArtistCard";
import { EmptyState } from "@/components/EmptyState";
import { connectToDatabase } from "@/lib/db";
import { getTestArtists } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";
import type { ArtistProfile as ArtistProfileType } from "@/types/entities";

export const dynamic = "force-dynamic";

export default async function ArtistsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  if (isTestDataEnabled()) {
    const artists = getTestArtists(params);
    const artistNames = [...new Set(getTestArtists().map((artist) => artist.displayName))].sort();
    const artistStyles = [...new Set(getTestArtists().flatMap((artist) => artist.styles))].sort();
    const artistLocations = [...new Set(getTestArtists().map((artist) => artist.location))].sort();
    const serviceTypes = [...new Set(getTestArtists().flatMap((artist) => artist.services))].sort();

    return (
      <main className="mx-auto max-w-7xl bg-white px-4 py-10 text-stone-900 sm:px-6 lg:px-8 dark:bg-transparent dark:text-white">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-stone-950 dark:text-white">Artist directory</h1>
            <p className="mt-2 text-stone-700 dark:text-stone-200">Search by style, city, and service.</p>
          </div>
        </div>
        <form className="mt-8 grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-soft dark:border-white/15 dark:bg-[#121418] md:grid-cols-4">
          <div>
            <input name="q" aria-label="Search artists" placeholder="Search artists" list="artist-name-suggestions" autoComplete="off" defaultValue={params.q} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/15 dark:bg-[#1b1f24] dark:text-stone-50 dark:placeholder:text-stone-400 dark:focus-visible:ring-offset-[#121214]" />
            <datalist id="artist-name-suggestions">
              {artistNames.map((name) => <option key={name} value={name} />)}
            </datalist>
          </div>
          <select name="style" aria-label="Art style" defaultValue={params.style ?? ""} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/15 dark:bg-[#1b1f24] dark:text-stone-50 dark:focus-visible:ring-offset-[#121214]">
            <option value="">All artist styles</option>
            {artistStyles.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
          <select name="location" aria-label="Artist location" defaultValue={params.location ?? ""} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/15 dark:bg-[#1b1f24] dark:text-stone-50 dark:focus-visible:ring-offset-[#121214]">
            <option value="">All artist locations</option>
            {artistLocations.map((location) => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
          <select name="service" aria-label="Service type" defaultValue={params.service ?? ""} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/15 dark:bg-[#1b1f24] dark:text-stone-50 dark:focus-visible:ring-offset-[#121214]">
            <option value="">All service types</option>
            {serviceTypes.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
          <button
            className="rounded-full border border-violet-300 bg-violet-100 px-5 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-200 focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-violet-400/60 dark:bg-[#2b1f49] dark:text-white dark:hover:bg-[#35235b] dark:focus-visible:ring-offset-[#121214] md:col-span-4"
            type="submit"
          >
            Search Artist
          </button>
        </form>
        <div className="mt-8">
          {artists.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artists.map((artist) => (
                <ArtistCard artist={artist} key={artist._id} />
              ))}
            </div>
          ) : (
            <EmptyState title="No artists found" body="Try broader filters, or sign up as an artist to create the first profile." />
          )}
        </div>
      </main>
    );
  }

  await connectToDatabase();
  const filters: Record<string, unknown> = {};
  if (params.q) filters.$text = { $search: params.q };
  if (params.style) filters.styles = params.style;
  if (params.location) filters.location = new RegExp(params.location, "i");
  if (params.service) filters.services = params.service;
  if (params.maxBudget) filters.startingPrice = { $lte: Number(params.maxBudget) };

  const [artistRows, artistNames, artistStyles, artistLocations, serviceTypes] = await Promise.all([
    ArtistProfile.find(filters).sort({ updatedAt: -1 }).lean(),
    ArtistProfile.distinct("displayName") as Promise<string[]>,
    ArtistProfile.distinct("styles") as Promise<string[]>,
    ArtistProfile.distinct("location") as Promise<string[]>,
    ArtistProfile.distinct("services") as Promise<string[]>
  ]);
  const artists = JSON.parse(JSON.stringify(artistRows)) as ArtistProfileType[];

  return (
    <main className="mx-auto max-w-7xl bg-white px-4 py-10 text-stone-900 sm:px-6 lg:px-8 dark:bg-transparent dark:text-white">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-stone-950 dark:text-white">Artist directory</h1>
          <p className="mt-2 text-stone-700 dark:text-stone-200">Search by style, city, and service.</p>
        </div>
      </div>
      <form className="mt-8 grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-soft dark:border-white/15 dark:bg-[#121418] md:grid-cols-4">
        <div>
          <input name="q" aria-label="Search artists" placeholder="Search artists" list="artist-name-suggestions" autoComplete="off" defaultValue={params.q} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/15 dark:bg-[#1b1f24] dark:text-stone-50 dark:placeholder:text-stone-400 dark:focus-visible:ring-offset-[#121214]" />
          <datalist id="artist-name-suggestions">
            {artistNames.sort().map((name) => <option key={name} value={name} />)}
          </datalist>
        </div>
        <select name="style" aria-label="Art style" defaultValue={params.style ?? ""} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/15 dark:bg-[#1b1f24] dark:text-stone-50 dark:focus-visible:ring-offset-[#121214]">
          <option value="">All artist styles</option>
          {artistStyles.sort().map((style) => (
            <option key={style} value={style}>{style}</option>
          ))}
        </select>
        <select name="location" aria-label="Artist location" defaultValue={params.location ?? ""} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/15 dark:bg-[#1b1f24] dark:text-stone-50 dark:focus-visible:ring-offset-[#121214]">
          <option value="">All artist locations</option>
          {artistLocations.sort().map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        <select name="service" aria-label="Service type" defaultValue={params.service ?? ""} className="w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/15 dark:bg-[#1b1f24] dark:text-stone-50 dark:focus-visible:ring-offset-[#121214]">
          <option value="">All service types</option>
          {serviceTypes.sort().map((service) => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
        <button
          className="rounded-full border border-violet-300 bg-violet-100 px-5 py-3 text-sm font-semibold text-violet-800 transition hover:bg-violet-200 focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-violet-400/60 dark:bg-[#2b1f49] dark:text-white dark:hover:bg-[#35235b] dark:focus-visible:ring-offset-[#121214] md:col-span-4"
          type="submit"
        >
          Search Artist
        </button>
      </form>
      <div className="mt-8">
        {artists.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artists.map((artist) => (
              <ArtistCard artist={artist} key={artist._id} />
            ))}
          </div>
        ) : (
          <EmptyState title="No artists found" body="Try broader filters, or sign up as an artist to create the first profile." />
        )}
      </div>
    </main>
  );
}
