"use client";

import { Job, JobStatus, PIPELINE_STAGES } from "@/types/job";

interface Props {
  jobs: Job[];
  activeFilter: JobStatus | null;
  onFilter: (status: JobStatus | null) => void;
}

export default function PipelineSummary({ jobs, activeFilter, onFilter }: Props) {
  return (
    <div className="flex w-full">
      {PIPELINE_STAGES.map((status, index) => {
        const count = jobs.filter((j) => j.status === status).length;
        const isActive = activeFilter === status;
        const isFirst = index === 0;
        const isLast = index === PIPELINE_STAGES.length - 1;

        return (
          <button
            key={status}
            onClick={() => onFilter(isActive ? null : status)}
            className="flex-1 min-w-0 group relative focus:outline-none"
            style={{ zIndex: PIPELINE_STAGES.length - index }}
          >
            <div
              className={`relative flex flex-col items-center justify-center px-2 py-3 h-16 transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-blue-50"
              } ${isFirst ? "border-l" : ""} border-y border-r border-slate-200`}
              style={{
                clipPath: isLast
                  ? isFirst
                    ? "none"
                    : `polygon(14px 0, 100% 0, 100% 100%, 14px 100%, 0 50%)`
                  : isFirst
                  ? `polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%)`
                  : `polygon(14px 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)`,
                marginLeft: isFirst ? 0 : "-1px",
              }}
            >
              <span className={`text-xl font-bold leading-none ${isActive ? "text-white" : count > 0 ? "text-slate-800" : "text-slate-300"}`}>
                {count > 0 ? count : "—"}
              </span>
              <span className={`text-[10px] font-semibold uppercase tracking-wide mt-1 truncate w-full text-center px-4 ${isActive ? "text-blue-100" : "text-slate-400"}`}>
                {status}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
