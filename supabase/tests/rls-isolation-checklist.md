# Leeder RLS and Tenant-Isolation Test Plan

Status: prepared for execution after the foundation migration is applied to a disposable Supabase test project. These checks have **not** been executed against PostgreSQL yet.

## Test environment

Create two isolated test institutions (Institution A and Institution B), each with:
- One institution administrator.
- Two departments (A1/A2 or B1/B2).
- One department administrator in each department.
- One department assistant with a limited permission set.
- One supervisor and one student in each department.
- One active academic year, training program, specialization, graduation cohort, group, enrollment, and thesis project.

Use separate test identities for every role. Do not use real student records, real institutional email addresses, or production credentials. Keep all test records disposable.

## Read-isolation tests

| Actor | Action | Expected result |
|---|---|---|
| Student A1 | Read own profile, enrollment, and thesis | Own records visible |
| Student A1 | Read another student in A1 | No row returned |
| Student A1 | Read any record in Institution B | No row returned |
| Supervisor A1 | Read a student and thesis assigned to them | Assigned records visible |
| Supervisor A1 | Read an unassigned student in A1 | No row returned |
| Supervisor A1 | Read any record in Institution B | No row returned |
| Department admin A1 | Read records in A1 | A1 records visible |
| Department admin A1 | Read records in A2 | No A2 records returned |
| Institution admin A | Read records in A1 and A2 | Both departments visible |
| Institution admin A | Read Institution B | No B records returned |
| Platform admin | Read institutions and permitted audit/request records | Platform-wide access as designed |

## Write and privilege-escalation tests

1. A student cannot insert or update the user_id field in student_profiles directly.
2. A student cannot change thesis status, supervisor assignment, enrollment, or institution scope.
3. A student can change only thesis title/research field through update_my_thesis_details.
4. A supervisor cannot assign themselves to another thesis or change supervisor assignment.
5. A supervisor cannot update thesis status unless a separately authorized workflow RPC is implemented.
6. A department admin in A1 cannot create or move a cohort into A2.
7. A department admin in A1 cannot enroll a student from B into an A1 cohort.
8. An enrollment cannot connect a student, cohort, or academic group from different institutions.
9. A supervisor assignment to a different institution or department must fail.
10. An institution admin in A cannot create an institution-admin membership or modify Institution B memberships.
11. A non-admin cannot insert, update, or delete audit log rows.
12. An authenticated or anonymous client cannot insert an institution request directly; the trusted Edge Function path must be used.
13. A department assistant receives only explicitly granted actions; ungranted actions must fail.
14. An inactive membership or inactive supervisor must lose access immediately.

## Academic integrity and lifecycle tests

- A cohort cannot open unless confirmed_by and confirmed_at are present.
- A newly inserted cohort must start as draft.
- A cohort's graduation year must equal the configured graduation year of its training program.
- A student whose department, program, or specialization differs from the cohort cannot be enrolled.
- Registration with status registered must fail unless the cohort is open and eligibility has been confirmed.
- A group from another cohort cannot be assigned to an enrollment.

## Execution protocol

1. Apply the migration only to a disposable Supabase test project, never the live project.
2. Create the test identities and academic fixtures.
3. Execute each check while authenticated as the relevant test identity (not as postgres or service_role).
4. Verify both positive and negative cases. For negative cases, confirm the operation is denied or returns no rows.
5. Save results, SQL errors, and policy traces. Fix failures before considering the migration for production.
6. Delete the disposable test project or remove all fixtures after the test.

## Current known limitations

- This is a test plan, not an executed test suite.
- Supervisor workflow actions (assignment, approval, status transitions) still need dedicated, narrowly authorized RPCs.
- Department-assistant permissions need to be connected to actual authorization checks before they can be treated as enforced permissions.
- Cross-table updates must be tested for stale academic relationships (for example, changing a student's program after enrollment).
