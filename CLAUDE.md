# Job Tracker — CLAUDE.md

## Project Overview

A personal job search tracking web application for Ahmad Faraz. Centralises all job opportunities, pipeline status, recruiter contacts, follow-up dates, and application documents in one place. Data is stored in Google Sheets via a service account. Built to run locally via Docker.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Data Store | Google Sheets API v4 (service account auth) |
| Containerisation | Docker (multi-stage build, standalone output) |
| Runtime | Node.js 20 (Alpine) |
| Package Manager | npm |

**Key dependencies:** `googleapis`, `uuid`

**Environment variables (in `.env.local`, never committed):**
- `GOOGLE_SHEET_ID` — Sheet ID only, not the full URL
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_PRIVATE_KEY` — wrapped in double quotes, `\n` for newlines

## Project Structure

```
app/
  page.tsx                  # Main job board (client component)
  layout.tsx                # Root layout
  globals.css               # Base styles
  api/
    jobs/route.ts           # GET all jobs, POST new job
    jobs/[id]/route.ts      # PATCH update, DELETE job
components/
  JobTable.tsx              # Jobs table with status badges and doc links
  JobModal.tsx              # Add / edit / delete modal (sectioned form)
  PipelineSummary.tsx       # Clickable stat cards per pipeline stage
  ActionRequired.tsx        # Alert bar for overdue follow-ups
  StatusBadge.tsx           # Coloured status pill
lib/
  sheets.ts                 # Google Sheets CRUD (getAllJobs, addJob, updateJob, deleteJob)
types/
  job.ts                    # Job interface, enums, status colours
```

## Features to Build

### Done (MVP)
- [x] Job board table — company, role, status, source, dates, type, docs
- [x] Pipeline summary cards — Saved / Applied / Interviewing / Offer counts
- [x] Action required alerts — overdue follow-up dates
- [x] Add / edit / delete job modal
- [x] Filters — status, source, inbound/outbound, free-text search
- [x] Google Sheets as data store (18 columns, A–R)
- [x] Resume & cover letter — stored as path or URL (text field, no upload)
- [x] Docker containerisation — `docker compose up`
- [x] Professional blue-and-white theme

### Phase 2 — Enhanced Job Board + New Tabs

**Job Board enhancements:**
- [ ] Expand pipeline stages from 7 → 10: Bookmarked, Applying, Applied, Interviewing, Negotiating, Accepted, I Withdrew, Not Selected, No Response, Archived
- [ ] Add `deadline` field (date) and `excitement` field (integer 1–5 star rating) to data model + Sheets columns S and T
- [ ] Rename `salary_range` → `max_salary` in data model and UI
- [ ] Add Deadline, Excitement, Location, Max. Salary, Date Applied as visible table columns
- [ ] Excitement column renders as star rating (read-only in table, picker in modal)
- [ ] Bulk row selection — checkbox per row, "N selected" counter, bulk status change + delete
- [ ] List / Grid view toggle — grid shows job cards with key fields
- [ ] Replace 4 stat cards with horizontal chevron/arrow pipeline flow bar (all 10 stages, clickable)

**New tabs:**
- [ ] People tab (`/people`) — contacts/recruiters, searchable, linked to jobs
- [ ] Companies tab (`/companies`) — company profiles, auto-linked from job entries
- [ ] Compensation tab (`/compensation`) — base, bonus, equity, super per job; total comp calc
- [ ] Offer Analysis tab (`/offers`) — side-by-side comparison of Negotiating/Accepted jobs

### Phase 3 — Chrome Extension
- [ ] One-click "Save Job" button on LinkedIn, Seek.com.au, Indeed
- [ ] Auto-extract: job title, company, location, salary, description, URL
- [ ] Push directly to Google Sheets / app

### Phase 4 — AI & Documents
- [ ] Claude (Anthropic) powered resume tailoring against job description
- [ ] Cover letter generation using Anthropic API
- [ ] Google Drive save for generated documents
- [ ] Gmail integration — send application directly from the app

### Phase 5 — Networking
- [ ] LinkedIn connection request tracker (approval-based, not automated)
- [ ] Company contact log

## Rules

- **Google Sheets is the source of truth.** All reads and writes go through `lib/sheets.ts`. Never bypass it.
- **Never commit `.env.local`.** It is gitignored. Credentials stay local only.
- **No new infrastructure for MVP.** Avoid adding databases, auth providers, or cloud services until Phase 2+.
- **Keep components client-side simple.** `app/page.tsx` owns all state. Components receive props and callbacks only.
- **API routes are server-only.** All Google Sheets and sensitive operations stay in `app/api/`. Never call googleapis from a client component.
- **TypeScript strict.** Run `npx tsc --noEmit` before committing. No type errors allowed.
- **Docker rebuild required** for any code changes when running via `docker compose up --build`.
- **Column order in sheets.ts matters.** `HEADER_ROW`, `rowToJob`, and `jobToRow` must stay in sync. Adding columns always goes at the end. Current last column is R (`cover_letter_url`). Phase 2 adds S (`deadline`) and T (`excitement`).
- **Status badge colours are defined in `types/job.ts`** under `STATUS_COLORS`. Update there, not in components.
