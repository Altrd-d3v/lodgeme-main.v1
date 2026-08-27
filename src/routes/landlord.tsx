import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice, roomTypes, schoolLabels, schools } from "@/data/listings";

export const Route = createFileRoute("/landlord")({
  head: () => ({
    meta: [
      { title: "My rooms — LodgeMe for landlords" },
      {
        name: "description",
        content: "Add, edit and unpublish the off-campus rooms you rent to students on LodgeMe.",
      },
      { property: "og:title", content: "My rooms — LodgeMe for landlords" },
      {
        property: "og:description",
        content: "Manage your LodgeMe room listings in one place.",
      },
    ],
  }),
  component: LandlordDashboard,
});

type Property = {
  id: string;
  title: string;
  room_type: string;
  school: string;
  area: string;
  distance: string | null;
  beds: number;
  baths: number;
  price: number;
  description: string | null;
  amenities: string[];
  image_url: string | null;
  contact_phone: string | null;
  published: boolean;
};

const emptyForm = {
  title: "",
  room_type: roomTypes[0] as string,
  school: schools[0] as string,
  area: "",
  distance: "",
  beds: "1",
  baths: "1",
  price: "",
  description: "",
  amenities: "",
  image_url: "",
  contact_phone: "",
};

function LandlordDashboard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return;
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      await load();
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function load() {
    const { data, error } = await supabase
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setProperties((data ?? []) as Property[]);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { data: sessionData } = await supabase.auth.getSession();
    const userId = sessionData.session?.user.id;
    if (!userId) {
      navigate({ to: "/auth" });
      return;
    }
    const { error } = await supabase.from("properties").insert({
      owner_id: userId,
      title: form.title,
      room_type: form.room_type,
      school: form.school,
      area: form.area,
      distance: form.distance || null,
      beds: Number(form.beds) || 1,
      baths: Number(form.baths) || 1,
      price: Number(form.price) || 0,
      description: form.description || null,
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      image_url: form.image_url || null,
      contact_phone: form.contact_phone || null,
    });
    if (error) setError(error.message);
    else {
      setForm(emptyForm);
      setShowForm(false);
      await load();
    }
    setBusy(false);
  }

  async function togglePublished(p: Property) {
    await supabase.from("properties").update({ published: !p.published }).eq("id", p.id);
    await load();
  }

  async function remove(p: Property) {
    await supabase.from("properties").delete().eq("id", p.id);
    await load();
  }

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  }

  const set = (k: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-5 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">My rooms</h1>
            <p className="mt-2 text-muted-foreground">Publish a room and students can request to book it.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm((s) => !s)}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-5 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" /> Add a room
            </button>
            <button
              onClick={signOut}
              className="inline-flex h-11 items-center rounded-full border border-border px-5 text-sm transition-colors hover:bg-accent"
            >
              Sign out
            </button>
          </div>
        </div>

        {error && <p className="mt-6 text-sm text-destructive">{error}</p>}

        {showForm && (
          <form onSubmit={onSubmit} className="mt-8 grid gap-4 rounded-2xl border border-border/70 bg-card p-6 sm:grid-cols-2">
            <Field label="Room title">
              <input required value={form.title} onChange={set("title")} className="input-field" placeholder="Bright self-contain at Akoka gate" />
            </Field>
            <Field label="Room type">
              <select value={form.room_type} onChange={set("room_type")} className="select-field">
                {roomTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Institution">
              <select value={form.school} onChange={set("school")} className="select-field">
                {schools.map((s) => (
                  <option key={s} value={s}>
                    {schoolLabels[s]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Area">
              <input required value={form.area} onChange={set("area")} className="input-field" placeholder="Akoka, Lagos" />
            </Field>
            <Field label="Distance to campus">
              <input value={form.distance} onChange={set("distance")} className="input-field" placeholder="0.8 km to UNILAG" />
            </Field>
            <Field label="Yearly rent (₦)">
              <input required type="number" min={0} value={form.price} onChange={set("price")} className="input-field" placeholder="850000" />
            </Field>
            <Field label="Beds">
              <input type="number" min={1} value={form.beds} onChange={set("beds")} className="input-field" />
            </Field>
            <Field label="Baths">
              <input type="number" min={1} value={form.baths} onChange={set("baths")} className="input-field" />
            </Field>
            <Field label="Photo URL">
              <input value={form.image_url} onChange={set("image_url")} className="input-field" placeholder="https://..." />
            </Field>
            <Field label="Contact phone">
              <input value={form.contact_phone} onChange={set("contact_phone")} className="input-field" placeholder="0803 000 0000" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Amenities (comma separated)">
                <input value={form.amenities} onChange={set("amenities")} className="input-field" placeholder="Prepaid meter, Water tank, Security gate" />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={set("description")}
                  rows={4}
                  className="input-field"
                  placeholder="Tell students what the room and compound are like."
                />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={busy}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {busy && <Loader2 className="size-4 animate-spin" />} Publish room
              </button>
            </div>
          </form>
        )}

        {!ready ? (
          <p className="mt-12 text-muted-foreground">Loading your rooms…</p>
        ) : properties.length ? (
          <div className="mt-10 space-y-4">
            {properties.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border/70 bg-card p-4">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.title} className="size-20 rounded-xl object-cover" loading="lazy" />
                ) : (
                  <div className="size-20 rounded-xl bg-secondary" />
                )}
                <div className="min-w-48 flex-1">
                  <p className="font-semibold">{p.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {p.room_type} · {p.area} · {p.school}
                  </p>
                  <p className="mt-1 text-sm font-medium">{formatPrice(p.price)} / year</p>
                </div>
                <span
                  className={
                    p.published
                      ? "rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                      : "rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground"
                  }
                >
                  {p.published ? "Published" : "Hidden"}
                </span>
                <button
                  onClick={() => togglePublished(p)}
                  className="rounded-full border border-border px-4 py-1.5 text-sm transition-colors hover:bg-accent"
                >
                  {p.published ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={() => remove(p)}
                  aria-label={`Delete ${p.title}`}
                  className="rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-12 rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
            No rooms yet. Add your first room and it goes live immediately.
          </p>
        )}
      </main>
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
