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

export async function GET(req: NextRequest) {
  const masterActive = await readBotStatus();

  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");
  const memberName = searchParams.get("memberName");

  let isLockedByAdmin = false;
  let memberBotEnabled = true;

  if (memberId || memberName) {
    try {
      const { data } = await supabase
        .from("bot_settings")
        .select("dm_template")
        .eq("id", "vst_members")
        .maybeSingle();

      if (data?.dm_template) {
        const members = JSON.parse(data.dm_template);
        if (Array.isArray(members)) {
          const m = members.find((x: any) =>
            (memberId && (x.id === memberId || String(x.id) === String(memberId))) ||
            (memberName && x.name?.toLowerCase() === memberName.toLowerCase()) ||
            (memberName && x.name?.toLowerCase().includes("sam") && memberName.toLowerCase().includes("sam"))
          );
          if (m) {
            memberBotEnabled = m.botEnabled !== false && m.status !== "Disabled";
            isLockedByAdmin = !memberBotEnabled;
          }
        }
      }
    } catch (e) {
      console.error("Error reading member bot status:", e);
    }
  }

  return NextResponse.json({
    active: masterActive,
    isLockedByAdmin,
    memberBotEnabled,
  });
}

export async function POST(req: NextRequest) {
  try {
    const text = await req.text();
    const body = JSON.parse(text);
    const { active, isAdmin, memberId, memberName } = body;

    // If Member tries to toggle bot status:
    if (!isAdmin) {
      // Check if Member is locked by Admin
      const { data } = await supabase
        .from("bot_settings")
        .select("dm_template")
        .eq("id", "vst_members")
        .maybeSingle();

      if (data?.dm_template) {
        try {
          const members = JSON.parse(data.dm_template);
          if (Array.isArray(members)) {
            const m = members.find((x: any) =>
              (memberId && (x.id === memberId || String(x.id) === String(memberId))) ||
              (memberName && x.name?.toLowerCase() === memberName.toLowerCase()) ||
              (memberName && x.name?.toLowerCase().includes("sam") && memberName.toLowerCase().includes("sam"))
            );
            if (m && (m.botEnabled === false || m.status === "Disabled")) {
              return NextResponse.json(
                {
                  success: false,
                  error: "គណនីរបស់អ្នកត្រូវបានផ្អាក Bot ដោយ Super Admin។ មិនអាចបើកដោយខ្លួនឯងបានទេ!",
                  locked: true,
                },
                { status: 403 }
              );
            }
          }
        } catch {}
      }

      return NextResponse.json(
        {
          success: false,
          error: "មានតែ Super Admin ប៉ុណ្ណោះដែលអាចបញ្ជា Bot Status សកលបាន!",
          locked: true,
        },
        { status: 403 }
      );
    }

    const isAct = active !== false;
    await writeBotStatus(isAct);
    return NextResponse.json({ success: true, active: isAct });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
