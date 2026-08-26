import { Link } from "@tanstack/react-router";
import { BadgeCheck, Bath, BedDouble, MapPin, Star } from "lucide-react";
import { formatPrice, type Listing } from "@/data/listings";

export function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link
      to="/listings/$slug"
      params={{ slug: listing.slug }}
      className="group overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(15,23,42,0.10)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          loading="lazy"
          width={1024}
          height={768}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1 text-xs font-medium">
          {listing.type}
        </span>
        {listing.verified && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
            <BadgeCheck className="size-3.5" /> Verified
          </span>
        )}
      </div>
      <div className="space-y-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug">{listing.title}</h3>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm text-muted-foreground">
            <Star className="size-3.5 fill-current text-primary" /> {listing.rating}
          </span>
        </div>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-3.5" /> {listing.area} · {listing.distance}
        </p>
        <p className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <BedDouble className="size-3.5" /> {listing.beds} bed{listing.beds > 1 ? "s" : ""}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Bath className="size-3.5" /> {listing.baths} bath
          </span>
        </p>
        <p className="pt-1 font-semibold">
          {formatPrice(listing.price)} <span className="text-sm font-normal text-muted-foreground">/ year</span>
        </p>
      </div>
    </Link>
  );
}
