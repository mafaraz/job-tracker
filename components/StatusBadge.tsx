import { JobStatus, STATUS_COLORS } from "@/types/job";

export default function StatusBadge({ status }: { status: JobStatus }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
}
