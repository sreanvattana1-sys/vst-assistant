import { NextRequest, NextResponse } from "next/server";
import { replyToComment, sendPrivateReply, sendMessengerMessage } from "@/lib/facebook";
import { supabase } from "@/lib/supabase";
import { readFile } from "fs/promises";
import path from "path";
import os from "os";

const VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN || "vst_assistant_secret_token_2026";

const PAGE_ACCESS_TOKEN =
  process.env.FB_PAGE_ACCESS_TOKEN ||
  "EAAUPN18ZBh34BSpqG93ehAQSnxpQiKZAT2OQXM4PiK205FGexKTZC24bUTQev0RzMXoNzDWcfla0LlmLtQJwmBtLOe7t3ZAc55mYm8apB1eYb4IstFUZA8ZC6GpFHEtP2BIcCLkbzEwG5uTrTfVjqO1u3i2je6TBu8XNoQjdtSRqni9IJw4yKHzMOM1UYtycbXy2ZCSS9Ks";

const PAGE_ID = "955747057621489";
const STATUS_FILE = path.join(os.tmpdir(), "vst_bot_status.json");

// In-memory cache for fast deduplication
const processedWebhookComments = new Set<string>();

async function getBotSettings(): Promise<{ isActive: boolean; templates: string[]; autoDm: boolean; dmTemplate: string }> {
  try {
    const { data } = await supabase
      .from("bot_settings")
      .select("*")
      .eq("id", "default")
      .single();

    if (data) {
      return {
        isActive: data.is_active !== false,
        templates: Array.isArray(data.reply_templates) && data.reply_templates.length > 0 ? data.reply_templates : [],
        autoDm: data.auto_dm_enabled !== false,
        dmTemplate: data.dm_template || "",
      };
    }
  } catch (e) {
    console.error("Supabase getBotSettings error, using fallback:", e);
  }

  // Local fallback
  try {
    const fileData = await readFile(STATUS_FILE, "utf-8");
    const json = JSON.parse(fileData);
    return {
      isActive: json.active !== false,
      templates: [],
      autoDm: true,
      dmTemplate: "",
    };
  } catch {
    return { isActive: true, templates: [], autoDm: true, dmTemplate: "" };
  }
}

function getCommentReply(senderName?: string, customTemplates?: string[]) {
  const displayName =
    senderName && senderName !== "Customer" && senderName !== "អតិថិជន" && senderName !== "អតិថិជន Facebook"
      ? `បង ${senderName}`
      : "បង";

  const defaultTemplates = [
    `សួស្ដី${displayName ? " " + displayName : ""}! 😊 អរគុណសម្រាប់ការចាប់អារម្មណ៍។ ខ្ញុំបានផ្ញើព័ត៌មានលម្អិត និងតម្លៃពិសេសជូនបងហើយណា 💬👉 https://m.me/${PAGE_ID}`,
    `ជម្រាបសួរ${displayName ? " " + displayName : ""}! 🌸 ព័ត៌មាន និងប្រូម៉ូសិនពិសេសត្រូវបានរៀបចំជូនបងរួចរាល់ហើយ សូមចុចត្រង់នេះដើម្បីឆាតមកកាន់ Inbox 🥰👉 https://m.me/${PAGE_ID}`,
    `សួស្ដី${displayName ? " " + displayName : ""}! ✨ ផលិតផលគុណភាពខ្ពស់ ផ្ដល់ទំនុកចិត្ត១០០%។ សូមចុចត្រង់នេះដើម្បីទទួលការប្រឹក្សាភ្លាមៗណា៎បង 💌👉 https://m.me/${PAGE_ID}`,
  ];

  const pool = customTemplates && customTemplates.length > 0 ? customTemplates : defaultTemplates;
  const picked = pool[Math.floor(Math.random() * pool.length)];
  return picked.replace(/{name}/g, displayName);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✓ Facebook Webhook verified successfully!");
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden: Invalid verification token", { status: 403 });
}

export async function POST(req: NextRequest) {
  try {
    // 1. Fetch settings from Supabase (or fallback)
    const settings = await getBotSettings();
    if (!settings.isActive) {
      console.log("[Webhook] Bot is currently OFF (Master Kill Switch). Skipping reply.");
      return NextResponse.json({ status: "bot_paused" });
    }

    const body = await req.json();

    if (body.object === "page") {
      for (const entry of body.entry) {
        const pageId = entry.id;

        // Messenger incoming message
        if (entry.messaging) {
          for (const event of entry.messaging) {
            const senderId = event.sender?.id;
            const messageText = event.message?.text;

            if (senderId && messageText && !event.message?.is_echo && senderId !== PAGE_ID && senderId !== pageId) {
              console.log(`[Messenger Event] Page: ${pageId}, Sender: ${senderId}, Text: "${messageText}"`);

              const replyText =
                "សូមស្វាគមន៍មកកាន់ VST Assistant 🌸! តើបងមានបញ្ហាសុខភាព ឬចង់បានការប្រឹក្សាលើផលិតផលណាខ្លះដែរ? ខ្ញុំរីករាយជួយជានិច្ច! 🥰";

              await sendMessengerMessage({
                pageAccessToken: PAGE_ACCESS_TOKEN,
                recipientId: senderId,
                message: replyText,
              });
            }
          }
        }

        // Feed updates (Comments on Posts)
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === "feed") {
              const value = change.value;

              if (value.item === "comment" && value.verb === "add") {
                const commentId = value.comment_id;
                const senderId = value.from?.id;
                const senderName = value.from?.name;
                const userComment = value.message || "";
                const postId = value.post_id;

                // 🛑 CRITICAL CHECK 1: Never reply to our own comments/replies
                if (senderId === PAGE_ID || senderId === pageId) {
                  console.log(`[Webhook] Skipping own comment from page ${senderId}`);
                  continue;
                }

                // 🛑 CRITICAL CHECK 2: Do not reply to nested replies
                if (value.parent_id && value.parent_id !== value.post_id) {
                  console.log(`[Webhook] Skipping nested reply ${commentId} on parent ${value.parent_id}`);
                  continue;
                }

                // 🛑 CRITICAL CHECK 3: In-memory Deduplication
                if (processedWebhookComments.has(commentId)) {
                  console.log(`[Webhook] Already processed in-memory: ${commentId}`);
                  continue;
                }
                processedWebhookComments.add(commentId);

                // 🛑 CRITICAL CHECK 4: Database Deduplication
                try {
                  const { data: existingComment } = await supabase
                    .from("comments")
                    .select("id")
                    .eq("id", commentId)
                    .maybeSingle();

                  if (existingComment) {
                    console.log(`[Webhook] Comment already in Supabase DB: ${commentId}`);
                    continue;
                  }
                } catch (dbErr) {
                  console.error("Supabase dedup check error:", dbErr);
                }

                console.log(`[New Comment] From: ${senderName || "Unknown"} (${senderId}), Comment: "${userComment}"`);

                // A. Auto Reply on Comment
                const commentText = getCommentReply(senderName, settings.templates);
                const replyRes = await replyToComment({
                  pageAccessToken: PAGE_ACCESS_TOKEN,
                  commentId: commentId,
                  message: commentText,
                });
                console.log(`[Webhook] Reply sent for comment ${commentId}:`, replyRes);

                // B. Auto Private Reply (DM into Customer Messenger)
                if (settings.autoDm) {
                  try {
                    const displayName =
                      senderName && senderName !== "Customer" && senderName !== "អតិថិជន" && senderName !== "អតិថិជន Facebook"
                        ? senderName
                        : "បង";
                    const dmTextTemplate =
                      settings.dmTemplate ||
                      "សួស្ដីបង {name}! 🌸 អរគុណដែលបាន comment លើទំព័រយើងខ្ញុំ។ តើបងចង់ដឹងព័ត៌មានលម្អិត ឬតម្លៃផលិតផលដែរទេ? ខ្ញុំអាចជួយផ្ដល់ការប្រឹក្សាជូនបងបានភ្លាមៗណា! 💬✨";
                    const dmMessage = dmTextTemplate.replace(/{name}/g, displayName);

                    const dmRes = await sendPrivateReply({
                      pageAccessToken: PAGE_ACCESS_TOKEN,
                      commentId: commentId,
                      message: dmMessage,
                    });
                    console.log(`[Webhook] Private Reply (DM) sent for comment ${commentId}:`, dmRes);
                  } catch (dmErr) {
                    console.error(`[Webhook] Private Reply failed for comment ${commentId}:`, dmErr);
                  }
                }

                // C. Save Comment to Supabase
                try {
                  await supabase.from("comments").upsert({
                    id: commentId,
                    post_id: postId,
                    fb_user_id: senderId || null,
                    sender_name: senderName || "អតិថិជន Facebook",
                    message: userComment,
                    reply_message: commentText,
                    created_time: new Date().toISOString(),
                    replied_at: new Date().toISOString(),
                    permalink: value.permalink_url || null,
                  });
                } catch (e) {
                  console.error("Failed to save comment to Supabase:", e);
                }

                // C. Save / Update Customer in Supabase
                if (senderName || senderId) {
                  try {
                    const custName = senderName || "អតិថិជន Facebook";
                    if (senderId) {
                      // Check if customer exists
                      const { data: existingCust } = await supabase
                        .from("customers")
                        .select("id, total_comments")
                        .eq("fb_user_id", senderId)
                        .maybeSingle();

                      if (existingCust) {
                        await supabase
                          .from("customers")
                          .update({
                            name: custName,
                            total_comments: (existingCust.total_comments || 1) + 1,
                            last_activity_at: new Date().toISOString(),
                          })
                          .eq("id", existingCust.id);
                      } else {
                        await supabase.from("customers").insert({
                          fb_user_id: senderId,
                          name: custName,
                          status: "new",
                          total_comments: 1,
                          source_page_id: PAGE_ID,
                          first_contact_at: new Date().toISOString(),
                          last_activity_at: new Date().toISOString(),
                        });
                      }
                    } else {
                      // If no senderId, insert by name
                      await supabase.from("customers").insert({
                        name: custName,
                        status: "new",
                        total_comments: 1,
                        source_page_id: PAGE_ID,
                      });
                    }
                  } catch (custErr) {
                    console.error("Failed to record customer in Supabase:", custErr);
                  }
                }
              }
            }
          }
        }
      }

      return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  } catch (error) {
    console.error("Webhook event error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
