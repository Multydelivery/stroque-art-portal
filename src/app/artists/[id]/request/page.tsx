import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProjectRequestForm } from "@/components/ProjectRequestForm";
import { getSessionUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getTestArtist, getTestProjectById } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";
import Project from "@/models/Project";
import type { ArtistProfile as ArtistProfileType, Project as ProjectType } from "@/types/entities";

export const dynamic = "force-dynamic";

type RequestPageSearchParams = {
  projectId?: string;
  spaceType?: string;
  budgetMin?: string;
  budgetMax?: string;
  timeline?: string;
  dueDate?: string;
  stylePreference?: string;
  description?: string;
};

export default async function RequestPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<RequestPageSearchParams>;
}) {
  const demoMode = isTestDataEnabled();
  const user = await getSessionUser();
  if (!user && !demoMode) redirect("/auth/login");
  if (user && user.role !== "business") redirect("/artists");

  const { id } = await params;
  const query = await searchParams;

  let selectedProject: ProjectType | null = null;
  if (query.projectId) {
    if (demoMode) {
      selectedProject = getTestProjectById(query.projectId) as ProjectType | null;
    } else {
      await connectToDatabase();
      selectedProject = JSON.parse(JSON.stringify(await Project.findById(query.projectId).lean())) as ProjectType | null;
    }
  }

  const projectId = query.projectId ?? selectedProject?._id;

  const minBudget = Number(query.budgetMin ?? 0);
  const maxBudget = Number(query.budgetMax ?? 0);
  const selectedProjectBudget =
    selectedProject && selectedProject.budgetMin > 0 && selectedProject.budgetMax >= selectedProject.budgetMin
      ? Math.round((selectedProject.budgetMin + selectedProject.budgetMax) / 2)
      : undefined;
  const midpointBudget = minBudget > 0 && maxBudget >= minBudget ? Math.round((minBudget + maxBudget) / 2) : selectedProjectBudget;
  const descriptionWithDueDate =
    query.description && query.dueDate
      ? `${query.description.trim()}\n\nRequested due date: ${query.dueDate}`
      : selectedProject
        ? `${selectedProject.description.trim()}\n\nRequested due date: ${selectedProject.dueDate}`
        : query.description;

  const artist = demoMode
    ? getTestArtist(id)
    : (JSON.parse(JSON.stringify(await connectToDatabase().then(() => ArtistProfile.findById(id).lean()))) as ArtistProfileType | null);
  if (!artist) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link className="text-sm font-semibold text-stone-600 hover:text-ink" href={`/artists/${artist._id}`}>
        Back to {artist.displayName}
      </Link>
      <div className="mt-6 rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
        <h1 className="text-3xl font-semibold">Request a project with {artist.displayName}</h1>
        <p className="mt-2 text-sm text-stone-600">Give the artist enough context to decide fit, timing, and next steps.</p>
        <div className="mt-8">
          <ProjectRequestForm
            projectId={projectId}
            artistId={artist._id}
            demoMode={demoMode}
            stayOnSuccess={demoMode && !user}
            initialValues={{
              projectId,
              spaceType: query.spaceType ?? selectedProject?.spaceType,
              budget: midpointBudget,
              timeline: query.timeline ?? selectedProject?.timeline,
              stylePreference: query.stylePreference ?? selectedProject?.stylePreference,
              description: descriptionWithDueDate
            }}
          />
        </div>
      </div>
    </main>
  );
}
