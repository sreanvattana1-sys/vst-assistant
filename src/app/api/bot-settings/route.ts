import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("bot_settings")
      .select("*")
      .eq("id", "default")
      .single();

    if (error || !data) {
      return NextResponse.json({
        id: "default",
        is_active: true,
        reply_templates: [
          "សួស្ដី {name}! 😊 អរគុណសម្រាប់ការចាប់អារម្មណ៍។ ខ្ញុំបានផ្ញើព័ត៌មានលម្អិត និងតម្លៃពិសេសជូនបងហើយណា 💬👉 https://m.me/955747057621489",
          "ជម្រាបសួរ {name}! 🌸 ព័ត៌មាន និងប្រូម៉ូសិនពិសេសត្រូវបានរៀបចំជូនបងរួចរាល់ហើយ សូមចុចត្រង់នេះដើម្បីឆាតមកកាន់ Inbox 🥰👉 https://m.me/955747057621489",
          "សួស្ដី {name}! ✨ ផលិតផលគុណភាពខ្ពស់ ផ្ដល់ទំនុកចិត្ត១០០%។ សូមចុចត្រង់នេះដើម្បីទទួលការប្រឹក្សាភ្លាមៗណា៎បង 💌👉 https://m.me/955747057621489",
        ],
        auto_dm_enabled: true,
        dm_template:
          "សួស្ដីបង {name}! 🌸 អរគុណដែលបាន comment លើទំព័រយើងខ្ញុំ។ តើបងចង់ដឹងព័ត៌មានលម្អិត ឬតម្លៃផលិតផលដែរទេ? ខ្ញុំអាចជួយផ្ដល់ការប្រឹក្សាជូនបងបានភ្លាមៗណា! 💬✨",
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching bot settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { is_active, reply_templates, auto_dm_enabled, dm_template } = body;

    const { data, error } = await supabase
      .from("bot_settings")
      .upsert({
        id: "default",
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
