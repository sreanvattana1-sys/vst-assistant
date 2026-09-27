import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile, mkdir } from "fs/promises";
import path from "path";
import os from "os";

const STATUS_FILE = path.join(os.tmpdir(), "vst_bot_status.json");

async function readBotStatus(): Promise<boolean> {
  try {
    const data = await readFile(STATUS_FILE, "utf-8");
    const json = JSON.parse(data);
    return json.active !== false; // default to true
  } catch {
    return true; // default ON if file doesn't exist
  }
}

async function writeBotStatus(active: boolean): Promise<void> {
  try {
    await writeFile(STATUS_FILE, JSON.stringify({ active, updatedAt: new Date().toISOString() }), "utf-8");
  } catch {
    // ignore write errors
  }
}

export async function GET() {
  const active = await readBotStatus();
  return NextResponse.json({ active });
}

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    const body = JSON.parse(text);
    const active = body.active !== false; // false only if explicitly false
    await writeBotStatus(active);
    return NextResponse.json({ success: true, active });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
