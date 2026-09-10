import Link from "next/link";

const baseClasses = "rounded-lg px-3 py-2 text-sm font-semibold transition";

function tabClasses(active: boolean, disabled = false) {
  if (disabled) {
    return `${baseClasses} cursor-not-allowed border border-stone-200 bg-stone-100 text-stone-500 dark:border-white/20 dark:bg-[#262630] dark:text-stone-300`;
  }

  return active
    ? `${baseClasses} bg-ink text-white focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-[#121214]`
    : `${baseClasses} border border-stone-300 bg-white text-stone-800 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/20 dark:bg-[#1b1b21] dark:text-stone-100 dark:hover:bg-[#25252d] dark:focus-visible:ring-offset-[#121214]`;
}

export function BusinessDashboardTabs({
  active
}: {
  active: "dashboard" | "project";
}) {
  const projectCurrent = active === "project" ? "page" : undefined;
  const dashboardCurrent = active === "dashboard" ? "page" : undefined;

  return (
    <nav aria-label="Business workflow">
      <ol className="flex flex-wrap gap-2">
        <li>
          <Link aria-current={projectCurrent} className={tabClasses(active === "project")} href="/dashboard/business/project">
            1. Create project
          </Link>
        </li>
        <li>
          <Link aria-current={dashboardCurrent} className={tabClasses(active === "dashboard")} href="/dashboard/business">
            2. Dashboard
          </Link>
        </li>
      </ol>
    </nav>
  );
}