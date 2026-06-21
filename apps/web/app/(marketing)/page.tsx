import Link from "next/link";
import { TripCard } from "@/components/trip-card";
import { MOCK_TRIPS } from "@/lib/mock/trips";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background-base">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <span className="font-display text-2xl text-text-primary">Wanderloom</span>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/sign-in" className="text-text-secondary hover:text-text-primary">
            Sign in
          </Link>
          <Link href="/sign-up" className="rounded-pill bg-accent-primary px-4 py-2 text-white">
            Get started
          </Link>
        </nav>
      </header>

      <section className="px-6 py-16 text-center md:px-12 md:py-24">
        <h1 className="mx-auto max-w-2xl font-display text-4xl leading-tight text-text-primary md:text-6xl">
          Your travels, woven into a living globe.
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
          Wanderloom turns real trips into a beautiful, social map of the world &mdash; build your scrapbook,
          discover where friends have been, and find your next destination through real journeys, not lists.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link href="/sign-up" className="rounded-pill bg-accent-primary px-6 py-3 text-white">
            Start your map
          </Link>
          <Link
            href="#how-it-works"
            className="rounded-pill border border-text-secondary/30 px-6 py-3 text-text-primary"
          >
            See how it works
          </Link>
        </div>
      </section>

      <section
        className="mx-6 aspect-[16/9] max-w-5xl rounded-lg bg-map-base bg-cover bg-center md:mx-auto"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600)",
        }}
        aria-label="Globe hero placeholder — replaced with the live Mapbox globe in Session 08"
      />

      <section id="how-it-works" className="px-6 py-16 md:px-12">
        <h2 className="text-center font-display text-3xl text-text-primary">Real trips. Not generic lists.</h2>
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
          {MOCK_TRIPS.map((trip) => (
            <TripCard key={trip.slug} trip={trip} />
          ))}
        </div>
      </section>

      <footer className="px-6 py-10 text-center text-sm text-text-secondary md:px-12">
        &copy; {new Date().getFullYear()} Wanderloom
      </footer>
    </main>
  );
}
