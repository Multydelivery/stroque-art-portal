import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";
import { InteractiveArtCard } from "@/components/ui/InteractiveArtCard";
import { RevealInView } from "@/components/ui/RevealInView";

const indyEvents = [
  {
    date: "Jul 18",
    title: "First Friday Gallery Walk",
    venue: "Fountain Square",
    description: "Open studios, small gallery shows, and pop-up mural previews for businesses scouting local artists."
  },
  {
    date: "Jul 24",
    title: "Public Art Mixer",
    venue: "Mass Ave",
    description: "A casual evening for property teams, curators, and artists planning hospitality and retail projects."
  },
  {
    date: "Aug 02",
    title: "Indy Makers Market",
    venue: "Bottleworks District",
    description: "Browse painters, printmakers, ceramicists, and installation artists available for commissions."
  }
];

const artNews = [
  {
    label: "Market",
    title: "Businesses are treating local art as part of brand experience",
    body: "Hotels, restaurants, and offices are commissioning site-specific work to make spaces more memorable."
  },
  {
    label: "Design",
    title: "Murals and textured wall pieces remain strong for guest-facing interiors",
    body: "Large-format work gives teams a clear focal point without rebuilding the whole space."
  },
  {
    label: "Artists",
    title: "Clear budgets help artists respond faster",
    body: "Requests with space details, timeline, and budget range are easier to price and schedule."
  }
];

const projectTypes = ["Lobby murals", "Restaurant feature walls", "Office artwork", "Retail installations", "Hotel room series", "Event backdrops"];

const heroImages = [
  {
    src: "/images/art-connect-spaces-hero.png",
    alt: "Colorful Stroque mural that says art connects spaces people and ideas"
  },
  {
    src: "/images/hero-indianapolis-restaurant-mural.png",
    alt: "Restaurant interior with a colorful Indianapolis skyline mural"
  },
  {
    src: "/images/hero-indy-wall-street-art.png",
    alt: "Colorful Indianapolis street mural with Indy lettering and local icons"
  },
  {
    src: "/images/hero-indy-bar-mural.png",
    alt: "Indianapolis bar interior with black and gold sports mural art"
  }
];

export default function HomePage() {
  return (
    <main className="relative z-10">
      <section className="relative mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 bg-white px-4 py-12 text-stone-900 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 dark:bg-transparent dark:text-white">
        <div className="space-y-8">
          <RevealInView className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-clay">Art for business spaces</p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-stone-950 sm:text-6xl dark:text-white">
              artists and businesses who make spaces feel
              <span className="bg-[linear-gradient(105deg,#d67aff_0%,#f18fcb_38%,#f5c16f_72%,#7fcbf1_100%)] bg-clip-text text-transparent"> alive.</span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-700 dark:text-stone-200">
              Stroque helps restaurants, offices, hotels, and retail teams discover artists by style,
              location, service, and budget, then send clear project requests in minutes.
            </p>
          </RevealInView>
          <RevealInView className="flex flex-col gap-3 sm:flex-row" delay={0.12}>
            <ButtonLink href="/artists">Find Artists</ButtonLink>
            <ButtonLink href="/auth/signup" variant="light">
              Join as Artist
            </ButtonLink>
          </RevealInView>
        </div>

        <div className="relative">
          <RevealInView className="grid grid-cols-2 gap-3 sm:gap-4" delay={0.08}>
            {heroImages.map((image, index) => {
              const card = (
                <div
                  className={`relative aspect-square overflow-hidden rounded-full border-2 border-[#c4b5fd]/70 shadow-[0_22px_48px_rgba(8,8,12,0.36)] ${index % 2 ? "sm:translate-y-8" : ""} ${index === 0 ? "sm:scale-[0.96]" : ""}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    priority={index < 2}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 46vw"
                    className="object-cover"
                  />
                </div>
              );

              return index < 2 ? (
                <InteractiveArtCard key={image.src} className="[transform-style:preserve-3d]">
                  {card}
                </InteractiveArtCard>
              ) : (
                <div key={image.src}>{card}</div>
              );
            })}
          </RevealInView>
        </div>
      </section>

      <section className="bg-white px-4 pb-14 pt-10 text-stone-900 sm:px-6 lg:px-8 dark:bg-transparent dark:text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <RevealInView className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-700 dark:text-blush">Marketplace pulse</p>
          </RevealInView>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {projectTypes.map((type, index) => (
              <RevealInView className="h-full w-full max-w-64" key={type} delay={index * 0.05}>
                <div className="flex h-full min-h-16 items-center justify-center border-b border-stone-200 px-4 py-3 text-center text-sm font-semibold text-stone-900 dark:border-white/20 dark:text-white">
                  {type}
                </div>
              </RevealInView>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 text-stone-900 sm:px-6 lg:px-8 dark:bg-transparent dark:text-white">
        <RevealInView className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clay">Indy calendar</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 dark:text-white">Incoming local art events</h2>
          </div>
          <p className="max-w-2xl text-stone-700 dark:text-stone-200">
            Demo listings for local discovery. Use this area later for real Indianapolis events, open calls, and artist meetups.
          </p>
        </RevealInView>
        <div className="mt-8 divide-y divide-stone-200 dark:divide-white/10">
          {indyEvents.map((event, index) => (
            <RevealInView key={event.title} delay={index * 0.08}>
              <article className="grid gap-2 py-5 md:grid-cols-[8rem_1fr] md:items-start">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">{event.date}</p>
                <div>
                  <h3 className="text-xl font-semibold text-stone-900 dark:text-stone-100">{event.title}</h3>
                  <p className="mt-1 text-sm font-medium text-stone-600 dark:text-stone-300">{event.venue}</p>
                  <p className="mt-3 text-sm leading-6 text-stone-700 dark:text-stone-200">{event.description}</p>
                </div>
              </article>
            </RevealInView>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-14 text-stone-900 sm:px-6 lg:px-8 dark:bg-transparent dark:text-white">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <RevealInView>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">Featured profile</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 dark:text-white">Artist of the week</h2>
            <p className="mt-4 text-stone-700 dark:text-stone-200">
              A weekly spotlight can help businesses quickly understand style, budget, and project fit.
            </p>
            <div className="mt-6">
              <ButtonLink href="/artists/test-artist-1">View Artist</ButtonLink>
            </div>
          </RevealInView>
          <RevealInView delay={0.08}>
            <article className="grid gap-6 md:grid-cols-[0.95fr_1.05fr] md:items-center">
              <div className="relative min-h-72 overflow-hidden rounded-3xl border border-stone-200 dark:border-white/10">
                <Image
                  src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80"
                  alt="Featured artist studio work"
                  fill
                  sizes="(min-width: 1024px) 36vw, 90vw"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">Mara Ellis</p>
                <h3 className="mt-3 text-2xl font-semibold text-stone-950 dark:text-white">Botanical murals for warm hospitality spaces</h3>
                <p className="mt-4 leading-7 text-stone-700 dark:text-stone-200">
                  Mara creates mixed-media wall pieces and custom murals for hotels, restaurants, and retail interiors that need a memorable focal point.
                </p>
                <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div>
                    <dt className="text-sm text-stone-500 dark:text-stone-400">Location</dt>
                    <dd className="mt-1 font-semibold text-stone-900 dark:text-stone-100">Indianapolis, IN</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-stone-500 dark:text-stone-400">Starts at</dt>
                    <dd className="mt-1 font-semibold text-stone-900 dark:text-stone-100">$1,800</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-stone-500 dark:text-stone-400">Best for</dt>
                    <dd className="mt-1 font-semibold text-stone-900 dark:text-stone-100">Murals</dd>
                  </div>
                </dl>
              </div>
            </article>
          </RevealInView>
        </div>
      </section>

      <section className="bg-white px-4 py-14 text-stone-900 sm:px-6 lg:px-8 dark:bg-transparent dark:text-white">
        <RevealInView className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-clay">Art news</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 dark:text-white">Notes for buyers and artists</h2>
          </div>
          <ButtonLink href="/artists" variant="light">Explore Directory</ButtonLink>
        </RevealInView>
        <div className="mt-8 divide-y divide-stone-200 dark:divide-white/10">
          {artNews.map((item, index) => (
            <RevealInView key={item.title} delay={index * 0.08}>
              <article className="grid gap-2 py-5 md:grid-cols-[8rem_1fr] md:items-start">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">{item.label}</p>
                <div>
                  <h3 className="text-xl font-semibold text-stone-950 dark:text-stone-100">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-700 dark:text-stone-200">{item.body}</p>
                </div>
              </article>
            </RevealInView>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-14 text-stone-900 sm:px-6 lg:px-8 dark:bg-transparent dark:text-white">
        <div>
          <RevealInView className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">How Stroque works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-950 dark:text-white">From discovery to a clear project request</h2>
            <p className="mt-4 text-stone-700 dark:text-stone-200">
              Keep the early art-buying process organized: compare artists, understand budget fit, and send enough context for a useful response.
            </p>
          </RevealInView>
          <div className="mt-8 divide-y divide-stone-200 dark:divide-white/10">
            <RevealInView delay={0.02}>
              <div className="grid gap-2 py-5 md:grid-cols-[8rem_1fr] md:items-start">
                <p className="text-sm font-semibold text-moss">01</p>
                <div>
                  <h3 className="text-xl font-semibold text-stone-950 dark:text-stone-100">Browse by fit</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-700 dark:text-stone-200">Use style, service, location, and budget signals to narrow the artist directory.</p>
                </div>
              </div>
            </RevealInView>
            <RevealInView delay={0.09}>
              <div className="grid gap-2 py-5 md:grid-cols-[8rem_1fr] md:items-start">
                <p className="text-sm font-semibold text-moss">02</p>
                <div>
                  <h3 className="text-xl font-semibold text-stone-950 dark:text-stone-100">Review the profile</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-700 dark:text-stone-200">Check portfolio images, starting price, services, and the kind of spaces each artist supports.</p>
                </div>
              </div>
            </RevealInView>
            <RevealInView delay={0.16}>
              <div className="grid gap-2 py-5 md:grid-cols-[8rem_1fr] md:items-start">
                <p className="text-sm font-semibold text-moss">03</p>
                <div>
                  <h3 className="text-xl font-semibold text-stone-950 dark:text-stone-100">Send a request</h3>
                  <p className="mt-3 text-sm leading-6 text-stone-700 dark:text-stone-200">Share the space type, timeline, budget, style preference, and project details in one form.</p>
                </div>
              </div>
            </RevealInView>
          </div>
        </div>
      </section>
    </main>
  );
}
