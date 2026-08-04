"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SessionUser } from "@/lib/auth";

type DockItem = {
  key: "messages" | "search" | "add" | "friends" | "profile";
  label: string;
  href: string;
};

function iconClasses(active: boolean) {
  return active ? "h-5 w-5 text-ink" : "h-5 w-5 text-stone-600";
}

function itemClasses(active: boolean) {
  return active
    ? "flex flex-col items-center gap-1 rounded-xl bg-stone-100 px-2 py-2 text-[11px] font-semibold text-ink"
    : "flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium text-stone-600";
}

function resolveItems(user: SessionUser | null): DockItem[] {
  const profileHref = user ? `/dashboard/${user.role}` : "/auth/login";
  const messagesHref = user?.role === "business" ? "/dashboard/business?tab=sent-requests" : profileHref;
  const addHref = user?.role === "business" ? "/dashboard/business/project" : user ? `/dashboard/${user.role}` : "/auth/signup";
  const friendsHref = "/artists";

  return [
    { key: "messages", label: "Messages", href: messagesHref },
    { key: "search", label: "Search", href: "/artists" },
    { key: "add", label: "Add post", href: addHref },
    { key: "friends", label: "Friends", href: friendsHref },
    { key: "profile", label: "Profile", href: profileHref }
  ];
}

function DockIcon({ icon, active }: { icon: DockItem["key"]; active: boolean }) {
  if (icon === "messages") {
    return (
      <svg aria-hidden="true" className={iconClasses(active)} fill="none" viewBox="0 0 24 24">
        <path d="M6.75 8.75h10.5M6.75 12h7.25M8 18l-3.5 2.5V7A2 2 0 0 1 6.5 5h11A2 2 0 0 1 19.5 7v10a2 2 0 0 1-2 2H8Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (icon === "search") {
    return (
      <svg aria-hidden="true" className={iconClasses(active)} fill="none" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.8" />
        <path d="m16 16 4.25 4.25" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (icon === "add") {
    return (
      <svg aria-hidden="true" className={iconClasses(active)} fill="none" viewBox="0 0 24 24">
        <rect x="4.5" y="4.5" width="15" height="15" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  if (icon === "friends") {
    return (
      <svg aria-hidden="true" className={iconClasses(active)} fill="none" viewBox="0 0 24 24">
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="16.5" cy="10.5" r="2.5" stroke="currentColor" strokeWidth="1.8" />
        <path d="M4.5 18c.6-2.2 2.5-3.5 4.5-3.5s3.9 1.3 4.5 3.5M13.5 18c.4-1.4 1.7-2.3 3.1-2.3 1.4 0 2.7.9 3.1 2.3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" className={iconClasses(active)} fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M5.5 19c.9-2.8 3.4-4.5 6.5-4.5s5.6 1.7 6.5 4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" />
    </svg>
  );
}

export function BottomDock({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const items = resolveItems(user);

  return (
    <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-2 pb-[calc(env(safe-area-inset-bottom)+0.35rem)] pt-2 backdrop-blur md:hidden dark:border-white/20 dark:bg-[#121214]/95">
      <ul className="mx-auto grid w-full max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <li key={item.key}>
              <Link aria-current={active ? "page" : undefined} className={itemClasses(active)} href={item.href}>
                <DockIcon icon={item.key} active={active} />
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
