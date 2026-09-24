import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";

export function WelcomeGate() {
  return (
    <main className="relative z-10 flex min-h-[calc(100vh-73px)] items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid w-full max-w-5xl items-center gap-10 rounded-3xl border border-stone-200 bg-white/90 p-8 shadow-[0_30px_80px_rgba(8,8,12,0.12)] sm:p-12 lg:grid-cols-[1.05fr_0.95fr] dark:border-white/10 dark:bg-[#141419]/90 dark:shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
        <div className="relative order-2 hidden aspect-square overflow-hidden rounded-2xl border border-stone-200 lg:order-1 lg:block dark:border-white/10">
          <Image
            src="/images/art-connect-spaces-hero.png"
            alt="Colorful Stroque mural that says art connects spaces people and ideas"
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 90vw"
            className="object-cover"
          />
        </div>

        <div className="order-1 space-y-6 text-center lg:order-2 lg:text-left">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-clay">Stroque</p>
            <h1 className="text-4xl font-semibold tracking-tight text-stone-950 sm:text-5xl dark:text-white">
              See where art meets
              <span className="bg-[linear-gradient(105deg,#d67aff_0%,#f18fcb_38%,#f5c16f_72%,#7fcbf1_100%)] bg-clip-text text-transparent"> business.</span>
            </h1>
            <p className="mx-auto max-w-md text-base leading-7 text-stone-700 sm:text-lg lg:mx-0 dark:text-stone-200">
              Sign up to browse artists, follow local events, and start project requests for your space.
            </p>
          </div>

          <div className="mx-auto flex max-w-xs flex-col gap-3 lg:mx-0">
            <ButtonLink href="/auth/signup">Create account</ButtonLink>
            <ButtonLink href="/auth/login" variant="light">
              Log in
            </ButtonLink>
          </div>

          <p className="text-xs text-stone-500 dark:text-stone-400">
            By continuing, you agree to browse Stroque as a business or artist account.
          </p>
        </div>
      </div>
    </main>
  );
}
