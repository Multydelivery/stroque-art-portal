import Link from "next/link";

const baseClasses = "rounded-lg px-3 py-2 text-sm font-semibold transition";

function tabClasses(active: boolean) {
  return active
    ? `${baseClasses} bg-ink text-white focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-[#121214]`
    : `${baseClasses} border border-stone-300 bg-white text-stone-800 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/20 dark:bg-[#1b1b21] dark:text-stone-100 dark:hover:bg-[#25252d] dark:focus-visible:ring-offset-[#121214]`;
}

export function BusinessDashboardNavTabs({
  activeTab
}: {
  activeTab: "business-profile" | "posted-projects" | "sent-requests";
}) {
  return (
    <nav aria-label="Business dashboard tabs">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link className={tabClasses(false)} href="/dashboard/business/project">
            Create project
          </Link>
        </li>
        <li>
          <Link
            aria-current={activeTab === "business-profile" ? "page" : undefined}
            className={tabClasses(activeTab === "business-profile")}
            href="/dashboard/business?tab=business-profile"
          >
            Business profile
          </Link>
        </li>
        <li>
          <Link
            aria-current={activeTab === "posted-projects" ? "page" : undefined}
            className={tabClasses(activeTab === "posted-projects")}
            href="/dashboard/business?tab=posted-projects"
          >
            Posted projects
          </Link>
        </li>
        <li>
          <Link
            aria-current={activeTab === "sent-requests" ? "page" : undefined}
            className={tabClasses(activeTab === "sent-requests")}
            href="/dashboard/business?tab=sent-requests"
          >
            Sent requests
          </Link>
        </li>
      </ul>
    </nav>
  );
}