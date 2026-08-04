"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { SessionUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/ThemeToggle";

function navLinkClasses(active: boolean) {
  return active
    ? "rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white"
    : "rounded-lg px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100";
}

export function SiteNavbar({ user }: { user: SessionUser | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const dashboardHref = user ? `/dashboard/${user.role}` : "/auth/login";
  const onArtists = pathname.startsWith("/artists");
  const onDashboard = pathname.startsWith("/dashboard");
  const onLogin = pathname.startsWith("/auth/login");
  const onSignup = pathname.startsWith("/auth/signup");

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200/80 bg-paper/90 backdrop-blur">
      <nav aria-label="Primary" className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white/90 px-4 py-3 shadow-soft">
          <Link className="group flex items-center gap-2" href="/">
            <span className="relative h-8 w-8 overflow-hidden rounded-lg">
              <Image src="/images/S_LogoTM.png" alt="Stroque logo" fill sizes="32px" className="object-contain" priority />
            </span>
            <span className="text-sm font-semibold tracking-tight text-stone-800 sm:text-base">Indy Art Portal</span>
            <span className="hidden rounded-full bg-moss/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-moss sm:inline-flex">
              by Stroque
            </span>
          </Link>

          <button
            aria-controls="mobile-nav-menu"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="rounded-lg border border-stone-300 p-2 text-stone-700 hover:bg-stone-100 md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            type="button"
          >
            {menuOpen ? (
              <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            ) : (
              <svg aria-hidden="true" className="h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
              </svg>
            )}
          </button>

          <div className="md:hidden">
            <ThemeToggle />
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Link aria-current={onArtists ? "page" : undefined} className={navLinkClasses(onArtists)} href="/artists">
              Artists
            </Link>
            {user ? (
              <>
                <Link aria-current={onDashboard ? "page" : undefined} className={navLinkClasses(onDashboard)} href={dashboardHref}>
                  {user.role === "admin" ? "Admin" : "Dashboard"}
                </Link>
                <form action="/api/auth/logout" method="post">
                  <button className="rounded-lg border border-stone-300 px-3 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-100" type="submit">
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link aria-current={onLogin ? "page" : undefined} className={navLinkClasses(onLogin)} href="/auth/login">
                  Log in
                </Link>
                <Link aria-current={onSignup ? "page" : undefined} className="rounded-lg bg-ink px-4 py-2 text-sm font-semibold text-white" href="/auth/signup">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>

        {menuOpen ? (
          <div className="mt-3 rounded-xl border border-stone-200 bg-white p-3 shadow-soft md:hidden" id="mobile-nav-menu">
            <div className="grid gap-2">
              <ThemeToggle compact />
              <Link className={navLinkClasses(onArtists)} href="/artists" onClick={() => setMenuOpen(false)}>
                Artists
              </Link>
              {user ? (
                <>
                  <Link className={navLinkClasses(onDashboard)} href={dashboardHref} onClick={() => setMenuOpen(false)}>
                    {user.role === "admin" ? "Admin" : "Dashboard"}
                  </Link>
                  <form action="/api/auth/logout" method="post">
                    <button className="w-full rounded-lg border border-stone-300 px-3 py-2 text-left text-sm font-semibold text-stone-700 hover:bg-stone-100" type="submit">
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link className={navLinkClasses(onLogin)} href="/auth/login" onClick={() => setMenuOpen(false)}>
                    Log in
                  </Link>
                  <Link className="rounded-lg bg-ink px-3 py-2 text-sm font-semibold text-white" href="/auth/signup" onClick={() => setMenuOpen(false)}>
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
