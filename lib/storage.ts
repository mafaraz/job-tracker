import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOADS_ROOT = "/app/uploads";

function safeCompanyName(company: string): string {
  return company.replace(/[<>:"/\\|?*]/g, "").trim() || "Unknown";
}

export async function saveFile(
  buffer: Buffer,
  company: string,
  originalName: string
): Promise<string> {
  const companyDir = safeCompanyName(company);
  const ext = path.extname(originalName);
  const base = path.basename(originalName, ext).replace(/\s+/g, "_");
  const timestamp = new Date().toISOString().slice(0, 10);
  const fileName = `${base}_${timestamp}${ext}`;

  const dir = path.join(UPLOADS_ROOT, companyDir);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, fileName), buffer);

  return `/api/files/${encodeURIComponent(companyDir)}/${encodeURIComponent(fileName)}`;
}
