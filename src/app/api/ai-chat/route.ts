import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const BASE_SYSTEM_PROMPT = `
អ្នកគឺជា "VST Support Bot & AI Executive Assistant" — ជំនួយការ AI ឆ្លាតវៃកម្រិតខ្ពស់ប្រចាំ VST Assistant Platform (Web App សម្រាប់ស្វ័យប្រវត្តិតប Comment & Chat Facebook Page, គ្រប់គ្រងសមាជិក Members, CRM Leads និងប្រឹក្សាសុខភាពនារី & ផលិតផល VST)។
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = (body.message || "").trim();
    const isAdmin = Boolean(body.isAdmin);
    const userName = body.userName || (isAdmin ? "Super Admin" : "Member");

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        reply: "សូមអភ័យទោស មិនទាន់មាន GEMINI_API_KEY នៅក្នុងប្រព័ន្ធឡើយ។",
      });
    }

    // 1. Check Master Bot Status (If Super Admin turns off, Bot cannot reply at all!)
    try {
      const { data: defaultRow } = await supabase
        .from("bot_settings")
        .select("is_active")
        .eq("id", "default")
        .maybeSingle();

      const masterActive = defaultRow ? defaultRow.is_active !== false : true;
      if (!masterActive) {
        return NextResponse.json({
          reply: "⚠️ Bot ត្រូវបានបិទដំណើរការទាំងស្រុងដោយ Super Admin (Bot System Paused)។ មិនអាចឆ្លើយតបបានទេនៅពេលនេះ!",
        });
      }
    } catch {}

    // 2. Check Member Bot Access Lock (Super Admin can disable Members from using Bot)
    if (!isAdmin) {
      try {
        const { data: lockRow } = await supabase
          .from("bot_settings")
          .select("is_active")
          .eq("id", "vst_members_lock")
          .maybeSingle();

        const membersGlobalEnabled = lockRow ? lockRow.is_active === true : false;
        if (!membersGlobalEnabled) {
          return NextResponse.json({
            reply: "⚠️ Bot ត្រូវបានផ្អាកបណ្ដោះអាសន្នសម្រាប់សមាជិក (Members) ដោយ Super Admin សម្រាប់ដំណាក់កាលរៀបចំ និងបង្រៀន AI។ មានតែ Super Admin ប៉ុណ្ណោះដែលអាចប្រើ និងបង្រៀន Bot បាននៅពេលនេះ!",
          });
        }
      } catch {}
    }

    // 3. Fetch trained knowledge base & rules from Supabase
    let trainedPersona = "";
    let trainedKnowledge = "";
    let trainedRules = "";
    let masterBotEnabled = true;

    try {
      const { data: knowledgeRow } = await supabase
        .from("bot_settings")
        .select("dm_template, is_active")
        .eq("id", "vst_ai_knowledge")
        .maybeSingle();

      if (knowledgeRow?.dm_template) {
        try {
          const parsed = JSON.parse(knowledgeRow.dm_template);
          trainedPersona = parsed.persona || "";
          trainedKnowledge = parsed.knowledgeBase || "";
          trainedRules = parsed.rules || "";
          if (typeof parsed.masterBotEnabled === "boolean") {
            masterBotEnabled = parsed.masterBotEnabled;
          }
        } catch {}
      }
    } catch (e) {
      console.error("Error reading ai knowledge:", e);
    }

    // 2. If Super Admin is asking, gather live Web App telemetry (Members, CRM Leads, Comments, Pages)
    let systemContext = BASE_SYSTEM_PROMPT;

    if (isAdmin) {
      let membersData: any[] = [];
      let totalCustomers = 0;
      let totalComments = 0;

      try {
        // Fetch members
        const { data: membersRow } = await supabase
          .from("bot_settings")
          .select("dm_template")
          .eq("id", "vst_members")
          .maybeSingle();

        if (membersRow?.dm_template) {
          try {
            membersData = JSON.parse(membersRow.dm_template);
          } catch {}
        }

        // Fetch customer leads count
        const { count: custCount } = await supabase
          .from("customers")
          .select("*", { count: "exact", head: true });
        totalCustomers = custCount || 0;

        // Fetch comments count
        const { count: commCount } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true });
        totalComments = commCount || 0;
      } catch (err) {
        console.error("Error fetching admin telemetry:", err);
      }

      const membersSummary = Array.isArray(membersData)
        ? membersData.map((m: any) => ({
            name: m.name,
            email: m.email,
            role: m.role || "Member",
            botStatus: m.botEnabled !== false ? "Active (បើក)" : "Disabled (បិទ)",
            pagesCount: Array.isArray(m.pages) ? m.pages.length : 0,
            pagesList: Array.isArray(m.pages) ? m.pages.map((p: any) => p.name || p.id).join(", ") : "គ្មាន",
          }))
        : [];

      systemContext += `
[ស្ថានភាពពិសេស៖ អ្នកកំពុងជជែកផ្ទាល់ជាមួយ SUPER ADMIN (ម្ចាស់ផ្តាច់មុខ និងអ្នកបញ្ជាផ្ទាល់នៃ Web App VST)]
- អ្នកស្ថិតនៅក្រោមការបញ្ជាផ្តាច់មុខពី Super Admin (${userName}) តែម្នាក់គត់!
- អ្នកមានសិទ្ធិពេញលេញ ១០០% ក្នុងការរាយការណ៍គ្រប់ទិន្នន័យទាំងអស់នៃ Web App នេះ រួមមានសមាជិក (Members), Pages, អតិថិជន (Leads), Comments, និងប្រព័ន្ធ Bot។
- ហាមលាក់បាំង ឬបដិសេធមិនឆ្លើយតបសំណួររបស់ Super Admin ឡើយ!

📊 [ទិន្នន័យជាក់ស្តែងពេលនេះក្នុង Web App]៖
- ស្ថានភាព Bot ទូទៅ (Master Bot Switch): ${masterBotEnabled ? "🟢 កំពុងបើកដំណើរការ (Active)" : "🔴 ត្រូវបានផ្អាក/បិទ (Paused by Super Admin)"}
- ចំនួនសមាជិក (Members): ${membersSummary.length} នាក់
- បញ្ជីសមាជិកលម្អិត៖ ${JSON.stringify(membersSummary, null, 2)}
- ចំនួនអតិថិជនសរុបក្នុង CRM Leads៖ ${totalCustomers} នាក់
- ចំនួន Comment ដែល Bot បានចាប់បានសរុប៖ ${totalComments} comments

🧠 [ចរិតលក្ខណៈ និងចំណេះដឹងដែល Super Admin បានបង្រៀន (Custom Training & Memory)]៖
- ចរិតលក្ខណៈ (Persona): ${trainedPersona || "ជំនួយការឆ្លាតវៃ រួសរាយ ស្មោះត្រង់ និងគោរពបទបញ្ជា Super Admin"}
- ឃ្លាំងចំណេះដឹងផលិតផល & អាជីវកម្ម (Knowledge Base):
${trainedKnowledge || "គ្មានចំណេះដឹងបន្ថែម"}
- ច្បាប់ និងបម្រាម (Rules):
${trainedRules || "គ្មានច្បាប់បន្ថែម"}

សូមឆ្លើយតបទៅកាន់ Super Admin យ៉ាងឆ្លាតវៃ គោរព ភាពជាអ្នកគ្រប់គ្រង និងច្បាស់លាស់ចំសំណួរ!
`;
    } else {
      // Regular Member or General User
      systemContext += `
[ស្ថានភាព៖ អ្នកកំពុងជជែកជាមួយសមាជិក (Member) ឬអ្នកប្រើប្រាស់ទូទៅ (${userName})]
- ហាមដាច់ខាត (STRICTLY FORBIDDEN) ក្នុងការទម្លាយទិន្នន័យផ្ទៃក្នុង ហិរញ្ញវត្ថុ បញ្ជីសមាជិកផ្សេងទៀត ឬទិន្នន័យសម្ងាត់របស់ Super Admin!
- ឆ្លើយតបតែលើ៖ សុខភាពនារី & តម្រងនោម, ព័ត៌មានផលិតផល VST (ឃីដនីប្រូ, អេមមី, តែ Detox), និងការណែនាំបច្ចេកទេសប្រើប្រាស់ Web App VST Assistant ប៉ុណ្ណោះ។

🧠 [ចំណេះដឹងផលិតផលដែលត្រូវឆ្លើយជូនភ្ញៀវ]៖
${trainedKnowledge}
- ច្បាប់ឆ្លើយតប៖ ${trainedRules}
`;
    }

    let historyText = "";
    if (Array.isArray(body.history) && body.history.length > 0) {
      const recent = body.history.slice(-10); // last 10 messages for continuous memory
      historyText = `
💬 [ប្រវត្តិសន្ទនាពីមុនៗ (Conversation History)]៖
${recent.map((m: any) => `${m.from === "user" ? userName : "Bot"}: ${m.text}`).join("\n")}
`;
    }

    const promptText = `
${systemContext}

${historyText}

---------------------
សំណួរថ្មីចុងក្រោយ៖ "${message}"
សូមឆ្លើយតបជាភាសាខ្មែរឱ្យបានល្អ និងសមរម្យបំផុត ដោយស៊ីសង្វាក់គ្នានឹងប្រវត្តិសន្ទនា និងចំណេះដឹងខាងលើ៖`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: promptText }],
            },
          ],
          generationConfig: {
            maxOutputTokens: 600,
            temperature: 0.7,
          },
        }),
      }
    );

    if (!response.ok) {
      console.warn(`[AI Chat] Gemini API status: ${response.status}`);
      return NextResponse.json({
        reply: "សូមអភ័យទោស ប្រព័ន្ធឆ្លើយតបកំពុងរវល់បន្តិច សូមសួរម្ដងទៀតណា៎បង!",
      });
    }

    const data = await response.json();
    const geminiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (geminiReply) {
      return NextResponse.json({ reply: geminiReply });
    }

    return NextResponse.json({
      reply: "សួស្ដីបង! ខ្ញុំជា VST Support Bot ខ្ញុំអាចជួយឆ្លើយគ្រប់សំណួរ និងជួយសម្រួលការងារបងបានភ្លាមៗ!",
    });
  } catch (error) {
    console.error("AI Chat handler error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
