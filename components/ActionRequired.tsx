import { Job } from "@/types/job";

interface Props {
  jobs: Job[];
  onSelect: (job: Job) => void;
}

const DONE_STATUSES = ["Rejected", "Accepted", "Closed"];

export default function ActionRequired({ jobs, onSelect }: Props) {
  const today = new Date().toISOString().split("T")[0];
  const actionJobs = jobs.filter(
    (j) =>
      j.follow_up_date &&
      j.follow_up_date <= today &&
      !DONE_STATUSES.includes(j.status)
  );

  if (actionJobs.length === 0) return null;

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-start gap-3">
      <div className="mt-0.5 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0">
        <span className="text-white text-xs font-bold">{actionJobs.length}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-amber-800 mb-1">Follow-up required</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {actionJobs.map((job) => (
            <button
              key={job.id}
              onClick={() => onSelect(job)}
              className="text-sm text-amber-700 hover:text-amber-900 hover:underline"
            >
              {job.company} — {job.job_title}
              <span className="ml-1.5 text-amber-500 text-xs">({job.follow_up_date})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
