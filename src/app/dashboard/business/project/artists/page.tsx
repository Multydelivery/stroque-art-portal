import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BusinessSidePanel } from "@/components/BusinessSidePanel";
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

const fallbackImage = "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=900&q=80";

function buildRequestHref(artistId: string, projectId: string) {
  const query = new URLSearchParams({ projectId });

  return `/artists/${artistId}/request?${query.toString()}`;
}

function isProjectComplete(project: ProjectType) {
  return Boolean(
    project.spaceType?.trim() &&
      project.stylePreference?.trim() &&
      project.timeline?.trim() &&
      project.dueDate?.trim() &&
      project.description?.trim() &&
      Number(project.budgetMin) > 0 &&
      Number(project.budgetMax) >= Number(project.budgetMin)
  );
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
  if (!projectId) {
    redirect("/dashboard/business/project");
  }

  const testMode = isTestDataEnabled();
  let project: ProjectType | null = null;
  let artists: ArtistProfileType[] = [];

  if (testMode) {
    project = getTestBusinessProjectById(user.id, projectId) as ProjectType | null;
    if (!project) {
      redirect("/dashboard/business/project");
    }
    if (!isProjectComplete(project)) {
      redirect(`/dashboard/business/project/${project._id}/edit`);
    }

    const filters = {
      style: project.stylePreference,
      maxBudget: String(project.budgetMax)
    };
    artists = getTestArtists(filters);
  } else {
    await connectToDatabase();
    const business = await BusinessProfile.findOne({ userId: user.id });
    project = JSON.parse(
      JSON.stringify(await Project.findOne({ _id: projectId, businessId: business?._id }).populate("businessId").lean())
    ) as ProjectType | null;
    if (!project) {
      redirect("/dashboard/business/project");
    }
    if (!isProjectComplete(project)) {
      redirect(`/dashboard/business/project/${project._id}/edit`);
    }

    const artistFilters: Record<string, unknown> = {};
    artistFilters.styles = new RegExp(project.stylePreference, "i");
    artistFilters.startingPrice = { $lte: Number(project.budgetMax) };

    const artistRows = await ArtistProfile.find(artistFilters).sort({ updatedAt: -1 }).lean();
    artists = JSON.parse(JSON.stringify(artistRows)) as ArtistProfileType[];
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight text-stone-100">Find artist for project</h1>
        <p className="mt-2 text-stone-200">Choose an artist who matches your project details.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <BusinessSidePanel active="create-project" profileName={user.name} profileImageUrl={project?.businessId?.logoUrl} />

        <div className="space-y-8">
          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft dark:border-white/20 dark:bg-[#16161c]/95">
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Project summary</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-300">Dimensions</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-800 dark:text-stone-100">{project?.dimensions}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-300">Pay range</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-800 dark:text-stone-100">
                  {currency(Number(project?.budgetMin ?? 0))} - {currency(Number(project?.budgetMax ?? 0))}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-300">Type of art</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-800 dark:text-stone-100">{project?.stylePreference}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-300">Timeline</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-800 dark:text-stone-100">{project?.timeline}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-stone-500 dark:text-stone-300">Due date</dt>
                <dd className="mt-1 text-sm font-semibold text-stone-800 dark:text-stone-100">{project?.dueDate}</dd>
              </div>
            </dl>
            <div className="mt-5">
              <Link className="text-sm font-semibold text-ink underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:text-stone-100 dark:focus-visible:ring-offset-[#121214]" href="/dashboard/business/project">
                Edit project
              </Link>
            </div>
          </section>

          <section>
            <div>
              <h2 className="text-2xl font-semibold text-stone-100">Matched artists</h2>
              <p className="mt-1 text-stone-200">Artists are filtered automatically by this project&apos;s type of art and pay range.</p>
            </div>
            <div className="mt-6">
              {artists.length ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {artists.map((artist) => (
                    <article key={artist._id} className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-soft dark:border-white/20 dark:bg-[#16161c]/95">
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
                          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">{artist.displayName}</h3>
                          <p className="text-sm text-stone-600 dark:text-stone-300">{artist.location}</p>
                        </div>
                        <p className="line-clamp-2 text-sm text-stone-700 dark:text-stone-200">{artist.bio}</p>
                        <div className="flex flex-wrap gap-2">
                          {artist.styles.slice(0, 3).map((style) => (
                            <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-800 dark:bg-[#262630] dark:text-stone-100" key={style}>
                              {style}
                            </span>
                          ))}
                        </div>
                        <p className="text-sm font-semibold text-stone-900 dark:text-stone-100">Starts at {currency(artist.startingPrice)}</p>
                        <Link
                          className="inline-flex rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-[#121214]"
                          href={buildRequestHref(artist._id, project._id)}
                        >
                          Select this artist
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <EmptyState title="No artists found" body="Update project details to broaden your art type or pay range." />
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}