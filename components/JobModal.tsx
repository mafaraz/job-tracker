"use client";

import { useState, useEffect } from "react";
import { Job, JobFormData, JOB_STATUSES, JOB_SOURCES } from "@/types/job";

interface Props {
  job?: Job | null;
  onClose: () => void;
  onSave: (data: JobFormData) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const EMPTY: JobFormData = {
  job_title: "",
  company: "",
  location: "",
  source: "LinkedIn",
  job_url: "",
  status: "Saved",
  date_applied: "",
  follow_up_date: "",
  inbound: false,
  recruiter_name: "",
  recruiter_email: "",
  salary_range: "",
  notes: "",
  job_description: "",
  resume_url: "",
  cover_letter_url: "",
};

export default function JobModal({ job, onClose, onSave, onDelete }: Props) {
  const [form, setForm] = useState<JobFormData>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (job) {
      const { id, date_added, ...rest } = job;
      setForm(rest);
    } else {
      setForm(EMPTY);
    }
  }, [job]);

  function set<K extends keyof JobFormData>(key: K, value: JobFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave() {
    if (!form.job_title.trim() || !form.company.trim()) return;
    setSaving(true);
    await onSave(form);
    setSaving(false);
  }

  async function handleDelete() {
    if (!onDelete) return;
    setDeleting(true);
    await onDelete();
    setDeleting(false);
  }

  const isEdit = !!job;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {isEdit ? "Edit Job" : "Add New Job"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isEdit ? "Update the details for this application" : "Track a new job application"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="px-7 py-5 flex flex-col gap-5">

          {/* Section: Role */}
          <Section title="Role">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Job Title *">
                <input className={inputCls} value={form.job_title} onChange={(e) => set("job_title", e.target.value)} placeholder="e.g. Senior Engineer" />
              </Field>
              <Field label="Company *">
                <input className={inputCls} value={form.company} onChange={(e) => set("company", e.target.value)} placeholder="e.g. Atlassian" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Field label="Location">
                <input className={inputCls} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="e.g. Sydney, AU" />
              </Field>
              <Field label="Salary Range">
                <input className={inputCls} value={form.salary_range} onChange={(e) => set("salary_range", e.target.value)} placeholder="e.g. $120k–$140k" />
              </Field>
            </div>
            <div className="mt-3">
              <Field label="Job URL">
                <input className={inputCls} type="url" value={form.job_url} onChange={(e) => set("job_url", e.target.value)} placeholder="https://..." />
              </Field>
            </div>
          </Section>

          {/* Section: Status */}
          <Section title="Application">
            <div className="grid grid-cols-3 gap-4">
              <Field label="Status">
                <select className={inputCls} value={form.status} onChange={(e) => set("status", e.target.value as JobFormData["status"])}>
                  {JOB_STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Source">
                <select className={inputCls} value={form.source} onChange={(e) => set("source", e.target.value as JobFormData["source"])}>
                  {JOB_SOURCES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Type">
                <label className="flex items-center gap-2 h-9 mt-1 cursor-pointer">
                  <input type="checkbox" checked={form.inbound} onChange={(e) => set("inbound", e.target.checked)} className="w-4 h-4 accent-blue-600 rounded" />
                  <span className="text-sm text-slate-600">Inbound</span>
                </label>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Field label="Date Applied">
                <input className={inputCls} type="date" value={form.date_applied} onChange={(e) => set("date_applied", e.target.value)} />
              </Field>
              <Field label="Follow-up Date">
                <input className={inputCls} type="date" value={form.follow_up_date} onChange={(e) => set("follow_up_date", e.target.value)} />
              </Field>
            </div>
          </Section>

          {/* Section: Recruiter */}
          <Section title="Recruiter">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name">
                <input className={inputCls} value={form.recruiter_name} onChange={(e) => set("recruiter_name", e.target.value)} placeholder="Jane Smith" />
              </Field>
              <Field label="Email">
                <input className={inputCls} type="email" value={form.recruiter_email} onChange={(e) => set("recruiter_email", e.target.value)} placeholder="jane@company.com" />
              </Field>
            </div>
          </Section>

          {/* Section: Documents */}
          <Section title="Documents">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Resume Path / URL">
                <input className={inputCls} value={form.resume_url} onChange={(e) => set("resume_url", e.target.value)} placeholder="Path or URL to resume" />
              </Field>
              <Field label="Cover Letter Path / URL">
                <input className={inputCls} value={form.cover_letter_url} onChange={(e) => set("cover_letter_url", e.target.value)} placeholder="Path or URL to cover letter" />
              </Field>
            </div>
          </Section>

          {/* Section: Notes */}
          <Section title="Notes">
            <Field label="Notes">
              <textarea className={`${inputCls} resize-none`} rows={3} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Interview notes, contact info, anything useful..." />
            </Field>
            <div className="mt-3">
              <Field label="Job Description">
                <textarea className={`${inputCls} resize-none`} rows={4} value={form.job_description} onChange={(e) => set("job_description", e.target.value)} placeholder="Paste the job description here..." />
              </Field>
            </div>
          </Section>

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-4 border-t border-slate-100 bg-slate-50/70 rounded-b-2xl">
          <div>
            {isEdit && onDelete && (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-600 font-medium">Delete this job?</span>
                  <button onClick={handleDelete} disabled={deleting} className="px-3 py-1.5 text-xs font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                    {deleting ? "Deleting..." : "Yes, delete"}
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-slate-700">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmDelete(true)} className="text-sm text-red-400 hover:text-red-600 font-medium transition-colors">
                  Delete
                </button>
              )
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.job_title.trim() || !form.company.trim()}
              className="px-5 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">{title}</p>
      <div className="bg-slate-50/60 border border-slate-100 rounded-xl px-4 py-4">
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-slate-500">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow";
