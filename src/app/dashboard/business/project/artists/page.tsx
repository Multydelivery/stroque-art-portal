import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BusinessDashboardTabs } from "@/components/BusinessDashboardTabs";
import { EmptyState } from "@/components/EmptyState";
import { currency } from "@/lib/format";
import { getSessionUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getTestArtists, getTestBusinessProjectById } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";
import BusinessProfile from "@/models/BusinessProfile";
import Project from "@/models/Project";
import type { ArtistProfile as ArtistProfileType, Project as ProjectType } from "@/types/entities";

export const dynamic = "force-dynamic";

const fallbackImage =
  "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=900&q=80";

function buildRequestHref(artistId: string, params: Record<string, string | undefined>) {
  const query = new URLSearchParams({
    projectId: params.projectId ?? ""
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
  const projectId = params.projectId;
  const projectReady = Boolean(projectId);

  const testMode = isTestDataEnabled();
  let project: ProjectType | null = null;
  let artists: ArtistProfileType[] = [];
  let artistStyles: string[] = [];
  let indianaLocations: string[] = [];

  if (projectReady) {
    if (testMode) {
      project = getTestBusinessProjectById(user.id, projectId ?? "") as ProjectType | null;
      const filters = project && !params.maxBudget ? { ...params, maxBudget: String(project.budgetMax) } : params;
      artists = getTestArtists(filters);
      artistStyles = [...new Set(getTestArtists().flatMap((artist) => artist.styles))].sort();
      indianaLocations = [...new Set(getTestArtists().map((artist) => artist.location))]
        .filter((location) => location.endsWith(", IN"))
        .sort();
    } else {
      await connectToDatabase();
      const business = await BusinessProfile.findOne({ userId: user.id });
      project = JSON.parse(
        JSON.stringify(await Project.findOne({ _id: projectId, businessId: business?._id }).populate("businessId").lean())
      ) as ProjectType | null;
      const artistFilters: Record<string, unknown> = {};
      if (params.q) artistFilters.$text = { $search: params.q };
      if (params.style) artistFilters.styles = new RegExp(params.style, "i");
      if (params.location) artistFilters.location = new RegExp(params.location, "i");
      if (params.maxBudget) {
        artistFilters.startingPrice = { $lte: Number(params.maxBudget) };
      } else if (project) {
        artistFilters.startingPrice = { $lte: project.budgetMax };
      }
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

  const projectDetailsReady = Boolean(project);

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
                  {currency(Number(project?.budgetMin ?? 0))} - {currency(Number(project?.budgetMax ?? 0))}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500">Type of art</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-800">{project?.stylePreference}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500">Timeline</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-800">{project?.timeline}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500">Due date</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-800">{project?.dueDate}</dd>
              </div>
            </dl>
            <div className="mt-5">
              <Link className="text-sm font-semibold text-ink underline-offset-4 hover:underline" href="/dashboard/business/project">
                Edit project
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
              <input
                name="maxBudget"
                aria-label="Maximum starting price"
                placeholder="Max starting price"
                type="number"
                defaultValue={params.maxBudget ?? project?.budgetMax}
              />

              <input type="hidden" name="projectId" value={project?._id} />

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
          title="Create project first"
          body="Post a project first, then search artists matched to that project."
        />
      )}
    </main>
  );
}