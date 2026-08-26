import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Landlord & agent accounts — Lodgemate" },
      {
        name: "description",
        content:
          "Create a Lodgemate landlord or agent account to list your off-campus rooms and reach students across Nigeria.",
      },
      { property: "og:title", content: "Landlord & agent accounts — Lodgemate" },
      {
        property: "og:description",
        content: "Sign up as a landlord or agent and publish your student rooms on Lodgemate.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [accountType, setAccountType] = useState<"landlord" | "agent">("landlord");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/landlord" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setNotice(null);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/landlord`,
          data: { full_name: fullName, phone, account_type: accountType },
        },
      });
      if (error) setError(error.message);
      else if (data.session) navigate({ to: "/landlord" });
      else setNotice("Check your email to confirm your account, then sign in.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else navigate({ to: "/landlord" });
    }
    setBusy(false);
  }

  async function onGoogle() {
    setError(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setError("Google sign-in failed. Try again or use email.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/landlord" });
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-[1fr_420px]">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">List your rooms on Lodgemate</h1>
          <p className="mt-3 max-w-md text-muted-foreground">
            Landlords and agents get a free account to publish rooms, keep prices accurate and receive booking
            requests from students who are ready to move in.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-muted-foreground">
            <li>• Publish unlimited rooms with photos, price and distance to campus</li>
            <li>• Edit or unpublish a room the moment it is taken</li>
            <li>• Students see your verified contact details, no agent runaround</li>
          </ul>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
          <div className="flex rounded-full bg-secondary p-1 text-sm">
            {(["signup", "signin"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={
                  mode === m
                    ? "flex-1 rounded-full bg-primary px-4 py-2 font-medium text-primary-foreground"
                    : "flex-1 rounded-full px-4 py-2 text-muted-foreground"
                }
              >
                {m === "signup" ? "Create account" : "Sign in"}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {mode === "signup" && (
              <>
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">Full name</span>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field mt-1.5"
                    placeholder="Adeyemi Balogun"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">Phone number</span>
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-field mt-1.5"
                    placeholder="0803 000 0000"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-muted-foreground">I am a</span>
                  <select
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value as "landlord" | "agent")}
                    className="select-field mt-1.5"
                  >
                    <option value="landlord">Landlord</option>
                    <option value="agent">Agent</option>
                  </select>
                </label>
              </>
            )}
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Email</span>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field mt-1.5"
                placeholder="you@email.com"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Password</span>
              <input
                required
                type="password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field mt-1.5"
                placeholder="••••••••"
              />
            </label>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {notice && <p className="text-sm text-muted-foreground">{notice}</p>}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {busy && <Loader2 className="size-4 animate-spin" />}
              {mode === "signup" ? "Create landlord account" : "Sign in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={onGoogle}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border font-medium transition-colors hover:bg-accent"
          >
            Continue with Google
          </button>

          <p className="mt-5 text-center text-xs text-muted-foreground">
            Looking for a room instead?{" "}
            <Link to="/listings" className="text-primary hover:underline">
              Browse rooms
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
