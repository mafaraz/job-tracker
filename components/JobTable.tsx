"use client";

import { Job, JobStatus, JobSource, JOB_STATUSES, JOB_SOURCES } from "@/types/job";
import StatusBadge from "./StatusBadge";

interface Props {
  jobs: Job[];
  onSelect: (job: Job) => void;
}

export default function JobTable({ jobs, onSelect }: Props) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        No jobs yet. Click &quot;Add Job&quot; to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left">Company</th>
            <th className="px-4 py-3 text-left">Job Title</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Source</th>
            <th className="px-4 py-3 text-left">Date Added</th>
            <th className="px-4 py-3 text-left">Follow Up</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Docs</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
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
                className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                  needsAction ? "bg-amber-50" : "bg-white"
                }`}
              >
                <td className="px-4 py-3 font-medium text-gray-900">{job.company}</td>
                <td className="px-4 py-3 text-gray-700">
                  {job.job_url ? (
                    <a
                      href={job.job_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="hover:underline text-blue-600"
                    >
                      {job.job_title}
                    </a>
                  ) : (
                    job.job_title
                  )}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={job.status} />
                </td>
                <td className="px-4 py-3 text-gray-500">{job.source}</td>
                <td className="px-4 py-3 text-gray-500">{job.date_added}</td>
                <td className={`px-4 py-3 text-xs ${needsAction ? "text-amber-700 font-medium" : "text-gray-500"}`}>
                  {job.follow_up_date || "—"}
                </td>
                <td className="px-4 py-3">
                  {job.inbound ? (
                    <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs">Inbound</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-xs">Outbound</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {job.resume_url && (
                      <a
                        href={job.resume_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        title="Resume"
                        className="text-blue-500 hover:text-blue-700 text-xs px-1.5 py-0.5 bg-blue-50 rounded"
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
                        className="text-violet-500 hover:text-violet-700 text-xs px-1.5 py-0.5 bg-violet-50 rounded"
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
