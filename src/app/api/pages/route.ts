import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DEFAULT_PAGES = [
  {
    id: "955747057621489",
    name: "Kidney Pro ឃីដនី ប្រូ",
    category: "សុខភាព & សម្រស់ (Health/Beauty)",
    ownerName: "VST Super Admin",
    isActive: true,
  },
  {
    id: "101267342561819",
    name: "Emmi អេមមី",
    category: "ផលិតផលនារី (Women Care)",
    ownerName: "VST Super Admin",
    isActive: true,
  },
  {
    id: "985673367962860",
    name: "Emmi By CEO",
    category: "អាជីវកម្មផ្លូវការ (Official Brand)",
    ownerName: "VST Super Admin",
    isActive: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const owner = searchParams.get("owner");

    // 1. Fetch bot_settings statuses & member pages
    const { data: settingsData } = await supabase
      .from("bot_settings")
      .select("id, is_active, dm_template");

    const statusMap = new Map<string, boolean>();
    const memberPagesMap = new Map<
      string,
      { id: string; name: string; ownerName: string; category?: string }
    >();

    if (Array.isArray(settingsData)) {
      settingsData.forEach((row) => {
        if (row.id === "vst_members") {
          try {
            const members = JSON.parse(row.dm_template);
            if (Array.isArray(members)) {
              members.forEach((m: any) => {
                if (Array.isArray(m.pages)) {
                  m.pages.forEach((p: any) => {
                    memberPagesMap.set(p.id, {
                      id: p.id,
                      name: p.name,
                      ownerName: m.name || "Member",
                      category: "Facebook Page (Member)",
                    });
                  });
                }
              });
            }
          } catch {}
        } else if (row.id !== "default") {
          statusMap.set(row.id, row.is_active !== false);
        }
      });
    }

    // Merge default pages and all member pages
    const pagesMap = new Map<string, any>();

    // Add admin pages
    DEFAULT_PAGES.forEach((p) => {
      pagesMap.set(p.id, {
        ...p,
        isActive: statusMap.has(p.id) ? statusMap.get(p.id)! : p.isActive,
      });
    });

    // Add member pages
    memberPagesMap.forEach((p, pageId) => {
      if (pagesMap.has(pageId)) {
        const existing = pagesMap.get(pageId);
        existing.ownerName = `${existing.ownerName} / ${p.ownerName}`;
      } else {
        pagesMap.set(pageId, {
          id: p.id,
          name: p.name,
          category: p.category || "Facebook Page (Member)",
          ownerName: p.ownerName,
          isActive: statusMap.has(p.id) ? statusMap.get(p.id)! : true,
        });
      }
    });

    let allPages = Array.from(pagesMap.values());

    // Filter by owner if requested
    if (owner) {
      allPages = allPages.filter((p) =>
        p.ownerName?.toLowerCase().includes(owner.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      pages: allPages,
      totalPages: allPages.length,
    });
  } catch (err) {
    console.error("GET /api/pages error:", err);
    return NextResponse.json({
      success: true,
      pages: DEFAULT_PAGES,
      totalPages: DEFAULT_PAGES.length,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { pageId, isActive } = await req.json();

    if (!pageId || typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Missing pageId or isActive" },
        { status: 400 }
      );
    }

    // Upsert into Supabase bot_settings
    await supabase.from("bot_settings").upsert(
      {
        id: pageId,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    return NextResponse.json({
      success: true,
      pageId,
      isActive,
    });
  } catch (err) {
    console.error("POST /api/pages error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
