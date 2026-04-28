-- 0001_lock_admin_writes.sql
--
-- Purpose: close anon/public write access to the carnivore schema.
--
-- Background: RLS is already enabled on all four tables. Existing SELECT
-- policies are correct and stay as-is (articles even filters drafts via
-- `published = true`). The problem is four write policies that grant ALL
-- or INSERT/UPDATE to the `public` role with `using true`/`with_check true`.
-- Combined with the anon API key, those policies let anyone on the
-- internet write to the database.
--
-- Admin writes are unaffected: the admin server action uses the
-- service_role key, which bypasses RLS entirely. After this migration,
-- the anon key has SELECT-only access to these tables.
--
-- ⚠️  CONSEQUENCE — read before applying:
-- The "Allow public insert" and "Allow public update" policies on
-- `experts` previously permitted anyone with the anon key to create or
-- modify expert rows. If any public-facing feature (e.g. a contributor
-- submission form, a "claim your profile" flow) writes to `experts`
-- using the anon key, it WILL BREAK after this migration. Such flows
-- must be reworked to go through a server action that uses the
-- service_role key (same pattern as the admin save). Audit before
-- running.

BEGIN;

-- 1. Drop the four broken write policies.
DROP POLICY IF EXISTS "Admin write articles" ON carnivore.articles;
DROP POLICY IF EXISTS "Admin write tests"    ON carnivore.clinical_tests;
DROP POLICY IF EXISTS "Allow public insert"  ON carnivore.experts;
DROP POLICY IF EXISTS "Allow public update"  ON carnivore.experts;

-- 2. No new policies. service_role bypasses RLS, so admin writes
--    continue to work. Anon has no INSERT/UPDATE/DELETE policy on
--    these tables, so any non-SELECT request from the anon key is
--    denied by RLS.

COMMIT;

-- 3. Verification — run this after the COMMIT and confirm that the
--    only rows returned are SELECT policies.
SELECT schemaname, tablename, policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'carnivore'
  AND tablename IN ('articles','experts','clinical_tests','state_directory_content')
ORDER BY tablename, policyname;
