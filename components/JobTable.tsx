"use client";

import { Job } from "@/types/job";
import StatusBadge from "./StatusBadge";

interface Props {
  jobs: Job[];
  onSelect: (job: Job) => void;
}

function Stars({ value }: { value: number }) {
  if (!value) return <span className="text-slate-200 text-sm">—</span>;
  return (
    <span className="text-sm leading-none">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < value ? "text-amber-400" : "text-slate-200"}>★</span>
      ))}
    </span>
  );
}

export default function JobTable({ jobs, onSelect }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl py-20 text-center">
        <p className="text-slate-400 text-sm">No jobs found. Click <span className="font-medium text-blue-500">+ Add Job</span> to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className={thCls}>Company</th>
            <th className={thCls}>Role</th>
            <th className={thCls}>Status</th>
            <th className={thCls}>Location</th>
            <th className={thCls}>Max. Salary</th>
            <th className={thCls}>Added</th>
            <th className={thCls}>Deadline</th>
            <th className={thCls}>Follow Up</th>
            <th className={thCls}>Excitement</th>
            <th className={thCls}>Type</th>
            <th className={thCls}>Docs</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {jobs.map((job) => {
            const today = new Date().toISOString().split("T")[0];
            const needsAction =
              job.follow_up_date &&
              job.follow_up_date <= today &&
              !["Not Selected", "Accepted", "Archived", "I Withdrew", "No Response"].includes(job.status);
            const deadlineSoon =
              job.deadline &&
              job.deadline >= today &&
              job.deadline <= new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];
            const deadlinePast = job.deadline && job.deadline < today;

            return (
              <tr
                key={job.id}
                onClick={() => onSelect(job)}
                className={`cursor-pointer transition-colors hover:bg-blue-50/60 ${needsAction ? "bg-amber-50/40" : ""}`}
              >
                <td className="px-5 py-3.5 font-semibold text-slate-800 whitespace-nowrap">{job.company}</td>
                <td className="px-5 py-3.5 text-slate-600 max-w-[200px]">
                  {job.job_url ? (
                    <a href={job.job_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-blue-600 hover:underline line-clamp-1">
                      {job.job_title}
                    </a>
                  ) : (
                    <span className="line-clamp-1">{job.job_title}</span>
                  )}
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{job.location || "—"}</td>
                <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{job.salary_range || "—"}</td>
                <td className="px-5 py-3.5 text-slate-400 text-xs whitespace-nowrap">{job.date_added}</td>
                <td className={`px-5 py-3.5 text-xs font-medium whitespace-nowrap ${deadlinePast ? "text-red-500" : deadlineSoon ? "text-amber-600" : "text-slate-400"}`}>
                  {job.deadline || "—"}
                </td>
                <td className={`px-5 py-3.5 text-xs font-medium whitespace-nowrap ${needsAction ? "text-amber-600" : "text-slate-400"}`}>
                  {job.follow_up_date || "—"}
                </td>
                <td className="px-5 py-3.5">
                  <Stars value={job.excitement} />
                </td>
                <td className="px-5 py-3.5 whitespace-nowrap">
                  {job.inbound ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-violet-50 text-violet-600 border border-violet-200">Inbound</span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200">Outbound</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    {job.resume_url && (
                      <a href={job.resume_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} title="Resume"
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100">
                        CV
                      </a>
                    )}
                    {job.cover_letter_url && (
                      <a href={job.cover_letter_url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} title="Cover Letter"
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-50 text-violet-600 border border-violet-200 hover:bg-violet-100">
                        CL
                      </a>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thCls = "px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap";
