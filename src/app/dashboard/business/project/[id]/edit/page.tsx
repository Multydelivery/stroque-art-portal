import { notFound, redirect } from "next/navigation";
import { BusinessDashboardTabs } from "@/components/BusinessDashboardTabs";
import { BusinessProjectDetailsForm } from "@/components/BusinessProjectDetailsForm";
import { getSessionUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getTestBusinessProjectById } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import BusinessProfile from "@/models/BusinessProfile";
import Project from "@/models/Project";
import type { Project as ProjectType } from "@/types/entities";

export const dynamic = "force-dynamic";

export default async function EditBusinessProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "business") redirect(`/dashboard/${user.role}`);

  const { id } = await params;
  let project: ProjectType | null = null;

  if (isTestDataEnabled()) {
    project = getTestBusinessProjectById(user.id, id) as ProjectType | null;
  } else {
    await connectToDatabase();
    const business = await BusinessProfile.findOne({ userId: user.id });
    project = JSON.parse(JSON.stringify(await Project.findOne({ _id: id, businessId: business?._id }).lean())) as ProjectType | null;
  }

  if (!project) notFound();

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight">Edit project</h1>
        <p className="mt-2 text-stone-700">Update details before finding artists for this project.</p>
        <div className="mt-5">
          <BusinessDashboardTabs active="project" />
        </div>
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-semibold">Project details</h2>
        <p className="mt-1 text-stone-700">Save your edits, then continue to artist search.</p>
        <BusinessProjectDetailsForm mode="edit" project={project} />
      </section>
    </main>
  );
}