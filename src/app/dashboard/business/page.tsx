import { redirect } from "next/navigation";
import Link from "next/link";
import { BusinessProfileForm } from "@/components/BusinessProfileForm";
import { BusinessDashboardTabs } from "@/components/BusinessDashboardTabs";
import { EmptyState } from "@/components/EmptyState";
import { RequestList } from "@/components/RequestList";
import { getSessionUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getTestBusinessProfile, getTestBusinessRequests } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";
import BusinessProfile from "@/models/BusinessProfile";
import ProjectRequest from "@/models/ProjectRequest";
import type { BusinessProfile as BusinessProfileType, ProjectRequest as ProjectRequestType } from "@/types/entities";

void ArtistProfile;

export const dynamic = "force-dynamic";

export default async function BusinessDashboardPage({
}: Record<string, never>) {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "business") redirect(`/dashboard/${user.role}`);

  const testMode = isTestDataEnabled();
  let profile: BusinessProfileType | null;
  let requests: ProjectRequestType[];

  if (testMode) {
    profile = getTestBusinessProfile(user.id) as BusinessProfileType | null;
    requests = getTestBusinessRequests(user.id);
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
  }

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight">Business dashboard</h1>
        <p className="mt-2 text-stone-700">Create project details first, then match with the right artist.</p>
        <div className="mt-5">
          <BusinessDashboardTabs active="dashboard" />
        </div>
      </section>
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <h2 className="mb-6 text-2xl font-semibold">Business profile</h2>
        <BusinessProfileForm profile={profile} />
      </section>
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold">Start a new project</h2>
        <p className="mb-6 mt-1 text-stone-700">Step 1: define pay range, art type, timeline, and due date before searching artists.</p>
        {profile ? (
          <Link className="inline-flex rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white" href="/dashboard/business/project">
            Create project details
          </Link>
        ) : (
          <EmptyState title="Complete your business profile" body="Save your business details above before creating a project." />
        )}
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Sent requests</h2>
        <RequestList requests={requests} mode="business" />
      </section>
    </main>
  );
}
