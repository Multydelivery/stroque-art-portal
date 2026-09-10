import { redirect } from "next/navigation";
import { BusinessSidePanel } from "@/components/BusinessSidePanel";
import { BusinessProjectDetailsForm } from "@/components/BusinessProjectDetailsForm";
import { EmptyState } from "@/components/EmptyState";
import { getSessionUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { getTestBusinessProfile } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import BusinessProfile from "@/models/BusinessProfile";

export const dynamic = "force-dynamic";

export default async function BusinessProjectDetailsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "business") redirect(`/dashboard/${user.role}`);

  const testMode = isTestDataEnabled();
  const profile = testMode
    ? getTestBusinessProfile(user.id)
    : await connectToDatabase().then(() => BusinessProfile.findOne({ userId: user.id }).lean());

  return (
    <main className="mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight text-stone-100">Create project</h1>
        <p className="mt-2 text-stone-200">Add project details first, then view matched artists for that project.</p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
        <BusinessSidePanel active="create-project" profileName={user.name} profileImageUrl={profile?.logoUrl} />

        {profile ? (
          <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft dark:border-white/20 dark:bg-[#16161c]/95">
            <h2 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">Project details</h2>
            <p className="mt-1 text-stone-700 dark:text-stone-200">Provide pay range, art type, timeline, and due date to continue.</p>
            <BusinessProjectDetailsForm />
          </section>
        ) : (
          <EmptyState
            title="Complete your business profile"
            body="Save your business details on the dashboard before creating a project."
          />
        )}
      </section>
    </main>
  );
}