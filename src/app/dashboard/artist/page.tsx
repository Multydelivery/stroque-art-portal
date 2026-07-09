import { redirect } from "next/navigation";
import { ArtistProfileForm } from "@/components/ArtistProfileForm";
import { RequestList } from "@/components/RequestList";
import { getSessionUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getTestArtistProfile, getTestArtistRequests } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";
import BusinessProfile from "@/models/BusinessProfile";
import ProjectRequest from "@/models/ProjectRequest";
import type { ArtistProfile as ArtistProfileType, ProjectRequest as ProjectRequestType } from "@/types/entities";

void BusinessProfile;

export const dynamic = "force-dynamic";

export default async function ArtistDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "artist") redirect("/dashboard/business");

  if (isTestDataEnabled()) {
    const profile = getTestArtistProfile(user.id) as ArtistProfileType;
    const requests = getTestArtistRequests(user.id);

    return (
      <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <h1 className="text-4xl font-semibold tracking-tight">Artist dashboard</h1>
          <p className="mt-2 text-stone-700">Maintain your profile, upload portfolio images, and manage project requests.</p>
        </section>
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <h2 className="mb-6 text-2xl font-semibold">Profile</h2>
          <ArtistProfileForm profile={profile} />
        </section>
        <section>
          <h2 className="mb-4 text-2xl font-semibold">Incoming requests</h2>
          <RequestList requests={requests} mode="artist" />
        </section>
      </main>
    );
  }

  await connectToDatabase();
  const profile = JSON.parse(JSON.stringify(await ArtistProfile.findOne({ userId: user.id }).lean())) as ArtistProfileType;
  const requests = profile
    ? (JSON.parse(
        JSON.stringify(
          await ProjectRequest.find({ artistId: profile._id }).populate("businessId").sort({ createdAt: -1 }).lean()
        )
      ) as ProjectRequestType[])
    : [];

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight">Artist dashboard</h1>
        <p className="mt-2 text-stone-700">Maintain your profile, upload portfolio images, and manage project requests.</p>
      </section>
      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <h2 className="mb-6 text-2xl font-semibold">Profile</h2>
        <ArtistProfileForm profile={profile} />
      </section>
      <section>
        <h2 className="mb-4 text-2xl font-semibold">Incoming requests</h2>
        <RequestList requests={requests} mode="artist" />
      </section>
    </main>
  );
}
