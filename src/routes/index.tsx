import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, Footprints, Search, ShieldCheck } from "lucide-react";

import heroImage from "@/assets/hero.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ListingCard } from "@/components/ListingCard";
import { budgets, listings, roomTypes, schoolCities, schoolLabels, schools } from "@/data/listings";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LodgeMe — Off-campus rooms near Nigerian universities" },
      {
        name: "description",
        content:
          "Find inspected off-campus student rooms near UNILAG, UI, ABU, UNN, OAU and UNIBEN. Real prices, real distances, landlords who answer.",
      },
      { property: "og:title", content: "LodgeMe — Off-campus rooms near Nigerian universities" },
      {
        property: "og:description",
        content: "Book an inspected student room near your campus from anywhere in Nigeria.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const [school, setSchool] = useState("");
  const [type, setType] = useState("");
  const [budget, setBudget] = useState("");

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <section className="relative">
        <img
          src={heroImage}
          alt="Students walking into a modern off-campus student residence"
          width={1600}
          height={900}
          className="h-[560px] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="absolute inset-0">
          <div className="mx-auto flex h-full max-w-6xl flex-col justify-center px-5">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/80">
              Off-campus living, sorted
            </p>
            <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.1] text-primary-foreground sm:text-5xl">
              Find a room near your campus — book it from anywhere.
            </h1>
            <p className="mt-5 max-w-xl text-primary-foreground/85">
              LodgeMe lists inspected off-campus rooms around Nigerian universities, with real prices, real
              distances and landlords who answer.
            </p>
          </div>
        </div>
      </section>

      <div className="relative z-20 mx-auto -mt-14 max-w-5xl px-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({
              to: "/listings",
              search: {
                ...(school ? { school } : {}),
                ...(type ? { type } : {}),
                ...(budget ? { budget: Number(budget) } : {}),
              },
            });
          }}
          className="grid gap-4 rounded-3xl border border-border/60 bg-card p-6 shadow-[0_20px_50px_rgba(15,23,42,0.12)] sm:grid-cols-[1fr_1fr_1fr_auto]"
        >
          <Field label="Institution">
            <select value={school} onChange={(e) => setSchool(e.target.value)} className="select-field">
              <option value="">Anywhere in Nigeria</option>
              {schools.map((s) => (
                <option key={s} value={s}>
                  {schoolLabels[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Room type">
            <select value={type} onChange={(e) => setType(e.target.value)} className="select-field">
              <option value="">Any type</option>
              {roomTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Yearly budget">
            <select value={budget} onChange={(e) => setBudget(e.target.value)} className="select-field">
              <option value="">Any budget</option>
              {budgets.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
          </Field>
          <div className="flex items-end">
            <button
              type="submit"
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary px-7 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Search className="size-4" /> Search rooms
            </button>
          </div>
        </form>

        <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Popular campuses:</span>
          {schools.map((s) => (
            <Link
              key={s}
              to="/listings"
              search={{ school: s }}
              className="rounded-full border border-border px-3.5 py-1.5 transition-colors hover:border-primary hover:text-primary"
            >
              {s} · {schoolCities[s]}
            </Link>
          ))}
        </div>
      </div>

      <section className="mx-auto mt-20 max-w-6xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Rooms students are booking now</h2>
            <p className="mt-1.5 text-muted-foreground">Every listing is visited by our team before it goes live.</p>
          </div>
          <Link to="/listings" className="text-sm font-medium text-primary hover:underline">
            View all rooms
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.slug} listing={l} />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-24 max-w-6xl px-5">
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: BadgeCheck,
              title: "Inspected, not guessed",
              body: "We photograph and verify each room, so the space you see is the space you get.",
            },
            {
              icon: Footprints,
              title: "Distance you can trust",
              body: "Every listing shows the real walking distance to your campus gate.",
            },
            {
              icon: ShieldCheck,
              title: "No agent runaround",
              body: "Yearly rent is stated upfront. Request a booking and the landlord replies in 24 hours.",
            },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border border-border/70 bg-card p-6">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-3xl px-5 text-center">
        <blockquote className="text-xl leading-relaxed sm:text-2xl">
          “I was still in Port Harcourt when I booked my Akoka self-contain. The photos matched, the landlord called
          the same day, and I moved in the week before lectures.”
        </blockquote>
        <p className="mt-5 text-sm text-muted-foreground">Chidera N. — 300 level, UNILAG</p>
      </section>

      <SiteFooter />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
