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
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
      <h2 className="text-sm font-semibold text-amber-800 mb-2">
        Action Required ({actionJobs.length})
      </h2>
      <div className="flex flex-col gap-1">
        {actionJobs.map((job) => (
          <button
            key={job.id}
            onClick={() => onSelect(job)}
            className="text-left text-sm text-amber-900 hover:underline"
          >
            {job.company} — {job.job_title}
            <span className="ml-2 text-amber-600 text-xs">Follow up by {job.follow_up_date}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
