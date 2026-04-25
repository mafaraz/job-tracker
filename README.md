# Job Tracker

A personal job search tracking app built with Next.js and Google Sheets. Track applications, pipeline stages, follow-ups, recruiter contacts, and documents in one place.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Auth:** Clerk
- **Data Store:** Google Sheets API v4 (service account)
- **Deployment:** Vercel / Docker

## Features

- 10-stage pipeline: Bookmarked → Applying → Applied → Interviewing → Negotiating → Accepted / Withdrew / Not Selected
- Chevron pipeline bar with per-stage counts
- Add / edit / delete jobs with a full-featured modal
- Deadline tracking with colour-coded urgency
- Excitement rating (1–5 stars)
- Follow-up alerts for overdue applications
- Filters: status, source, inbound/outbound, free-text search
- Resume and cover letter links per job
- Recruiter contact details

## Local Development

### Prerequisites

- Node.js 20+
- A Google Cloud service account with Sheets API enabled
- A Clerk application

### Setup

1. Clone the repo and install dependencies:
   ```bash
   git clone https://github.com/mafaraz/job-tracker.git
   cd job-tracker
   npm install
   ```

2. Copy the example env file and fill in your credentials:
   ```bash
   cp .env.local.example .env.local
   ```

   | Variable | Description |
   |---|---|
   | `GOOGLE_SHEET_ID` | ID from the Google Sheets URL (between `/d/` and `/edit`) |
   | `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service account email from Google Cloud |
   | `GOOGLE_PRIVATE_KEY` | Private key wrapped in double quotes, `\n` for newlines |
   | `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (test key for local) |
   | `CLERK_SECRET_KEY` | Clerk secret key (test key for local) |

3. Run the dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

## Docker

```bash
docker compose up --build
```

App runs at [http://localhost:3000](http://localhost:3000). Set env vars in `.env.local` before building.

## Vercel Deployment

1. Import the repo on [vercel.com](https://vercel.com)
2. Add all 5 environment variables in **Project Settings → Environment Variables** (use live Clerk keys)
3. Deploy

## Google Sheets Setup

The app auto-creates headers on first run. Share your Google Sheet with the service account email (Editor access). The sheet uses columns A–T:

`id, job_title, company, location, source, job_url, status, date_added, date_applied, follow_up_date, deadline, excitement, inbound, recruiter_name, recruiter_email, salary_range, notes, job_description, resume_url, cover_letter_url`
