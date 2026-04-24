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
  Saved: "bg-gray-100 text-gray-700",
  Applied: "bg-blue-100 text-blue-700",
  Interviewing: "bg-yellow-100 text-yellow-700",
  Offer: "bg-green-100 text-green-700",
  Accepted: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  Closed: "bg-slate-100 text-slate-600",
};
