import { createServerFn } from "@tanstack/react-start";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { listings } from "@/data/listings";
import { serviceFee, type BookingStatus } from "@/lib/bookings";

type CreateInput = {
  slug?: string | undefined;
  propertyId?: string | undefined;
  name: string;
  email: string;
  phone?: string | undefined;
  matric?: string | undefined;
  moveIn?: string | undefined;
  months: number;
  message?: string | undefined;
};

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export const createBookingRequest = createServerFn({ method: "POST" })
  .inputValidator((input: CreateInput): CreateInput => {
    const name = str(input?.name, 120);
    const email = str(input?.email, 160).toLowerCase();
    if (name.length < 2) throw new Error("Please enter your full name.");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("Please enter a valid email.");
    const months = Number(input?.months);
    return {
      slug: str(input?.slug, 120) || undefined,
      propertyId: str(input?.propertyId, 60) || undefined,
      name,
      email,
      phone: str(input?.phone, 40) || undefined,
      matric: str(input?.matric, 40) || undefined,
      moveIn: str(input?.moveIn, 20) || undefined,
      message: str(input?.message, 1000) || undefined,
      months: Number.isFinite(months) ? Math.min(Math.max(Math.round(months), 1), 24) : 12,
    };
  })
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let room: {
      title: string;
      area: string;
      school: string;
      price: number;
      property_id: string | null;
      slug: string | null;
    } | null = null;

    if (data.propertyId) {
      const { data: p } = await supabaseAdmin
        .from("properties")
        .select("id, title, area, school, price, published")
        .eq("id", data.propertyId)
        .eq("published", true)
        .maybeSingle();
      if (p) {
        room = { title: p.title, area: p.area, school: p.school, price: p.price, property_id: p.id, slug: null };
      }
    } else if (data.slug) {
      const l = listings.find((x) => x.slug === data.slug);
      if (l) {
        room = { title: l.title, area: l.area, school: l.school, price: l.price, property_id: null, slug: l.slug };
      }
    }

    if (!room) throw new Error("That room could not be found.");

    const fee = serviceFee(room.price);

    const { data: booking, error } = await supabaseAdmin
      .from("bookings")
      .insert({
        property_id: room.property_id,
        property_slug: room.slug,
        property_title: room.title,
        property_area: room.area,
        school: room.school,
        student_name: data.name,
        student_email: data.email,
        student_phone: data.phone ?? null,
        matric_number: data.matric ?? null,
        move_in_date: data.moveIn ?? null,
        months: data.months,
        message: data.message ?? null,
        rent_amount: room.price,
        service_fee: fee,
        total_amount: room.price + fee,
      })
      .select("reference, rent_amount, service_fee, total_amount, status")
      .single();

    if (error) throw new Error(error.message);
    return booking;
  });

export const lookupBooking = createServerFn({ method: "POST" })
  .inputValidator((input: { reference: string; email: string }) => ({
    reference: str(input?.reference, 40).toUpperCase(),
    email: str(input?.email, 160).toLowerCase(),
  }))
  .handler(async ({ data }) => {
    if (!data.reference || !data.email) throw new Error("Enter your reference and email.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: booking } = await supabaseAdmin
      .from("bookings")
      .select(
        "reference, property_title, property_area, school, status, rent_amount, service_fee, total_amount, move_in_date, months, created_at",
      )
      .eq("reference", data.reference)
      .ilike("student_email", data.email)
      .maybeSingle();
    if (!booking) throw new Error("No booking found with that reference and email.");
    return booking;
  });

async function assertStaff(context: { supabase: any; userId: string }) {
  const [{ data: isAdmin }, { data: isStaff }] = await Promise.all([
    context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" }),
    context.supabase.rpc("has_role", { _user_id: context.userId, _role: "staff" }),
  ]);
  if (!isAdmin && !isStaff) throw new Error("Forbidden");
}

export const listBookings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertStaff(context as never);
    const { data, error } = await context.supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data;
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: BookingStatus; notes?: string | undefined }) => ({
    id: str(input?.id, 60),
    status: input?.status,
    notes: str(input?.notes, 1000) || undefined,
  }))
  .handler(async ({ data, context }) => {
    await assertStaff(context as never);
    const patch = { status: data.status, ...(data.notes !== undefined ? { admin_notes: data.notes } : {}) };
    const { error } = await context.supabase.from("bookings").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const isStaffUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      await assertStaff(context as never);
      return { staff: true };
    } catch {
      return { staff: false };
    }
  });
