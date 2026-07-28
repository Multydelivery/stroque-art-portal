import Link from "next/link";

const baseClasses = "rounded-lg px-3 py-2 text-sm font-semibold transition";

export function BusinessDashboardTabs({
  active
}: {
  active: "dashboard" | "project" | "artists";
}) {
  const dashboardClasses =
    active === "dashboard"
      ? `${baseClasses} bg-ink text-white`
      : `${baseClasses} border border-stone-300 bg-white text-stone-800 hover:bg-stone-100`;
  const projectClasses =
    active === "project"
      ? `${baseClasses} bg-ink text-white`
      : `${baseClasses} border border-stone-300 bg-white text-stone-800 hover:bg-stone-100`;
  const artistsClasses =
    active === "artists"
      ? `${baseClasses} bg-ink text-white`
      : `${baseClasses} border border-stone-300 bg-white text-stone-800 hover:bg-stone-100`;

  return (
    <nav aria-label="Business workflow" className="flex flex-wrap gap-2">
      <Link className={dashboardClasses} href="/dashboard/business">
        Dashboard
      </Link>
      <Link className={projectClasses} href="/dashboard/business/project">
        1. Project details
      </Link>
      <Link className={artistsClasses} href="/dashboard/business/project/artists">
        2. Find artist
      </Link>
    </nav>
  );
}