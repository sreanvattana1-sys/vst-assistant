import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { writeFile, readFile } from "fs/promises";
import path from "path";
import os from "os";

const STATUS_FILE = path.join(os.tmpdir(), "vst_bot_status.json");

async function readBotStatus(): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("bot_settings")
      .select("is_active")
      .eq("id", "default")
      .single();

    if (!error && data) {
      return data.is_active;
    }
  } catch (e) {
    console.error("Supabase readBotStatus error, falling back to local file:", e);
  }

  try {
    const fileData = await readFile(STATUS_FILE, "utf-8");
    const json = JSON.parse(fileData);
    return json.active !== false;
  } catch {
    return true; // default ON
  }
}

async function writeBotStatus(active: boolean): Promise<void> {
  try {
    await supabase
      .from("bot_settings")
      .upsert({ id: "default", is_active: active, updated_at: new Date().toISOString() });
  } catch (e) {
    console.error("Supabase writeBotStatus error:", e);
  }

  try {
    await writeFile(STATUS_FILE, JSON.stringify({ active, updatedAt: new Date().toISOString() }), "utf-8");
  } catch {
    // ignore
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
    const active = body.active !== false;
    await writeBotStatus(active);
    return NextResponse.json({ success: true, active });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
