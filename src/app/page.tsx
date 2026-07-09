import Image from "next/image";
import { ButtonLink } from "@/components/ButtonLink";

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
    <main>
      <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <div className="space-y-8">
          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">Art for business spaces</p>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-6xl">
              Commission artists who make commercial spaces feel alive.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-stone-700">
              Stroque helps restaurants, offices, hotels, and retail teams discover artists by style,
              location, service, and budget, then send clear project requests in minutes.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/artists">Find Artists</ButtonLink>
            <ButtonLink href="/auth/signup" variant="light">
              Join as Artist
            </ButtonLink>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {heroImages.map((image, index) => (
            <div className={`relative aspect-[4/5] overflow-hidden rounded-lg shadow-soft ${index % 2 ? "sm:translate-y-8" : ""}`} key={image.src}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority={index < 2}
                unoptimized
                sizes="(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 46vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>
      <section className="bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blush">Marketplace pulse</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">What businesses are requesting</h2>
          </div>
          <div className="md:col-span-2">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {projectTypes.map((type) => (
                <div className="rounded-lg border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold" key={type}>
                  {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">Indy calendar</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Incoming local art events</h2>
          </div>
          <p className="max-w-2xl text-stone-700">
            Demo listings for local discovery. Use this area later for real Indianapolis events, open calls, and artist meetups.
          </p>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {indyEvents.map((event) => (
            <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft" key={event.title}>
              <p className="text-sm font-semibold text-moss">{event.date}</p>
              <h3 className="mt-3 text-xl font-semibold">{event.title}</h3>
              <p className="mt-1 text-sm font-medium text-stone-500">{event.venue}</p>
              <p className="mt-4 text-sm leading-6 text-stone-700">{event.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">Featured profile</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Artist of the week</h2>
            <p className="mt-4 text-stone-700">
              A weekly spotlight can help businesses quickly understand style, budget, and project fit.
            </p>
            <div className="mt-6">
              <ButtonLink href="/artists/test-artist-1">View Artist</ButtonLink>
            </div>
          </div>
          <article className="grid overflow-hidden rounded-lg border border-stone-200 bg-paper shadow-soft md:grid-cols-[0.85fr_1.15fr]">
            <div className="relative min-h-72">
              <Image
                src="https://images.unsplash.com/photo-1547891654-e66ed7ebb968?auto=format&fit=crop&w=1200&q=80"
                alt="Featured artist studio work"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">Mara Ellis</p>
              <h3 className="mt-3 text-2xl font-semibold">Botanical murals for warm hospitality spaces</h3>
              <p className="mt-4 leading-7 text-stone-700">
                Mara creates mixed-media wall pieces and custom murals for hotels, restaurants, and retail interiors that need a memorable focal point.
              </p>
              <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-stone-500">Location</dt>
                  <dd className="mt-1 font-semibold">Brooklyn, NY</dd>
                </div>
                <div>
                  <dt className="text-sm text-stone-500">Starts at</dt>
                  <dd className="mt-1 font-semibold">$1,800</dd>
                </div>
                <div>
                  <dt className="text-sm text-stone-500">Best for</dt>
                  <dd className="mt-1 font-semibold">Murals</dd>
                </div>
              </dl>
            </div>
          </article>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">Art news</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">Notes for buyers and artists</h2>
          </div>
          <ButtonLink href="/artists" variant="light">Explore Directory</ButtonLink>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {artNews.map((item) => (
            <article className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft" key={item.title}>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">{item.label}</p>
              <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
              <p className="mt-4 text-sm leading-6 text-stone-700">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-moss">How Stroque works</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">From discovery to a clear project request</h2>
            <p className="mt-4 text-stone-700">
              Keep the early art-buying process organized: compare artists, understand budget fit, and send enough context for a useful response.
            </p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-lg border border-stone-200 bg-paper p-5">
              <p className="text-sm font-semibold text-moss">01</p>
              <h3 className="mt-3 text-xl font-semibold">Browse by fit</h3>
              <p className="mt-3 text-sm leading-6 text-stone-700">Use style, service, location, and budget signals to narrow the artist directory.</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-paper p-5">
              <p className="text-sm font-semibold text-moss">02</p>
              <h3 className="mt-3 text-xl font-semibold">Review the profile</h3>
              <p className="mt-3 text-sm leading-6 text-stone-700">Check portfolio images, starting price, services, and the kind of spaces each artist supports.</p>
            </div>
            <div className="rounded-lg border border-stone-200 bg-paper p-5">
              <p className="text-sm font-semibold text-moss">03</p>
              <h3 className="mt-3 text-xl font-semibold">Send a request</h3>
              <p className="mt-3 text-sm leading-6 text-stone-700">Share the space type, timeline, budget, style preference, and project details in one form.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
