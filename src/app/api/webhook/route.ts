import { NextRequest, NextResponse } from "next/server";
import { replyToComment, sendMessengerMessage } from "@/lib/facebook";
import { readFile } from "fs/promises";
import path from "path";
import os from "os";

const VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

const PAGE_ID = "955747057621489";
const STATUS_FILE = path.join(os.tmpdir(), "vst_bot_status.json");

async function isBotActive(): Promise<boolean> {
  try {
    const data = await readFile(STATUS_FILE, "utf-8");
    const json = JSON.parse(data);
    return json.active !== false;
  } catch {
    return true; // default ON
  }
}

/**
 * Anti-Spam Variations for Comment Replies with Tag Mention
 */
function getCommentReply(senderId?: string, senderName?: string) {
  const userTag = senderId ? `@[${senderId}]` : `បង ${senderName || "អតិថិជន"}`;
  const replies = [
    `សួស្ដី ${userTag}! 😊 អរគុណសម្រាប់ការចាប់អារម្មណ៍។ ខ្ញុំបានផ្ញើព័ត៌មានលម្អិត និងតម្លៃពិសេសជូនបងហើយណា 💬👉 https://m.me/${PAGE_ID}`,
    `ជម្រាបសួរ ${userTag}! 🌸 ព័ត៌មាន និងប្រូម៉ូសិនពិសេសត្រូវបានរៀបចំជូនបងរួចរាល់ហើយ សូមចុចត្រង់នេះដើម្បីឆាតមកកាន់ Inbox 🥰👉 https://m.me/${PAGE_ID}`,
    `សួស្ដី ${userTag}! ✨ ផលិតផលគុណភាពខ្ពស់ ផ្ដល់ទំនុកចិត្ត១០០%។ សូមចុចត្រង់នេះដើម្បីទទួលការប្រឹក្សាភ្លាមៗណា៎បង 💌👉 https://m.me/${PAGE_ID}`,
  ];
  return replies[Math.floor(Math.random() * replies.length)];
}

export async function GET(req: NextRequest) {
  if (!VERIFY_TOKEN) {
    console.error("[Webhook] FB_WEBHOOK_VERIFY_TOKEN is not configured.");
    return new Response("Server configuration error", { status: 500 });
  }

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
    if (!PAGE_ACCESS_TOKEN) {
      console.error("[Webhook] FB_PAGE_ACCESS_TOKEN is not configured.");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // ✅ Master Kill Switch — check if bot is active before processing
    const botActive = await isBotActive();
    if (!botActive) {
      console.log("[Webhook] Bot is currently OFF (Master Kill Switch). Skipping reply.");
      return NextResponse.json({ status: "bot_paused" });
    }

    const body = await req.json();

    if (body.object === "page") {
      for (const entry of body.entry) {
        const pageId = entry.id;

        // 1. Messenger incoming message (Auto Welcome & Smart Answer)
        if (entry.messaging) {
          for (const event of entry.messaging) {
            const senderId = event.sender?.id;
            const messageText = event.message?.text;

            // Prevent bot replying to its own echoes
            if (senderId && messageText && !event.message?.is_echo) {
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

        // 2. Feed updates (Comments on Posts ➔ Auto Reply + Auto DM)
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === "feed") {
              const value = change.value;

              if (value.item === "comment" && value.verb === "add") {
                const commentId = value.comment_id;
                const senderId = value.from?.id;
                const senderName = value.from?.name || "បង";
                const userComment = value.message || "";

                console.log(`[New Comment] From: ${senderName} (${senderId}), Comment: "${userComment}"`);

                // A. Auto Reply on the Comment (Anti-Spam variation with Tag Mention)
                const commentText = getCommentReply(senderId, senderName);
                await replyToComment({
                  pageAccessToken: PAGE_ACCESS_TOKEN,
                  commentId: commentId,
                  message: commentText,
                });

                // B. Auto Send Private DM to customer Inbox
                if (senderId) {
                  const dmText = `សួស្ដីបង ${senderName}! 🌸 អរគុណដែលបាន comment លើទំព័រយើងខ្ញុំ។ តើបងចង់ដឹងព័ត៌មានលម្អិត ឬតម្លៃផលិតផលដែរទេ? ខ្ញុំអាចជួយផ្ដល់ការប្រឹក្សាជូនបងបានភ្លាមៗណា! 💬✨`;
                  await sendMessengerMessage({
                    pageAccessToken: PAGE_ACCESS_TOKEN,
                    recipientId: senderId,
                    message: dmText,
                  });
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
