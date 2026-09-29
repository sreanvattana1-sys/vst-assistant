import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Missing Facebook access token" },
        { status: 400 }
      );
    }

    // 1. Fetch User Profile from Facebook Graph API
    const userRes = await fetch(
      `https://graph.facebook.com/v21.0/me?fields=id,name,email,picture.width(200).height(200)&access_token=${accessToken}`
    );
    const userData = await userRes.json();

    if (userData.error) {
      console.error("Facebook User Profile error:", userData.error);
      return NextResponse.json(
        { success: false, error: userData.error.message },
        { status: 400 }
      );
    }

    // 2. Fetch all Pages managed by this User
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,category,picture.width(150).height(150),tasks&limit=100&access_token=${accessToken}`
    );
    const pagesData = await pagesRes.json();

    const rawPages = Array.isArray(pagesData.data) ? pagesData.data : [];

    const formattedPages = rawPages.map((p: any) => ({
      id: p.id,
      name: p.name,
      category: p.category || "Facebook Page",
      picture: p.picture?.data?.url || null,
      accessToken: p.access_token,
      isActive: true,
      tasks: p.tasks || [],
    }));

    let userStatus = "Active";
    let userBotEnabled = true;

    // 3. Save or sync to Supabase (if bot_settings exists)
    try {
      // Store/update user session & pages list into bot_settings or customer records
      for (const p of formattedPages) {
        // Upsert default settings for each discovered page
        await supabase.from("bot_settings").upsert(
          {
            id: p.id,
            is_active: true,
            reply_templates: [
              `សួស្ដី {name}! 😊 អរគុណសម្រាប់ការចាប់អារម្មណ៍លើទំព័រ ${p.name}។ ខ្ញុំបានផ្ញើព័ត៌មានលម្អិតជូនបងហើយណា 💬👉 https://m.me/${p.id}`,
            ],
            auto_dm_enabled: true,
            dm_template: `សួស្ដីបង {name}! 🌸 អរគុណដែលបាន comment លើទំព័រ ${p.name}។ តើបងចង់ដឹងព័ត៌មានលម្អិត ឬតម្លៃផលិតផលដែរទេ? ខ្ញុំអាចជួយផ្ដល់ការប្រឹក្សាជូនបងបានភ្លាមៗណា! 💬✨`,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        );

        // Automatically subscribe this page to webhooks (feed comments and messages)
        if (p.accessToken) {
          try {
            await fetch(
              `https://graph.facebook.com/v21.0/${p.id}/subscribed_apps?subscribed_fields=feed,messages&access_token=${p.accessToken}`,
              { method: "POST" }
            );
          } catch (subErr) {
            console.warn(`[Facebook Auth] Webhook subscription notice for ${p.name}:`, subErr);
          }
        }
      }

      // 4. Update connected members list in Supabase
      try {
        const { data: memberData } = await supabase
          .from("bot_settings")
          .select("dm_template")
          .eq("id", "vst_members")
          .maybeSingle();

        let membersList: any[] = [];
        if (memberData && memberData.dm_template) {
          try {
            membersList = JSON.parse(memberData.dm_template);
          } catch {}
        }

        const existingIndex = membersList.findIndex(
          (m: any) => m.id === userData.id || m.name === userData.name
        );

        if (existingIndex >= 0) {
          const existing = membersList[existingIndex];
          userStatus = existing.status || "Active";
          userBotEnabled = existing.botEnabled !== false && existing.status !== "Disabled";
        }

        const memberEntry = {
          id: userData.id,
          name: userData.name,
          email: userData.email || null,
          picture: userData.picture?.data?.url || null,
          role: "Member / Tester",
          loginType: "Facebook OAuth",
          pagesCount: formattedPages.length,
          pages: formattedPages.map((p: any) => ({
            id: p.id,
            name: p.name,
            category: p.category,
            accessToken: p.accessToken,
          })),
          lastLogin: new Date().toISOString(),
          status: userStatus,
          botEnabled: userBotEnabled,
        };

        if (existingIndex >= 0) {
          membersList[existingIndex] = { ...membersList[existingIndex], ...memberEntry };
        } else {
          membersList.push(memberEntry);
        }

        await supabase.from("bot_settings").upsert({
          id: "vst_members",
          is_active: true,
          dm_template: JSON.stringify(membersList),
          updated_at: new Date().toISOString(),
        });
      } catch (memErr) {
        console.error("Member tracking error:", memErr);
      }
    } catch (dbErr) {
      console.error("Supabase pages sync warning:", dbErr);
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email || null,
        picture: userData.picture?.data?.url || null,
        loginType: "facebook",
        loginTime: new Date().toISOString(),
        status: userStatus,
        botEnabled: userBotEnabled,
      },
      pages: formattedPages,
      totalPages: formattedPages.length,
    });
  } catch (error) {
    console.error("Facebook Auth API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
