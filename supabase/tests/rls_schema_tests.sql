-- Leeder schema-level security tests (pgTAP)
-- Run only after applying the foundation migration to a disposable test database.
-- This verifies schema guards and grants; it does not replace JWT-based tenant-isolation tests.
begin;

create extension if not exists pgtap with schema extensions;

select extensions.plan(36);

-- Every core table must exist and have RLS enabled.
select extensions.ok(
  (select c.relrowsecurity
   from pg_class c join pg_namespace n on n.oid=c.relnamespace
   where n.nspname='public' and c.relname='profiles'),
  'profiles has RLS'
);
select extensions.ok((select relrowsecurity from pg_class where oid='public.platform_admins'::regclass), 'platform_admins has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.institution_requests'::regclass), 'institution_requests has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.institutions'::regclass), 'institutions has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.institution_memberships'::regclass), 'institution_memberships has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.membership_permissions'::regclass), 'membership_permissions has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.departments'::regclass), 'departments has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.training_programs'::regclass), 'training_programs has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.specializations'::regclass), 'specializations has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.academic_years'::regclass), 'academic_years has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.graduation_cohorts'::regclass), 'graduation_cohorts has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.academic_groups'::regclass), 'academic_groups has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.student_profiles'::regclass), 'student_profiles has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.supervisor_profiles'::regclass), 'supervisor_profiles has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.cohort_enrollments'::regclass), 'cohort_enrollments has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.thesis_projects'::regclass), 'thesis_projects has RLS');
select extensions.ok((select relrowsecurity from pg_class where oid='public.audit_logs'::regclass), 'audit_logs has RLS');

-- Client privilege boundaries.
select extensions.ok(not has_table_privilege('authenticated','public.student_profiles','UPDATE'), 'student_profiles has no table-wide UPDATE grant');
select extensions.ok(not has_column_privilege('authenticated','public.student_profiles','user_id','UPDATE'), 'authenticated cannot update student_profiles.user_id');
select extensions.ok(not has_column_privilege('authenticated','public.student_profiles','user_id','INSERT'), 'authenticated cannot insert student_profiles.user_id');
select extensions.ok(has_column_privilege('authenticated','public.student_profiles','student_number','INSERT'), 'approved student import column is insertable');
select extensions.ok(has_column_privilege('authenticated','public.student_profiles','student_number','UPDATE'), 'approved student record columns are updatable');
select extensions.ok(not has_table_privilege('authenticated','public.thesis_projects','UPDATE'), 'thesis_projects has no table-wide UPDATE grant');
select extensions.ok(has_column_privilege('authenticated','public.thesis_projects','title','UPDATE'), 'thesis title is an approved update column');
select extensions.ok(not has_column_privilege('authenticated','public.thesis_projects','status','UPDATE'), 'thesis status is not directly updateable');
select extensions.ok(not has_table_privilege('authenticated','public.audit_logs','INSERT'), 'clients cannot insert audit logs');
select extensions.ok(not has_table_privilege('authenticated','public.audit_logs','UPDATE'), 'clients cannot update audit logs');
select extensions.ok(not has_table_privilege('authenticated','public.institution_requests','INSERT'), 'clients cannot directly submit institution requests');

-- Only intended RPCs are executable by authenticated clients.
select extensions.ok(has_function_privilege('authenticated','public.claim_my_student_record(text)','EXECUTE'), 'student claim RPC is executable by authenticated users');
select extensions.ok(not has_function_privilege('anon','public.claim_my_student_record(text)','EXECUTE'), 'anonymous users cannot claim student records');
select extensions.ok(has_function_privilege('authenticated','public.update_my_thesis_details(uuid,text,text)','EXECUTE'), 'student thesis-details RPC is executable by authenticated users');
select extensions.ok(not has_function_privilege('authenticated','public.validate_thesis_supervisor_assignment()','EXECUTE'), 'trigger function is not executable by authenticated clients');

-- Critical integrity triggers must be installed.
select extensions.ok(exists(select 1 from pg_trigger where tgrelid='public.cohort_enrollments'::regclass and tgname='cohort_enrollments_validate_scope' and not tgisinternal), 'cohort enrollment scope trigger exists');
select extensions.ok(exists(select 1 from pg_trigger where tgrelid='public.graduation_cohorts'::regclass and tgname='graduation_cohorts_validate_program' and not tgisinternal), 'graduation year validation trigger exists');
select extensions.ok(exists(select 1 from pg_trigger where tgrelid='public.graduation_cohorts'::regclass and tgname='graduation_cohorts_validate_state' and not tgisinternal), 'cohort lifecycle trigger exists');
select extensions.ok(exists(select 1 from pg_trigger where tgrelid='public.thesis_projects'::regclass and tgname='thesis_projects_validate_supervisor' and not tgisinternal), 'supervisor assignment validation trigger exists');

select * from extensions.finish();
rollback;
