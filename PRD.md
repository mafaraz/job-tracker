# Product Requirements Document — Job Tracker

**Version:** 1.1 (MVP)
**Date:** 2026-04-24
**Author:** Ahmad Faraz
**Status:** Draft

---

## 1. Overview

### 1.1 Problem Statement

Job searching across multiple platforms (LinkedIn, Seek.com.au, direct recruiter outreach) makes it easy to lose track of applications, miss follow-ups, and forget where things stand. There is no single place to see the full picture.

### 1.2 Goal

Build a simple, personal web application to centralize job search activity — tracking every opportunity, its pipeline status, follow-up dates, and related contacts — backed by Google Sheets as the data store.

### 1.3 Non-Goals (MVP)

- Chrome extension (Phase 2)
- AI resume/cover letter generation (Phase 3)
- Email/Gmail integration (Phase 3)
- Google Drive document management (Phase 3)
- Networking / LinkedIn outreach tracking (Phase 4)
- Multi-user support
- Mobile app

---

## 2. Users

Single user — the job seeker (Ahmad Faraz). No authentication complexity required beyond Google OAuth to access Google Sheets.

---

## 3. Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js (App Router) | Requested; good balance of simplicity and capability |
| Styling | Tailwind CSS | Fast, utility-first, no separate CSS files |
| Data Store | Google Sheets (via Google Sheets API v4) | Zero infra, human-readable, editable directly |
| Auth | Google OAuth 2.0 (service account or OAuth client) | Required to read/write Google Sheets |
| Containerisation | Docker (multi-stage build) | Consistent runtime, easy to move to any host later |
| Hosting | Local via Docker or `npm run dev` | MVP — no cloud deployment needed yet |

---

## 4. Data Model

Each job is one row in a Google Sheet. Columns:

| Column | Type | Description |
|---|---|---|
| `id` | String (UUID) | Unique identifier |
| `job_title` | String | e.g. "Senior Software Engineer" |
| `company` | String | e.g. "Atlassian" |
| `location` | String | e.g. "Sydney, AU" |
| `source` | Enum | LinkedIn / Seek / Indeed / Recruiter / Other |
| `job_url` | URL | Link to the original listing |
| `status` | Enum | See pipeline stages below |
| `date_added` | Date | When the job was added |
| `date_applied` | Date | When application was submitted (nullable) |
| `follow_up_date` | Date | When to follow up next (nullable) |
| `inbound` | Boolean | TRUE if recruiter reached out first |
| `recruiter_name` | String | Contact name (nullable) |
| `recruiter_email` | String | Contact email (nullable) |
| `salary_range` | String | e.g. "$120k–$140k" (nullable) |
| `notes` | String | Free text — interview notes, context |
| `job_description` | String | Full or partial job description (optional) |

### Pipeline Stages (status)

```
Saved → Applied → Interviewing → Offer → Accepted
                                        → Rejected
                              → Rejected
              → Rejected
```

Displayed values: `Saved` | `Applied` | `Interviewing` | `Offer` | `Accepted` | `Rejected` | `Closed`

---

## 5. Features

### 5.1 Job Board View

**Description:** Main screen showing all tracked jobs.

**Requirements:**
- Display jobs in a table view with columns: Company, Job Title, Status, Source, Date Added, Follow-up Date, Inbound flag
- Color-coded status badges (e.g. green = Offer, red = Rejected, blue = Applied)
- Filter by: Status, Source, Inbound/Outbound
- Sort by: Date Added, Company, Follow-up Date
- Search by: Company name or Job Title (client-side)
- "Needs action" highlight — rows where follow-up date is today or past

### 5.2 Add Job Form

**Description:** Modal or page to manually add a new job.

**Requirements:**
- Fields: Job Title, Company, Location, Source (dropdown), Job URL, Status (default: Saved), Inbound toggle, Recruiter Name, Recruiter Email, Salary Range, Follow-up Date, Notes, Job Description (textarea)
- Required fields: Job Title, Company, Status
- On submit: appends a new row to Google Sheet, assigns UUID, sets Date Added to today
- Validation: URL format for job_url, date format for dates

### 5.3 Edit Job

**Description:** Update any field on an existing job entry.

**Requirements:**
- Click a row to open a detail/edit panel (side drawer or modal)
- All fields editable
- Save updates the corresponding row in Google Sheet (matched by id)
- Status change is prominent — large dropdown or segmented button

### 5.4 Delete Job

**Requirements:**
- Delete button in the edit panel
- Confirmation prompt before deleting
- Removes the row from Google Sheet

### 5.5 Follow-up Dashboard

**Description:** Quick view of jobs that need attention.

**Requirements:**
- Section at the top of the board: "Action Required" — jobs where follow_up_date ≤ today and status is not Rejected/Accepted/Closed
- Count badge on the tab/header
- Clicking a row opens the edit panel

### 5.6 Status Pipeline Summary

**Description:** At-a-glance count per stage.

**Requirements:**
- Row of counters at the top of the board: Saved (n) | Applied (n) | Interviewing (n) | Offer (n)
- Clicking a counter filters the table to that status

### 5.7 Google Sheets Sync

**Requirements:**
- All reads on page load — fetch all rows from the sheet
- All writes on form submit/save — append or update rows via Sheets API
- No real-time sync needed — manual refresh is acceptable for MVP
- Sheet is treated as the source of truth
- First row of the sheet is a header row matching column names above

---

## 6. Pages / Routes

| Route | Description |
|---|---|
| `/` | Job board — main view |
| `/jobs/new` | Add new job (or modal on `/`) |
| `/jobs/[id]` | Job detail / edit (or side drawer on `/`) |

For MVP simplicity, prefer modals/drawers over separate pages.

---

## 7. Google Sheets Setup

- One Google Sheet named **"Job Tracker"**
- One tab named **"Jobs"**
- Service account credentials stored in `.env.local` (never committed to git)
- Environment variables:
  - `GOOGLE_SHEET_ID` — the Sheet ID from the URL
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  - `GOOGLE_PRIVATE_KEY`

---

## 8. Environment & Configuration

```
# .env.local
GOOGLE_SHEET_ID=
GOOGLE_SERVICE_ACCOUNT_EMAIL=
GOOGLE_PRIVATE_KEY=
```

`.env.local` must be listed in `.gitignore`.

---

## 9. Docker Setup

### 9.1 Overview

The app is containerised using a multi-stage Docker build for a minimal production image. Environment variables (Google credentials) are injected at `docker run` time via an env file — never baked into the image.

### 9.2 Files

| File | Purpose |
|---|---|
| `Dockerfile` | Multi-stage build: deps → builder → runner |
| `.dockerignore` | Excludes node_modules, .env files, .next cache |
| `docker-compose.yml` | One-command local run with env file wiring |

### 9.3 Running with Docker

```bash
# Build the image
docker build -t job-tracker .

# Run with env file
docker run -p 3000:3000 --env-file .env.local job-tracker
```

Or with Compose:

```bash
docker compose up
```

### 9.4 Notes

- `next.config.ts` uses `output: 'standalone'` to produce a minimal self-contained build
- The container runs as a non-root user (`nextjs`) for security
- Port `3000` is exposed; map to any host port as needed
- `.env.local` is never copied into the image — always passed at runtime

---

## 10. Out of Scope Decisions (Deferred)

| Feature | Deferred To |
|---|---|
| Chrome extension for auto-extracting jobs | Phase 2 |
| AI-powered resume & cover letter generation (Claude/Anthropic) | Phase 3 |
| Gmail integration — send applications directly | Phase 3 |
| Google Drive — save/link documents to jobs | Phase 3 |
| Networking tracker — LinkedIn connection log | Phase 4 |
| Portal upload tracking | Phase 3 |

---

## 11. Success Criteria (MVP)

- Can add a job in under 30 seconds
- Can see all jobs and their statuses at a glance
- Never miss a follow-up (action-required section is visible on load)
- All data persists in Google Sheets and survives page refresh
- Can run locally with `npm run dev` after one-time Google Sheets setup

---

## 11. Future Phases (Summary)

| Phase | Focus |
|---|---|
| 2 | Chrome extension — one-click save from LinkedIn, Seek, Indeed |
| 3 | AI documents — Claude-powered tailored resume + cover letter, Google Drive save, Gmail send |
| 4 | Networking — track LinkedIn outreach, company contacts |
