import { JobStatus, STATUS_COLORS } from "@/types/job";

export default function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
}
