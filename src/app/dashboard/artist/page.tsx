import { redirect } from "next/navigation";
import { ArtistDashboardNavTabs } from "@/components/ArtistDashboardNavTabs";
import { ArtistProfileForm } from "@/components/ArtistProfileForm";
import { EmptyState } from "@/components/EmptyState";
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

export default async function ArtistDashboardPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "artist") redirect(`/dashboard/${user.role}`);
  const params = await searchParams;
  const activeTab =
    params.tab === "requests"
      ? "requests"
      : params.tab === "communication"
        ? "communication"
        : "profile";

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
    <main className="mx-auto max-w-7xl space-y-8 bg-white px-4 py-10 text-stone-900 sm:px-6 lg:px-8 dark:bg-transparent dark:text-white">
      <section>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-clay">Artist dashboard</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 dark:text-white">Artist dashboard</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-stone-700 dark:text-stone-200">
          Use tabs to manage your profile, respond to businesses, and improve audience communication.
        </p>
        <div className="mt-5">
          <ArtistDashboardNavTabs activeTab={activeTab} />
        </div>
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

      {activeTab === "profile" ? (
        <section className="rounded-2xl bg-white p-6 dark:bg-transparent" id="artist-profile">
          <h2 className="mb-6 text-2xl font-semibold text-stone-950 dark:text-white">Profile</h2>
          <p className="mb-6 text-sm text-stone-700 dark:text-stone-200">This is what businesses and your broader audience use to evaluate fit and quality.</p>
          <ArtistProfileForm profile={profileForForm} />
        </section>
      ) : null}

      {activeTab === "requests" ? (
        <section id="incoming-requests">
          <h2 className="mb-2 text-2xl font-semibold text-stone-950 dark:text-white">Incoming requests</h2>
          <p className="mb-4 text-sm text-stone-700 dark:text-stone-200">Respond quickly and keep statuses updated so businesses can move projects forward.</p>
          <RequestList requests={requests} mode="artist" />
        </section>
      ) : null}

      {activeTab === "communication" ? (
        <section className="rounded-2xl bg-white p-6 dark:bg-transparent" id="communication-guide">
          <h2 className="text-2xl font-semibold text-stone-950 dark:text-white">Communication guide</h2>
          <p className="mt-2 text-sm text-stone-700 dark:text-stone-200">Use these templates to communicate clearly with businesses and your audience.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl bg-stone-50 p-4 dark:bg-white/5">
              <h3 className="text-lg font-semibold text-stone-900 dark:text-white">Accept message template</h3>
              <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-stone-200">
                Thanks for the request. I can take this project in your timeline. I will send a concept direction and next steps within 2 business days.
              </p>
            </article>
            <article className="rounded-2xl bg-stone-50 p-4 dark:bg-white/5">
              <h3 className="text-lg font-semibold text-stone-900 dark:text-white">Decline message template</h3>
              <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-stone-200">
                Thanks for reaching out. I am not available for this timeline, but I appreciate the opportunity and wish you success on the project.
              </p>
            </article>
            <article className="rounded-2xl bg-stone-50 p-4 md:col-span-2 dark:bg-white/5">
              <h3 className="text-lg font-semibold text-stone-900 dark:text-white">Audience-facing update</h3>
              <p className="mt-2 text-sm leading-6 text-stone-700 dark:text-stone-200">
                Working on a new commissioned piece focused on {profileForForm.styles[0] || "custom art"}. Sharing process snapshots soon.
              </p>
            </article>
          </div>

          {!requests.length ? (
            <div className="mt-6">
              <EmptyState
                title="No requests yet"
                body="Complete your profile and portfolio to increase visibility and get matched with more business projects."
              />
            </div>
          ) : null}
        </section>
      ) : null}
    </main>
  );
}
