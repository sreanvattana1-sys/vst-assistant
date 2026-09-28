import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const DEFAULT_PAGES = [
  {
    id: "955747057621489",
    name: "Kidney Pro ឃីដនី ប្រូ",
    category: "សុខភាព & សម្រស់ (Health/Beauty)",
    isActive: true,
  },
  {
    id: "101267342561819",
    name: "Emmi អេមមី",
    category: "ផលិតផលនារី (Women Care)",
    isActive: true,
  },
  {
    id: "985673367962860",
    name: "Emmi By CEO",
    category: "អាជីវកម្មផ្លូវការ (Official Brand)",
    isActive: true,
  },
];

export async function GET(req: NextRequest) {
  try {
    // Attempt to read custom page settings from Supabase
    const { data } = await supabase.from("bot_settings").select("id, is_active");

    const statusMap = new Map<string, boolean>();
    if (Array.isArray(data)) {
      data.forEach((row) => {
        statusMap.set(row.id, row.is_active !== false);
      });
    }

    const pagesWithStatus = DEFAULT_PAGES.map((p) => ({
      ...p,
      isActive: statusMap.has(p.id) ? statusMap.get(p.id)! : p.isActive,
    }));

    return NextResponse.json({
      success: true,
      pages: pagesWithStatus,
    });
  } catch (err) {
    console.error("GET /api/pages error:", err);
    return NextResponse.json({
      success: true,
      pages: DEFAULT_PAGES,
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
