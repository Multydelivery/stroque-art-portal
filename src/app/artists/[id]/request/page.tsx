import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ProjectRequestForm } from "@/components/ProjectRequestForm";
import { getSessionUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getTestArtist } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";
import type { ArtistProfile as ArtistProfileType } from "@/types/entities";

export const dynamic = "force-dynamic";

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const demoMode = isTestDataEnabled();
  const user = await getSessionUser();
  if (!user && !demoMode) redirect("/auth/login");
  if (user && user.role !== "business") redirect("/artists");

  const { id } = await params;
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
          <ProjectRequestForm artistId={artist._id} demoMode={demoMode} stayOnSuccess={demoMode && !user} />
        </div>
      </div>
    </main>
  );
}
