import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, BadgeCheck, Bath, BedDouble, Check, MapPin, Star } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPrice, listings, schoolLabels } from "@/data/listings";

export const Route = createFileRoute("/listings/$slug")({
  loader: ({ params }) => {
    const listing = listings.find((l) => l.slug === params.slug);
    if (!listing) throw notFound();
    return { listing };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Room not found — Lodgemate" }, { name: "robots", content: "noindex" }] };
    }
    const { listing } = loaderData;
    const title = `${listing.title} — Lodgemate`;
    const description = `${listing.type} in ${listing.area}, ${listing.distance}. ${formatPrice(listing.price)} per year.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ListingDetail,
});

function ListingDetail() {
  const { listing } = Route.useLoaderData();
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-10">
        <Link
          to="/listings"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" /> Back to rooms
        </Link>

        <div className="mt-6 overflow-hidden rounded-3xl">
          <img
            src={listing.image}
            alt={listing.title}
            width={1024}
            height={768}
            className="h-[420px] w-full object-cover"
          />
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-secondary px-3 py-1 font-medium">{listing.type}</span>
              {listing.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 font-medium text-primary-foreground">
                  <BadgeCheck className="size-3.5" /> Verified
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Star className="size-3.5 fill-current text-primary" /> {listing.rating}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight">{listing.title}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="size-4" /> {listing.area} · {listing.distance}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{schoolLabels[listing.school]}</p>

            <div className="mt-6 flex gap-6 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <BedDouble className="size-4" /> {listing.beds} bed{listing.beds > 1 ? "s" : ""}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Bath className="size-4" /> {listing.baths} bath
              </span>
            </div>

            <p className="mt-8 leading-relaxed">{listing.description}</p>

            <h2 className="mt-10 text-lg font-semibold">What the room includes</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {listing.amenities.map((a) => (
                <li key={a} className="flex items-center gap-2 text-sm">
                  <Check className="size-4 text-primary" /> {a}
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit rounded-3xl border border-border/70 bg-card p-6 shadow-[0_12px_40px_rgba(15,23,42,0.08)] lg:sticky lg:top-24">
            <p className="text-2xl font-semibold">
              {formatPrice(listing.price)}{" "}
              <span className="text-sm font-normal text-muted-foreground">/ year</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              About {formatPrice(Math.round(listing.price / 12))} a month
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Landlord: {listing.landlord}</p>

            {sent ? (
              <div className="mt-6 rounded-2xl bg-secondary p-5 text-sm">
                <p className="font-medium">Request sent</p>
                <p className="mt-1 text-muted-foreground">
                  {listing.landlord} will confirm within 24 hours. No money changes hands before then.
                </p>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="mt-6 h-12 w-full rounded-full bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Request to book
                </button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Free to request · No payment until the landlord confirms
                </p>
              </>
            )}
          </aside>
        </div>
      </main>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-lg">Book {listing.title}</DialogTitle>
            <DialogDescription>
              {formatPrice(listing.price)} per year · {listing.area}. No payment is taken now — the
              landlord confirms availability first.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setOpen(false);
              setSent(true);
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <input id="name" required placeholder="Amaka Okoro" className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="amaka@student.edu.ng"
                className="input-field"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="matric" className="text-sm font-medium">
                Matric number
              </label>
              <input id="matric" required placeholder="190401025" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="movein" className="text-sm font-medium">
                  Move-in date
                </label>
                <input id="movein" type="date" required className="input-field" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="months" className="text-sm font-medium">
                  Months
                </label>
                <input
                  id="months"
                  type="number"
                  min={1}
                  max={24}
                  defaultValue={12}
                  className="input-field"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label htmlFor="message" className="text-sm font-medium">
                Message to host (optional)
              </label>
              <textarea
                id="message"
                rows={3}
                placeholder="I'm a 300-level student resuming in October."
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"
              />
            </div>
            <button
              type="submit"
              className="h-12 w-full rounded-full bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Send request
            </button>
          </form>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}
