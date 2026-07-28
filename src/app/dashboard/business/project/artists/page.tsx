import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BusinessDashboardTabs } from "@/components/BusinessDashboardTabs";
import { EmptyState } from "@/components/EmptyState";
import { currency } from "@/lib/format";
import { getSessionUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getTestArtists } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";
import type { ArtistProfile as ArtistProfileType } from "@/types/entities";

export const dynamic = "force-dynamic";

const fallbackImage =
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=900&q=80";

function isValidProjectDetails(params: Record<string, string | undefined>) {
  return Boolean(
    params.spaceType &&
      params.stylePreference &&
      params.timeline &&
      params.dueDate &&
      params.description &&
      params.budgetMin &&
      params.budgetMax
  );
}

function buildRequestHref(artistId: string, params: Record<string, string | undefined>) {
  const query = new URLSearchParams({
    spaceType: params.spaceType ?? "",
    stylePreference: params.stylePreference ?? "",
    timeline: params.timeline ?? "",
    dueDate: params.dueDate ?? "",
    description: params.description ?? "",
    budgetMin: params.budgetMin ?? "",
    budgetMax: params.budgetMax ?? ""
  });

  return `/artists/${artistId}/request?${query.toString()}`;
}

export default async function BusinessProjectArtistSearchPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "business") redirect(`/dashboard/${user.role}`);

  const params = await searchParams;
  const projectDetailsReady = isValidProjectDetails(params);

  const testMode = isTestDataEnabled();
  let artists: ArtistProfileType[] = [];
  let artistStyles: string[] = [];
  let indianaLocations: string[] = [];

  if (projectDetailsReady) {
    if (testMode) {
      artists = getTestArtists(params);
      artistStyles = [...new Set(getTestArtists().flatMap((artist) => artist.styles))].sort();
      indianaLocations = [...new Set(getTestArtists().map((artist) => artist.location))]
        .filter((location) => location.endsWith(", IN"))
        .sort();
    } else {
      await connectToDatabase();
      const artistFilters: Record<string, unknown> = {};
      if (params.q) artistFilters.$text = { $search: params.q };
      if (params.style) artistFilters.styles = new RegExp(params.style, "i");
      if (params.location) artistFilters.location = new RegExp(params.location, "i");
      if (params.maxBudget) artistFilters.startingPrice = { $lte: Number(params.maxBudget) };
      const [artistRows, availableStyles, availableLocations] = await Promise.all([
        ArtistProfile.find(artistFilters).sort({ updatedAt: -1 }).lean(),
        ArtistProfile.distinct("styles") as Promise<string[]>,
        ArtistProfile.distinct("location") as Promise<string[]>
      ]);
      artists = JSON.parse(JSON.stringify(artistRows)) as ArtistProfileType[];
      artistStyles = availableStyles.sort();
      indianaLocations = availableLocations
        .filter((location) => location.endsWith(", IN"))
        .sort();
    }
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight">Find artist for project</h1>
        <p className="mt-2 text-stone-700">Step 2 of 2: choose an artist who matches your project details.</p>
        <div className="mt-5">
          <BusinessDashboardTabs active="artists" />
        </div>
      </section>

      {projectDetailsReady ? (
        <>
          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
            <h2 className="text-2xl font-semibold">Project summary</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500">Pay range</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-800">
                  {currency(Number(params.budgetMin ?? 0))} - {currency(Number(params.budgetMax ?? 0))}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500">Type of art</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-800">{params.stylePreference}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500">Timeline</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-800">{params.timeline}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500">Due date</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-800">{params.dueDate}</dd>
              </div>
            </dl>
            <div className="mt-5">
              <Link className="text-sm font-semibold text-ink underline-offset-4 hover:underline" href="/dashboard/business/project">
                Edit project details
              </Link>
            </div>
          </section>

          <section>
            <div>
              <h2 className="text-2xl font-semibold">Search artists</h2>
              <p className="mt-1 text-stone-700">Filter artists by specialty, location, and starting price.</p>
            </div>
            <form className="mt-4 grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-soft md:grid-cols-4" method="get">
              <input name="q" aria-label="Search artists" placeholder="Name or keyword" defaultValue={params.q} />
              <select name="style" aria-label="Art style" defaultValue={params.style ?? ""}>
                <option value="">All artist styles</option>
                {artistStyles.map((style) => (
                  <option key={style} value={style}>{style}</option>
                ))}
              </select>
              <select name="location" aria-label="Indiana artist location" defaultValue={params.location ?? ""}>
                <option value="">All Indiana locations</option>
                {indianaLocations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <input name="maxBudget" aria-label="Maximum starting price" placeholder="Max starting price" type="number" defaultValue={params.maxBudget} />

              <input type="hidden" name="spaceType" value={params.spaceType} />
              <input type="hidden" name="budgetMin" value={params.budgetMin} />
              <input type="hidden" name="budgetMax" value={params.budgetMax} />
              <input type="hidden" name="timeline" value={params.timeline} />
              <input type="hidden" name="dueDate" value={params.dueDate} />
              <input type="hidden" name="stylePreference" value={params.stylePreference} />
              <input type="hidden" name="description" value={params.description} />

              <button className="rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white md:col-span-4" type="submit">
                Search artists
              </button>
            </form>

            <div className="mt-6">
              {artists.length ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {artists.map((artist) => (
                    <article key={artist._id} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-soft">
                      <div className="relative aspect-[4/3] bg-stone-100">
                        <Image
                          src={artist.portfolioImages[0] || fallbackImage}
                          alt={`${artist.displayName} portfolio preview`}
                          fill
                          className="object-cover"
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
                        <Link
                          className="inline-flex rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white"
                          href={buildRequestHref(artist._id, params)}
                        >
                          Select this artist
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="No artists found" body="Try broader filters to discover additional artists." />
              )}
            </div>
          </section>
        </>
      ) : (
        <EmptyState
          title="Add project details first"
          body="Complete pay range, art type, timeline, due date, and description before searching for artists."
        />
      )}
    </main>
  );
}