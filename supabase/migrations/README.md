# Database migrations

The live database is Supabase project **hvcmknveplxksufotmmu** (dashboard name: skilara).

## The rule: migrations are files first, applied second

Two nights of production bugs were caused by **schema drift** — the app querying
columns or tables that were changed manually in the SQL editor and never written
down, or written down in a migration file that was never actually applied. To stop
this, treat this folder as the **single source of truth** for the schema:

1. **Write the change as a new `.sql` file in this folder first.** Do not run
   ad-hoc DDL in the Supabase SQL editor as the primary action.
2. **Apply it with the CLI**, not by pasting into the editor:

   ```bash
   supabase db push          # applies pending migration files to the linked project
   ```

3. **Commit the file** in the same PR as the app code that depends on it.

If you ever must hotfix directly in the SQL editor (incident, CLI unavailable),
immediately add a matching migration file with a header noting it was already
applied live — see `fix_progress_rls_insert_update.sql` and
`fix_schema_drift_audit.sql` for the pattern.

## One-time setup

```bash
npm i -g supabase                 # or: brew install supabase/tap/supabase
supabase login                    # opens a browser for a personal access token
supabase link --project-ref hvcmknveplxksufotmmu   # prompts for the DB password
```

`config.toml` in the parent folder pins the project ref so `link` is one step.

## Everyday workflow

```bash
supabase migration new add_widget_table   # creates a timestamped empty .sql file
# ...edit the generated file...
supabase db push                          # applies it to the live project
git add supabase/migrations && git commit # commit alongside the app change
```

To confirm the repo matches live at any time:

```bash
supabase db diff        # shows any drift between migration files and the live DB
```

## Naming

New migrations are auto-named `<UTC-timestamp>_<slug>.sql` by `supabase migration new`.
Older files here predate the CLI and use ad-hoc names (`create_*`, `fix_*`,
`YYYYMMDD_*`). They are kept as-is for history. **Do not rename them** — the CLI
tracks applied migrations by filename in the `supabase_migrations.schema_migrations`
table, and renaming would make it re-run or lose track of them. New work should use
the CLI-generated names.

## Reconciliation status (2026-07-15)

A full audit compared every migration file here against the live schema. Findings:

- **Applied live but was never in the repo** — now backfilled as files:
  `fix_progress_lesson_id_type.sql`, `fix_progress_rls_insert_update.sql`,
  `fix_user_badges_missing_table.sql`, `fix_schema_drift_audit.sql`.
- **In the repo but had never been applied live** — `20260701_support_tickets.sql`.
  Re-applied as part of `fix_schema_drift_audit.sql`, so repo and live now agree.
- **Legacy orphan tables** still live but unused (`badges`, `jobs`, `employers`,
  `courses`, `lessons`, all 0 rows): left in place, flagged for a cleanup migration
  once confirmed safe to drop.
