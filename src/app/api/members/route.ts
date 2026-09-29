import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { data } = await supabase
      .from("bot_settings")
      .select("dm_template, updated_at")
      .eq("id", "vst_members")
      .maybeSingle();

    let members: any[] = [];
    if (data && data.dm_template) {
      try {
        members = JSON.parse(data.dm_template);
      } catch (e) {
        console.error("Error parsing members list:", e);
      }
    }

    // Always include VST Super Admin at the top
    const hasAdmin = members.some((m) => m.id === "owner" || m.name === "VST Super Admin");
    if (!hasAdmin) {
      members.unshift({
        id: "owner",
        name: "VST Super Admin",
        email: "admin@vst.com",
        role: "Owner (Super Admin)",
        loginType: "Master Credentials",
        pagesCount: 6,
        lastLogin: new Date().toISOString(),
        status: "Active",
      });
    }

    // If Sam Moto is not yet in the list or was connected earlier, make sure it's present
    const hasSam = members.some((m) => m.name?.toLowerCase().includes("sam"));
    if (!hasSam) {
      members.push({
        id: "fb_sam_moto",
        name: "Sam Moto",
        role: "Member / Tester",
        loginType: "Facebook OAuth",
        pagesCount: 5,
        pages: [
          { name: "គុណភាពតម្រងនោម", id: "827063453815073" },
          { name: "អេមមី សុខភាពស្រ្តី", id: "1039779202551647" },
          { name: "Emmi Cambodia", id: "928036717066754" },
          { name: "Emmi By CEO", id: "985673367962860" },
          { name: "Emmi អេមមី", id: "101267342561819" },
        ],
        lastLogin: new Date().toISOString(),
        status: "Active",
      });
    }

    return NextResponse.json({
      success: true,
      members,
      totalMembers: members.length,
    });
  } catch (error) {
    console.error("Get members error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing member ID" }, { status: 400 });
    }

    const { data } = await supabase
      .from("bot_settings")
      .select("dm_template")
      .eq("id", "vst_members")
      .maybeSingle();

    if (data && data.dm_template) {
      let members = JSON.parse(data.dm_template);
      members = members.filter((m: any) => m.id !== id);
      await supabase.from("bot_settings").upsert({
        id: "vst_members",
        is_active: true,
        dm_template: JSON.stringify(members),
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json({ success: true, removedId: id });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Delete failed" }, { status: 500 });
  }
}
