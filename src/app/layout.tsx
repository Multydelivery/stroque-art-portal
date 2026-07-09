import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Stroque Art Portal",
  description: "Connect businesses with artists for custom spaces and brand experiences."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <header className="sticky top-0 z-20 border-b border-stone-200 bg-paper/90 backdrop-blur">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-lg font-semibold tracking-tight">
              Stroque
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <Link className="rounded-lg px-3 py-2 hover:bg-stone-100" href="/artists">
                Artists
              </Link>
              {user ? (
                <>
                  <Link
                    className="rounded-lg px-3 py-2 hover:bg-stone-100"
                    href={user.role === "artist" ? "/dashboard/artist" : "/dashboard/business"}
                  >
                    Dashboard
                  </Link>
                  <form action="/api/auth/logout" method="post">
                    <button className="rounded-lg border border-stone-300 px-3 py-2 hover:bg-white" type="submit">
                      Log out
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link className="rounded-lg px-3 py-2 hover:bg-stone-100" href="/auth/login">
                    Log in
                  </Link>
                  <Link className="rounded-lg bg-ink px-4 py-2 text-white" href="/auth/signup">
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </header>
        {children}
        <footer className="border-t border-stone-200 bg-ink text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
            <div>
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Stroque
              </Link>
              <p className="mt-3 max-w-md text-sm leading-6 text-stone-300">
                A marketplace-style art portal for discovering artists, comparing project fit, and sending clear commission requests.
              </p>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-blush">Explore</h2>
              <div className="mt-4 grid gap-2 text-sm text-stone-300">
                <Link className="hover:text-white" href="/artists">
                  Artists
                </Link>
                <Link className="hover:text-white" href="/auth/login">
                  Log in
                </Link>
                <Link className="hover:text-white" href="/auth/signup">
                  Sign up
                </Link>
              </div>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-blush">Demo mode</h2>
              <p className="mt-4 text-sm leading-6 text-stone-300">
                Use test data locally with artist@example.com or business@example.com and password123.
              </p>
            </div>
          </div>
          <div className="border-t border-white/10">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-xs text-stone-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <p>Stroque Art Portal</p>
              <p>Built for local testing and portfolio review.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
