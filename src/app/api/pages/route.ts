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

    const statusMap = new Map<
      string,
      { isActive: boolean; disabledByAdmin: boolean }
    >();
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
          statusMap.set(row.id, {
            isActive: row.is_active !== false,
            disabledByAdmin: row.dm_template === "LOCKED_BY_ADMIN",
          });
        }
      });
    }

    // Merge default pages and all member pages
    const pagesMap = new Map<string, any>();

    // Add admin pages
    DEFAULT_PAGES.forEach((p) => {
      const pageStatus = statusMap.get(p.id);
      pagesMap.set(p.id, {
        ...p,
        isActive: pageStatus ? pageStatus.isActive : p.isActive,
        disabledByAdmin: pageStatus ? pageStatus.disabledByAdmin : false,
      });
    });

    // Add member pages
    memberPagesMap.forEach((p, pageId) => {
      const pageStatus = statusMap.get(pageId);
      if (pagesMap.has(pageId)) {
        const existing = pagesMap.get(pageId);
        existing.ownerName = `${existing.ownerName} / ${p.ownerName}`;
      } else {
        pagesMap.set(pageId, {
          id: p.id,
          name: p.name,
          category: p.category || "Facebook Page (Member)",
          ownerName: p.ownerName,
          isActive: pageStatus ? pageStatus.isActive : true,
          disabledByAdmin: pageStatus ? pageStatus.disabledByAdmin : false,
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
    const { pageId, isActive, isAdmin } = await req.json();

    if (!pageId || typeof isActive !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Missing pageId or isActive" },
        { status: 400 }
      );
    }

    // 1. Check existing settings for Admin Lock
    const { data: existingRow } = await supabase
      .from("bot_settings")
      .select("dm_template")
      .eq("id", pageId)
      .maybeSingle();

    const isLockedByAdmin = existingRow?.dm_template === "LOCKED_BY_ADMIN";

    // 2. Member trying to enable a page that was locked/disabled by Admin
    if (!isAdmin && isLockedByAdmin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "ទំព័រនេះត្រូវបានផ្អាកដោយ Super Admin។ មានតែ Admin ប៉ុណ្ណោះដែលអាចបើកដំណើរការ Bot ឡើងវិញបាន!",
          locked: true,
        },
        { status: 403 }
      );
    }

    // 3. Upsert into Supabase bot_settings
    const updatePayload: any = {
      id: pageId,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    };

    // If Super Admin is explicitly disabling, record the Admin Lock
    if (isAdmin) {
      updatePayload.dm_template = isActive ? "" : "LOCKED_BY_ADMIN";
    }

    await supabase.from("bot_settings").upsert(updatePayload, { onConflict: "id" });

    return NextResponse.json({
      success: true,
      pageId,
      isActive,
      disabledByAdmin: isAdmin ? !isActive : isLockedByAdmin,
    });
  } catch (err) {
    console.error("POST /api/pages error:", err);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
