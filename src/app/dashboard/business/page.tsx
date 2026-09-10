import { redirect } from "next/navigation";
import Link from "next/link";
import { BusinessProfileForm } from "@/components/BusinessProfileForm";
import { BusinessSidePanel } from "@/components/BusinessSidePanel";
import { EmptyState } from "@/components/EmptyState";
import { ProjectCardActions } from "@/components/ProjectCardActions";
import { RequestList } from "@/components/RequestList";
import { getSessionUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { currency } from "@/lib/format";
import { getTestBusinessProfile, getTestBusinessProjects, getTestBusinessRequests } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import BusinessProfile from "@/models/BusinessProfile";
import Project from "@/models/Project";
import ProjectRequest from "@/models/ProjectRequest";
import type { BusinessProfile as BusinessProfileType, Project as ProjectType, ProjectRequest as ProjectRequestType } from "@/types/entities";

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
  const activeTab =
    params.tab === "business-profile"
      ? "business-profile"
      : params.tab === "sent-requests"
        ? "sent-requests"
        : "posted-projects";

  const testMode = isTestDataEnabled();
  let profile: BusinessProfileType | null;
  let projects: ProjectType[] = [];
  let requests: ProjectRequestType[];

  if (testMode) {
    profile = getTestBusinessProfile(user.id) as BusinessProfileType | null;
    requests = getTestBusinessRequests(user.id);
    projects = getTestBusinessProjects(user.id) as ProjectType[];
  } else {
    await connectToDatabase();
    profile = JSON.parse(JSON.stringify(await BusinessProfile.findOne({ userId: user.id }).lean())) as BusinessProfileType | null;
    projects = profile
      ? JSON.parse(JSON.stringify(await Project.find({ businessId: profile._id }).sort({ createdAt: -1 }).lean()))
      : [];
    requests = profile
      ? (JSON.parse(
        JSON.stringify(
          await ProjectRequest.find({ businessId: profile._id }).populate("projectId").populate("artistId").sort({ createdAt: -1 }).lean()
        )
      ) as ProjectRequestType[])
      : [];
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section aria-labelledby="business-dashboard-title">
        <h1 className="text-4xl font-semibold tracking-tight text-stone-100" id="business-dashboard-title">Stroque for Business</h1>
        <p className="mt-2 text-stone-200">Use the side panel to manage your business profile, projects, and requests.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <BusinessSidePanel active={activeTab} profileName={user.name} profileImageUrl={profile?.logoUrl} />

        {activeTab === "business-profile" ? (
          <section aria-labelledby="business-profile-title" className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft dark:border-white/20 dark:bg-[#16161c]/95" id="business-profile">
            <h2 className="mb-6 text-2xl font-semibold text-stone-900 dark:text-stone-100" id="business-profile-title">Business profile</h2>
            <BusinessProfileForm profile={profile} />
          </section>
        ) : activeTab === "posted-projects" ? (
          <section aria-labelledby="posted-projects-title" className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft dark:border-white/20 dark:bg-[#16161c]/95">
          <div className="mb-4">
            <div>
              <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100" id="posted-projects-title">Posted projects</h2>
              <p className="mt-1 text-sm text-stone-700 dark:text-stone-200">Manage each project and continue to artist matching.</p>
            </div>
          </div>
          <div className="mb-6">
            <Link
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/20 dark:bg-[#1f1f26] dark:text-stone-100 dark:hover:bg-[#2b2b33] dark:focus-visible:ring-offset-[#121214]"
              href="/dashboard/business/project"
            >
              <span aria-hidden="true" className="text-base leading-none">+</span>
              <span>Create project</span>
            </Link>
          </div>
          {projects.length ? (
            <div className="space-y-4">
              {projects.map((project) => (
                <article aria-labelledby={`project-title-${project._id}`} key={project._id} className="rounded-xl border border-stone-200 bg-stone-50 p-5 dark:border-white/20 dark:bg-[#1f1f26]">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100" id={`project-title-${project._id}`}>{project.spaceType}</h3>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold capitalize text-stone-700 dark:bg-[#2c2c35] dark:text-stone-100">{project.status}</span>
                      </div>
                      <p className="mt-2 text-sm text-stone-700 dark:text-stone-200">{project.description}</p>
                      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-5">
                        <div>
                          <dt className="text-stone-500 dark:text-stone-300">Dimensions</dt>
                          <dd className="font-semibold text-stone-800 dark:text-stone-100">{project.dimensions}</dd>
                        </div>
                        <div>
                          <dt className="text-stone-500 dark:text-stone-300">Pay range</dt>
                          <dd className="font-semibold text-stone-800 dark:text-stone-100">{currency(project.budgetMin)} - {currency(project.budgetMax)}</dd>
                        </div>
                        <div>
                          <dt className="text-stone-500 dark:text-stone-300">Type of art</dt>
                          <dd className="font-semibold text-stone-800 dark:text-stone-100">{project.stylePreference}</dd>
                        </div>
                        <div>
                          <dt className="text-stone-500 dark:text-stone-300">Timeline</dt>
                          <dd className="font-semibold text-stone-800 dark:text-stone-100">{project.timeline}</dd>
                        </div>
                        <div>
                          <dt className="text-stone-500 dark:text-stone-300">Due date</dt>
                          <dd className="font-semibold text-stone-800 dark:text-stone-100">{project.dueDate}</dd>
                        </div>
                      </dl>
                    </div>
                    <div className="flex flex-col gap-2 lg:items-end">
                      <Link
                        className="inline-flex rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-[#121214]"
                        href={`/dashboard/business/project/artists?projectId=${project._id}`}
                      >
                        Search artists
                      </Link>
                      <Link
                        className="inline-flex rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/20 dark:bg-[#1f1f26] dark:text-stone-100 dark:hover:bg-[#2b2b33] dark:focus-visible:ring-offset-[#121214]"
                        href={`/dashboard/business/project/${project._id}/edit`}
                      >
                        Edit project
                      </Link>
                      <ProjectCardActions projectId={project._id} projectName={project.spaceType} status={project.status} />
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="No posted projects yet" body="Create your first project, then search for artists and send requests." />
          )}
          </section>
        ) : (
          <section aria-labelledby="sent-requests-title">
            <h2 className="mb-4 text-2xl font-semibold text-stone-100" id="sent-requests-title">Sent requests</h2>
            <RequestList requests={requests} mode="business" />
          </section>
        )}
      </section>
    </main>
  );
}
