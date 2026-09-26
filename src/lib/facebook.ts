/**
 * Facebook Graph API helper for sending comment replies and private messages
 */

export interface FBCommentReplyOptions {
  pageAccessToken: string;
  commentId: string;
  message: string;
}

export interface FBPrivateMessageOptions {
  pageAccessToken: string;
  recipientId: string;
  message: string;
}

/**
 * Reply directly to a Facebook comment
 */
export async function replyToComment({
  pageAccessToken,
  commentId,
  message,
}: FBCommentReplyOptions) {
  const url = `https://graph.facebook.com/v19.0/${commentId}/comments?access_token=${pageAccessToken}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  return res.json();
}

/**
 * Send a Private Message (DM) to customer via Messenger
 */
export async function sendMessengerMessage({
  pageAccessToken,
  recipientId,
  message,
}: FBPrivateMessageOptions) {
  const url = `https://graph.facebook.com/v19.0/me/messages?access_token=${pageAccessToken}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipient: { id: recipientId },
      message: { text: message },
    }),
  });
  return res.json();
}
