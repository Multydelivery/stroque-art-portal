import { redirect } from "next/navigation";
import { ArtistProfileForm } from "@/components/ArtistProfileForm";
import { GuidedStartPanel } from "@/components/GuidedStartPanel";
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

function isProfileReady(profile: ArtistProfileType | null) {
  if (!profile) return false;
  return Boolean(
    profile.displayName &&
      profile.bio &&
      profile.location &&
      profile.styles.length &&
      profile.services.length &&
      profile.portfolioImages.length
  );
}

function buildFirstAction(profile: ArtistProfileType | null, pendingCount: number) {
  if (!isProfileReady(profile)) {
    return {
      title: "Complete your artist profile",
      detail: "Add portfolio images, services, and styles so businesses can evaluate your fit quickly.",
      href: "#artist-profile"
    };
  }

  if (pendingCount > 0) {
    return {
      title: "Respond to pending requests",
      detail: "Update each pending request to accepted or declined so businesses can plan next steps.",
      href: "#incoming-requests"
    };
  }

  return {
    title: "Keep your profile fresh",
    detail: "Refresh your bio and portfolio often to increase visibility in artist search results.",
    href: "#artist-profile"
  };
}

export default async function ArtistDashboardPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "artist") redirect(`/dashboard/${user.role}`);

  let profile: ArtistProfileType | null = null;
  let requests: ProjectRequestType[] = [];

  if (isTestDataEnabled()) {
    profile = (getTestArtistProfile(user.id) as ArtistProfileType | null) ?? null;
    requests = getTestArtistRequests(user.id);
  } else {
    await connectToDatabase();
    profile = (JSON.parse(JSON.stringify(await ArtistProfile.findOne({ userId: user.id }).lean())) as ArtistProfileType | null) ?? null;
    requests = profile
      ? (JSON.parse(
          JSON.stringify(
            await ProjectRequest.find({ artistId: profile._id }).populate("projectId").populate("businessId").sort({ createdAt: -1 }).lean()
          )
        ) as ProjectRequestType[])
      : [];
  }

  const pendingCount = requests.filter((request) => request.status === "pending").length;
  const profileReady = isProfileReady(profile);
  const firstAction = buildFirstAction(profile, pendingCount);
  const profileForForm: ArtistProfileType = profile ?? {
    _id: "",
    displayName: "",
    bio: "",
    location: "",
    styles: [],
    services: [],
    startingPrice: 0,
    portfolioImages: []
  };

  return (
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight">Artist dashboard</h1>
        <p className="mt-2 text-stone-700">Maintain your profile, upload portfolio images, and manage project requests.</p>
      </section>

      <GuidedStartPanel
        title="Start Here"
        subtitle="Use this checklist to stay visible and close more opportunities."
        stats={[
          { label: "Pending requests", value: pendingCount },
          { label: "Total requests", value: requests.length },
          { label: "Profile readiness", value: profileReady ? "Ready" : "Needs updates" }
        ]}
        steps={[
          {
            title: firstAction.title,
            detail: firstAction.detail,
            href: firstAction.href,
            cta: "Open step",
            status: "next"
          },
          {
            title: "Review incoming requests",
            detail: "Set request statuses quickly so businesses know your availability.",
            href: "#incoming-requests",
            cta: "Go to requests",
            status: requests.length > 0 ? "done" : "later"
          },
          {
            title: "Upgrade portfolio quality",
            detail: "Add stronger visuals and service tags to improve match quality.",
            href: "#artist-profile",
            cta: "Edit profile",
            status: profileReady ? "done" : "later"
          }
        ]}
      />

      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft" id="artist-profile">
        <h2 className="mb-6 text-2xl font-semibold">Profile</h2>
        <ArtistProfileForm profile={profileForForm} />
      </section>
      <section id="incoming-requests">
        <h2 className="mb-4 text-2xl font-semibold">Incoming requests</h2>
        <RequestList requests={requests} mode="artist" />
      </section>
    </main>
  );
}
