import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { BottomDock } from "@/components/BottomDock";
import { SiteNavbar } from "@/components/SiteNavbar";
import { LivingArtBackground } from "@/components/ui/LivingArtBackground";
import { getSessionUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Stroque Art Portal",
  description: "Connect businesses with artists for custom spaces and brand experiences."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="relative pb-24 font-sans antialiased md:pb-0">
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => {
  try {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const useDark = savedTheme ? savedTheme === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", useDark);
  } catch {
    document.documentElement.classList.remove("dark");
  }
})();`
          }}
        />
        <LivingArtBackground />
        <div className="relative z-10">
          <a
            href="#main-content"
            className="sr-only z-50 rounded-md bg-white px-4 py-2 text-sm font-semibold text-ink focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:outline-none focus:ring-2 focus:ring-moss dark:bg-[#141419] dark:text-stone-100"
          >
            Skip to main content
          </a>
          <SiteNavbar user={user} />
          <div id="main-content" tabIndex={-1}>
            {children}
          </div>
          <footer className="border-t border-stone-200 bg-ink text-white">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
              <div>
                <Link href="/" className="group relative inline-flex rounded-[1.75rem] border border-white/15 bg-gradient-to-br from-white via-white to-stone-100/90 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,0.35),0_0_35px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5 hover:border-white/25 hover:shadow-[0_22px_55px_rgba(0,0,0,0.42),0_0_48px_rgba(255,240,192,0.18)] focus-visible:ring-2 focus-visible:ring-moss focus-visible:ring-offset-2 focus-visible:ring-offset-ink">
                  <span aria-hidden="true" className="absolute inset-[-10px] -z-10 rounded-[2rem] bg-radial-[at_50%_50%] from-white/35 via-blush/10 to-transparent blur-2xl transition duration-300 group-hover:from-white/45 group-hover:via-blush/15" />
                  <Image
                    src="/images/Logo.TMfooter.jpg"
                    alt="Stroque logo"
                    width={320}
                    height={96}
                    className="h-auto w-full max-w-xs object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.18)]"
                    priority={false}
                  />
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
                  Use test data locally with artist@example.com, business@example.com, or admin@example.com and password123.
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
          <BottomDock user={user} />
        </div>
      </body>
    </html>
  );
}
