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
    <article className="rounded-xl border border-stone-200 bg-white p-5 shadow-soft">
      <p className="text-sm font-medium text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-stone-500">{note}</p>
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
    <main className="mx-auto max-w-7xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">Administration</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Platform dashboard</h1>
          <p className="mt-2 text-stone-700">Monitor members, profiles, and commission activity across Stroque.</p>
        </div>
        <div className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white">Signed in as {session.name}</div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={users.length} note={`${users.filter((user) => user.role === "admin").length} administrator account`} />
        <StatCard label="Artist profiles" value={artistCount} note="Artists available on the platform" />
        <StatCard label="Business profiles" value={businessCount} note="Organizations commissioning art" />
        <StatCard label="Project requests" value={requests.length} note={`${activeRequests} currently active`} />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-soft">
          <div className="border-b border-stone-200 px-6 py-5">
            <h2 className="text-xl font-semibold">Recent users</h2>
            <p className="mt-1 text-sm text-stone-500">The latest accounts across every role.</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-stone-50 text-xs uppercase tracking-wider text-stone-500">
                <tr><th className="px-6 py-3">User</th><th className="px-6 py-3">Role</th><th className="px-6 py-3">Joined</th></tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {users.slice(0, 8).map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4"><p className="font-medium">{user.name}</p><p className="text-stone-500">{user.email}</p></td>
                    <td className="px-6 py-4"><span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize">{user.role}</span></td>
                    <td className="whitespace-nowrap px-6 py-4 text-stone-500">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-ink p-6 text-white shadow-soft">
          <h2 className="text-xl font-semibold">Request health</h2>
          <p className="mt-1 text-sm text-stone-400">Status distribution for all commissions.</p>
          <div className="mt-7 space-y-5">
            {statuses.map((status) => {
              const count = requests.filter((request) => request.status === status).length;
              const width = requests.length ? Math.max((count / requests.length) * 100, count ? 6 : 0) : 0;
              return <div key={status}><div className="mb-2 flex justify-between text-sm"><span className="capitalize text-stone-300">{status}</span><span className="font-semibold">{count}</span></div><div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-blush" style={{ width: `${width}%` }} /></div></div>;
            })}
          </div>
          <div className="mt-8 border-t border-white/10 pt-5"><p className="text-sm text-stone-400">Combined requested budget</p><p className="mt-1 text-2xl font-semibold">{currency(totalBudget)}</p></div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-soft">
        <div className="border-b border-stone-200 px-6 py-5"><h2 className="text-xl font-semibold">Recent project activity</h2><p className="mt-1 text-sm text-stone-500">Latest commission requests and their current status.</p></div>
        {requests.length ? <div className="divide-y divide-stone-100">{requests.slice(0, 6).map((request) => (
          <article className="grid gap-3 px-6 py-5 sm:grid-cols-[1fr_auto] sm:items-center" key={request._id}>
            <div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{request.spaceType}</h3><span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium capitalize">{request.status}</span></div><p className="mt-1 text-sm text-stone-500">{request.businessId?.businessName ?? "Business"} → {request.artistId?.displayName ?? "Artist"}</p></div>
            <div className="sm:text-right"><p className="font-semibold">{currency(request.budget)}</p><p className="text-xs text-stone-500">{formatDate(request.createdAt)}</p></div>
          </article>
        ))}</div> : <p className="px-6 py-10 text-center text-stone-500">No project requests yet.</p>}
      </section>
    </main>
  );
}
