import Link from "next/link";

const baseClasses = "rounded-lg px-3 py-2 text-sm font-semibold transition";

function tabClasses(active: boolean) {
  return active
    ? `${baseClasses} bg-stone-900 text-white focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:bg-stone-900 dark:text-white dark:focus-visible:ring-offset-[#121214]`
    : `${baseClasses} bg-stone-100 text-stone-700 hover:bg-stone-200 focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:bg-white/5 dark:text-stone-100 dark:hover:bg-white/10 dark:focus-visible:ring-offset-[#121214]`;
}

export function ArtistDashboardNavTabs({
  activeTab
}: {
  activeTab: "profile" | "requests" | "communication";
}) {
  return (
    <nav aria-label="Artist dashboard tabs">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            aria-current={activeTab === "profile" ? "page" : undefined}
            className={tabClasses(activeTab === "profile")}
            href="/dashboard/artist?tab=profile"
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            aria-current={activeTab === "requests" ? "page" : undefined}
            className={tabClasses(activeTab === "requests")}
            href="/dashboard/artist?tab=requests"
          >
            Incoming requests
          </Link>
        </li>
        <li>
          <Link
            aria-current={activeTab === "communication" ? "page" : undefined}
            className={tabClasses(activeTab === "communication")}
            href="/dashboard/artist?tab=communication"
          >
            Communication guide
          </Link>
        </li>
      </ul>
    </nav>
  );
}