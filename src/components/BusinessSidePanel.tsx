import Image from "next/image";
import Link from "next/link";

type Option = {
  key: "create-project" | "posted-projects" | "business-profile" | "sent-requests";
  label: string;
  href: string;
};

const options: Option[] = [
  { key: "create-project", label: "Create project", href: "/dashboard/business/project" },
  { key: "posted-projects", label: "Posted projects", href: "/dashboard/business?tab=posted-projects" },
  { key: "business-profile", label: "Business profile", href: "/dashboard/business?tab=business-profile" },
  { key: "sent-requests", label: "Sent requests", href: "/dashboard/business?tab=sent-requests" }
];

function optionClasses(isActive: boolean, isCreateProject: boolean) {
  if (isCreateProject) {
    return isActive
      ? "block rounded-lg bg-violet-600 px-3 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-[#121214]"
      : "block rounded-lg bg-violet-50 px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-100 focus-visible:ring-2 focus-visible:ring-violet-300 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:bg-white/5 dark:text-violet-200 dark:hover:bg-white/10 dark:focus-visible:ring-offset-[#121214]";
  }

  return isActive
    ? "block rounded-lg bg-stone-900 px-3 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:bg-stone-900 dark:text-white dark:focus-visible:ring-offset-[#121214]"
    : "block rounded-lg bg-stone-100 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-200 focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:bg-white/5 dark:text-stone-100 dark:hover:bg-white/10 dark:focus-visible:ring-offset-[#121214]";
}

export function BusinessSidePanel({
  active,
  profileName,
  profileImageUrl
}: {
  active: "create-project" | "posted-projects" | "business-profile" | "sent-requests";
  profileName: string;
  profileImageUrl?: string;
}) {
  return (
    <aside aria-label="Business options" className="h-fit rounded-2xl bg-stone-50 p-4 dark:bg-[#121418] lg:sticky lg:top-6">
      <div className="mb-4 inline-flex w-full items-center gap-3 rounded-xl bg-white px-3 py-2 dark:bg-white/5">
        <span className="relative h-8 w-8 overflow-hidden rounded-full bg-stone-100 dark:bg-white/10">
          {profileImageUrl ? (
            <Image src={profileImageUrl} alt="Business profile logo" fill sizes="32px" className="object-contain p-1" priority />
          ) : (
            <>
              <Image
                src="/images/S_Logoforrdarkthem.png"
                alt="Stroque buyer logo"
                fill
                sizes="32px"
                className="hidden object-contain p-1 dark:block"
                priority
              />
              <Image
                src="/images/S_LogoTM.png"
                alt="Stroque buyer logo"
                fill
                sizes="32px"
                className="object-contain p-1 dark:hidden"
                priority
              />
            </>
          )}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300">Business user</p>
          <p className="truncate text-sm font-semibold text-stone-900 dark:text-white">{profileName}</p>
        </div>
      </div>

      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-stone-600 dark:text-stone-300">Business options</h2>
      <nav className="mt-3">
        <ul className="space-y-2">
          {options.map((option) => {
            const isActive = option.key === active;

            return (
              <li key={option.key}>
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={optionClasses(isActive, option.key === "create-project")}
                  href={option.href}
                >
                  {option.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}