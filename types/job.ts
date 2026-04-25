export type JobStatus =
  | "Bookmarked"
  | "Applying"
  | "Applied"
  | "Interviewing"
  | "Negotiating"
  | "Accepted"
  | "I Withdrew"
  | "Not Selected"
  | "No Response"
  | "Archived";

export type JobSource =
  | "LinkedIn"
  | "Seek"
  | "Indeed"
  | "Recruiter"
  | "Other";

export interface Job {
  id: string;
  job_title: string;
  company: string;
  location: string;
  source: JobSource;
  job_url: string;
  status: JobStatus;
  date_added: string;
  date_applied: string;
  follow_up_date: string;
  deadline: string;
  excitement: number;
  inbound: boolean;
  recruiter_name: string;
  recruiter_email: string;
  salary_range: string;
  notes: string;
  job_description: string;
  resume_url: string;
  cover_letter_url: string;
}

export type JobFormData = Omit<Job, "id" | "date_added">;

export const JOB_STATUSES: JobStatus[] = [
  "Bookmarked",
  "Applying",
  "Applied",
  "Interviewing",
  "Negotiating",
  "Accepted",
  "I Withdrew",
  "Not Selected",
  "No Response",
  "Archived",
];

// Stages shown in the pipeline flow bar (forward-progression only)
export const PIPELINE_STAGES: JobStatus[] = [
  "Bookmarked",
  "Applying",
  "Applied",
  "Interviewing",
  "Negotiating",
  "Accepted",
];

// Terminal/exit statuses not shown in the pipeline bar
export const TERMINAL_STATUSES: JobStatus[] = [
  "I Withdrew",
  "Not Selected",
  "No Response",
  "Archived",
];

export const JOB_SOURCES: JobSource[] = [
  "LinkedIn",
  "Seek",
  "Indeed",
  "Recruiter",
  "Other",
];

export const STATUS_COLORS: Record<JobStatus, string> = {
  Bookmarked:    "bg-slate-100 text-slate-600 border border-slate-200",
  Applying:      "bg-sky-50 text-sky-700 border border-sky-200",
  Applied:       "bg-blue-50 text-blue-700 border border-blue-200",
  Interviewing:  "bg-amber-50 text-amber-700 border border-amber-200",
  Negotiating:   "bg-violet-50 text-violet-700 border border-violet-200",
  Accepted:      "bg-emerald-50 text-emerald-700 border border-emerald-200",
  "I Withdrew":  "bg-orange-50 text-orange-600 border border-orange-200",
  "Not Selected":"bg-red-50 text-red-600 border border-red-200",
  "No Response": "bg-rose-50 text-rose-500 border border-rose-200",
  Archived:      "bg-slate-100 text-slate-400 border border-slate-200",
};
