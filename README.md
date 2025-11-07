<<<<<<< HEAD
# Farient
=======
# Farient -- Executive Compensation Intelligence (Mock Frontend)

This repository hosts a dark-first Next.js 15 prototype that showcases Farient's seven core capabilities with mocked data. It is meant to align with `docs/prd.md` and demonstrate the UX, navigation, and component architecture for a future production build.

## Getting started

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:3000` with App Router routing enabled. Global state is powered by Zustand and UI primitives come from Tailwind + shadcn/ui.

## Mock data

Structured JSON fixtures live under `data/` (companies, execs, grants, peers, policies, citations, agent runs, etc.). Update or extend these files to change what the mock pages display. `lib/mockSearch.ts` indexes `citations.json` and `policies.json` at build time to fuel global and lakehouse searches without calling external APIs.

## Extension points

- `/app/(app)/filings` -- replace the dropzone, file status cards, and stepper with real ingestion queue events or webhook callbacks.
- `/lib/mockSearch.ts` -- swap the local fuzzy search for a vector store (pgvector, Pinecone, etc.) that enforces cited-span retrieval.
- `/components/ReportPreview.tsx` -- bind the slide cards to real document templates and wire the disabled export buttons to Google Docs/Slides APIs.
- `/store/useMockRuns.ts` -- hydrate agent runs from Supabase/Postgres or LangGraph job logs instead of the static fixture.

## Scripts

- `pnpm dev` -- start Next.js in development mode.
- `pnpm build` -- build for production (runs linting and type checks).
- `pnpm lint` -- run ESLint using Next.js presets.

> Note: this is a pure frontend mock. No ingestion, vector search, or integration calls leave your machine. Replace the mocked hooks above when connecting to live systems.
>>>>>>> 5d544c94 (first commit)
