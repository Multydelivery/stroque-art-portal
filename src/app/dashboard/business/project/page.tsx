import { redirect } from "next/navigation";
import { BusinessDashboardTabs } from "@/components/BusinessDashboardTabs";
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
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <section>
        <h1 className="text-4xl font-semibold tracking-tight">Create project</h1>
        <p className="mt-2 text-stone-700">Step 1 of 2: add project details before searching for artists.</p>
        <div className="mt-5">
          <BusinessDashboardTabs active="project" />
        </div>
      </section>

      {profile ? (
        <section className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-semibold">Project details</h2>
          <p className="mt-1 text-stone-700">Provide pay range, art type, timeline, and due date to continue.</p>
          <form action="/dashboard/business/project/artists" className="mt-6 space-y-5" method="get">
            <div className="field">
              <label htmlFor="spaceType">Project name or space type</label>
              <input defaultValue="Hotel lobby feature wall" id="spaceType" name="spaceType" required placeholder="Restaurant mural, lobby sculpture, office gallery wall" />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="field">
                <label htmlFor="budgetMin">Pay range minimum (USD)</label>
                <input defaultValue={2500} id="budgetMin" min={1} name="budgetMin" required type="number" />
              </div>
              <div className="field">
                <label htmlFor="budgetMax">Pay range maximum (USD)</label>
                <input defaultValue={5000} id="budgetMax" min={1} name="budgetMax" required type="number" />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="field">
                <label htmlFor="stylePreference">Type of art needed</label>
                <input
                  defaultValue="Warm botanical mural with contemporary details"
                  id="stylePreference"
                  name="stylePreference"
                  placeholder="Abstract mural, portrait series, mixed-media wall"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="timeline">Timeline</label>
                <select defaultValue="6-8 weeks" id="timeline" name="timeline" required>
                  <option value="">Select timeline</option>
                  <option value="ASAP">ASAP</option>
                  <option value="2-4 weeks">2-4 weeks</option>
                  <option value="4-6 weeks">4-6 weeks</option>
                  <option value="6-8 weeks">6-8 weeks</option>
                  <option value="2-3 months">2-3 months</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="dueDate">Project due date</label>
              <input id="dueDate" name="dueDate" required type="date" />
            </div>

            <div className="field">
              <label htmlFor="description">Project details</label>
              <textarea
                defaultValue="This is a hospitality lobby focal piece designed to increase visual impact and photo moments. Installation support is needed."
                id="description"
                name="description"
                placeholder="Describe goals, audience, constraints, installation requirements, and approvals."
                required
                rows={6}
              />
            </div>

            <button className="rounded-lg bg-ink px-5 py-3 text-sm font-semibold text-white" type="submit">
              Continue to artist search
            </button>
          </form>
        </section>
      ) : (
        <EmptyState
          title="Complete your business profile"
          body="Save your business details on the dashboard before creating a project."
        />
      )}
    </main>
  );
}