import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageId = searchParams.get("pageId") || "default";

    const { data } = await supabase
      .from("bot_settings")
      .select("*")
      .eq("id", pageId)
      .maybeSingle();

    if (data) {
      return NextResponse.json(data);
    }

    // Fallback: If no custom setting for this page, load default settings or generate intelligent fallback
    const { data: defaultData } = await supabase
      .from("bot_settings")
      .select("*")
      .eq("id", "default")
      .maybeSingle();

    const fallbackReply =
      pageId !== "default"
        ? `សួស្ដី {name}! 😊 អរគុណសម្រាប់ការចាប់អារម្មណ៍លើទំព័រយើងខ្ញុំ។ ខ្ញុំបានផ្ញើព័ត៌មានលម្អិត និងតម្លៃពិសេសជូនបងហើយណា 💬👉 https://m.me/${pageId}`
        : "សួស្ដី {name}! 😊 អរគុណសម្រាប់ការចាប់អារម្មណ៍។ ខ្ញុំបានផ្ញើព័ត៌មានលម្អិត និងតម្លៃពិសេសជូនបងហើយណា 💬👉 https://m.me/955747057621489";

    const fallbackDm =
      defaultData?.dm_template ||
      "សួស្ដីបង {name}! 🌸 អរគុណដែលបាន comment លើទំព័រយើងខ្ញុំ។ តើបងចង់ដឹងព័ត៌មានលម្អិត ឬតម្លៃផលិតផលដែរទេ? ខ្ញុំអាចជួយផ្ដល់ការប្រឹក្សាជូនបងបានភ្លាមៗណា! 💬✨";

    return NextResponse.json({
      id: pageId,
      is_active: true,
      reply_templates: defaultData?.reply_templates && defaultData.reply_templates.length > 0
        ? defaultData.reply_templates
        : [fallbackReply],
      auto_dm_enabled: defaultData ? defaultData.auto_dm_enabled !== false : true,
      dm_template: fallbackDm,
    });
  } catch (error) {
    console.error("Error fetching bot settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      pageId = "default",
      is_active,
      reply_templates,
      auto_dm_enabled,
      dm_template,
    } = body;

    const { data, error } = await supabase
      .from("bot_settings")
      .upsert({
        id: pageId,
        is_active: is_active ?? true,
        reply_templates: reply_templates || [],
        auto_dm_enabled: auto_dm_enabled ?? true,
        dm_template: dm_template || "",
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, settings: data });
  } catch (error) {
    console.error("Error saving bot settings:", error);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
