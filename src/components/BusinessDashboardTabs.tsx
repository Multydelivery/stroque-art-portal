import Link from "next/link";

const baseClasses = "rounded-lg px-3 py-2 text-sm font-semibold transition";

export function BusinessDashboardTabs({
  active
}: {
  active: "dashboard" | "project" | "artists";
}) {
  const projectCurrent = active === "project" ? "page" : undefined;
  const artistsCurrent = active === "artists" ? "page" : undefined;
  const dashboardCurrent = active === "dashboard" ? "page" : undefined;

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
    <nav aria-label="Business workflow">
      <ol className="flex flex-wrap gap-2">
        <li>
          <Link aria-current={projectCurrent} className={projectClasses} href="/dashboard/business/project">
            1. Create project
          </Link>
        </li>
        <li>
          <Link aria-current={artistsCurrent} className={artistsClasses} href="/dashboard/business/project/artists">
            2. Find artist
          </Link>
        </li>
        <li>
          <Link aria-current={dashboardCurrent} className={dashboardClasses} href="/dashboard/business">
            3. Dashboard
          </Link>
        </li>
      </ol>
    </nav>
  );
}