import { Link } from "@tanstack/react-router";
import { Home } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Home className="size-[18px]" />
          </span>
          <span className="text-lg font-semibold tracking-tight">Lodgemate</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/listings" className="transition-colors hover:text-foreground">
            Browse rooms
          </Link>
          <Link to="/how-it-works" className="transition-colors hover:text-foreground">
            How it works
          </Link>
          <Link to="/listings" className="hidden transition-colors hover:text-foreground sm:inline">
            Sign in
          </Link>
        </nav>
      </div>
    </header>
  );
}
