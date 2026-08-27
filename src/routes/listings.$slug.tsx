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
import { serviceFee, totalWithFee } from "@/lib/bookings";
import { createBookingRequest } from "@/lib/bookings.functions";

export const Route = createFileRoute("/listings/$slug")({
  loader: ({ params }) => {
    const listing = listings.find((l) => l.slug === params.slug);
    if (!listing) throw notFound();
    return { listing };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Room not found — LodgeMe" }, { name: "robots", content: "noindex" }] };
    }
    const { listing } = loaderData;
    const title = `${listing.title} — LodgeMe`;
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
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);
  const fee = serviceFee(listing.price);
  const total = totalWithFee(listing.price);

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

            <dl className="mt-5 space-y-2 border-t border-border/70 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Yearly rent</dt>
                <dd>{formatPrice(listing.price)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">LodgeMe service fee (2%)</dt>
                <dd>{formatPrice(fee)}</dd>
              </div>
              <div className="flex justify-between border-t border-border/70 pt-2 font-medium">
                <dt>Total payable to LodgeMe</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            {reference ? (
              <div className="mt-6 rounded-2xl bg-secondary p-5 text-sm">
                <p className="font-medium">Request received</p>
                <p className="mt-2 text-muted-foreground">Your booking reference</p>
                <p className="mt-1 text-lg font-semibold tracking-wide">{reference}</p>
                <p className="mt-3 text-muted-foreground">
                  We've emailed you a copy. LodgeMe now contacts the landlord to confirm the room is
                  still free, then arranges your inspection. You pay LodgeMe only after inspection —
                  never the landlord directly.
                </p>
                <Link
                  to="/track"
                  search={{ ref: reference }}
                  className="mt-4 inline-block font-medium text-primary hover:underline"
                >
                  Track this booking
                </Link>
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
                  Free to request · You pay LodgeMe only after the inspection passes
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
              {formatPrice(listing.price)} rent + {formatPrice(fee)} LodgeMe service fee (2%) ={" "}
              {formatPrice(total)}. No payment is taken now — LodgeMe confirms availability with the
              landlord first.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              setBusy(true);
              setError(null);
              try {
                const booking = await createBookingRequest({
                  data: {
                    slug: listing.slug,
                    name: String(fd.get("name") ?? ""),
                    email: String(fd.get("email") ?? ""),
                    phone: String(fd.get("phone") ?? ""),
                    matric: String(fd.get("matric") ?? ""),
                    moveIn: String(fd.get("movein") ?? ""),
                    months: Number(fd.get("months") ?? 12),
                    message: String(fd.get("message") ?? ""),
                  },
                });
                setOpen(false);
                setReference(booking.reference);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong.");
              } finally {
                setBusy(false);
              }
            }}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Full name
              </label>
              <input id="name" name="name" required placeholder="Amaka Okoro" className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email" name="email"
                type="email"
                required
                placeholder="amaka@student.edu.ng"
                className="input-field"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone number
              </label>
              <input id="phone" name="phone" required placeholder="0803 000 0000" className="input-field" />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="matric" className="text-sm font-medium">
                Matric number
              </label>
              <input id="matric" name="matric" required placeholder="190401025" className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label htmlFor="movein" className="text-sm font-medium">
                  Move-in date
                </label>
                <input id="movein" name="movein" type="date" required className="input-field" />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="months" className="text-sm font-medium">
                  Months
                </label>
                <input
                  id="months" name="months"
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
                id="message" name="message"
                rows={3}
                placeholder="I'm a 300-level student resuming in October."
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="h-12 w-full rounded-full bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send request"}
            </button>
            <p className="text-center text-xs text-muted-foreground">
              LodgeMe holds the process end-to-end: no payment to the landlord until inspection passes.
            </p>
          </form>
        </DialogContent>
      </Dialog>

      <SiteFooter />
    </div>
  );
}
