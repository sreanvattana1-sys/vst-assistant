import { NextRequest, NextResponse } from "next/server";
import { replyToComment } from "@/lib/facebook";
import { supabase } from "@/lib/supabase";
import { readFile } from "fs/promises";
import path from "path";
import os from "os";

const PAGE_ACCESS_TOKEN =
  process.env.FB_PAGE_ACCESS_TOKEN ||
  "EAAUPN18ZBh34BSpqG93ehAQSnxpQiKZAT2OQXM4PiK205FGexKTZC24bUTQev0RzMXoNzDWcfla0LlmLtQJwmBtLOe7t3ZAc55mYm8apB1eYb4IstFUZA8ZC6GpFHEtP2BIcCLkbzEwG5uTrTfVjqO1u3i2je6TBu8XNoQjdtSRqni9IJw4yKHzMOM1UYtycbXy2ZCSS9Ks";

const PAGE_ID = "955747057621489";
const STATUS_FILE = path.join(os.tmpdir(), "vst_bot_status.json");

async function isBotActive(): Promise<boolean> {
  try {
    const { data } = await supabase
      .from("bot_settings")
      .select("is_active")
      .eq("id", "default")
      .single();

    if (data) {
      return data.is_active !== false;
    }
  } catch (e) {
    console.error("Supabase isBotActive error in scanner:", e);
  }

  try {
    const data = await readFile(STATUS_FILE, "utf-8");
    const json = JSON.parse(data);
    return json.active !== false;
  } catch {
    return true;
  }
}

const repliedCommentIds = new Set<string>();

export interface CommentActivity {
  commentId: string;
  postId: string;
  senderName: string;
  senderId?: string;
  message: string;
  createdTime: string;
  hasReplied: boolean;
  replyText?: string;
  permalink?: string;
}

export async function GET(req: NextRequest) {
  try {
    const botActive = await isBotActive();
    if (!botActive) {
      return NextResponse.json({
        status: "BOT_PAUSED",
        message: "Bot is currently paused",
        activities: [],
        repliesSent: 0,
        totalComments: 0,
      });
    }

    const feedRes = await fetch(
      `https://graph.facebook.com/v19.0/${PAGE_ID}/feed?fields=id,permalink_url,comments{id,message,from,created_time,comments{id,message,from,created_time}}&limit=25&access_token=${PAGE_ACCESS_TOKEN}`,
      { cache: "no-store" }
    );
    const feedData = await feedRes.json();

    if (!feedData.data) {
      return NextResponse.json({
        status: "ERROR",
        message: "Failed to fetch page posts",
        details: feedData,
        activities: [],
        totalComments: 0,
      });
    }

    const processedReplies: Array<{ commentId: string; from: string; message: string; replyText: string }> = [];
    const activities: CommentActivity[] = [];

    for (const post of feedData.data) {
      if (post.comments && post.comments.data) {
        for (const c of post.comments.data) {
          const commentId = c.id;
          const senderId = c.from?.id;
          const senderName = c.from?.name || "អតិថិជន Facebook";
          const messageText = c.message || "";

          // Skip if this comment was posted by the Page itself
          if (senderId === PAGE_ID) continue;

          // Check if there is already a reply
          const pageReplyObj = c.comments?.data?.find(
            (subC: { from?: { id?: string } }) => subC.from?.id === PAGE_ID
          );
          const hasAnyReply = Boolean(c.comments?.data && c.comments.data.length > 0);
          const hasPageReply = Boolean(pageReplyObj) || hasAnyReply || repliedCommentIds.has(commentId);
          const commentAgeSec = (Date.now() - new Date(c.created_time).getTime()) / 1000;

          // Sync lead into Supabase customers table if sender is known and valid
          if (senderName && senderName !== "Customer" && senderName !== "អតិថិជន" && senderName !== "អតិថិជន Facebook") {
            try {
              if (senderId) {
                await supabase.from("customers").upsert(
                  {
                    fb_user_id: senderId,
                    name: senderName,
                    source_page_id: PAGE_ID,
                    last_activity_at: c.created_time || new Date().toISOString(),
                  },
                  { onConflict: "fb_user_id" }
                );
              }
            } catch (err) {
              // Non-blocking sync
            }
          }

          // Only reply if there is NO reply yet AND comment is older than 45s (allow Webhook to reply first)
          if (!hasPageReply && commentAgeSec > 45) {
            const userTag =
              senderName && senderName !== "Customer" && senderName !== "អតិថិជន" && senderName !== "អតិថិជន Facebook"
                ? `បង ${senderName}`
                : "បង";

            const replyMessage = `សួស្ដី ${userTag}! 😊 អរគុណសម្រាប់ការចាប់អារម្មណ៍លើផលិតផល Kidney Pro។\n💬 សូមចុចត្រង់នេះដើម្បីទទួលយកតម្លៃប្រូម៉ូសិនពិសេសក្នុង Inbox ភ្លាមៗណា៎បង 👉 https://m.me/${PAGE_ID}`;

            const replyRes = await replyToComment({
              pageAccessToken: PAGE_ACCESS_TOKEN,
              commentId: commentId,
              message: replyMessage,
            });

            if (replyRes.id) {
              repliedCommentIds.add(commentId);
              processedReplies.push({
                commentId,
                from: senderName,
                message: messageText,
                replyText: replyMessage,
              });

              // Save to Supabase
              try {
                await supabase.from("comments").upsert({
                  id: commentId,
                  post_id: post.id,
                  fb_user_id: senderId || null,
                  sender_name: senderName,
                  message: messageText,
                  reply_message: replyMessage,
                  created_time: c.created_time,
                  permalink: post.permalink_url,
                });
              } catch (dbErr) {
                console.error("Supabase comment log error:", dbErr);
              }

              activities.push({
                commentId,
                postId: post.id,
                senderName,
                senderId,
                message: messageText,
                createdTime: c.created_time,
                hasReplied: true,
                replyText: replyMessage,
                permalink: post.permalink_url,
              });
              continue;
            }
          }

          activities.push({
            commentId,
            postId: post.id,
            senderName,
            senderId,
            message: messageText,
            createdTime: c.created_time,
            hasReplied: true,
            replyText: pageReplyObj?.message || "បានឆ្លើយតបរួចរាល់",
            permalink: post.permalink_url,
          });
        }
      }
    }

    // Sort newest comments first
    activities.sort((a, b) => new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime());

    return NextResponse.json({
      status: "SUCCESS",
      repliesSent: processedReplies.length,
      activities: activities.slice(0, 20),
      totalComments: activities.length,
    });
  } catch (error) {
    console.error("Auto Scanner error:", error);
    return NextResponse.json({ error: "Internal Server Error", activities: [], totalComments: 0 }, { status: 500 });
  }
}
