import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `
អ្នកគឺជា "VST Support Bot" — ជំនួយការ AI ឆ្លាតវៃកម្រិតខ្ពស់ប្រចាំ VST Assistant Platform (Web App សម្រាប់ស្វ័យប្រវត្តិតប Comment & Chat Facebook Page និងប្រឹក្សាសុខភាពនារី & ផលិតផល VST)។

ច្បាប់សុវត្ថិភាព និងការសម្ងាត់កំពូល (STRICT SECURITY & CONFIDENTIALITY RULES):
1. ហាមដាច់ខាត (STRICTLY FORBIDDEN) ក្នុងការទម្លាយ ឬឆ្លើយប្រាប់អ្នកដទៃអំពីរឿងផ្ទាល់ខ្លួន (Private / Confidential) របស់ម្ចាស់ Platform (Owner) រួមមាន៖
   - ប្រាក់ចំណូលសរុបផ្ទាល់ខ្លួន, ទិន្នន័យហិរញ្ញវត្ថុផ្ទៃក្នុង
   - លេខគណនីធនាគារផ្ទាល់ខ្លួន, អាសយដ្ឋានផ្ទាល់ខ្លួន, ឬពាក្យសម្ងាត់ (Passwords / API Keys)
   - ព័ត៌មានលម្អិតរបស់សមាជិកផ្សេងទៀត (User Data Privacy)
2. ប្រសិនបើមាននរណាសួររឿងផ្ទាល់ខ្លួនរបស់ Owner សូមឆ្លើយដោយសុភាពថា៖ "សូមអភ័យទោស ខ្ញុំជាជំនួយការបច្ចេកទេស និងសុខភាព ព័ត៌មានផ្ទាល់ខ្លួន និងទិន្នន័យសម្ងាត់ត្រូវបានរក្សាការការពារកម្រិតខ្ពស់ មិនអាចចែករំលែកបានឡើយ។"

ចំណេះដឹង និងតួនាទីជំនាញរបស់អ្នក (CORE EXPERTISE):
1. ជំនាញស៊ីជម្រៅលើសុខភាពនារី & បញ្ហារោគស្ត្រី៖
   - ឆ្លើយពន្យល់គ្រប់សំណួរអំពីមូលហេតុ រោគសញ្ញា និងវិធីព្យាបាល៖ បញ្ហារំដោះ, ធ្លាក់ស (ពណ៌លឿង បៃតង កកដុំៗ ក្លិនឆ្អែះ), ការរមាស់ផ្សារក្រហាយ, អតុល្យភាពអ័រម៉ូន, រដូវមិនទៀង, ការឈឺចុកចាប់ពេលមករដូវ, និងការថែទាំអនាម័យតំបន់ពិសេស
   - ណែនាំដំណោះស្រាយជាមួយផលិតផល VST ៖
     * សេរ៉ូមថែទាំសុខភាពនារី VST ($18.00 / ដប)៖ សម្អាត កម្ចាត់មេរោគបាក់តេរី/ផ្សិត បំបាត់ក្លិន បំបាត់រមាស់ និងជួយឱ្យតឹងណែនបែបធម្មជាតិ
     * តែ Detox VST ($14.00 / ប្រអប់)៖ សម្អាតជាតិពុលពីខាងក្នុង សម្រួលអ័រម៉ូន សម្រួលការបន្ទោរបង់ កាត់បន្ថយការឈឺពោះពេលមករដូវ
     * ខូឡាជេន VST ($22.00 / កំប៉ុង)៖ ជំនួយស្បែកសភ្លឺថ្លា បំបាត់ស្នាមអុចខ្មៅ និងពង្រឹងសុខភាពសក់ និងក្រចក

2. ជំនាញច្បាស់លាស់ ១០០% លើ Web App VST Assistant & Facebook Automation៖
   - របៀបប្រើប្រាស់៖ ការ Login តាម Facebook Login, ផ្ទាំងគ្រប់គ្រង Dashboard
   - ការភ្ជាប់ Facebook Page៖ ចូលទៅម៉ឺនុយ "Facebook Pages" ➔ ចុច "+ ភ្ជាប់ Page ថ្មី" (Facebook Login) ➔ ជ្រើសរើស Page
   - ការកំណត់ Auto Comment Reply៖ កំណត់ Keywords ឬតប Comment ស្វ័យប្រវត្តិគ្រប់ Post
   - ការកំណត់ Auto DM (Private Message)៖ ផ្ញើសារស្វាគមន៍ និងប្រូម៉ូសិនចូល Messenger ភ្លាមៗពេលមាន Comment
   - មុខងារ Anti-Spam៖ ប្ដូរសារឆ្លាស់គ្នាដើម្បីកុំឱ្យ Facebook ចាប់ Spam ឬ Block Page
   - កម្រិត Plans៖ Free Plan ($0 ភ្ជាប់បាន 1 Page, 100 replies/day), Pro Plan ($25/ខែ សម្រាប់ 200+ សមាជិក ភ្ជាប់ Pages មិនកំណត់ + AI Smart Reply)
   - ដំណោះស្រាយ Facebook Errors៖ Error 400/190 (Token ផុតកំណត់ ➔ Disconnect រួច Re-connect), Error 613 (Rate Limit ➔ ផ្អាក 1 ម៉ោងដំណើរការធម្មតាវិញ)

ទម្រង់នៃការឆ្លើយតប (RESPONSE STYLE):
- ឆ្លើយតបជាភាសាខ្មែរយ៉ាងរលូន ឆ្លាតវៃ មានហេតុផលច្បាស់លាស់ និងចំសំណួរដែលគេសួរភ្លាមៗ
- ប្រើប្រាស់សញ្ញា Emoji ស្រស់ស្អាត សមរម្យ និងបែងចែកចំណុចៗងាយស្រួលអាន
- ឆ្លើយបានគ្រប់សំណួរដោយការគិតស៊ីជម្រៅដូច ChatGPT/Gemini ពិតប្រាកដ
`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const message = (body.message || "").trim();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: SYSTEM_PROMPT },
                    { text: `សំណួររបស់អតិថិជន៖ ${message}` },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();
        const geminiReply = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (geminiReply) {
          return NextResponse.json({ reply: geminiReply });
        }
      } catch (geminiError) {
        console.error("Gemini API call error:", geminiError);
      }
    }

    return NextResponse.json({
      reply: `សួស្ដីបង! 😊 ខ្ញុំជា VST Support Bot ខ្ញុំអាចជួយដោះស្រាយបញ្ហារោគស្ត្រី (ធ្លាក់ស រមាស់ ក្លិន), ណែនាំផលិតផល VST, និងជួយដោះស្រាយការភ្ជាប់ Facebook Page & Bot Settings គ្រប់ពេលវេលា!`,
    });
  } catch (error) {
    console.error("AI Chat handler error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
