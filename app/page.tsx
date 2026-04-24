"use client";

import { useEffect, useState, useMemo } from "react";
import { Job, JobStatus, JobSource, JobFormData, JOB_SOURCES } from "@/types/job";
import JobTable from "@/components/JobTable";
import JobModal from "@/components/JobModal";
import PipelineSummary from "@/components/PipelineSummary";
import ActionRequired from "@/components/ActionRequired";

export default function HomePage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [statusFilter, setStatusFilter] = useState<JobStatus | null>(null);
  const [sourceFilter, setSourceFilter] = useState<JobSource | "All">("All");
  const [inboundFilter, setInboundFilter] = useState<"All" | "Inbound" | "Outbound">("All");
  const [search, setSearch] = useState("");

  async function fetchJobs() {
    try {
      setError(null);
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to load jobs");
      setJobs(await res.json());
    } catch {
      setError("Could not load jobs. Check your Google Sheets configuration.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchJobs(); }, []);

  const filteredJobs = useMemo(() => {
    return jobs
      .filter((j) => !statusFilter || j.status === statusFilter)
      .filter((j) => sourceFilter === "All" || j.source === sourceFilter)
      .filter((j) => {
        if (inboundFilter === "Inbound") return j.inbound;
        if (inboundFilter === "Outbound") return !j.inbound;
        return true;
      })
      .filter((j) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return j.company.toLowerCase().includes(q) || j.job_title.toLowerCase().includes(q);
      });
  }, [jobs, statusFilter, sourceFilter, inboundFilter, search]);

  async function handleAdd(data: JobFormData) {
    const res = await fetch("/api/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const newJob = await res.json();
      setJobs((prev) => [newJob, ...prev]);
      setShowAddModal(false);
    }
  }

  async function handleEdit(data: JobFormData) {
    if (!selectedJob) return;
    const res = await fetch(`/api/jobs/${selectedJob.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const updated = await res.json();
      setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
      setSelectedJob(null);
    }
  }

  async function handleDelete() {
    if (!selectedJob) return;
    const res = await fetch(`/api/jobs/${selectedJob.id}`, { method: "DELETE" });
    if (res.ok) {
      setJobs((prev) => prev.filter((j) => j.id !== selectedJob.id));
      setSelectedJob(null);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Tracker</h1>
            <p className="text-sm text-gray-500 mt-0.5">{jobs.length} job{jobs.length !== 1 ? "s" : ""} tracked</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Add Job
          </button>
        </div>

        {/* Action Required */}
        <div className="mb-4">
          <ActionRequired jobs={jobs} onSelect={setSelectedJob} />
        </div>

        {/* Pipeline Summary */}
        <div className="mb-4">
          <PipelineSummary jobs={jobs} activeFilter={statusFilter} onFilter={setStatusFilter} />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-4">
          <input
            type="text"
            placeholder="Search company or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as JobSource | "All")}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Sources</option>
            {JOB_SOURCES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            value={inboundFilter}
            onChange={(e) => setInboundFilter(e.target.value as typeof inboundFilter)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All">All Types</option>
            <option value="Inbound">Inbound</option>
            <option value="Outbound">Outbound</option>
          </select>
          {(statusFilter || sourceFilter !== "All" || inboundFilter !== "All" || search) && (
            <button
              onClick={() => { setStatusFilter(null); setSourceFilter("All"); setInboundFilter("All"); setSearch(""); }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-16 text-gray-400 text-sm">Loading jobs...</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500 text-sm">{error}</div>
        ) : (
          <JobTable jobs={filteredJobs} onSelect={setSelectedJob} />
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <JobModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAdd}
        />
      )}
      {selectedJob && (
        <JobModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onSave={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </main>
  );
}
