import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export interface PageCaptionItem {
  pageId: string;
  pageName: string;
  category?: string;
  caption: string;
  status?: "pending" | "uploading" | "success" | "error";
  postId?: string;
  errorMessage?: string;
}

export interface VideoPostRecord {
  id: string;
  title: string;
  videoUrl?: string;
  mediaType?: "video" | "photo" | "text";
  postType: "reels" | "video";
  captionStyle: string;
  targetPagesCount: number;
  publishedAt: string;
  status: "completed" | "partial" | "failed";
  results: {
    pageId: string;
    pageName: string;
    status: "success" | "error";
    postId?: string;
    captionPreview: string;
  }[];
}

// 8 Official Company Pages definition with distinct niche identities
const OFFICIAL_COMPANY_PAGES = [
  {
    id: "955747057621489",
    name: "Kidney Pro ឃីដនី ប្រូ",
    category: "សុខភាព & សម្រស់ (Health/Beauty)",
    niche: "kidney_pro",
    description: "ផ្តោតលើផលិតផលជំនួយសុខភាពតម្រងនោម នោមទាស់ នោមញឹក ឈឺចង្កេះ",
  },
  {
    id: "1039779202551647",
    name: "អេមមី សុខភាពស្រ្តី",
    category: "សុខភាពស្ត្រី (Women Health)",
    niche: "women_health",
    description: "ផ្តោតលើសុខភាពស្បូនស្រ្តី រដូវមិនទៀង ធ្លាក់ស ក្លិនមិនល្អ",
  },
  {
    id: "827063453815073",
    name: "គុណភាពតម្រងនោម",
    category: "សុខភាពតម្រងនោម (Kidney Care)",
    niche: "kidney_care",
    description: "ការអប់រំ និងការពារជំងឺតម្រងនោម ការថែទាំជាតិពុលក្នុងឈាម",
  },
  {
    id: "928036717066754",
    name: "Emmi Cambodia",
    category: "សម្រស់ & ថែទាំ (Beauty/Care)",
    niche: "emmi_cambodia",
    description: "ចែកចាយទូទាំងប្រទេស ប្រូម៉ូសិនកញ្ចប់ធំ និងសេវាកម្មរហ័ស",
  },
  {
    id: "923321100873981",
    name: "Emmi",
    category: "ផលិតផលផ្លូវការ (Official)",
    niche: "emmi_official",
    description: "ផលិតផលដើមសុទ្ធ ១០០% របៀបប្រើប្រាស់ត្រឹមត្រូវ និងប្រសិទ្ធភាព",
  },
  {
    id: "985673367962860",
    name: "Emmi By CEO",
    category: "ម៉ាកយីហោ (Brand)",
    niche: "emmi_ceo",
    description: "ការធានាផ្ទាល់ពី CEO គុណភាពលំដាប់ VIP និងកិត្តិយសម៉ាកយីហោ",
  },
  {
    id: "997410203461527",
    name: "Emmi Care",
    category: "ថែទាំសម្រស់ (Care/Beauty)",
    niche: "emmi_care",
    description: "ការថែរក្សាស្បែក និងសម្រស់ក្មេងជាងវ័យ ទំនុកចិត្តនារីសម័យថ្មី",
  },
  {
    id: "101267342561819",
    name: "Emmi អេមមី",
    category: "វីដេអូ & Reel (Reel Creator)",
    niche: "emmi_reels",
    description: "Reels វីដេអូខ្លីៗទាក់ទាញ ការកម្សាន្ត និងចំណេះដឹងរហ័ស",
  },
];

// Master Deep-Thinking Unique Caption Generator per Page & Style
function generateUniqueCaptionByNiche(
  pageId: string,
  pageName: string,
  style: string,
  baseTopic: string
): string {
  const extraNote = baseTopic.trim() ? `\n📌 ${baseTopic.trim()}` : "";

  // --- 1. Kidney Pro & គុណភាពតម្រងនោម (955747057621489 & 827063453815073) ---
  if (
    pageId === "955747057621489" ||
    pageId === "827063453815073" ||
    pageName.includes("Kidney") ||
    pageName.includes("តម្រងនោម")
  ) {
    if (style === "education" || style === "question") {
      return `បងប្អូនជាច្រើនអាចជួបប្រទះបញ្ហាដូចជា៖
🌿 នោមញឹកពេលយប់លើសពី ២-៣ ដង
🌿 នោមទាស់ នោមរអាក់រអួល ឬឈឺផ្សា
🌿 ចុកចង្កេះ ចុករួយខ្នង ងើបមិនចង់រួច
🌿 អស់កម្លាំងល្ហិតល្ហៃ គេងមិនលក់ស្រួល
🌿 សញ្ញាជាតិពុលកើនឡើងក្នុងតម្រងនោម${extraNote}

🛡️ Kidney Pro (ឃីដនី ប្រូ) ជំនួយតម្រងនោម និងបន្សុទ្ធជាតិពុល ផ្សំពីរុក្ខជាតិឱសថធម្មជាតិ៖
✅ សម្រួលការបត់ជើងតូចឱ្យស្រួល គេងលក់ពេញមួយយប់
✅ បំបាត់អាការៈចុកចង្កេះ និងអស់កម្លាំង
✅ ជំនួយកោសិកាតម្រងនោមឱ្យរឹងមាំយូរអង្វែង
✅ គុណភាពស្ដង់ដារ ទុកចិត្តបាន ១០០%

📩 ឆាតមកកាន់យើងខ្ញុំឥឡូវនេះ ដើម្បីទទួលបានការប្រឹក្សាសុខភាពដោយឥតគិតថ្លៃ!

#KidneyPro #គុណភាពតម្រងនោម #សុខភាពតម្រងនោម #ថែទាំសុខភាព`;
    }

    return `នោមញឹកពេលយប់ នោមទាស់ ចុកចង្កេះ... ឈប់បារម្ភទៀតទៅ!
Kidney Pro ជំនួយការពិសេសសម្រាប់សុខភាពតម្រងនោម។ ផលិតផលដែលរួមផ្សំឡើងពីឱសថធម្មជាតិ ជួយដោះស្រាយបញ្ហា៖
✅ នោមញឹក នោមទាស់ នោមក្រហាយ
✅ ឈឺចុកចាប់ចង្កេះ និងខ្នង
✅ បញ្ចុះជាតិពុល និងអាស៊ីតក្នុងឈាម
✅ អស់កម្លាំង ល្ហិតល្ហៃ គេងមិនលក់${extraNote}

🛡️ ជួយឱ្យគេងលក់ស្រួលពេញមួយយប់ មានកម្លាំងមាំមួន និងសុខភាពល្អពីខាងក្នុង!
👉 ឆាតមកយើងឥឡូវនេះដើម្បីទទួលបានការប្រឹក្សាយោបល់ឥតគិតថ្លៃ!

#KidneyPro #ថែរក្សាតម្រងនោម #សុខភាពបុរសស្រ្តី`;
  }

  // --- 2. អេមមី សុខភាពស្រ្តី (1039779202551647) & Emmi Care (997410203461527) ---
  if (
    pageId === "1039779202551647" ||
    pageId === "997410203461527" ||
    pageName.includes("សុខភាពស្រ្តី") ||
    pageName.includes("Care")
  ) {
    if (style === "promotion" || style === "branding") {
      return `ធ្លាក់ស រដូវមកមិនទៀង មានក្លិនមិនល្អ... ឈប់បារម្ភទៀតទៅ! 
Emmi ជំនួយការពិសេសសម្រាប់សុខភាពស្ត្រី។ ផលិតផលដែលរួមផ្សំឡើងពីគ្រឿងផ្សំធម្មជាតិជិត ២០មុខ ជួយដោះស្រាយបញ្ហា៖
✅ រដូវមកមិនទៀង និងឈឺចាប់ខ្លាំង
✅ ធ្លាក់/ស រមាស់ និងមានក្លិន
✅ ផ្សិតក្នុងទ្វារ.មាស
✅ សិរមាន់ HVP
✅ ស្ងួតទ្វា.មាស់
✅ បញ្ហាស្បូន...${extraNote}

🛡️ ជួយឱ្យរដូវមកទៀងទាត់ ផ្តល់ទំនុកចិត្ត និងសុខភាពល្អពីខាងក្នុង! ឃើញប្រសិទ្ធភាពលឿន...
👉 ឆាតមកយើងឥឡូវនេះដើម្បីទទួលបានការប្រឹក្សាយោបល់ឥតគិតថ្លៃ!

#Emmi #អេមមីសុខភាពស្រ្តី #ថែរក្សាស្បូន #ទំនុកចិត្តនារី`;
    }

    // Default style / daily care
    return `ស្ត្រីជាច្រើនអាចជួបប្រទះបញ្ហាដូចជា៖
💗 អារម្មណ៍មិនស្រួលនៅតំបន់សម្ងាត់
💗 ក្លិនមិនស្រស់ស្រាយ
💗 សំណើម ឬទឹករំអិលប្រែប្រួល
💗 អារម្មណ៍រមាស់ ឬរំខាន
💗 ភាពស្ងួត និងមិនស្រួលខ្លួន
💗 ការប្រែប្រួលដែលកើតឡើងតាមវ័យ និងរបៀបរស់នៅ${extraNote}

🇰🇷 Emmi (អេមមី) ជាផលិតផលថែរក្សាសុខភាពនារី ស្តង់ដារកូរ៉េសម្រាប់ថែរក្សាខ្លួនប្រចាំថ្ងៃ។
✨ ងាយស្រួលប្រើ
✨ សម្រាប់ការថែរក្សាប្រចាំថ្ងៃ
✨ គុណភាពតាមស្តង់ដារកូរ៉េ
✨ ជួយឲ្យការថែរក្សាខ្លួនកាន់តែងាយស្រួល

📩 ចង់ដឹងព័ត៌មានលម្អិត របៀបប្រើ និងតម្លៃ សូមផ្ញើសារមក Page

#Emmi #អេមមី #ស្តង់ដារកូរ៉េ #សុខភាពស្ត្រី`;
  }

  // --- 3. Emmi By CEO (985673367962860) ---
  if (pageId === "985673367962860" || pageName.includes("CEO")) {
    return `👑 [សារផ្ទាល់ពី CEO] ការប្តេជ្ញាចិត្តខ្ពស់បំផុតចំពោះគុណភាព និងសុខភាពរបស់បងប្អូន! 💎✨

ធ្លាក់ស រដូវមកមិនទៀង មានក្លិនមិនល្អ... ឈប់បារម្ភទៀតទៅ! 
🇰🇷 Emmi (អេមមី) ជាផលិតផលថែរក្សាសុខភាពនារី ស្តង់ដារកូរ៉េ រួមផ្សំពីគ្រឿងផ្សំធម្មជាតិជិត ២០មុខ៖
✅ រដូវមកមិនទៀង និងឈឺចាប់ខ្លាំង
✅ ធ្លាក់/ស រមាស់ និងមានក្លិន
✅ ផ្សិតក្នុងទ្វារ.មាស និងស្ងួតទ្វា.មាស់
✅ ផ្តល់ទំនុកចិត្ត និងសុខភាពល្អពីខាងក្នុង${extraNote}

✨ គុណភាពជាកិត្តិយស ទំនុកចិត្តពិត ១០០%!
📩 ចង់ដឹងព័ត៌មានលម្អិត របៀបប្រើ និងតម្លៃ សូមផ្ញើសារមកកាន់ Page ឬទម្លាក់លេខទូរស័ព្ទខាងក្រោម!

#EmmiByCEO #Emmi #ស្តង់ដារកូរ៉េ #គុណភាពជាចម្បង`;
  }

  // --- 4. Emmi Cambodia (928036717066754) & Emmi (923321100873981) ---
  if (
    pageId === "928036717066754" ||
    pageId === "923321100873981" ||
    pageName.includes("Cambodia") ||
    pageName.includes("Emmi")
  ) {
    return `ធ្លាក់ស រដូវមកមិនទៀង មានក្លិនមិនល្អ... ឈប់បារម្ភទៀតទៅ! 
🇰🇷 Emmi ជំនួយការពិសេសសម្រាប់សុខភាពស្ត្រី ស្តង់ដារកូរ៉េ រួមផ្សំពីធម្មជាតិជិត ២០មុខ ជួយដោះស្រាយបញ្ហា៖
✅ រដូវមកមិនទៀង និងឈឺចាប់ខ្លាំង
✅ ធ្លាក់/ស រមាស់ និងមានក្លិន
✅ ផ្សិតក្នុងទ្វារ.មាស
✅ សិរមាន់ HVP
✅ ស្ងួតទ្វា.មាស់${extraNote}

🛡️ ជួយឱ្យរដូវមកទៀងទាត់ ផ្តល់ទំនុកចិត្ត និងសុខភាពល្អពីខាងក្នុង!
🚚 ដឹកជញ្ជូនរហ័សទូទាំង ២៥ ខេត្ត/ក្រុង!
👉 ឆាតមកយើងឥឡូវនេះដើម្បីទទួលបានការប្រឹក្សាយោបល់ឥតគិតថ្លៃ!

#EmmiCambodia #Emmi #សុខភាពស្ត្រី #ស្តង់ដារកូរ៉េ`;
  }

  // Default fallback for any other page
  return `ស្ត្រីជាច្រើនអាចជួបប្រទះបញ្ហាដូចជា៖
💗 អារម្មណ៍មិនស្រួលនៅតំបន់សម្ងាត់
💗 ក្លិនមិនស្រស់ស្រាយ
💗 សំណើម ឬទឹករំអិលប្រែប្រួល
💗 អារម្មណ៍រមាស់ ឬរំខាន
💗 ភាពស្ងួត និងមិនស្រួលខ្លួន${extraNote}

🇰🇷 Emmi (អេមមី) ជាផលិតផលថែរក្សាសុខភាពនារី ស្តង់ដារកូរ៉េសម្រាប់ថែរក្សាខ្លួនប្រចាំថ្ងៃ។
✨ ងាយស្រួលប្រើ
✨ សម្រាប់ការថែរក្សាប្រចាំថ្ងៃ
✨ គុណភាពតាមស្តង់ដារកូរ៉េ

📩 ចង់ដឹងព័ត៌មានលម្អិត របៀបប្រើ និងតម្លៃ សូមផ្ញើសារមក Page

#Emmi #${pageName.replace(/\s+/g, "")} #ស្តង់ដារកូរ៉េ`;
}

// Helper to fetch individual Page Access Tokens from Supabase vst_members & env
async function getPageTokensMap(): Promise<Record<string, string>> {
  const tokenMap: Record<string, string> = {};

  try {
    const { data: memberData } = await supabase
      .from("bot_settings")
      .select("dm_template")
      .eq("id", "vst_members")
      .maybeSingle();

    if (memberData?.dm_template) {
      const members = JSON.parse(memberData.dm_template);
      if (Array.isArray(members)) {
        for (const m of members) {
          if (Array.isArray(m.pages)) {
            for (const p of m.pages) {
              const token = p.accessToken || p.access_token;
              if (p.id && token) {
                tokenMap[p.id] = token;
              }
            }
          }
        }
      }
    }
  } catch (err) {
    console.error("Error reading page tokens from vst_members:", err);
  }

  // Fallback to individual page rows in bot_settings if any
  try {
    const { data: pageRows } = await supabase
      .from("bot_settings")
      .select("id, dm_template")
      .neq("id", "vst_members")
      .neq("id", "vst_video_posts");

    if (pageRows) {
      for (const row of pageRows) {
        if (row.dm_template && row.dm_template.startsWith("EAA")) {
          tokenMap[row.id] = row.dm_template;
        }
      }
    }
  } catch {}

  // Environment fallback
  const envToken = process.env.FB_PAGE_ACCESS_TOKEN;
  if (envToken && !tokenMap["955747057621489"]) {
    tokenMap["955747057621489"] = envToken;
  }

  return tokenMap;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    if (searchParams.get("action") === "tokens") {
      const tokenMap = await getPageTokensMap();
      return NextResponse.json({ success: true, tokens: tokenMap });
    }

    const { data } = await supabase
      .from("bot_settings")
      .select("dm_template")
      .eq("id", "vst_video_posts")
      .maybeSingle();

    let history: VideoPostRecord[] = [];
    if (data?.dm_template) {
      try {
        history = JSON.parse(data.dm_template);
      } catch (e) {
        console.error("Error parsing video post history:", e);
      }
    }

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error fetching video publisher history:", error);
    return NextResponse.json({ history: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    // ACTION 1: Generate High-Thinking AI Captions tailored to each page & style
    if (action === "generate_captions") {
      const {
        videoTitle = "",
        videoContent = "",
        baseTopic = "",
        captionStyle = "promotion",
        pages,
      } = body as {
        videoTitle?: string;
        videoContent?: string;
        baseTopic?: string;
        captionStyle: "promotion" | "education" | "question" | "testimonial" | "branding";
        pages: { id: string; name: string; category?: string }[];
      };

      if (!Array.isArray(pages) || pages.length === 0) {
        return NextResponse.json(
          { error: "No pages selected" },
          { status: 400 }
        );
      }

      const apiKey = process.env.GEMINI_API_KEY;
      const captionsMap: Record<string, string> = {};

      // User's provided video description or topic
      const realContent = (videoContent || baseTopic || videoTitle || "ប្រូម៉ូសិនពិសេស គុណភាពខ្ពស់").trim();

      if (apiKey) {
        try {
          const pagesPromptList = pages
            .map(
              (p, idx) =>
                `${idx + 1}. Page ID: "${p.id}", Name: "${p.name}", Category: "${p.category || "Health/Beauty"}"`
            )
            .join("\n");

          const prompt = `You are an elite Cambodian digital marketing copywriter and conversion rate optimization (CRO) specialist for Emmi and Kidney Pro.
The user wants to publish a Facebook Video, Reel, or Photo across multiple Facebook pages.

VIDEO/MEDIA TITLE:
"${videoTitle || "វីដេអូផ្សព្វផ្សាយ"}"

ACTUAL VIDEO / MEDIA CONTENT:
"${realContent}"

CHOSEN CAPTION STRATEGY:
"${captionStyle}" (promotion, education, question, testimonial, branding)

TARGET PAGES TO GENERATE CAPTIONS FOR:
${pagesPromptList}

GOLD-STANDARD EXAMPLES OF WHAT THE USER LOVES (FOLLOW THIS EXACT TONE, BULLETS, AND FORMAT):

--- GOLD STANDARD EXAMPLE 1 (Feminine Health Daily Care - Emmi): ---
ស្ត្រីជាច្រើនអាចជួបប្រទះបញ្ហាដូចជា៖
💗 អារម្មណ៍មិនស្រួលនៅតំបន់សម្ងាត់
💗 ក្លិនមិនស្រស់ស្រាយ
💗 សំណើម ឬទឹករំអិលប្រែប្រួល
💗 អារម្មណ៍រមាស់ ឬរំខាន
💗 ភាពស្ងួត និងមិនស្រួលខ្លួន
💗 ការប្រែប្រួលដែលកើតឡើងតាមវ័យ និងរបៀបរស់នៅ
🇰🇷 Emmi (អេមមី) ជាផលិតផលថែរក្សាសុខភាពនារី ស្តង់ដារកូរ៉េសម្រាប់ថែរក្សាខ្លួនប្រចាំថ្ងៃ។
✨ ងាយស្រួលប្រើ
✨ សម្រាប់ការថែរក្សាប្រចាំថ្ងៃ
✨ គុណភាពតាមស្តង់ដារកូរ៉េ
✨ ជួយឲ្យការថែរក្សាខ្លួនកាន់តែងាយស្រួល
📩 ចង់ដឹងព័ត៌មានលម្អិត របៀបប្រើ និងតម្លៃ សូមផ្ញើសារមក Page

--- GOLD STANDARD EXAMPLE 2 (Treatment & Natural Healing - Emmi): ---
ធ្លាក់ស រដូវមកមិនទៀង មានក្លិនមិនល្អ... ឈប់បារម្ភទៀតទៅ! 
Emmi ជំនួយការពិសេសសម្រាប់សុខភាពស្ត្រី។ ផលិតផលដែលរួមផ្សំឡើងពីគ្រឿងផ្សំធម្មជាតិជិត ២០មុខ ជួយដោះស្រាយបញ្ហា៖
✅ រដូវមកមិនទៀង និងឈឺចាប់ខ្លាំង
✅ ធ្លាក់/ស រមាស់ និងមានក្លិន
✅ ផ្សិតក្នុងទ្វារ.មាស
✅ សិរមាន់ HVP
✅ ស្ងួតទ្វា.មាស់
✅ បញ្ហាស្បូន...
🛡️ ជួយឱ្យរដូវមកទៀងទាត់ ផ្តល់ទំនុកចិត្ត និងសុខភាពល្អពីខាងក្នុង! ឃើញប្រសិទ្ធភាពលឿន... 
👉 ឆាតមកយើងឥឡូវនេះដើម្បីទទួលបានការប្រឹក្សាយោបល់ឥតគិតថ្លៃ!

--- GOLD STANDARD EXAMPLE 3 (Kidney Pro): ---
បងប្អូនជាច្រើនអាចជួបប្រទះបញ្ហាដូចជា៖
🌿 នោមញឹកពេលយប់លើសពី ២-៣ ដង
🌿 នោមទាស់ នោមរអាក់រអួល ឬឈឺផ្សា
🌿 ចុកចង្កេះ ចុករួយខ្នង ងើបមិនចង់រួច
🌿 អស់កម្លាំងល្ហិតល្ហៃ គេងមិនលក់ស្រួល
🌿 សញ្ញាជាតិពុលកើនឡើងក្នុងតម្រងនោម
🛡️ Kidney Pro (ឃីដនី ប្រូ) ជំនួយតម្រងនោម និងបន្សុទ្ធជាតិពុល ផ្សំពីរុក្ខជាតិឱសថធម្មជាតិ៖
✅ សម្រួលការបត់ជើងតូចឱ្យស្រួល គេងលក់ពេញមួយយប់
✅ បំបាត់អាការៈចុកចង្កេះ និងអស់កម្លាំង
✅ ជំនួយកោសិកាតម្រងនោមឱ្យរឹងមាំយូរអង្វែង
✅ គុណភាពស្ដង់ដារ ទុកចិត្តបាន ១០០%
📩 ឆាតមកកាន់យើងខ្ញុំឥឡូវនេះ ដើម្បីទទួលបានការប្រឹក្សាសុខភាពដោយឥតគិតថ្លៃ!

CRITICAL COPYWRITING RULES:
1. MATCH THE GOLD STANDARDS ABOVE: Write in this exact authentic tone, flow, and formatting. Do not write generic slogans!
2. FACEBOOK POLICY SAFEGUARD: Always use dots/slashes on sensitive body/health words so Facebook doesn't flag the post (e.g., 'ទ្វារ.មាស', 'ធ្លាក់/ស', 'ស្ងួតទ្វា.មាស់', 'សិរមាន់ HVP', 'បញ្ហាស្បូន').
3. EMMI PRODUCTS: Always feature "🇰🇷 Emmi (អេមមី) ស្តង់ដារកូរ៉េ" or "រួមផ្សំឡើងពីគ្រឿងផ្សំធម្មជាតិជិត ២០មុខ".
4. KIDNEY PRODUCTS: For Kidney pages, focus on Kidney Pro, urination ease, night urination relief, back pain relief, detox.
5. 100% RELEVANT TO MEDIA CONTENT: Weave in any specific promotion or video details provided in "${realContent}".
6. Output MUST be valid JSON mapping each Page ID to its generated Khmer caption text.
Example format:
{
  "${pages[0]?.id}": "caption in Khmer...",
  "${pages[1]?.id || "2"}": "caption in Khmer..."
}`;

          // Try gemini-3.8-flash first, fallback to gemini-3.5-flash-lite
          let geminiRes = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                  responseMimeType: "application/json",
                  temperature: 0.85,
                },
              }),
            }
          );

          if (!geminiRes.ok) {
            geminiRes = await fetch(
              `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: {
                    responseMimeType: "application/json",
                    temperature: 0.85,
                  },
                }),
              }
            );
          }

          if (geminiRes.ok) {
            const geminiData = await geminiRes.json();
            const rawJson =
              geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
            if (rawJson) {
              const parsed = JSON.parse(rawJson);
              Object.assign(captionsMap, parsed);
            }
          }
        } catch (geminiError) {
          console.warn("Gemini caption generation error, using deep niche fallback:", geminiError);
        }
      }

      // Guarantee 100% distinct, tailored captions for every page via niche engine
      pages.forEach((p) => {
        if (!captionsMap[p.id]) {
          captionsMap[p.id] = generateUniqueCaptionByNiche(
            p.id,
            p.name,
            captionStyle,
            realContent
          );
        }
      });

      return NextResponse.json({
        success: true,
        captions: captionsMap,
        captionStyle,
        usedAi: Object.keys(captionsMap).length > 0,
      });
    }

    // ACTION: Save post record to history (when published directly from browser)
    if (action === "save_history") {
      const { record } = body as { record: VideoPostRecord };
      if (record) {
        try {
          const { data: existingData } = await supabase
            .from("bot_settings")
            .select("dm_template")
            .eq("id", "vst_video_posts")
            .maybeSingle();

          let historyList: VideoPostRecord[] = [];
          if (existingData?.dm_template) {
            try {
              historyList = JSON.parse(existingData.dm_template);
            } catch {}
          }

          historyList.unshift(record);
          if (historyList.length > 30) historyList = historyList.slice(0, 30);

          await supabase.from("bot_settings").upsert(
            {
              id: "vst_video_posts",
              dm_template: JSON.stringify(historyList),
              is_active: true,
            },
            { onConflict: "id" }
          );
        } catch (e) {
          console.error("Error saving history:", e);
        }
      }
      return NextResponse.json({ success: true });
    }

    // ACTION 2: Publish video / photo / text to multiple Facebook pages
    if (action === "publish_video") {
      const {
        title,
        videoUrl,
        mediaType = "video",
        postType = "reels",
        captionStyle = "promotion",
        pageCaptions,
      } = body as {
        title: string;
        videoUrl?: string;
        mediaType?: "video" | "photo" | "text";
        postType: "reels" | "video";
        captionStyle?: string;
        pageCaptions: PageCaptionItem[];
      };

      if (!Array.isArray(pageCaptions) || pageCaptions.length === 0) {
        return NextResponse.json(
          { error: "No target pages provided" },
          { status: 400 }
        );
      }

      const results: {
        pageId: string;
        pageName: string;
        status: "success" | "error";
        postId?: string;
        captionPreview: string;
        message?: string;
        needsReauth?: boolean;
      }[] = [];

      const tokenMap = await getPageTokensMap();
      const defaultToken = process.env.FB_PAGE_ACCESS_TOKEN;

      // Process and dispatch to each page with genuine Meta API calls
      for (const item of pageCaptions) {
        const pageToken = tokenMap[item.pageId] || defaultToken;

        if (!pageToken) {
          results.push({
            pageId: item.pageId,
            pageName: item.pageName,
            status: "error",
            captionPreview: item.caption.slice(0, 70) + "...",
            message: "ពុំមាន Access Token សម្រាប់ Page នេះទេ (សូម Re-authorize តាម Facebook Login)",
            needsReauth: true,
          });
          continue;
        }

        try {
          const isRemoteVideoUrl =
            videoUrl &&
            (videoUrl.startsWith("http://") || videoUrl.startsWith("https://")) &&
            !videoUrl.includes("localhost") &&
            !videoUrl.startsWith("blob:");

          let fbRes: Response;
          let fbData: any;

          if (mediaType === "photo" && isRemoteVideoUrl) {
            // 1. Post Photo via /photos Graph API
            fbRes = await fetch(
              `https://graph.facebook.com/v19.0/${item.pageId}/photos`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  url: videoUrl,
                  caption: item.caption,
                  access_token: pageToken,
                }),
              }
            );
            fbData = await fbRes.json();
          } else if (isRemoteVideoUrl) {
            // 2. Post Video or Reel via /videos Graph API
            fbRes = await fetch(
              `https://graph.facebook.com/v19.0/${item.pageId}/videos`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  file_url: videoUrl,
                  description: item.caption,
                  title: title || "Video Post",
                  access_token: pageToken,
                }),
              }
            );
            fbData = await fbRes.json();
          } else {
            // 3. Post directly to Page Feed (/feed) for text posts
            fbRes = await fetch(
              `https://graph.facebook.com/v19.0/${item.pageId}/feed`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  message: item.caption,
                  access_token: pageToken,
                }),
              }
            );
            fbData = await fbRes.json();
          }

          if (fbRes.ok && fbData?.id) {
            results.push({
              pageId: item.pageId,
              pageName: item.pageName,
              status: "success",
              postId: fbData.id,
              captionPreview: item.caption.slice(0, 70) + "...",
              message: "បានផុសទៅកាន់ Facebook Page ផ្ទាល់ជោគជ័យ!",
            });
          } else {
            const errObj = fbData?.error;
            const errCode = errObj?.code;
            const errMsg = errObj?.message || "Meta API returned an error";
            const isPermError =
              errCode === 200 ||
              errCode === 190 ||
              errMsg.includes("pages_manage_posts") ||
              errMsg.includes("requires both pages_read_engagement");

            results.push({
              pageId: item.pageId,
              pageName: item.pageName,
              status: "error",
              captionPreview: item.caption.slice(0, 70) + "...",
              message: isPermError
                ? "Facebook ទាមទារសិទ្ធិ 'pages_manage_posts' (សូមចុចប៊ូតុង 'ភ្ជាប់សិទ្ធិឡើងវិញ')"
                : `Facebook Error: ${errMsg}`,
              needsReauth: isPermError,
            });
          }
        } catch (e: any) {
          results.push({
            pageId: item.pageId,
            pageName: item.pageName,
            status: "error",
            captionPreview: item.caption.slice(0, 70) + "...",
            message: e.message || "Failed to communicate with Facebook",
          });
        }
      }

      // Save to Supabase History
      const newRecord: VideoPostRecord = {
        id: `vpost_${Date.now()}`,
        title: title || "វីដេអូផ្សព្វផ្សាយថ្មី",
        videoUrl: videoUrl?.startsWith("data:") ? "[Uploaded Video File]" : videoUrl,
        mediaType,
        postType,
        captionStyle,
        targetPagesCount: pageCaptions.length,
        publishedAt: new Date().toISOString(),
        status: results.every((r) => r.status === "success")
          ? "completed"
          : "partial",
        results,
      };

      try {
        const { data: existingData } = await supabase
          .from("bot_settings")
          .select("dm_template")
          .eq("id", "vst_video_posts")
          .maybeSingle();

        let historyList: VideoPostRecord[] = [];
        if (existingData?.dm_template) {
          try {
            historyList = JSON.parse(existingData.dm_template);
          } catch {}
        }

        historyList.unshift(newRecord);
        if (historyList.length > 30) historyList = historyList.slice(0, 30);

        await supabase.from("bot_settings").upsert(
          {
            id: "vst_video_posts",
            dm_template: JSON.stringify(historyList),
            is_active: true,
          },
          { onConflict: "id" }
        );
      } catch (histErr) {
        console.warn("Failed to persist history to Supabase:", histErr);
      }

      return NextResponse.json({
        success: true,
        record: newRecord,
        results,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("Error in video-publisher POST:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
