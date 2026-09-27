import { NextRequest, NextResponse } from "next/server";
import { replyToComment, sendMessengerMessage } from "@/lib/facebook";
import { readFile } from "fs/promises";
import path from "path";
import os from "os";

const VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN || "vst_assistant_secret_token_2026";

// Page Token configured from environment or fallback to verified token
const PAGE_ACCESS_TOKEN =
  process.env.FB_PAGE_ACCESS_TOKEN ||
  "EAAUPN18ZBh34BSpqG93ehAQSnxpQiKZAT2OQXM4PiK205FGexKTZC24bUTQev0RzMXoNzDWcfla0LlmLtQJwmBtLOe7t3ZAc55mYm8apB1eYb4IstFUZA8ZC6GpFHEtP2BIcCLkbzEwG5uTrTfVjqO1u3i2je6TBu8XNoQjdtSRqni9IJw4yKHzMOM1UYtycbXy2ZCSS9Ks";

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

const processedWebhookComments = new Set<string>();

/**
 * Anti-Spam Variations for Comment Replies with Friendly Name
 */
function getCommentReply(senderId?: string, senderName?: string) {
  const displayName =
    senderName && senderName !== "Customer" && senderName !== "អតិថិជន" && senderName !== "អតិថិជន Facebook"
      ? `បង ${senderName}`
      : "បង";

  const replies = [
    `សួស្ដី${displayName ? " " + displayName : ""}! 😊 អរគុណសម្រាប់ការចាប់អារម្មណ៍។ ខ្ញុំបានផ្ញើព័ត៌មានលម្អិត និងតម្លៃពិសេសជូនបងហើយណា 💬👉 https://m.me/${PAGE_ID}`,
    `ជម្រាបសួរ${displayName ? " " + displayName : ""}! 🌸 ព័ត៌មាន និងប្រូម៉ូសិនពិសេសត្រូវបានរៀបចំជូនបងរួចរាល់ហើយ សូមចុចត្រង់នេះដើម្បីឆាតមកកាន់ Inbox 🥰👉 https://m.me/${PAGE_ID}`,
    `សួស្ដី${displayName ? " " + displayName : ""}! ✨ ផលិតផលគុណភាពខ្ពស់ ផ្ដល់ទំនុកចិត្ត១០០%។ សូមចុចត្រង់នេះដើម្បីទទួលការប្រឹក្សាភ្លាមៗណា៎បង 💌👉 https://m.me/${PAGE_ID}`,
  ];
  return replies[Math.floor(Math.random() * replies.length)];
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

            // Prevent bot replying to its own echoes or page itself
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

        // 2. Feed updates (Comments on Posts ➔ Auto Reply + Auto DM)
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === "feed") {
              const value = change.value;

              if (value.item === "comment" && value.verb === "add") {
                const commentId = value.comment_id;
                const senderId = value.from?.id;
                const senderName = value.from?.name;
                const userComment = value.message || "";

                // 🛑 CRITICAL CHECK 1: Never reply to our own comments/replies
                if (senderId === PAGE_ID || senderId === pageId) {
                  console.log(`[Webhook] Skipping own comment from page ${senderId}`);
                  continue;
                }

                // 🛑 CRITICAL CHECK 2: Do not reply to nested replies (only top-level comments)
                if (value.parent_id && value.parent_id !== value.post_id) {
                  console.log(`[Webhook] Skipping nested reply ${commentId} on parent ${value.parent_id}`);
                  continue;
                }

                // 🛑 CRITICAL CHECK 3: Deduplication (don't reply twice to the same comment)
                if (processedWebhookComments.has(commentId)) {
                  console.log(`[Webhook] Already processed comment ${commentId}, skipping.`);
                  continue;
                }
                processedWebhookComments.add(commentId);

                console.log(`[New Comment] From: ${senderName || "Unknown"} (${senderId}), Comment: "${userComment}"`);

                // A. Auto Reply on the Comment
                const commentText = getCommentReply(senderId, senderName);
                await replyToComment({
                  pageAccessToken: PAGE_ACCESS_TOKEN,
                  commentId: commentId,
                  message: commentText,
                });

                // B. Auto Send Private DM to customer Inbox
                if (senderId) {
                  const greeting = senderName ? `បង ${senderName}` : "បង";
                  const dmText = `សួស្ដី${greeting}! 🌸 អរគុណដែលបាន comment លើទំព័រយើងខ្ញុំ។ តើបងចង់ដឹងព័ត៌មានលម្អិត ឬតម្លៃផលិតផលដែរទេ? ខ្ញុំអាចជួយផ្ដល់ការប្រឹក្សាជូនបងបានភ្លាមៗណា! 💬✨`;
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
