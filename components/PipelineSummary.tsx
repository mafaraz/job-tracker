import { Job, JobStatus } from "@/types/job";

const STAGES: { status: JobStatus; color: string; activeColor: string }[] = [
  { status: "Saved",        color: "text-slate-600",   activeColor: "bg-slate-600" },
  { status: "Applied",      color: "text-blue-600",    activeColor: "bg-blue-600" },
  { status: "Interviewing", color: "text-amber-600",   activeColor: "bg-amber-600" },
  { status: "Offer",        color: "text-emerald-600", activeColor: "bg-emerald-600" },
];

interface Props {
  jobs: Job[];
  activeFilter: JobStatus | null;
  onFilter: (status: JobStatus | null) => void;
}

export default function PipelineSummary({ jobs, activeFilter, onFilter }: Props) {
  return (
    <div className="grid grid-cols-4 gap-4">
      {STAGES.map(({ status, color, activeColor }) => {
        const count = jobs.filter((j) => j.status === status).length;
        const isActive = activeFilter === status;
        return (
          <button
            key={status}
            onClick={() => onFilter(isActive ? null : status)}
            className={`bg-white rounded-xl border p-4 text-left transition-all cursor-pointer ${
              isActive
                ? "border-blue-400 ring-2 ring-blue-100 shadow-sm"
                : "border-slate-200 hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">{status}</p>
            <p className={`text-2xl font-bold ${isActive ? "text-blue-600" : color}`}>{count}</p>
          </button>
        );
      })}
    </div>
  );
}
