import { redirect } from "next/navigation";
import { BusinessProfileForm } from "@/components/BusinessProfileForm";
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

export default async function BusinessDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "business") redirect("/dashboard/artist");

  if (isTestDataEnabled()) {
    const profile = getTestBusinessProfile(user.id) as BusinessProfileType;
    const requests = getTestBusinessRequests(user.id);

    return (
      <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <h1 className="text-4xl font-semibold tracking-tight">Business dashboard</h1>
          <p className="mt-2 text-stone-700">Edit your business details and track project requests sent to artists.</p>
        </section>
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <h2 className="mb-6 text-2xl font-semibold">Business profile</h2>
          <BusinessProfileForm profile={profile} />
        </section>
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Sent requests</h2>
          <RequestList requests={requests} mode="business" />
        </section>
      </main>
    );
  }

  await connectToDatabase();
  const profile = JSON.parse(JSON.stringify(await BusinessProfile.findOne({ userId: user.id }).lean())) as BusinessProfileType;
  const requests = profile
    ? (JSON.parse(
        JSON.stringify(
          await ProjectRequest.find({ businessId: profile._id }).populate("artistId").sort({ createdAt: -1 }).lean()
        )
      ) as ProjectRequestType[])
    : [];

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight">Business dashboard</h1>
        <p className="mt-2 text-stone-700">Edit your business details and track project requests sent to artists.</p>
      </section>
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <h2 className="mb-6 text-2xl font-semibold">Business profile</h2>
        <BusinessProfileForm profile={profile} />
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Sent requests</h2>
        <RequestList requests={requests} mode="business" />
      </section>
    </main>
  );
}
