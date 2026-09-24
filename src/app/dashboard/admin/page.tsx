import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import { currency } from "@/lib/format";
import { getTestAdminDashboard } from "@/lib/test-data";
import { isTestDataEnabled } from "@/lib/test-mode";
import ArtistProfile from "@/models/ArtistProfile";
import BusinessProfile from "@/models/BusinessProfile";
import ProjectRequest from "@/models/ProjectRequest";
import User from "@/models/User";

export const dynamic = "force-dynamic";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "artist" | "business" | "admin";
  createdAt?: string;
};

type AdminRequest = {
  _id: string;
  spaceType: string;
  budget: number;
  status: "pending" | "accepted" | "declined" | "completed";
  createdAt: string;
  artistId?: { displayName?: string };
  businessId?: { businessName?: string };
};

function StatCard({ label, value, note }: { label: string; value: string | number; note: string }) {
  return (
    <article className="rounded-2xl bg-white p-5 text-stone-900 transition-colors duration-200 hover:bg-stone-50 dark:bg-transparent dark:text-white dark:hover:bg-white/5">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 dark:text-stone-200">{label}</p>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 dark:text-white">{value}</p>
      <p className="mt-2 text-xs leading-5 text-stone-700 dark:text-stone-200">{note}</p>
    </article>
  );
}

function formatDate(value?: string) {
  if (!value) return "Demo account";
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default async function AdminDashboardPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login");
  if (session.role !== "admin") redirect(`/dashboard/${session.role}`);

  let users: AdminUser[];
  let requests: AdminRequest[];
  let artistCount: number;
  let businessCount: number;

  if (isTestDataEnabled()) {
    const data = getTestAdminDashboard();
    users = data.users;
    requests = data.requests as AdminRequest[];
    artistCount = data.artists.length;
    businessCount = data.businesses.length;
  } else {
    await connectToDatabase();
    const [userRows, requestRows, artists, businesses] = await Promise.all([
      User.find().select("_id name email role createdAt").sort({ createdAt: -1 }).lean(),
      ProjectRequest.find().populate("artistId", "displayName").populate("businessId", "businessName").sort({ createdAt: -1 }).lean(),
      ArtistProfile.countDocuments(),
      BusinessProfile.countDocuments()
    ]);

    users = JSON.parse(JSON.stringify(userRows)).map((user: { _id: string; name: string; email: string; role: AdminUser["role"]; createdAt?: string }) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }));
    requests = JSON.parse(JSON.stringify(requestRows));
    artistCount = artists;
    businessCount = businesses;
  }

  const activeRequests = requests.filter((request) => request.status === "pending" || request.status === "accepted").length;
  const totalBudget = requests.reduce((sum, request) => sum + request.budget, 0);
  const statuses = ["pending", "accepted", "completed", "declined"] as const;

  return (
    <main className="mx-auto max-w-7xl space-y-8 bg-white px-4 py-10 text-stone-900 sm:px-6 lg:px-8 dark:bg-transparent dark:text-white">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-clay">Administration</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-stone-950 dark:text-white sm:text-5xl">Platform dashboard</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-stone-700 dark:text-stone-200">
            Monitor members, profiles, and commission activity across Stroque.
          </p>
        </div>

        <div className="inline-flex items-center rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-800 dark:bg-white/5 dark:text-stone-100">
          Signed in as {session.name}
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={users.length} note={`${users.filter((user) => user.role === "admin").length} administrator account`} />
        <StatCard label="Artist profiles" value={artistCount} note="Artists available on the platform" />
        <StatCard label="Business profiles" value={businessCount} note="Organizations commissioning art" />
        <StatCard label="Project requests" value={requests.length} note={`${activeRequests} currently active`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <div className="overflow-hidden rounded-2xl bg-white dark:bg-transparent">
          <div className="px-6 py-5">
            <h2 className="text-xl font-semibold text-stone-950 dark:text-white">Recent users</h2>
            <p className="mt-1 text-sm text-stone-700 dark:text-stone-200">The latest accounts across every role.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-[11px] uppercase tracking-[0.16em] text-stone-700 dark:bg-white/5 dark:text-stone-200">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 8).map((user) => (
                  <tr key={user.id} className="border-t border-stone-200 transition-colors hover:bg-stone-50 dark:border-white/10 dark:hover:bg-white/5">
                    <td className="px-6 py-4">
                      <p className="font-medium text-stone-900 dark:text-white">{user.name}</p>
                      <p className="text-stone-700 dark:text-stone-200">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize text-stone-700 dark:bg-white/5 dark:text-stone-100">
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-stone-700 dark:text-stone-200">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 dark:bg-transparent">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-clay">Request health</p>
          <h2 className="mt-3 text-2xl font-semibold text-stone-950 dark:text-white">Workflow overview</h2>
          <div className="mt-6 space-y-5">
            {statuses.map((status) => {
              const count = requests.filter((request) => request.status === status).length;
              const width = requests.length ? Math.max((count / requests.length) * 100, count ? 8 : 0) : 0;

              return (
                <div key={status}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="capitalize text-stone-700 dark:text-stone-200">{status}</span>
                    <span className="font-semibold text-stone-900 dark:text-white">{count}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-stone-100 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#8b5cf6_0%,#ec4899_100%)]"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 border-t border-stone-200 pt-5 dark:border-white/10">
            <p className="text-sm text-stone-700 dark:text-stone-200">Combined requested budget</p>
            <p className="mt-2 text-2xl font-semibold text-stone-950 dark:text-white">{currency(totalBudget)}</p>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl bg-white dark:bg-transparent">
        <div className="px-6 py-5">
          <h2 className="text-xl font-semibold text-stone-950 dark:text-white">Recent project activity</h2>
          <p className="mt-1 text-sm text-stone-700 dark:text-stone-200">Latest commission requests and their current status.</p>
        </div>

        {requests.length ? (
          <div>
            {requests.slice(0, 6).map((request) => (
              <article className="grid gap-3 border-t border-stone-200 px-6 py-5 sm:grid-cols-[1fr_auto] sm:items-center dark:border-white/10" key={request._id}>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-stone-900 dark:text-white">{request.spaceType}</h3>
                    <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-medium capitalize text-stone-700 dark:bg-white/5 dark:text-stone-100">
                      {request.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-stone-700 dark:text-stone-200">
                    {request.businessId?.businessName ?? "Business"} → {request.artistId?.displayName ?? "Artist"}
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="font-semibold text-stone-900 dark:text-white">{currency(request.budget)}</p>
                  <p className="text-xs text-stone-700 dark:text-stone-200">{formatDate(request.createdAt)}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="px-6 py-10 text-center text-stone-700 dark:text-stone-200">No project requests yet.</p>
        )}
      </section>
    </main>
  );
}
