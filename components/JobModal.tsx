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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? "Edit Job" : "Add Job"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <div className="px-6 py-4 flex flex-col gap-4">
          {/* Row 1 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Job Title *">
              <input
                className={inputCls}
                value={form.job_title}
                onChange={(e) => set("job_title", e.target.value)}
                placeholder="e.g. Senior Engineer"
              />
            </Field>
            <Field label="Company *">
              <input
                className={inputCls}
                value={form.company}
                onChange={(e) => set("company", e.target.value)}
                placeholder="e.g. Atlassian"
              />
            </Field>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Location">
              <input
                className={inputCls}
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                placeholder="e.g. Sydney, AU"
              />
            </Field>
            <Field label="Salary Range">
              <input
                className={inputCls}
                value={form.salary_range}
                onChange={(e) => set("salary_range", e.target.value)}
                placeholder="e.g. $120k–$140k"
              />
            </Field>
          </div>

          {/* Row 3 */}
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
              <label className="flex items-center gap-2 mt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.inbound}
                  onChange={(e) => set("inbound", e.target.checked)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span className="text-sm text-gray-700">Recruiter reached out</span>
              </label>
            </Field>
          </div>

          {/* Row 4 */}
          <Field label="Job URL">
            <input
              className={inputCls}
              value={form.job_url}
              onChange={(e) => set("job_url", e.target.value)}
              placeholder="https://..."
              type="url"
            />
          </Field>

          {/* Row 5 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date Applied">
              <input
                className={inputCls}
                type="date"
                value={form.date_applied}
                onChange={(e) => set("date_applied", e.target.value)}
              />
            </Field>
            <Field label="Follow-up Date">
              <input
                className={inputCls}
                type="date"
                value={form.follow_up_date}
                onChange={(e) => set("follow_up_date", e.target.value)}
              />
            </Field>
          </div>

          {/* Row 6 */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Recruiter Name">
              <input
                className={inputCls}
                value={form.recruiter_name}
                onChange={(e) => set("recruiter_name", e.target.value)}
                placeholder="Jane Smith"
              />
            </Field>
            <Field label="Recruiter Email">
              <input
                className={inputCls}
                type="email"
                value={form.recruiter_email}
                onChange={(e) => set("recruiter_email", e.target.value)}
                placeholder="jane@company.com"
              />
            </Field>
          </div>

          {/* Notes */}
          <Field label="Notes">
            <textarea
              className={`${inputCls} resize-none`}
              rows={3}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Interview notes, contact info, anything useful..."
            />
          </Field>

          {/* Job Description */}
          <Field label="Job Description">
            <textarea
              className={`${inputCls} resize-none`}
              rows={4}
              value={form.job_description}
              onChange={(e) => set("job_description", e.target.value)}
              placeholder="Paste the job description here..."
            />
          </Field>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <div>
            {isEdit && onDelete && (
              confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-600">Are you sure?</span>
                  <button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting ? "Deleting..." : "Yes, delete"}
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800">
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="px-3 py-1.5 text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              )
            )}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.job_title.trim() || !form.company.trim()}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : isEdit ? "Save Changes" : "Add Job"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
