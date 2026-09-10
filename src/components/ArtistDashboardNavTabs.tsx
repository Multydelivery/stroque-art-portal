import Link from "next/link";

const baseClasses = "rounded-lg px-3 py-2 text-sm font-semibold transition";

function tabClasses(active: boolean) {
  return active
    ? `${baseClasses} bg-ink text-white focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-[#121214]`
    : `${baseClasses} border border-stone-300 bg-white text-stone-800 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/20 dark:bg-[#1b1b21] dark:text-stone-100 dark:hover:bg-[#25252d] dark:focus-visible:ring-offset-[#121214]`;
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