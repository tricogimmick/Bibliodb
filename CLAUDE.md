# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Bibliodb is a personal bibliographic database manager (書誌情報管理システム) — a SvelteKit app for cataloguing books/magazines (prints), the works published in them, their authors/creators (persons), publishers, brands, series, movies, and curated book lists. UI labels are English, but code comments and domain vocabulary are Japanese.

## Commands

```bash
npm run dev          # start dev server
npm run build         # production build
npm run preview       # preview production build
npm run check          # svelte-kit sync + svelte-check (type checking)
npm run check:watch    # type checking in watch mode
npm run format          # prettier --write .
npm run lint             # prettier --check . && eslint .
```

There is no test suite configured in this repo.

## Required environment

The app reads its SQLite database path from `BIBLIODB_PATH` (via `$env/dynamic/private`), e.g. in a `.env` file:

```
BIBLIODB_PATH=/path/to/bibliodb.sqlite3
```

The `ddl/*.sql` files define the schema (one file per table) but there is no migration tooling — a database file must already exist at that path with the tables created from `ddl/`.

## Architecture

### Data flow: two parallel access paths

Every entity (works, prints, persons, publishers, brands, series, movies, book lists) is read through **both**:

1. **`+page.server.ts` `load` functions** — used for initial SSR page render (list pages, detail pages, edit-form pre-fill). These open a `sqlite3.Database`, query, and `db.close()` in a `finally` block.
2. **`src/routes/api/*/+server.ts` REST endpoints** (`GET`/`POST`/`PUT`) — used by client-side Svelte components (editors) for creating/updating records via `fetch`, and for dynamic lookups (e.g. `GET /api/works?pid=<personId>`). Each handler also opens its own `Database` connection and closes it in `finally`.

There is no shared DB connection/pool — every load function and API handler opens and closes its own `sqlite3.Database(dbPath)` instance per request. Follow this pattern for new endpoints rather than introducing a shared connection.

### `src/lib/common.ts`

Central place for reusable DB helpers:
- `runSql`, `getRow<T>`, `getAllRows<T>` — thin promise wrappers around `sqlite3`'s callback API.
- `getAll*` / `get*` convenience functions for each master table (publishers, brands, series, persons, works, prints, movies, book lists).
- `getAllRelatedPersons/Links/Series/Works/Tags` — generic helpers for the polymorphic "related_*" tables (see below).

Route-specific queries (joins, detail-page aggregation) live inline in the relevant `+page.server.ts` / `+server.ts` file rather than in `common.ts`.

### Polymorphic relation tables

Several tables relate arbitrary entities to each other using a `(relatedType, relatedId)` pair instead of dedicated foreign keys, where `relatedType` is a string like `'WORK'`, `'PRINT'`, etc.:

- `related_persons` — links a person to an entity with a `role` (author, illustrator, ...) and `orderNo` for display order.
- `related_links` — image/external links (`linkType`: `'IMG' | 'LINK'`) attached to an entity.
- `related_series` — links a series to an entity; `isMedia` distinguishes "published media" series vs. "title/franchise" series.
- `related_works` — links a work to another entity via a `subType` (relationship kind).
- `related_tags` — many-to-many between an entity and `tags` (tags are get-or-create by name in `runSql`/`getRow` pairs, see `appendWork`/`updateWork` in `api/works/+server.ts`).

When adding a new relatable entity type, follow this pattern: give it its own `relatedType` string constant, and reuse the existing `related_*` tables rather than creating new join tables.

### Route structure (per entity, e.g. `works`)

- `works/+page.server.ts` + `+page.svelte` — list view.
- `works/[id]/+page.server.ts` + `+page.svelte` — detail/read view, aggregates the entity plus all its related_* rows into a single "Detail" display type (see `WorkDetailType` in `works/[id]/+page.server.ts`).
- `works/[id]/edit/+page.server.ts` + `+page.svelte` — edit form, loads lookups needed for selects (e.g. all persons/series) plus the current entity's related rows.
- `works/append/+page.server.ts` + `+page.svelte` — create form, loads the same lookups as edit but with no pre-filled entity.
- `api/works/+server.ts` — `POST` (create), `PUT` (update), `GET` (list, optionally filtered) — called from the Svelte editor components.

Simpler master entities without relations (publishers, brands) omit the `edit/` route and edit inline instead — check the existing route folder for a given entity before assuming the full pattern applies.

### Components (`src/components/`)

One `*Editor.svelte` component per entity (`WorkEditor`, `PrintEditor`, `PersonEditor`, etc.) encapsulates the form UI and calls the matching `api/*` endpoint. Shared sub-editors (`RelatedPersonEditor`, `RelatedLinkEditor`, `RelatedSeriesEditor`, `RelatedWorksEditor`, `TagEditor`) are embedded inside the entity editors to manage the polymorphic relation rows described above. `WorksSelector.svelte` + `src/lib/workSelectorLib.ts` implement a cross-page "pick a work" dialog opened via a `work-selector-dialog-open` custom DOM event.

### Types (`src/types/`)

One file per entity/relation mirroring the DDL table shape (e.g. `work.ts` mirrors `ddl/works.sql`). `result.ts` defines the generic `ResultType<T> = { ok: boolean, data: T | null | string }` used as the JSON envelope returned by all `api/*` POST/PUT handlers.

## Conventions

- Formatting: tabs, single quotes, no trailing commas, 100-char width (see `.prettierrc`). Run `npm run format` before committing.
- SQL string literals use camelCase column names matching the DDL exactly, including bracket-quoted reserved words like `[index]` (the `index` column on `works`, `series`, `persons`).
- Always close the `sqlite3.Database` connection in a `finally` block, in both `load` functions and API route handlers.
