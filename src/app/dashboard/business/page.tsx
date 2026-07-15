import { redirect } from "next/navigation";
import { BusinessProfileForm } from "@/components/BusinessProfileForm";
import { ArtistCard } from "@/components/ArtistCard";
import { EmptyState } from "@/components/EmptyState";
import { ProjectRequestForm } from "@/components/ProjectRequestForm";
import { RequestList } from "@/components/RequestList";
import { getSessionUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getTestArtists, getTestBusinessProfile, getTestBusinessRequests } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";
import BusinessProfile from "@/models/BusinessProfile";
import ProjectRequest from "@/models/ProjectRequest";
import type { ArtistProfile as ArtistProfileType, BusinessProfile as BusinessProfileType, ProjectRequest as ProjectRequestType } from "@/types/entities";

void ArtistProfile;

export const dynamic = "force-dynamic";

export default async function BusinessDashboardPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "business") redirect(`/dashboard/${user.role}`);

  const params = await searchParams;
  const testMode = isTestDataEnabled();
  let profile: BusinessProfileType | null;
  let requests: ProjectRequestType[];
  let artists: ArtistProfileType[];

  if (testMode) {
    profile = getTestBusinessProfile(user.id) as BusinessProfileType | null;
    requests = getTestBusinessRequests(user.id);
    artists = getTestArtists(params);
  } else {
    await connectToDatabase();
    profile = JSON.parse(JSON.stringify(await BusinessProfile.findOne({ userId: user.id }).lean())) as BusinessProfileType | null;
    requests = profile
      ? (JSON.parse(
        JSON.stringify(
          await ProjectRequest.find({ businessId: profile._id }).populate("artistId").sort({ createdAt: -1 }).lean()
        )
      ) as ProjectRequestType[])
      : [];

    const artistFilters: Record<string, unknown> = {};
    if (params.q) artistFilters.$text = { $search: params.q };
    if (params.style) artistFilters.styles = new RegExp(params.style, "i");
    if (params.location) artistFilters.location = new RegExp(params.location, "i");
    if (params.maxBudget) artistFilters.startingPrice = { $lte: Number(params.maxBudget) };
    artists = JSON.parse(
      JSON.stringify(await ArtistProfile.find(artistFilters).sort({ updatedAt: -1 }).lean())
    ) as ArtistProfileType[];
  }

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight">Business dashboard</h1>
        <p className="mt-2 text-stone-700">Find artists, post project opportunities, and track your requests.</p>
      </section>
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <h2 className="mb-6 text-2xl font-semibold">Business profile</h2>
        <BusinessProfileForm profile={profile} />
      </section>
      <section id="find-artists">
        <div>
          <h2 className="text-2xl font-semibold">Find an artist</h2>
          <p className="mt-1 text-stone-700">Search by name, specialty, location, or budget.</p>
        </div>
        <form className="mt-4 grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-soft md:grid-cols-4">
          <input name="q" aria-label="Search artists" placeholder="Name or keyword" defaultValue={params.q} />
          <input name="style" aria-label="Art style" placeholder="Style" defaultValue={params.style} />
          <input name="location" aria-label="Artist location" placeholder="Location" defaultValue={params.location} />
          <input name="maxBudget" aria-label="Maximum starting price" placeholder="Max starting price" type="number" defaultValue={params.maxBudget} />
          <button className="rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white md:col-span-4" type="submit">
            Search artists
          </button>
        </form>
        <div className="mt-6">
          {artists.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {artists.map((artist) => <ArtistCard artist={artist} key={artist._id} />)}
            </div>
          ) : (
            <EmptyState title="No artists found" body="Try removing a filter or searching with a broader term." />
          )}
        </div>
      </section>
      <section id="post-job" className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold">Post a job</h2>
        <p className="mb-6 mt-1 text-stone-700">Choose an artist and share the project scope, budget, and timeline.</p>
        {profile ? (
          artists.length ? (
            <ProjectRequestForm artists={artists} demoMode={testMode} />
          ) : (
            <EmptyState title="Choose an artist first" body="Clear your search filters to see artists available for a project." />
          )
        ) : (
          <EmptyState title="Complete your business profile" body="Save your business details above before posting a job." />
        )}
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Sent requests</h2>
        <RequestList requests={requests} mode="business" />
      </section>
    </main>
  );
}
