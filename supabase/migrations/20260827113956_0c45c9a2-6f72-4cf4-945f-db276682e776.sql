CREATE TYPE public.booking_status AS ENUM ('received','reviewing','unavailable','available','awaiting_payment','completed','cancelled');

CREATE TYPE public.app_role AS ENUM ('admin','staff','user');

CREATE TABLE public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.generate_booking_reference()
RETURNS text LANGUAGE sql VOLATILE SET search_path = public AS $$
  SELECT 'LM-' || to_char(now(), 'YYMM') || '-' || upper(substr(replace(gen_random_uuid()::text,'-',''), 1, 6))
$$;

CREATE TABLE public.bookings (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique default public.generate_booking_reference(),
  property_id uuid references public.properties(id) on delete set null,
  property_slug text,
  property_title text not null,
  property_area text,
  school text,
  student_name text not null,
  student_email text not null,
  student_phone text,
  matric_number text,
  move_in_date date,
  months integer not null default 12,
  message text,
  rent_amount integer not null,
  service_fee integer not null,
  total_amount integer not null,
  status public.booking_status not null default 'received',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT, UPDATE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view bookings" ON public.bookings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));
CREATE POLICY "Admins can update bookings" ON public.bookings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
  WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'));

CREATE TRIGGER set_bookings_updated_at BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX bookings_status_idx ON public.bookings (status, created_at DESC);