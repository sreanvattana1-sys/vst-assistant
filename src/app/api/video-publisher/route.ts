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
  const topic = baseTopic.trim() || "ប្រូម៉ូសិនពិសេស គុណភាពស្ដង់ដារខ្ពស់ ដឹកជូនឥតគិតថ្លៃ";

  // --- 1. Kidney Pro (955747057621489) ---
  if (pageId === "955747057621489" || pageName.includes("Kidney Pro")) {
    if (style === "promotion") {
      return `🔥 [ប្រូម៉ូសិនពិសេសប្រចាំខែ] Kidney Pro ជំនួយតម្រងនោមលេខ ១! 🌿✨\n\n${topic}\n\n👉 ទិញ ២ កំប៉ុង ថែមជូន ១ កំប៉ុងភ្លាមៗ (ចំណេញបានច្រើន)! សល់ត្រឹមតែ ៥០ កញ្ចប់ប៉ុណ្ណោះ!\n✅ ជួយលាងសម្អាតជាតិពុលក្នុងតម្រងនោម\n✅ បំបាត់ការនោមញឹកពេលយប់ និងនោមទាស់\n✅ បំបាត់អាការៈចុកចង្កេះ អស់កម្លាំងល្ហិតល្ហៃ\n\n🚚 ដឹកជញ្ជូនឥតគិតថ្លៃដល់មុខផ្ទះ! ចុចប៊ូតុង "Send Message" ខាងក្រោមដើម្បីកុម្ម៉ង់ឥឡូវនេះ! 💬📦\n\n#KidneyPro #ប្រូម៉ូសិនពិសេស #ជំនួយតម្រងនោម #សុខភាពបុរសស្រ្តី`;
    }
    if (style === "education") {
      return `🩺 សញ្ញាគ្រោះថ្នាក់ទាំង ៤ បញ្ជាក់ថាតម្រងនោមរបស់អ្នកកំពុងចុះខ្សោយ! ⚠️\n\n${topic}\n\nតើបងប្អូនកំពុងជួបបញ្ហាទាំងនេះដែរឬទេ?\n១. នោមញឹកពេលយប់លើសពី ៣ ដង\n២. នោមមានពពុះច្រើន ឬទឹកនោមល្អក់\n៣. ឈឺចុកចាប់ត្រង់ចង្កេះផ្នែកខាងក្រោយ\n៤. ហើមត្របកភ្នែក ឬហើមជើងនៅពេលព្រឹក\n\n🌿 Kidney Pro ផ្សំពីរុក្ខជាតិឱសថធម្មជាតិជំនួយកោសិកាតម្រងនោមឱ្យមានសុខភាពល្អឡើងវិញ។\n💬 ឆាតមកកាន់យើងខ្ញុំឥឡូវនេះ ដើម្បីទទួលបានការពិគ្រោះសុខភាពដោយឥតគិតថ្លៃ! 👨‍⚕️🌿\n\n#ចំណេះដឹងសុខភាព #KidneyPro #ថែរក្សាតម្រងនោម #ពិគ្រោះសុខភាព`;
    }
    if (style === "question") {
      return `❓ តើបងប្អូនធុញទ្រាន់នឹងការភ្ញាក់នោមញឹកញាប់ពេលយប់រហូតគេងមិនលក់មែនទេ? 😴🚫\n\n${topic}\n\nកុំទុកឱ្យបញ្ហាតម្រងនោមក្លាយជាជំងឺធ្ងន់ធ្ងរ! Kidney Pro អាចជួយបងប្អូនឱ្យគេងលក់ស្រួលពេញមួយយប់ និងមានកម្លាំងមាំមួនឡើងវិញ។\n\n👇 បងប្អូនណាខ្លះមានបញ្ហានោមទាស់ ឬចុកចង្កេះ? សូម Comment ពាក្យ "ចង់ដឹង" ឬទម្លាក់លេខទូរស័ព្ទខាងក្រោម ក្រុមការងារនឹងតបជូនភ្លាមៗ! 💬\n\n#សំណួរសុខភាព #KidneyPro #នោមញឹក #សុខភាពតម្រងនោម`;
    }
    if (style === "testimonial") {
      return `🌟 «ពីមុននោមទាស់ ចុកចង្កេះងើបមិនចង់រួច ឥឡូវប្រើ Kidney Pro អស់ ២ កំប៉ុង ស្រួលខ្លួនខ្លាំងណាស់!» 💖\n\n${topic}\n\nនេះជាការឆ្លើយតបពិតៗពីអតិថិជនរាប់ពាន់នាក់ដែលបានប្រើប្រាស់ Kidney Pro! ផលិតផលស្ដង់ដារ គុណភាពពិត ប្រសិទ្ធភាពពិត។\n\n🎁 ប្រូម៉ូសិនពិសេសសម្រាប់ថ្ងៃនេះ! ផ្ញើសារ Inbox មកកាន់យើងខ្ញុំដើម្បីទទួលបានការបញ្ចុះតម្លៃពិសេស! 💌\n\n#Feedbackភ្ញៀវពិត #KidneyPro #ទំនុកចិត្តខ្ពស់ #សុខភាពល្អ`;
    }
    // branding
    return `💎 Kidney Pro - ស្ដង់ដារកំពូលនៃការថែបំប៉នសុខភាពតម្រងនោមនៅកម្ពុជា 🇰🇭🌿\n\n${topic}\n\nផលិតផលត្រូវបានទទួលស្គាល់គុណភាព និងត្រួតពិនិត្យយ៉ាងហ្មត់ចត់ ដើម្បីធានាសុវត្ថិភាពខ្ពស់បំផុតជូនដល់អតិថិជន។\n\n👉 ជ្រើសរើស Kidney Pro សម្រាប់សុខភាពរឹងមាំយូរអង្វែងរបស់លោកអ្នក និងមនុស្សជាទីស្រឡាញ់!\n\n#KidneyPro #OriginalBrand #គុណភាពស្ដង់ដារ #សុខភាពរឹងមាំ`;
  }

  // --- 2. អេមមី សុខភាពស្រ្តី (1039779202551647) ---
  if (pageId === "1039779202551647" || pageName.includes("សុខភាពស្រ្តី")) {
    if (style === "promotion") {
      return `🌸 ប្រូម៉ូសិនមហាសាលសម្រាប់សុភាពនារី! ទិញ ២ ប្រអប់ ថែមជូន ១ ប្រអប់ភ្លាមៗ! 🎁✨\n\n${topic}\n\n💖 អេមមី សុខភាពស្រ្តី ជំនួយពីខាងក្នុង ឱ្យស្រស់ស្អាតមកខាងក្រៅ៖\n• បំបាត់ធ្លាក់ស រមាស់ និងក្លិនមិនល្អ ១០០%\n• សម្រួលរដូវឱ្យមកទៀងទាត់ និងបំបាត់ការឈឺចាប់ពេលមករដូវ\n• រឹតបន្តឹងស្បូន និងជួយឱ្យស្បែកភ្លឺថ្លាក្មេងជាងវ័យ\n\n🚚 ដឹកជូនឥតគិតថ្លៃ ២៥ ខេត្ត/ក្រុង! ចុច Send Message ដើម្បីកុម្ម៉ង់ឥឡូវនេះចាស! 💬🛍️\n\n#អេមមីសុខភាពស្រ្តី #ប្រូម៉ូសិនពិសេស #ថែរក្សាស្បូន #សម្រស់នារី`;
    }
    if (style === "education") {
      return `🩺 បងប្អូននារីៗកុំមើលរំលង! រោគសញ្ញាធ្លាក់សខុសប្រក្រតីអាចបង្កគ្រោះថ្នាក់ដល់ស្បូន! ⚠️\n\n${topic}\n\nតើបងៗមានរោគសញ្ញាទាំងនេះទេ?\n- ធ្លាក់សពណ៌លឿង បៃតង ឬកករម្សៅ\n- មានក្លិនឆ្អេះឆ្អាប និងរមាស់ទ្វារមាស\n- ឈឺចុកចាប់ខ្លាំងនៅពោះផ្នែកខាងក្រោម\n\n🌸 អេមមី សុខភាពស្រ្តី ជួយបន្សុទ្ធជាតិពុលក្នុងស្បូន និងស្ដារសុខភាពមាតាឱ្យស្រស់ថ្លាឡើងវិញ។\n💬 ចុចឆាតមកកាន់ផេក ដើម្បីពិគ្រោះជាមួយអ្នកជំនាញដោយសម្ងាត់ និងសុវត្ថិភាព! 💖\n\n#សុខភាពស្ត្រី #ចំណេះដឹងរោគស្រ្តី #អេមមី #ស្បូនរឹងមាំ`;
    }
    if (style === "question") {
      return `❓ តើរដូវមិនទៀង និងធ្លាក់សញឹកញាប់ ធ្វើឱ្យបងៗបាត់បង់ទំនុកចិត្ត និងពិបាកចិត្តមែនទេ? 🥺💔\n\n${topic}\n\nកុំបារម្ភទៀតអី! អេមមី សុខភាពស្រ្តី ជួយឱ្យបងៗមានទំនុកចិត្តឡើងវិញក្នុងរយៈពេលខ្លី។\n\n👇 បងប្អូនណាខ្លះចង់ដឹងវិធីដោះស្រាយ? សូម Comment លេខទូរស័ព្ទខាងក្រោម ខាងប្អូននឹងឆាតទៅប្រឹក្សាជូនជាសម្ងាត់ចាស! 💬📞\n\n#អេមមីសុខភាពស្រ្តី #រដូវមិនទៀង #ធ្លាក់ស #ទំនុកចិត្តនារី`;
    }
    return `🌟 អាថ៌កំបាំងសុភមង្គល និងភាពទាក់ទាញរបស់ស្រ្តីសម័យថ្មី 💖✨\n\n${topic}\n\nអេមមី សុខភាពស្រ្តី ជួយឱ្យបងៗមានស្បែកភ្លឺថ្លា អារម្មណ៍ស្រស់ស្រាយ និងបំបាត់រាល់បញ្ហារោគស្រ្តីទាំងអស់។\n\n👉 ឆាតមកកាន់យើងខ្ញុំឥឡូវនេះ ដើម្បីទទួលបានកាដូពិសេស និងការប្រឹក្សាឥតគិតថ្លៃ! 🎁\n\n#អេមមី #សុខភាពស្រ្តី #សម្រស់និងសុខភាព #ទំនុកចិត្ត`;
  }

  // --- 3. គុណភាពតម្រងនោម (827063453815073) ---
  if (pageId === "827063453815073" || pageName.includes("គុណភាពតម្រងនោម")) {
    return `🌿 គន្លឹះថែទាំតម្រងនោមឱ្យមានអាយុយឺនយូរ និងជៀសឆ្ងាយពីការលាងឈាម! 🛡️✨\n\n${topic}\n\n👉 តម្រងនោមជាតម្រងចម្រោះជាតិពុលសំខាន់បំផុតក្នុងរាងកាយ។ បើខូចហើយ ពិបាកស្ដារមកវិញខ្លាំងណាស់!\n✅ ពិសាទឹកឱ្យបានគ្រប់គ្រាន់\n✅ កាត់បន្ថយចំណីអាហារប្រៃ និងផ្អែមខ្លាំង\n✅ ប្រើប្រាស់រូបមន្តជំនួយកោសិកាតម្រងនោមធម្មជាតិ\n\n💬 ឆាតមកកាន់ទំព័រ "គុណភាពតម្រងនោម" ឥឡូវនេះ ដើម្បីពិគ្រោះលទ្ធផលឈាម និងការថែទាំត្រឹមត្រូវ! 📞\n\n#គុណភាពតម្រងនោម #ថែទាំសុខភាព #ការពារជំងឺតម្រងនោម #សុខភាពជាចម្បង`;
  }

  // --- 4. Emmi Cambodia (928036717066754) ---
  if (pageId === "928036717066754" || pageName.includes("Cambodia")) {
    return `🇰🇭 Emmi Cambodia - តំណាងចែកចាយផ្លូវការទូទាំង ២៥ ខេត្ត/ក្រុង! 🚚📦\n\n${topic}\n\n🔥 ប្រូម៉ូសិនបញ្ចុះតម្លៃពិសេសប្រចាំសប្ដាហ៍! ទំនិញសុទ្ធ ១០០% ចេញពីរោងចក្រផ្ទាល់ មានតែមត្រួតពិនិត្យត្រឹមត្រូវ។\n\n📦 បញ្ជាទិញថ្ងៃនេះ ទទួលបាន៖\n• សេវាដឹកជញ្ជូនរហ័សទាន់ចិត្តដល់មុខផ្ទះ\n• ការធានាគុណភាពមិនពេញចិត្តប្តូរប្រាក់វិញ\n• កាដូបន្ថែមពិសេសជូនអតិថិជនថ្មី\n\n👉 ចុច Send Message ឥឡូវនេះ ដើម្បីកុម្ម៉ង់ទិញក្នុងតម្លៃបោះដុំ! 💬🛍️\n\n#EmmiCambodia #ទូទាំងប្រទេស #ប្រូម៉ូសិនកក្រើក #ចែកចាយផ្លូវការ`;
  }

  // --- 5. Emmi By CEO (985673367962860) ---
  if (pageId === "985673367962860" || pageName.includes("CEO")) {
    return `👑 [សារផ្ទាល់ពី CEO] ការប្តេជ្ញាចិត្តខ្ពស់បំផុតចំពោះគុណភាព និងសុខភាពរបស់អតិថិជន! 💎✨\n\n${topic}\n\n«គ្រប់ផលិតផល Emmi ត្រូវបានផលិតឡើងដោយក្ដីស្រឡាញ់ និងការយកចិត្តទុកដាក់ខ្ពស់បំផុត។ ខ្ញុំធានាជូននូវគុណភាពស្ដង់ដារដែលបងប្អូនអាចទុកចិត្តបាន ១០០%!»\n\n🎁 ប្រូម៉ូសិនកិត្តិយសពិសេសថ្ងៃនេះ៖ ចុចផ្ញើសារ Inbox ដើម្បីទទួលយកប្រូម៉ូសិនពីដៃ CEO ផ្ទាល់! 💖\n\n#EmmiByCEO #គុណភាពជាកិត្តិយស #ទំនុកចិត្ត១០០ #ម៉ាកយីហោខ្មែរ`;
  }

  // --- 6. Emmi Care (997410203461527) ---
  if (pageId === "997410203461527" || pageName.includes("Care")) {
    return `💖 ស្រឡាញ់ខ្លួនឯង ថែរក្សាសម្រស់ និងសុខភាពជាមួយ Emmi Care ជារៀងរាល់ថ្ងៃ! 🌸✨\n\n${topic}\n\n👉 ជីវិតកាន់តែមានន័យ នៅពេលដែលអ្នកមានសុខភាពល្អ និងសម្រស់ក្មេងជាងវ័យ។ កុំឱ្យវ័យចំណាស់ និងភាពនឿយហត់ឆក់យកភាពស្រស់ថ្លារបស់អ្នក!\n\n✨ ផ្ញើសារមកកាន់ Emmi Care ឥឡូវនេះ ដើម្បីទទួលបានកញ្ចប់ថែទាំសម្រស់ពិសេស! 💌\n\n#EmmiCare #ថែរក្សាសម្រស់ #ស្រឡាញ់ខ្លួនឯង #ក្មេងជាងវ័យ`;
  }

  // --- 7. Emmi អេមមី (Reels Creator - 101267342561819) ---
  if (pageId === "101267342561819" || pageName.includes("Reel")) {
    return `🎬 [Reels វីដេអូពិសេស] មើលហើយដឹងតែជាប់ចិត្ត! 😱🔥\n\n${topic}\n\n👉 ចង់ដឹងអត់ថាហេតុអីបានជាមនុស្សរាប់ម៉ឺននាក់ជ្រើសរើសប្រើប្រាស់ផលិតផលនេះ? មើលវីដេអូដល់ចប់ទៅដឹងហើយ!\n\n💬 Comment លេខទូរស័ព្ទ ឬចុច Send Message ខាងក្រោមឥឡូវនេះណា! 👇✨\n\n#Emmi #ViralReels #វីដេអូល្បី #ប្រូម៉ូសិន`;
  }

  // Default fallback for any other page
  return `✨ ព័ត៌មានពិសេសពីទំព័រ ${pageName}! 🌟\n\n${topic}\n\n👉 គុណភាពខ្ពស់ ទំនុកចិត្តពិត និងផ្ដល់អត្ថប្រយោជន៍ពិតប្រាកដជូនអតិថិជន។\n💬 ចុច Send Message ឬទម្លាក់លេខទូរស័ព្ទខាងក្រោម ដើម្បីកុម្ម៉ង់ទិញឥឡូវនេះ! 📦🚚\n\n#Promotion #${pageName.replace(/\s+/g, "")} #គុណភាពខ្ពស់`;
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

          const prompt = `You are an elite Cambodian digital marketing copywriter and conversion rate optimization (CRO) specialist.
The user wants to publish a Facebook Video, Reel, or Photo across multiple Facebook pages.

VIDEO/MEDIA TITLE:
"${videoTitle || "វីដេអូផ្សព្វផ្សាយ"}"

ACTUAL VIDEO / MEDIA CONTENT (WHAT HAPPENS IN THIS VIDEO):
"${realContent}"

CHOSEN CAPTION STRATEGY:
"${captionStyle}" (Options: promotion = mega discounts/urgency, education = health symptoms & solutions, question = engagement questions, testimonial = real social proof, branding = CEO & official standards)

TARGET PAGES TO GENERATE CAPTIONS FOR:
${pagesPromptList}

STRICT COPYWRITING INSTRUCTIONS:
1. 100% RELEVANT TO THE VIDEO CONTENT: Every caption MUST directly connect to the real content and actions described above ("${realContent}"). Do NOT invent unrelated offers unless mentioned.
2. NATURAL KHMER COPY: Write authentic, persuasive, conversational Cambodian digital marketing copy that sounds like a top-tier online seller.
3. UNIQUE NICHE ADAPTATION PER PAGE:
   - Pages containing "Kidney" or "តម្រងនោម": Focus strictly on Kidney Pro, back pain relief, urination ease, detoxing, quality sleep.
   - Pages containing "ស្រ្តី" or "Emmi Care": Focus on women's health, irregular periods, white discharge, uterus strength, skin glow.
   - Pages containing "CEO": Focus on official CEO guarantee, premium quality, original brand warranty.
   - Pages containing "Reels" or "វីដេអូ": Short, punchy, viral hooks for fast reading.
4. Structure for each caption:
   - Line 1: Strong emotional hook with relevant emojis
   - Line 2-4: Core message directly explaining what the video shows and solving the viewer's pain point
   - Line 5-7: 3 clear bullet points of benefits
   - Line 8: Irresistible Call-To-Action (Inbox/Send Message or Comment phone number)
   - Line 9: 3-4 hashtags in Khmer and English
5. Output MUST be valid JSON mapping each Page ID to its generated Khmer caption text.
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
