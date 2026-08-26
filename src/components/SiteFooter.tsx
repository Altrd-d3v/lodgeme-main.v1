import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div>
          <p className="text-base font-semibold">Lodgemate</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            Inspected off-campus rooms around Nigerian universities, bookable from anywhere.
          </p>
        </div>
        <div className="text-sm">
          <p className="font-medium">Students</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>
              <Link to="/listings" className="hover:text-foreground">
                Browse rooms
              </Link>
            </li>
            <li>
              <Link to="/how-it-works" className="hover:text-foreground">
                How booking works
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <p className="font-medium">Landlords</p>
          <ul className="mt-3 space-y-2 text-muted-foreground">
            <li>List a room</li>
            <li>Inspection visits</li>
            <li>hello@lodgemate.ng</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Lodgemate. Built for Nigerian students.
      </div>
    </footer>
  );
}
