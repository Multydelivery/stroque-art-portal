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
      ? "block rounded-lg bg-[#7c3aed] px-3 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-[#c4b5fd] focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-[#121214]"
      : "block rounded-lg border border-[#c4b5fd] bg-[#f5f3ff] px-3 py-2 text-sm font-semibold text-[#5b21b6] hover:bg-[#ede9fe] focus-visible:ring-2 focus-visible:ring-[#c4b5fd] focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-[#8b5cf6]/40 dark:bg-[#2b1f49] dark:text-[#ddd6fe] dark:hover:bg-[#37275d] dark:focus-visible:ring-offset-[#121214]";
  }

  return isActive
    ? "block rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:focus-visible:ring-offset-[#121214]"
    : "block rounded-lg border border-stone-300 bg-white px-3 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-100 focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-paper dark:border-white/20 dark:bg-[#1f1f26] dark:text-stone-100 dark:hover:bg-[#2b2b33] dark:focus-visible:ring-offset-[#121214]";
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
    <aside aria-label="Business options" className="h-fit rounded-xl border border-stone-200 bg-white p-4 shadow-soft dark:border-white/20 dark:bg-[#16161c]/95 lg:sticky lg:top-6">
      <div className="mb-4 inline-flex w-full items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 dark:border-white/20 dark:bg-[#1f1f26]">
        <span className="relative h-8 w-8 overflow-hidden rounded-full border border-stone-200 bg-white dark:border-white/20 dark:bg-[#262630]">
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
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-300">Business user</p>
          <p className="truncate text-sm font-semibold text-stone-900 dark:text-stone-100">{profileName}</p>
        </div>
      </div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500 dark:text-stone-300">Business options</h2>
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