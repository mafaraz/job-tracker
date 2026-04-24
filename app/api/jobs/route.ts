import { NextResponse } from "next/server";
import { getAllJobs, addJob, ensureHeaderRow } from "@/lib/sheets";

export async function GET() {
  try {
    await ensureHeaderRow();
    const jobs = await getAllJobs();
    return NextResponse.json(jobs);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const job = await addJob(data);
    return NextResponse.json(job, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to add job" }, { status: 500 });
  }
}
