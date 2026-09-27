import { NextRequest, NextResponse } from "next/server";
import { replyToComment } from "@/lib/facebook";
import { readFile } from "fs/promises";
import path from "path";
import os from "os";

const PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

const PAGE_ID = "955747057621489";
const STATUS_FILE = path.join(os.tmpdir(), "vst_bot_status.json");

async function isBotActive(): Promise<boolean> {
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
    if (!PAGE_ACCESS_TOKEN) {
      console.error("[Auto Scanner] FB_PAGE_ACCESS_TOKEN is not configured.");
      return NextResponse.json(
        { error: "Server configuration error", activities: [], totalComments: 0 },
        { status: 500 }
      );
    }

    // ✅ Master Kill Switch — check if bot is active
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

          // Skip if this comment itself was posted by the Page
          if (senderId === PAGE_ID) continue;

          // Check if the page has already replied
          const pageReplyObj = c.comments?.data?.find(
            (subC: { from?: { id?: string } }) => subC.from?.id === PAGE_ID
          );
          const hasPageReply = Boolean(pageReplyObj) || repliedCommentIds.has(commentId);

          if (!hasPageReply) {
            // Tag Mention user directly on Facebook if senderId exists; otherwise polite Khmer greeting
            const userTag = senderId
              ? `@[${senderId}]`
              : senderName && senderName !== "Customer" && senderName !== "អតិថិជន"
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
