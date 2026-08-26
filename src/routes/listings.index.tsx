import { createFileRoute, Link } from "@tanstack/react-router";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ListingCard } from "@/components/ListingCard";
import { budgets, filterListings, roomTypes, schools } from "@/data/listings";

type Search = { school?: string; type?: string; budget?: number };

export const Route = createFileRoute("/listings/")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    school: typeof search.school === "string" ? search.school : undefined,
    type: typeof search.type === "string" ? search.type : undefined,
    budget: search.budget ? Number(search.budget) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "All off-campus rooms — Lodgemate" },
      {
        name: "description",
        content: "Browse inspected off-campus student rooms by campus, room type and yearly budget.",
      },
      { property: "og:title", content: "All off-campus rooms — Lodgemate" },
      {
        property: "og:description",
        content: "Filter verified student rooms by campus, type and budget across Nigeria.",
      },
    ],
  }),
  component: ListingsPage,
});

function ListingsPage() {
  const search = Route.useSearch();
  const results = filterListings(search);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-14">
        <h1 className="text-3xl font-semibold tracking-tight">All off-campus rooms</h1>
        <p className="mt-2 text-muted-foreground">
          <span className="font-medium text-foreground">{results.length}</span> room
          {results.length === 1 ? "" : "s"} available
        </p>

        <div className="mt-8 space-y-4 rounded-2xl border border-border/70 bg-card p-5">
          <FilterRow label="Institution">
            <Chip to={{ ...search, school: undefined }} active={!search.school}>
              All campuses
            </Chip>
            {schools.map((s) => (
              <Chip key={s} to={{ ...search, school: s }} active={search.school === s}>
                {s}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Room type">
            <Chip to={{ ...search, type: undefined }} active={!search.type}>
              Any type
            </Chip>
            {roomTypes.map((t) => (
              <Chip key={t} to={{ ...search, type: t }} active={search.type === t}>
                {t}
              </Chip>
            ))}
          </FilterRow>
          <FilterRow label="Budget">
            <Chip to={{ ...search, budget: undefined }} active={!search.budget}>
              Any
            </Chip>
            {budgets.map((b) => (
              <Chip key={b.value} to={{ ...search, budget: b.value }} active={search.budget === b.value}>
                Under ₦{b.value / 1000}k
              </Chip>
            ))}
          </FilterRow>
        </div>

        {results.length ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((l) => (
              <ListingCard key={l.slug} listing={l} />
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No rooms match those filters yet. Try a wider budget or another campus.
          </p>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-24 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function Chip({ to, active, children }: { to: Search; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to="/listings"
      search={to}
      className={
        active
          ? "rounded-full bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground"
          : "rounded-full border border-border px-3.5 py-1.5 text-sm transition-colors hover:border-primary hover:text-primary"
      }
    >
      {children}
    </Link>
  );
}
