export type JobStatus =
  | "Saved"
  | "Applied"
  | "Interviewing"
  | "Offer"
  | "Accepted"
  | "Rejected"
  | "Closed";

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
  "Saved",
  "Applied",
  "Interviewing",
  "Offer",
  "Accepted",
  "Rejected",
  "Closed",
];

export const JOB_SOURCES: JobSource[] = [
  "LinkedIn",
  "Seek",
  "Indeed",
  "Recruiter",
  "Other",
];

export const STATUS_COLORS: Record<JobStatus, string> = {
  Saved:       "bg-slate-100 text-slate-600 border border-slate-200",
  Applied:     "bg-blue-50 text-blue-700 border border-blue-200",
  Interviewing:"bg-amber-50 text-amber-700 border border-amber-200",
  Offer:       "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Accepted:    "bg-green-50 text-green-700 border border-green-200",
  Rejected:    "bg-red-50 text-red-600 border border-red-200",
  Closed:      "bg-slate-100 text-slate-500 border border-slate-200",
};
