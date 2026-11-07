-- Leeder: multi-institution academic foundation
-- Initial schema only. It is not connected to the demo app yet.
-- Apply to a NEW Supabase project after reviewing the migration.
-- Graduation-year rules are configured per training program, never hard-coded by institution.

create extension if not exists pgcrypto;

do $$ begin
  create type public.institution_status as enum ('active', 'suspended', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.institution_request_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.membership_role as enum (
    'institution_admin',
    'department_admin',
    'department_assistant',
    'supervisor',
    'student'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.cohort_status as enum ('draft', 'ready', 'open', 'closed', 'archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.enrollment_status as enum ('imported', 'eligible', 'registered', 'withdrawn');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.thesis_status as enum (
    'proposal',
    'pending_review',
    'modifications_requested',
    'approved',
    'in_progress',
    'submitted',
    'completed',
    'rejected'
  );
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  preferred_language text not null default 'ar' check (preferred_language in ('ar', 'fr', 'en')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Central administrators are provisioned manually by the platform owner.
create table if not exists public.platform_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.institution_requests (
  id uuid primary key default gen_random_uuid(),
  institution_name text not null,
  institution_name_ar text,
  institution_name_fr text,
  country text not null default 'Algeria',
  city text,
  contact_name text not null,
  contact_email text not null,
  contact_position text,
  message text,
  status public.institution_request_status not null default 'pending',
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  review_note text,
  created_at timestamptz not null default now()
);

create table if not exists public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  name_ar text,
  name_fr text,
  slug text not null unique,
  country text not null default 'Algeria',
  city text,
  status public.institution_status not null default 'active',
  source_request_id uuid unique references public.institution_requests(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.institution_memberships (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.membership_role not null,
  department_id uuid,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, institution_id),
  check (
    (role = 'institution_admin' and department_id is null)
    or (role <> 'institution_admin' and department_id is not null)
  )
);

-- Fine-grained grants let each department assistant receive only selected duties.
create table if not exists public.membership_permissions (
  id uuid primary key default gen_random_uuid(),
  membership_id uuid not null,
  institution_id uuid not null references public.institutions(id) on delete restrict,
  permission_key text not null,
  granted_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  unique (membership_id, permission_key),
  foreign key (membership_id, institution_id)
    references public.institution_memberships(id, institution_id)
    on delete cascade
);

create index if not exists institution_memberships_user_idx
  on public.institution_memberships(user_id, institution_id);
create index if not exists institution_memberships_scope_idx
  on public.institution_memberships(institution_id, department_id, role);

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete restrict,
  name text not null,
  name_ar text,
  name_fr text,
  code text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (institution_id, name),
  unique (id, institution_id)
);

alter table public.institution_memberships
  add constraint institution_memberships_department_scope_fk
  foreign key (department_id, institution_id)
  references public.departments(id, institution_id)
  on delete restrict;

create table if not exists public.training_programs (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete restrict,
  department_id uuid not null references public.departments(id) on delete restrict,
  name text not null,
  education_track text,
  duration_years smallint not null check (duration_years > 0),
  graduation_year_number smallint not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (graduation_year_number between 1 and duration_years),
  unique (institution_id, department_id, name),
  unique (id, institution_id),
  foreign key (department_id, institution_id)
    references public.departments(id, institution_id)
    on delete restrict
);

create table if not exists public.specializations (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete restrict,
  department_id uuid not null references public.departments(id) on delete restrict,
  training_program_id uuid not null references public.training_programs(id) on delete restrict,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (institution_id, department_id, training_program_id, name),
  unique (id, institution_id, department_id, training_program_id),
  foreign key (department_id, institution_id)
    references public.departments(id, institution_id)
    on delete restrict,
  foreign key (training_program_id, institution_id)
    references public.training_programs(id, institution_id)
    on delete restrict
);

create table if not exists public.academic_years (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete restrict,
  label text not null,
  starts_on date,
  ends_on date,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  check (starts_on is null or ends_on is null or starts_on < ends_on),
  unique (institution_id, label),
  unique (id, institution_id)
);

create table if not exists public.graduation_cohorts (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete restrict,
  department_id uuid not null references public.departments(id) on delete restrict,
  training_program_id uuid not null references public.training_programs(id) on delete restrict,
  specialization_id uuid not null references public.specializations(id) on delete restrict,
  academic_year_id uuid not null references public.academic_years(id) on delete restrict,
  name text not null,
  graduation_year_number smallint not null check (graduation_year_number > 0),
  status public.cohort_status not null default 'draft',
  created_by uuid not null references auth.users(id),
  confirmed_by uuid references auth.users(id),
  confirmed_at timestamptz,
  opened_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (institution_id, academic_year_id, training_program_id, specialization_id, name),
  unique (id, institution_id),
  foreign key (department_id, institution_id)
    references public.departments(id, institution_id)
    on delete restrict,
  foreign key (training_program_id, institution_id)
    references public.training_programs(id, institution_id)
    on delete restrict,
  foreign key (specialization_id, institution_id, department_id, training_program_id)
    references public.specializations(id, institution_id, department_id, training_program_id)
    on delete restrict,
  foreign key (academic_year_id, institution_id)
    references public.academic_years(id, institution_id)
    on delete restrict
);

create table if not exists public.academic_groups (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete restrict,
  cohort_id uuid not null references public.graduation_cohorts(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (cohort_id, name),
  unique (id, institution_id),
  foreign key (cohort_id, institution_id)
    references public.graduation_cohorts(id, institution_id)
    on delete cascade
);

-- Imported student records may exist before the student activates an account.
create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete restrict,
  user_id uuid references auth.users(id) on delete set null,
  student_number text not null,
  full_name text not null,
  institutional_email text,
  department_id uuid not null references public.departments(id) on delete restrict,
  training_program_id uuid not null references public.training_programs(id) on delete restrict,
  specialization_id uuid not null references public.specializations(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (institution_id, student_number),
  unique (id, institution_id),
  foreign key (department_id, institution_id)
    references public.departments(id, institution_id)
    on delete restrict,
  foreign key (training_program_id, institution_id)
    references public.training_programs(id, institution_id)
    on delete restrict,
  foreign key (specialization_id, institution_id, department_id, training_program_id)
    references public.specializations(id, institution_id, department_id, training_program_id)
    on delete restrict
);

create unique index if not exists student_profiles_institution_user_unique
  on public.student_profiles(institution_id, user_id)
  where user_id is not null;

create table if not exists public.supervisor_profiles (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete restrict,
  user_id uuid not null references auth.users(id) on delete cascade,
  department_id uuid not null references public.departments(id) on delete restrict,
  academic_title text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (institution_id, user_id),
  unique (id, institution_id),
  foreign key (department_id, institution_id)
    references public.departments(id, institution_id)
    on delete restrict
);

create table if not exists public.cohort_enrollments (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete restrict,
  cohort_id uuid not null references public.graduation_cohorts(id) on delete cascade,
  student_profile_id uuid not null references public.student_profiles(id) on delete restrict,
  group_id uuid references public.academic_groups(id) on delete restrict,
  status public.enrollment_status not null default 'imported',
  eligibility_confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (cohort_id, student_profile_id),
  unique (id, institution_id),
  foreign key (cohort_id, institution_id)
    references public.graduation_cohorts(id, institution_id)
    on delete cascade,
  foreign key (student_profile_id, institution_id)
    references public.student_profiles(id, institution_id)
    on delete restrict,
  foreign key (group_id, institution_id)
    references public.academic_groups(id, institution_id)
    on delete restrict
);

create table if not exists public.thesis_projects (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions(id) on delete restrict,
  enrollment_id uuid not null unique references public.cohort_enrollments(id) on delete restrict,
  supervisor_profile_id uuid references public.supervisor_profiles(id) on delete restrict,
  title text,
  research_field text,
  status public.thesis_status not null default 'proposal',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  foreign key (enrollment_id, institution_id)
    references public.cohort_enrollments(id, institution_id)
    on delete restrict,
  foreign key (supervisor_profile_id, institution_id)
    references public.supervisor_profiles(id, institution_id)
    on delete restrict
);

create table if not exists public.audit_logs (
  id bigint generated always as identity primary key,
  institution_id uuid references public.institutions(id) on delete restrict,
  department_id uuid references public.departments(id) on delete restrict,
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists graduation_cohorts_scope_idx
  on public.graduation_cohorts(institution_id, academic_year_id, status);
create index if not exists student_profiles_scope_idx
  on public.student_profiles(institution_id, department_id);
create index if not exists thesis_projects_scope_idx
  on public.thesis_projects(institution_id, status);
create index if not exists audit_logs_scope_idx
  on public.audit_logs(institution_id, created_at desc);

-- Security-definer helpers avoid recursive membership-policy evaluation.
create or replace function public.is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.platform_admins pa
    where pa.user_id = auth.uid()
  );
$$;

create or replace function public.is_institution_member(target_institution_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_platform_admin() or exists (
    select 1
    from public.institution_memberships im
    where im.institution_id = target_institution_id
      and im.user_id = auth.uid()
      and im.is_active = true
  );
$$;

create or replace function public.has_institution_role(
  target_institution_id uuid,
  allowed_roles text[],
  target_department_id uuid default null
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.is_platform_admin() or exists (
    select 1
    from public.institution_memberships im
    where im.institution_id = target_institution_id
      and im.user_id = auth.uid()
      and im.is_active = true
      and im.role::text = any(allowed_roles)
      and (
        target_department_id is null
        or im.department_id is null
        or im.department_id = target_department_id
      )
  );
$$;

create or replace function public.is_assigned_supervisor(target_supervisor_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.supervisor_profiles sp
    join public.institution_memberships im
      on im.institution_id = sp.institution_id
     and im.user_id = sp.user_id
     and im.is_active = true
     and im.role = 'supervisor'
    where sp.id = target_supervisor_profile_id
      and sp.user_id = auth.uid()
      and sp.is_active = true
  );
$$;

-- Keep each cohort's graduation year consistent with its institution-owned program.
create or replace function public.validate_graduation_cohort_program()
returns trigger
language plpgsql
set search_path = public
as $
declare
  configured_graduation_year smallint;
begin
  select tp.graduation_year_number
    into configured_graduation_year
  from public.training_programs tp
  where tp.id = new.training_program_id
    and tp.institution_id = new.institution_id
    and tp.department_id = new.department_id
    and tp.is_active = true;

  if configured_graduation_year is null then
    raise exception 'Training program is missing, inactive, or outside this institution';
  end if;

  if new.graduation_year_number <> configured_graduation_year then
    raise exception 'Cohort graduation year must match the institution training program';
  end if;

  return new;
end;
$;

drop trigger if exists graduation_cohorts_validate_program on public.graduation_cohorts;
create trigger graduation_cohorts_validate_program
before insert or update of institution_id, department_id, training_program_id, graduation_year_number
on public.graduation_cohorts
for each row execute function public.validate_graduation_cohort_program();

-- Updated-at trigger for mutable records.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists institutions_set_updated_at on public.institutions;
create trigger institutions_set_updated_at before update on public.institutions
for each row execute function public.set_updated_at();

drop trigger if exists cohorts_set_updated_at on public.graduation_cohorts;
create trigger cohorts_set_updated_at before update on public.graduation_cohorts
for each row execute function public.set_updated_at();

drop trigger if exists thesis_projects_set_updated_at on public.thesis_projects;
create trigger thesis_projects_set_updated_at before update on public.thesis_projects
for each row execute function public.set_updated_at();

-- Enable RLS everywhere before exposing these tables through the API.
alter table public.profiles enable row level security;
alter table public.platform_admins enable row level security;
alter table public.institution_requests enable row level security;
alter table public.institutions enable row level security;
alter table public.institution_memberships enable row level security;
alter table public.membership_permissions enable row level security;
alter table public.departments enable row level security;
alter table public.training_programs enable row level security;
alter table public.specializations enable row level security;
alter table public.academic_years enable row level security;
alter table public.graduation_cohorts enable row level security;
alter table public.academic_groups enable row level security;
alter table public.student_profiles enable row level security;
alter table public.supervisor_profiles enable row level security;
alter table public.cohort_enrollments enable row level security;
alter table public.thesis_projects enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles: users see their own profile; platform admins can administer all profiles.
create policy profiles_select on public.profiles
for select to authenticated
using (id = auth.uid() or public.is_platform_admin());

create policy profiles_insert_self on public.profiles
for insert to authenticated
with check (id = auth.uid());

create policy profiles_update_self on public.profiles
for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy platform_admins_select on public.platform_admins
for select to authenticated
using (user_id = auth.uid() or public.is_platform_admin());

-- Public institution requests are pending-only. Review and approval are central-admin actions.
create policy institution_requests_submit on public.institution_requests
for insert to anon, authenticated
with check (
  status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
);

create policy institution_requests_admin_read on public.institution_requests
for select to authenticated
using (public.is_platform_admin());

create policy institution_requests_admin_update on public.institution_requests
for update to authenticated
using (public.is_platform_admin())
with check (public.is_platform_admin());

create policy institutions_read_scope on public.institutions
for select to authenticated
using (public.is_institution_member(id));

create policy institutions_central_update on public.institutions
for update to authenticated
using (public.is_platform_admin())
with check (public.is_platform_admin());

create policy memberships_read_scope on public.institution_memberships
for select to authenticated
using (
  user_id = auth.uid()
  or public.has_institution_role(institution_id, array['institution_admin'])
);

create policy memberships_central_insert on public.institution_memberships
for insert to authenticated
with check (public.is_platform_admin());

create policy memberships_institution_admin_insert on public.institution_memberships
for insert to authenticated
with check (
  public.has_institution_role(institution_id, array['institution_admin'])
  and role <> 'institution_admin'
);

create policy memberships_central_update on public.institution_memberships
for update to authenticated
using (public.is_platform_admin())
with check (public.is_platform_admin());

create policy memberships_institution_admin_update on public.institution_memberships
for update to authenticated
using (
  public.has_institution_role(institution_id, array['institution_admin'])
  and role <> 'institution_admin'
)
with check (
  public.has_institution_role(institution_id, array['institution_admin'])
  and role <> 'institution_admin'
);

-- Academic structure is visible only inside its institution.
create policy membership_permissions_read_scope on public.membership_permissions
for select to authenticated
using (
  exists (
    select 1
    from public.institution_memberships im
    where im.id = membership_id
      and (
        im.user_id = auth.uid()
        or public.has_institution_role(
          im.institution_id,
          array['institution_admin', 'department_admin'],
          im.department_id
        )
      )
  )
);

create policy membership_permissions_manage on public.membership_permissions
for all to authenticated
using (
  exists (
    select 1
    from public.institution_memberships im
    where im.id = membership_id
      and public.has_institution_role(
        im.institution_id,
        array['institution_admin', 'department_admin'],
        im.department_id
      )
  )
)
with check (
  exists (
    select 1
    from public.institution_memberships im
    where im.id = membership_id
      and public.has_institution_role(
        im.institution_id,
        array['institution_admin', 'department_admin'],
        im.department_id
      )
  )
);

create policy departments_read_scope on public.departments
for select to authenticated
using (public.is_institution_member(institution_id));
create policy departments_manage on public.departments
for all to authenticated
using (public.has_institution_role(institution_id, array['institution_admin']))
with check (public.has_institution_role(institution_id, array['institution_admin']));

create policy training_programs_read_scope on public.training_programs
for select to authenticated
using (public.is_institution_member(institution_id));
create policy training_programs_manage on public.training_programs
for all to authenticated
using (public.has_institution_role(institution_id, array['institution_admin']))
with check (public.has_institution_role(institution_id, array['institution_admin']));

create policy specializations_read_scope on public.specializations
for select to authenticated
using (public.is_institution_member(institution_id));
create policy specializations_manage on public.specializations
for all to authenticated
using (public.has_institution_role(institution_id, array['institution_admin']))
with check (public.has_institution_role(institution_id, array['institution_admin']));

create policy academic_years_read_scope on public.academic_years
for select to authenticated
using (public.is_institution_member(institution_id));
create policy academic_years_manage on public.academic_years
for all to authenticated
using (public.has_institution_role(institution_id, array['institution_admin']))
with check (public.has_institution_role(institution_id, array['institution_admin']));

create policy cohorts_read_scope on public.graduation_cohorts
for select to authenticated
using (public.is_institution_member(institution_id));
create policy cohorts_manage on public.graduation_cohorts
for all to authenticated
using (
  public.has_institution_role(institution_id, array['institution_admin', 'department_admin'], department_id)
)
with check (
  public.has_institution_role(institution_id, array['institution_admin', 'department_admin'], department_id)
);

create policy groups_read_scope on public.academic_groups
for select to authenticated
using (public.is_institution_member(institution_id));
create policy groups_manage on public.academic_groups
for all to authenticated
using (
  public.has_institution_role(institution_id, array['institution_admin'])
  or exists (
    select 1 from public.graduation_cohorts gc
    where gc.id = cohort_id
      and public.has_institution_role(gc.institution_id, array['department_admin'], gc.department_id)
  )
)
with check (
  public.has_institution_role(institution_id, array['institution_admin'])
  or exists (
    select 1 from public.graduation_cohorts gc
    where gc.id = cohort_id
      and public.has_institution_role(gc.institution_id, array['department_admin'], gc.department_id)
  )
);

-- Student and supervisor records remain tenant-scoped.
create policy student_profiles_read_scope on public.student_profiles
for select to authenticated
using (
  user_id = auth.uid()
  or public.has_institution_role(institution_id, array['institution_admin', 'department_admin'], department_id)
);

create policy student_profiles_manage on public.student_profiles
for all to authenticated
using (
  public.has_institution_role(institution_id, array['institution_admin', 'department_admin'], department_id)
)
with check (
  public.has_institution_role(institution_id, array['institution_admin', 'department_admin'], department_id)
);

create policy supervisor_profiles_read_scope on public.supervisor_profiles
for select to authenticated
using (
  user_id = auth.uid()
  or public.has_institution_role(institution_id, array['institution_admin', 'department_admin'], department_id)
);

create policy supervisor_profiles_manage on public.supervisor_profiles
for all to authenticated
using (
  public.has_institution_role(institution_id, array['institution_admin', 'department_admin'], department_id)
)
with check (
  public.has_institution_role(institution_id, array['institution_admin', 'department_admin'], department_id)
);

create policy cohort_enrollments_read_scope on public.cohort_enrollments
for select to authenticated
using (
  exists (
    select 1 from public.graduation_cohorts gc
    where gc.id = cohort_id
      and public.has_institution_role(
        gc.institution_id,
        array['institution_admin', 'department_admin'],
        gc.department_id
      )
  )
  or exists (
    select 1 from public.student_profiles sp
    where sp.id = student_profile_id and sp.user_id = auth.uid()
  )
);

create policy cohort_enrollments_manage on public.cohort_enrollments
for all to authenticated
using (
  exists (
    select 1 from public.graduation_cohorts gc
    where gc.id = cohort_id
      and public.has_institution_role(
        gc.institution_id,
        array['institution_admin', 'department_admin'],
        gc.department_id
      )
  )
)
with check (
  exists (
    select 1 from public.graduation_cohorts gc
    where gc.id = cohort_id
      and public.has_institution_role(
        gc.institution_id,
        array['institution_admin', 'department_admin'],
        gc.department_id
      )
  )
);

create policy thesis_projects_read_scope on public.thesis_projects
for select to authenticated
using (
  exists (
    select 1
    from public.cohort_enrollments ce
    join public.graduation_cohorts gc on gc.id = ce.cohort_id
    where ce.id = enrollment_id
      and public.has_institution_role(
        gc.institution_id,
        array['institution_admin', 'department_admin'],
        gc.department_id
      )
  )
  or exists (
    select 1
    from public.cohort_enrollments ce
    join public.student_profiles sp on sp.id = ce.student_profile_id
    where ce.id = enrollment_id and sp.user_id = auth.uid()
  )
  or public.is_assigned_supervisor(supervisor_profile_id)
);

-- Student edits are exposed through a narrow RPC so students cannot change
-- workflow status, supervisor assignment, institution scope, or enrollment links.
create or replace function public.update_my_thesis_details(
  target_project_id uuid,
  new_title text,
  new_research_field text
)
returns void
language plpgsql
security definer
set search_path = public
as $
begin
  update public.thesis_projects tp
  set title = new_title,
      research_field = new_research_field,
      updated_at = now()
  where tp.id = target_project_id
    and exists (
      select 1
      from public.cohort_enrollments ce
      join public.student_profiles sp on sp.id = ce.student_profile_id
      where ce.id = tp.enrollment_id
        and sp.user_id = auth.uid()
        and sp.institution_id = tp.institution_id
    );

  if not found then
    raise exception 'Project not found or access denied';
  end if;
end;
$;

revoke all on function public.update_my_thesis_details(uuid, text, text) from public;
grant execute on function public.update_my_thesis_details(uuid, text, text) to authenticated;

create policy thesis_projects_staff_update on public.thesis_projects
for update to authenticated
using (
  exists (
    select 1
    from public.cohort_enrollments ce
    join public.graduation_cohorts gc on gc.id = ce.cohort_id
    where ce.id = enrollment_id
      and public.has_institution_role(
        gc.institution_id,
        array['institution_admin', 'department_admin'],
        gc.department_id
      )
  )
  or public.is_assigned_supervisor(supervisor_profile_id)
)
with check (
  exists (
    select 1
    from public.cohort_enrollments ce
    join public.graduation_cohorts gc on gc.id = ce.cohort_id
    where ce.id = enrollment_id
      and public.has_institution_role(
        gc.institution_id,
        array['institution_admin', 'department_admin'],
        gc.department_id
      )
  )
  or public.is_assigned_supervisor(supervisor_profile_id)
);

create policy thesis_projects_create_by_staff on public.thesis_projects
for insert to authenticated
with check (
  exists (
    select 1
    from public.cohort_enrollments ce
    join public.graduation_cohorts gc on gc.id = ce.cohort_id
    where ce.id = enrollment_id
      and gc.institution_id = institution_id
      and public.has_institution_role(
        gc.institution_id,
        array['institution_admin', 'department_admin'],
        gc.department_id
      )
  )
);

-- Audit records are append-only for ordinary users.
create policy audit_logs_read_scope on public.audit_logs
for select to authenticated
using (
  public.is_platform_admin()
  or public.has_institution_role(institution_id, array['institution_admin'])
  or public.has_institution_role(institution_id, array['department_admin'], department_id)
);

create policy audit_logs_insert_scope on public.audit_logs
for insert to authenticated
with check (
  actor_id = auth.uid()
  and (
    public.is_platform_admin()
    or public.is_institution_member(institution_id)
  )
);

-- No UPDATE or DELETE policies are intentionally defined for audit_logs.
