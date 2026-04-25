"use client";

import { useEffect, useState, useMemo } from "react";
import { Job, JobStatus, JobSource, JobFormData, JOB_SOURCES, JOB_STATUSES } from "@/types/job";
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
      if (!res.ok) throw new Error();
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

  const hasFilters = statusFilter || sourceFilter !== "All" || inboundFilter !== "All" || search;

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
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* Top nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">JT</span>
            </div>
            <span className="font-semibold text-slate-900 text-sm">Job Tracker</span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            <span className="text-base leading-none">+</span>
            Add Job
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6 flex flex-col gap-5">

        {/* Action Required */}
        <ActionRequired jobs={jobs} onSelect={setSelectedJob} />

        {/* Pipeline stats */}
        <PipelineSummary jobs={jobs} activeFilter={statusFilter} onFilter={setStatusFilter} />

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">🔍</span>
            <input
              type="text"
              placeholder="Search company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-52 placeholder:text-slate-300"
            />
          </div>
          <select
            value={statusFilter ?? "All"}
            onChange={(e) => setStatusFilter(e.target.value === "All" ? null : e.target.value as JobStatus)}
            className={selectCls}
          >
            <option value="All">All Statuses</option>
            {JOB_STATUSES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value as JobSource | "All")}
            className={selectCls}
          >
            <option value="All">All Sources</option>
            {JOB_SOURCES.map((s) => <option key={s}>{s}</option>)}
          </select>
          <select
            value={inboundFilter}
            onChange={(e) => setInboundFilter(e.target.value as typeof inboundFilter)}
            className={selectCls}
          >
            <option value="All">All Types</option>
            <option value="Inbound">Inbound</option>
            <option value="Outbound">Outbound</option>
          </select>
          {hasFilters && (
            <button
              onClick={() => { setStatusFilter(null); setSourceFilter("All"); setInboundFilter("All"); setSearch(""); }}
              className="text-xs text-slate-400 hover:text-blue-600 font-medium transition-colors"
            >
              Clear filters
            </button>
          )}
          <span className="ml-auto text-xs text-slate-400 font-medium">
            {filteredJobs.length} of {jobs.length} jobs
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white border border-slate-200 rounded-xl py-20 text-center">
            <p className="text-slate-400 text-sm">Loading jobs...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl py-10 text-center">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        ) : (
          <JobTable jobs={filteredJobs} onSelect={setSelectedJob} />
        )}

      </main>

      {showAddModal && (
        <JobModal onClose={() => setShowAddModal(false)} onSave={handleAdd} />
      )}
      {selectedJob && (
        <JobModal job={selectedJob} onClose={() => setSelectedJob(null)} onSave={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
}

const selectCls = "px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-600";
