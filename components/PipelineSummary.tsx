import { Job, JobStatus } from "@/types/job";

const TRACKED: JobStatus[] = ["Saved", "Applied", "Interviewing", "Offer"];

interface Props {
  jobs: Job[];
  activeFilter: JobStatus | null;
  onFilter: (status: JobStatus | null) => void;
}

export default function PipelineSummary({ jobs, activeFilter, onFilter }: Props) {
  return (
    <div className="flex gap-3 flex-wrap">
      {TRACKED.map((status) => {
        const count = jobs.filter((j) => j.status === status).length;
        const isActive = activeFilter === status;
        return (
          <button
            key={status}
            onClick={() => onFilter(isActive ? null : status)}
            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
              isActive
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-blue-400"
            }`}
          >
            {status}
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${isActive ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}>
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
