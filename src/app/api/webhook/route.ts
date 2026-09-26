import { NextRequest, NextResponse } from "next/server";

// Facebook Webhook Verify Token (configured in Facebook App Dashboard)
const VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN || "vst_assistant_secret_token_2026";

/**
 * GET Handler for Facebook Webhook verification
 * When you setup Webhook in Facebook App Developer Console, Facebook sends a GET request here
 */
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

/**
 * POST Handler for incoming Facebook Events
 * Triggered when customer comments on a post or sends a message in Messenger
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Check if event is from page subscription
    if (body.object === "page") {
      for (const entry of body.entry) {
        const pageId = entry.id;
        const time = entry.time;

        // 1. Messenger messages
        if (entry.messaging) {
          for (const event of entry.messaging) {
            const senderId = event.sender?.id;
            const messageText = event.message?.text;
            console.log(`[FB Messenger] Page: ${pageId}, From: ${senderId}, Text: "${messageText}"`);

            // Phase 1: Logic to auto-reply in Messenger
            // await handleMessengerReply(pageId, senderId, messageText);
          }
        }

        // 2. Feed updates (Comments on Posts)
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === "feed") {
              const value = change.value;
              if (value.item === "comment" && value.verb === "add") {
                const commentId = value.comment_id;
                const postId = value.post_id;
                const message = value.message;
                const from = value.from;
                console.log(`[FB Comment] New comment from ${from?.name}: "${message}" on post ${postId}`);

                // Phase 1: Logic to auto-reply comment and send private DM
                // await handleCommentReply(pageId, commentId, message, from);
              }
            }
          }
        }
      }

      return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
