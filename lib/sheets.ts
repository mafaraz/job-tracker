import { google } from "googleapis";
import { v4 as uuidv4 } from "uuid";
import { Job, JobFormData } from "@/types/job";

const SHEET_NAME = "Jobs";
const HEADER_ROW = [
  "id",
  "job_title",
  "company",
  "location",
  "source",
  "job_url",
  "status",
  "date_added",
  "date_applied",
  "follow_up_date",
  "deadline",
  "excitement",
  "inbound",
  "recruiter_name",
  "recruiter_email",
  "salary_range",
  "notes",
  "job_description",
  "resume_url",
  "cover_letter_url",
];

const COL_RANGE = `A:T`;
const DATA_RANGE = `${SHEET_NAME}!A2:T`;
const HEADER_RANGE = `${SHEET_NAME}!A1:T1`;

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheets() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

function rowToJob(row: string[]): Job {
  return {
    id:               row[0]  ?? "",
    job_title:        row[1]  ?? "",
    company:          row[2]  ?? "",
    location:         row[3]  ?? "",
    source:           (row[4]  as Job["source"]) ?? "Other",
    job_url:          row[5]  ?? "",
    status:           (row[6]  as Job["status"]) ?? "Bookmarked",
    date_added:       row[7]  ?? "",
    date_applied:     row[8]  ?? "",
    follow_up_date:   row[9]  ?? "",
    deadline:         row[10] ?? "",
    excitement:       parseInt(row[11] ?? "0", 10) || 0,
    inbound:          row[12] === "TRUE",
    recruiter_name:   row[13] ?? "",
    recruiter_email:  row[14] ?? "",
    salary_range:     row[15] ?? "",
    notes:            row[16] ?? "",
    job_description:  row[17] ?? "",
    resume_url:       row[18] ?? "",
    cover_letter_url: row[19] ?? "",
  };
}

function jobToRow(job: Job): string[] {
  return [
    job.id,
    job.job_title,
    job.company,
    job.location,
    job.source,
    job.job_url,
    job.status,
    job.date_added,
    job.date_applied,
    job.follow_up_date,
    job.deadline,
    job.excitement ? String(job.excitement) : "",
    job.inbound ? "TRUE" : "FALSE",
    job.recruiter_name,
    job.recruiter_email,
    job.salary_range,
    job.notes,
    job.job_description,
    job.resume_url,
    job.cover_letter_url,
  ];
}

export async function ensureHeaderRow() {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: HEADER_RANGE,
  });
  const existing = res.data.values?.[0] ?? [];
  const missing = HEADER_ROW.slice(existing.length);
  if (missing.length > 0) {
    const startCol = String.fromCharCode(65 + existing.length);
    await sheets.spreadsheets.values.update({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${SHEET_NAME}!${startCol}1`,
      valueInputOption: "RAW",
      requestBody: { values: [missing] },
    });
  }
}

export async function getAllJobs(): Promise<Job[]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: DATA_RANGE,
  });
  const rows = res.data.values ?? [];
  return rows.filter((r) => r[0]).map(rowToJob);
}

export async function addJob(data: JobFormData): Promise<Job> {
  const job: Job = {
    ...data,
    id: uuidv4(),
    date_added: new Date().toISOString().split("T")[0],
  };
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!${COL_RANGE}`,
    valueInputOption: "RAW",
    requestBody: { values: [jobToRow(job)] },
  });
  return job;
}

export async function updateJob(id: string, data: Partial<JobFormData>): Promise<Job | null> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!${COL_RANGE}`,
  });
  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex((r) => r[0] === id);
  if (rowIndex === -1) return null;

  const existing = rowToJob(rows[rowIndex]);
  const updated: Job = { ...existing, ...data };
  const sheetRow = rowIndex + 1;

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!A${sheetRow}:T${sheetRow}`,
    valueInputOption: "RAW",
    requestBody: { values: [jobToRow(updated)] },
  });
  return updated;
}

export async function deleteJob(id: string): Promise<boolean> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: `${SHEET_NAME}!A:A`,
  });
  const rows = res.data.values ?? [];
  const rowIndex = rows.findIndex((r) => r[0] === id);
  if (rowIndex === -1) return false;

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
  });
  const sheet = spreadsheet.data.sheets?.find(
    (s) => s.properties?.title === SHEET_NAME
  );
  const sheetId = sheet?.properties?.sheetId ?? 0;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: "ROWS",
              startIndex: rowIndex,
              endIndex: rowIndex + 1,
            },
          },
        },
      ],
    },
  });
  return true;
}
