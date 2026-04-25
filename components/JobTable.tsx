"use client";

import { Job } from "@/types/job";
import StatusBadge from "./StatusBadge";

interface Props {
  jobs: Job[];
  onSelect: (job: Job) => void;
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
            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Company</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Role</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Source</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Added</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Follow Up</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
            <th className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">Docs</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {jobs.map((job) => {
            const today = new Date().toISOString().split("T")[0];
            const needsAction =
              job.follow_up_date &&
              job.follow_up_date <= today &&
              !["Rejected", "Accepted", "Closed"].includes(job.status);

            return (
              <tr
                key={job.id}
                onClick={() => onSelect(job)}
                className={`cursor-pointer transition-colors hover:bg-blue-50/60 ${needsAction ? "bg-amber-50/40" : ""}`}
              >
                <td className="px-5 py-3.5 font-semibold text-slate-800">{job.company}</td>
                <td className="px-5 py-3.5 text-slate-600">
                  {job.job_url ? (
                    <a
                      href={job.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {job.job_title}
                    </a>
                  ) : (
                    job.job_title
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-5 py-3.5 text-slate-500">{job.source}</td>
                <td className="px-5 py-3.5 text-slate-400 text-xs">{job.date_added}</td>
                <td className={`px-5 py-3.5 text-xs font-medium ${needsAction ? "text-amber-600" : "text-slate-400"}`}>
                  {job.follow_up_date || "—"}
                </td>
                <td className="px-5 py-3.5">
                  {job.inbound ? (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-violet-50 text-violet-600 border border-violet-200">
                      Inbound
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-500 border border-slate-200">
                      Outbound
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    {job.resume_url && (
                      <a
                        href={job.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Resume"
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                      >
                        CV
                      </a>
                    )}
                    {job.cover_letter_url && (
                      <a
                        href={job.cover_letter_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Cover Letter"
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-50 text-violet-600 border border-violet-200 hover:bg-violet-100"
                      >
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
