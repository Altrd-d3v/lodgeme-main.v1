import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How booking a room works — Lodgemate" },
      {
        name: "description",
        content:
          "Three steps to book an inspected off-campus room from your phone: pick your campus, compare rooms, request to book.",
      },
      { property: "og:title", content: "How booking a room works — Lodgemate" },
      {
        property: "og:description",
        content: "Skip the trek to campus. Compare inspected rooms and book from anywhere in Nigeria.",
      },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  {
    title: "Tell us your campus and budget",
    body: "Pick your institution and a yearly budget. We only show rooms within walking or keke distance of that campus.",
  },
  {
    title: "Compare inspected rooms",
    body: "Photos, amenities, real distance to the gate and the full yearly rent — no hidden agent fees on top.",
  },
  {
    title: "Request to book from anywhere",
    body: "Send a booking request with your matric number and move-in date. The landlord confirms within 24 hours before any money changes hands.",
  },
];

function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-5 py-16">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Booking a room, without the trek</h1>
        <p className="mt-4 text-muted-foreground">
          Most students still travel to campus early just to hunt for a room. Lodgemate replaces that with three
          steps you can finish from your phone.
        </p>

        <ol className="mt-12 space-y-8">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-5 rounded-2xl border border-border/70 bg-card p-6">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                {i + 1}
              </span>
              <div>
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-16 rounded-3xl bg-secondary/60 p-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">Ready to look?</h2>
          <p className="mt-2 text-muted-foreground">Rooms around six campuses are live now.</p>
          <Link
            to="/listings"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-primary px-7 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Browse rooms
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
