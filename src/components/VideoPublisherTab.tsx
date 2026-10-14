"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Video,
  Film,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  Layers,
  FileText,
  Clock,
  Play,
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  ExternalLink,
  Plus,
  Trash2,
  Flame,
  Stethoscope,
  HelpCircle,
  Star,
  Award,
  Image as ImageIcon,
} from "lucide-react";
import { VideoPostRecord } from "@/app/api/video-publisher/route";

const OFFICIAL_COMPANY_PAGES = [
  {
    id: "955747057621489",
    name: "Kidney Pro ឃីដនី ប្រូ",
    category: "សុខភាព & សម្រស់ (Health/Beauty)",
    description: "ផ្តោតលើផលិតផលជំនួយសុខភាពតម្រងនោម នោមទាស់ នោមញឹក ឈឺចង្កេះ",
  },
  {
    id: "1039779202551647",
    name: "អេមមី សុខភាពស្រ្តី",
    category: "សុខភាពស្ត្រី (Women Health)",
    description: "ផ្តោតលើសុខភាពស្បូនស្រ្តី រដូវមិនទៀង ធ្លាក់ស ក្លិនមិនល្អ",
  },
  {
    id: "827063453815073",
    name: "គុណភាពតម្រងនោម",
    category: "សុខភាពតម្រងនោម (Kidney Care)",
    description: "ការអប់រំ និងការពារជំងឺតម្រងនោម ការថែទាំជាតិពុលក្នុងឈាម",
  },
  {
    id: "928036717066754",
    name: "Emmi Cambodia",
    category: "សម្រស់ & ថែទាំ (Beauty/Care)",
    description: "ចែកចាយទូទាំងប្រទេស ប្រូម៉ូសិនកញ្ចប់ធំ និងសេវាកម្មរហ័ស",
  },
  {
    id: "923321100873981",
    name: "Emmi",
    category: "ផលិតផលផ្លូវការ (Official)",
    description: "ផលិតផលដើមសុទ្ធ ១០០% របៀបប្រើប្រាស់ត្រឹមត្រូវ និងប្រសិទ្ធភាព",
  },
  {
    id: "985673367962860",
    name: "Emmi By CEO",
    category: "ម៉ាកយីហោ (Brand)",
    description: "ការធានាផ្ទាល់ពី CEO គុណភាពលំដាប់ VIP និងកិត្តិយសម៉ាកយីហោ",
  },
  {
    id: "997410203461527",
    name: "Emmi Care",
    category: "ថែទាំសម្រស់ (Care/Beauty)",
    description: "ការថែរក្សាស្បែក និងសម្រស់ក្មេងជាងវ័យ ទំនុកចិត្តនារីសម័យថ្មី",
  },
  {
    id: "101267342561819",
    name: "Emmi អេមមី",
    category: "វីដេអូ & Reel (Reel Creator)",
    description: "Reels វីដេអូខ្លីៗទាក់ទាញ ការកម្សាន្ត និងចំណេះដឹងរហ័ស",
  },
];

const GOLDEN_PRESETS = [
  {
    id: "treatment",
    label: "🌿 Emmi ព្យាបាលធ្លាក់ស/រដូវមិនទៀង (២០មុខ)",
    text: `ធ្លាក់ស រដូវមកមិនទៀង មានក្លិនមិនល្អ... ឈប់បារម្ភទៀតទៅ! 
Emmi ជំនួយការពិសេសសម្រាប់សុខភាពស្ត្រី។ ផលិតផលដែលរួមផ្សំឡើងពីគ្រឿងផ្សំធម្មជាតិជិត ២០មុខ ជួយដោះស្រាយបញ្ហា៖
✅ រដូវមកមិនទៀង និងឈឺចាប់ខ្លាំង
✅ ធ្លាក់/ស រមាស់ និងមានក្លិន
✅ ផ្សិតក្នុងទ្វារ.មាស
✅ សិរមាន់ HVP
✅ ស្ងួតទ្វា.មាស់
✅ បញ្ហាស្បូន...

🛡️ ជួយឱ្យរដូវមកទៀងទាត់ ផ្តល់ទំនុកចិត្ត និងសុខភាពល្អពីខាងក្នុង! ឃើញប្រសិទ្ធភាពលឿន... 
👉 ឆាតមកយើងឥឡូវនេះដើម្បីទទួលបានការប្រឹក្សាយោបល់ឥតគិតថ្លៃ!`,
  },
  {
    id: "daily_care",
    label: "🌸 Emmi ថែរក្សាប្រចាំថ្ងៃ (ស្តង់ដារកូរ៉េ)",
    text: `ស្ត្រីជាច្រើនអាចជួបប្រទះបញ្ហាដូចជា៖
💗 អារម្មណ៍មិនស្រួលនៅតំបន់សម្ងាត់
💗 ក្លិនមិនស្រស់ស្រាយ
💗 សំណើម ឬទឹករំអិលប្រែប្រួល
💗 អារម្មណ៍រមាស់ ឬរំខាន
💗 ភាពស្ងួត និងមិនស្រួលខ្លួន
💗 ការប្រែប្រួលដែលកើតឡើងតាមវ័យ និងរបៀបរស់នៅ

🇰🇷 Emmi (អេមមី) ជាផលិតផលថែរក្សាសុខភាពនារី ស្តង់ដារកូរ៉េសម្រាប់ថែរក្សាខ្លួនប្រចាំថ្ងៃ។
✨ ងាយស្រួលប្រើ
✨ សម្រាប់ការថែរក្សាប្រចាំថ្ងៃ
✨ គុណភាពតាមស្តង់ដារកូរ៉េ
✨ ជួយឲ្យការថែរក្សាខ្លួនកាន់តែងាយស្រួល

📩 ចង់ដឹងព័ត៌មានលម្អិត របៀបប្រើ និងតម្លៃ សូមផ្ញើសារមក Page`,
  },
  {
    id: "kidney",
    label: "🛡️ Kidney Pro ជំនួយតម្រងនោម & នោមញឹក",
    text: `បងប្អូនជាច្រើនអាចជួបប្រទះបញ្ហាដូចជា៖
🌿 នោមញឹកពេលយប់លើសពី ២-៣ ដង
🌿 នោមទាស់ នោមរអាក់រអួល ឬឈឺផ្សា
🌿 ចុកចង្កេះ ចុករួយខ្នង ងើបមិនចង់រួច
🌿 អស់កម្លាំងល្ហិតល្ហៃ គេងមិនលក់ស្រួល
🌿 សញ្ញាជាតិពុលកើនឡើងក្នុងតម្រងនោម

🛡️ Kidney Pro (ឃីដនី ប្រូ) ជំនួយតម្រងនោម និងបន្សុទ្ធជាតិពុល ផ្សំពីរុក្ខជាតិឱសថធម្មជាតិ៖
✅ សម្រួលការបត់ជើងតូចឱ្យស្រួល គេងលក់ពេញមួយយប់
✅ បំបាត់អាការៈចុកចង្កេះ និងអស់កម្លាំង
✅ ជំនួយកោសិកាតម្រងនោមឱ្យរឹងមាំយូរអង្វែង
✅ គុណភាពស្ដង់ដារ ទុកចិត្តបាន ១០០%

📩 ឆាតមកកាន់យើងខ្ញុំឥឡូវនេះ ដើម្បីទទួលបានការប្រឹក្សាសុខភាពដោយឥតគិតថ្លៃ!`,
  },
];

interface VideoPublisherTabProps {
  lang: "km" | "en";
  connectedPages: { id: string; name: string; category?: string }[];
}

export default function VideoPublisherTab({
  lang,
  connectedPages: propsPages,
}: VideoPublisherTabProps) {
  // Use official 8 pages pre-configured
  const allTargetPages = OFFICIAL_COMPANY_PAGES;

  // Media Type State: "video" (default) | "photo" | "text"
  const [mediaType, setMediaType] = useState<"video" | "photo" | "text">("video");

  // Video Source State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [videoDirectUrl, setVideoDirectUrl] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState("");
  const [postType, setPostType] = useState<"reels" | "video">("reels");

  // Photo Source State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string>("");

  // Detailed Media Story/Content for Gemini 3.8 Deep Caption Generation
  const [mediaStory, setMediaStory] = useState<string>("");

  // Master Caption Template (Golden copy state)
  const [masterCaption, setMasterCaption] = useState<string>(GOLDEN_PRESETS[0].text);

  // Selected Pages State (default: ALL 8 PAGES PRE-SELECTED)
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>(
    allTargetPages.map((p) => p.id)
  );

  // Caption Strategy / Style Selector
  const [captionStyle, setCaptionStyle] = useState<
    "promotion" | "education" | "question" | "testimonial" | "branding"
  >("promotion");

  // Base Topic & Captions Map: pageId -> caption string
  const [baseTopic, setBaseTopic] = useState("");
  const [captionsMap, setCaptionsMap] = useState<Record<string, string>>({});
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [expandedCaptionPageId, setExpandedCaptionPageId] = useState<string | null>(null);

  // Publishing State
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishProgress, setPublishProgress] = useState<{
    total: number;
    completed: number;
    status: string;
  } | null>(null);
  const [publishResults, setPublishResults] = useState<{
    pageId: string;
    pageName: string;
    status: "success" | "error";
    postId?: string;
    message?: string;
    needsReauth?: boolean;
  }[] | null>(null);
  const [isReauthorizing, setIsReauthorizing] = useState(false);

  // Refs for file inputs
  const videoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Re-authorize Facebook with pages_manage_posts and publish_video permissions
  const triggerFacebookReauth = () => {
    setIsReauthorizing(true);
    const redirectUri =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://vst-assistant.vercel.app";
    const scopes =
      "public_profile,pages_show_list,pages_read_engagement,pages_read_user_content,pages_manage_engagement,pages_manage_metadata,pages_messaging,pages_manage_posts,publish_video,ads_read,ads_management";
    const fbOAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=1424105379104638&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=token&auth_type=rerequest&scope=${scopes}`;

    // Direct redirect is 100% immune to popup blockers across all browsers and devices
    window.location.href = fbOAuthUrl;
  };

  // History State
  const [history, setHistory] = useState<VideoPostRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch publish history
  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetch("/api/video-publisher");
      if (res.ok) {
        const json = await res.json();
        setHistory(json.history || []);
      }
    } catch (e) {
      console.error("Error fetching video publisher history:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Handle local video upload
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      if (!videoTitle) {
        setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  // Handle local photo upload
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPhotoPreviewUrl(url);
      if (!videoTitle) {
        setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  // Toggle page selection
  const togglePageSelect = (id: string) => {
    if (selectedPageIds.includes(id)) {
      setSelectedPageIds(selectedPageIds.filter((pId) => pId !== id));
    } else {
      setSelectedPageIds([...selectedPageIds, id]);
    }
  };

  const selectAllPages = () => {
    setSelectedPageIds(allTargetPages.map((p) => p.id));
  };

  const deselectAllPages = () => {
    setSelectedPageIds([]);
  };

  // Trigger Deep AI Caption Generation with Gemini 3.8 Flash
  const handleGenerateCaptions = async () => {
    if (selectedPageIds.length === 0) {
      alert("សូមជ្រើសរើស Page យ៉ាងហោចណាស់ ១ ជាមុនសិន!");
      return;
    }

    setIsGeneratingAi(true);
    try {
      const targetPages = allTargetPages.filter((p) =>
        selectedPageIds.includes(p.id)
      );

      const res = await fetch("/api/video-publisher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_captions",
          videoTitle: videoTitle || (mediaType === "photo" ? "រូបភាពផ្សព្វផ្សាយ" : "វីដេអូផ្សព្វផ្សាយ"),
          videoContent: mediaStory || masterCaption,
          baseTopic,
          captionStyle,
          pages: targetPages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.captions) {
          setCaptionsMap(data.captions);
          if (targetPages.length > 0) {
            setExpandedCaptionPageId(targetPages[0].id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to generate AI captions:", err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Apply Master Caption directly to all selected pages (1-Click Instant Apply)
  const applyMasterCaptionToAll = () => {
    if (selectedPageIds.length === 0) {
      alert("សូមជ្រើសរើស Page យ៉ាងហោចណាស់ ១ ជាមុនសិន!");
      return;
    }
    const newMap: Record<string, string> = {};
    allTargetPages
      .filter((p) => selectedPageIds.includes(p.id))
      .forEach((p) => {
        if (p.name.includes("Kidney") || p.name.includes("តម្រងនោម")) {
          newMap[p.id] = `${GOLDEN_PRESETS[2].text}\n\n#${p.name.replace(/\s+/g, "")}`;
        } else {
          newMap[p.id] = `${masterCaption}\n\n#${p.name.replace(/\s+/g, "")}`;
        }
      });
    setCaptionsMap(newMap);
    setExpandedCaptionPageId(selectedPageIds[0]);
  };

  // Update caption for a specific page
  const handleUpdateCaption = (pageId: string, text: string) => {
    setCaptionsMap((prev) => ({
      ...prev,
      [pageId]: text,
    }));
  };

  // Submit and Publish Media (Video / Photo / Text) directly to Facebook Pages
  const handlePublishAll = async () => {
    if (selectedPageIds.length === 0) {
      alert("សូមជ្រើសរើស Page ដែលចង់ផុស!");
      return;
    }

    if (mediaType === "video" && !videoFile && !videoDirectUrl) {
      alert("សូម Upload វីដេអូ ឬបញ្ចូលតំណភ្ជាប់វីដេអូជាមុនសិន!");
      return;
    }

    if (mediaType === "photo" && !photoFile && !videoDirectUrl) {
      alert("សូម Upload រូបភាព ឬបញ្ចូលតំណភ្ជាប់រូបភាពជាមុនសិន!");
      return;
    }

    setIsPublishing(true);
    setPublishResults(null);
    setPublishProgress({
      total: selectedPageIds.length,
      completed: 0,
      status: "កំពុងទាញយក Page Access Token ពីប្រព័ន្ធ...",
    });

    try {
      // 1. Fetch live Page Access Tokens stored in Supabase
      const tokenRes = await fetch("/api/video-publisher?action=tokens");
      const tokenJson = tokenRes.ok ? await tokenRes.json() : {};
      const tokenMap: Record<string, string> = tokenJson.tokens || {};

      const targetPages = allTargetPages.filter((p) =>
        selectedPageIds.includes(p.id)
      );

      const pageCaptions = targetPages.map((p) => ({
        pageId: p.id,
        pageName: p.name,
        caption:
          captionsMap[p.id] ||
          `${videoTitle || "ការផ្សព្វផ្សាយពិសេស"}\n\n${mediaStory || baseTopic}\n\n#${p.name.replace(/\s+/g, "")}`,
      }));

      const results: {
        pageId: string;
        pageName: string;
        status: "success" | "error";
        postId?: string;
        captionPreview: string;
        message?: string;
        needsReauth?: boolean;
      }[] = [];

      let completedCount = 0;

      for (const item of pageCaptions) {
        const pageToken = tokenMap[item.pageId];
        setPublishProgress({
          total: pageCaptions.length,
          completed: completedCount,
          status: `កំពុងផុសទៅកាន់ "${item.pageName}" (${completedCount + 1}/${pageCaptions.length})...`,
        });

        if (!pageToken) {
          results.push({
            pageId: item.pageId,
            pageName: item.pageName,
            status: "error",
            captionPreview: item.caption.slice(0, 70) + "...",
            message: "ពុំមាន Access Token សម្រាប់ Page នេះទេ (សូម Re-authorize ឡើងវិញ)",
            needsReauth: true,
          });
          completedCount++;
          continue;
        }

        try {
          let fbRes: Response;
          let fbData: any;

          if (mediaType === "video" && videoFile) {
            // Direct browser upload to Facebook Graph API (Bypasses Vercel 4.5MB limit)
            const formData = new FormData();
            formData.append("source", videoFile);
            formData.append("description", item.caption);
            formData.append("title", videoTitle || "Video Post");
            formData.append("access_token", pageToken);

            fbRes = await fetch(`https://graph.facebook.com/v19.0/${item.pageId}/videos`, {
              method: "POST",
              body: formData,
            });
            fbData = await fbRes.json();
          } else if (mediaType === "photo" && photoFile) {
            // Direct browser upload photo to Facebook Graph API
            const formData = new FormData();
            formData.append("source", photoFile);
            formData.append("caption", item.caption);
            formData.append("access_token", pageToken);

            fbRes = await fetch(`https://graph.facebook.com/v19.0/${item.pageId}/photos`, {
              method: "POST",
              body: formData,
            });
            fbData = await fbRes.json();
          } else if (mediaType === "photo" && videoDirectUrl) {
            // Photo via remote URL
            fbRes = await fetch(`https://graph.facebook.com/v19.0/${item.pageId}/photos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                url: videoDirectUrl,
                caption: item.caption,
                access_token: pageToken,
              }),
            });
            fbData = await fbRes.json();
          } else if (mediaType === "video" && videoDirectUrl) {
            // Video via remote URL
            fbRes = await fetch(`https://graph.facebook.com/v19.0/${item.pageId}/videos`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                file_url: videoDirectUrl,
                description: item.caption,
                title: videoTitle || "Video Post",
                access_token: pageToken,
              }),
            });
            fbData = await fbRes.json();
          } else {
            // Pure text post via /feed
            fbRes = await fetch(`https://graph.facebook.com/v19.0/${item.pageId}/feed`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                message: item.caption,
                access_token: pageToken,
              }),
            });
            fbData = await fbRes.json();
          }

          if (fbRes.ok && (fbData?.id || fbData?.post_id)) {
            const realPostId = fbData.id || fbData.post_id;
            results.push({
              pageId: item.pageId,
              pageName: item.pageName,
              status: "success",
              postId: realPostId,
              captionPreview: item.caption.slice(0, 70) + "...",
              message: "បានផុសទៅកាន់ Facebook Page ផ្ទាល់ជោគជ័យ!",
            });
          } else {
            const errObj = fbData?.error;
            const errCode = errObj?.code;
            const errMsg = errObj?.message || "Facebook Graph API returned an error";
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
        } catch (postErr: any) {
          results.push({
            pageId: item.pageId,
            pageName: item.pageName,
            status: "error",
            captionPreview: item.caption.slice(0, 70) + "...",
            message: postErr.message || "Failed to communicate with Facebook",
          });
        }

        completedCount++;
      }

      setPublishResults(results);

      // 2. Persist this publish record to Supabase History
      const record: VideoPostRecord = {
        id: `vpost_${Date.now()}`,
        title: videoTitle || (mediaType === "video" ? "វីដេអូផ្សព្វផ្សាយ" : mediaType === "photo" ? "រូបភាពផ្សព្វផ្សាយ" : "អត្ថបទផ្សព្វផ្សាយ"),
        videoUrl: videoDirectUrl || (mediaType === "video" ? "[Uploaded Video File]" : mediaType === "photo" ? "[Uploaded Photo File]" : "[Text Post]"),
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

      await fetch("/api/video-publisher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save_history",
          record,
        }),
      });

      fetchHistory();
    } catch (err) {
      console.error("Failed to publish media:", err);
    } finally {
      setIsPublishing(false);
      setPublishProgress(null);
    }
  };

  const selectedPagesList = allTargetPages.filter((p) =>
    selectedPageIds.includes(p.id)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/70 to-slate-900 border border-indigo-500/30 p-5 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30">
            <Film className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Multi-Page Video & Reels Publisher
              </h2>
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                ● ភ្ជាប់ 8 Pages រួចរាល់
              </span>
              <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                AI Deep Thinking 🪄
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Upload វីដេអូតែ ១ ដង អាចផុសទៅកាន់ Page ទាំង ៨ ព្រមគ្នា ដោយ AI បង្កើត Caption ខុសៗគ្នាតាមប្រភេទ Page នីមួយៗ
            </p>
          </div>
        </div>

        {/* Media Type & Reels Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Media Type Selector */}
          <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-1 text-xs">
            <button
              type="button"
              onClick={() => setMediaType("video")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                mediaType === "video"
                  ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Video className="h-3.5 w-3.5" />
              <span>🎬 វីដេអូ</span>
            </button>
            <button
              type="button"
              onClick={() => setMediaType("photo")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                mediaType === "photo"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <ImageIcon className="h-3.5 w-3.5" />
              <span>🖼️ រូបភាព</span>
            </button>
            <button
              type="button"
              onClick={() => setMediaType("text")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                mediaType === "text"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <FileText className="h-3.5 w-3.5" />
              <span>📝 អត្ថបទ</span>
            </button>
          </div>

          {/* Sub-selector for Video: Reels vs Video */}
          {mediaType === "video" && (
            <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setPostType("reels")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                  postType === "reels"
                    ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>🎥 Reels</span>
                <span className="text-[9px] bg-white/20 text-white px-1 py-0.2 rounded font-normal">
                  Viral
                </span>
              </button>
              <button
                type="button"
                onClick={() => setPostType("video")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                  postType === "video"
                    ? "bg-indigo-600 text-white shadow-sm font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>📹 Video ធម្មតា</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Facebook Permissions & Re-Auth Alert Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-slate-900 to-indigo-950/70 border border-indigo-500/30 text-xs shadow-md">
        <div className="flex items-center gap-2.5 text-slate-300">
          <div className="p-1.5 rounded-xl bg-indigo-500/20 text-indigo-400">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="font-bold text-white">សិទ្ធិផុសលើ Facebook (Post Permissions)៖</span>{" "}
            <span className="text-slate-400">
              ប្រព័ន្ធបានភ្ជាប់ជាមួយ Page Access Token ផ្លូវការដែលមានសិទ្ធិ{" "}
              <code className="text-emerald-400 font-mono text-[11px] bg-slate-800 px-1 py-0.5 rounded">
                pages_manage_posts
              </code>{" "}
              រួចរាល់ អាចផុសវីដេអូ រូបភាព និងអត្ថបទបាន ១០០%
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={triggerFacebookReauth}
          disabled={isReauthorizing}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition shrink-0"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isReauthorizing ? "animate-spin" : ""}`} />
          <span>{isReauthorizing ? "កំពុងភ្ជាប់..." : "🔑 ភ្ជាប់សិទ្ធិ Facebook ឡើងវិញ (Re-authorize)"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Media Source & 8 Pre-Connected Pages (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Media Source Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3.5 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              {mediaType === "video" && <Video className="h-4 w-4 text-blue-400" />}
              {mediaType === "photo" && <ImageIcon className="h-4 w-4 text-emerald-400" />}
              {mediaType === "text" && <FileText className="h-4 w-4 text-purple-400" />}
              <span>
                ១. {mediaType === "video" ? "ជ្រើសរើសវីដេអូ (Video Source)" : mediaType === "photo" ? "ជ្រើសរើសរូបភាព (Photo Source)" : "ការផុសអត្ថបទសុទ្ធ (Text Post)"}
              </span>
            </h3>

            {/* VIDEO MEDIA DISPLAY */}
            {mediaType === "video" && (
              <>
                {videoPreviewUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video flex items-center justify-center">
                    <video
                      src={videoPreviewUrl}
                      controls
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => {
                        setVideoFile(null);
                        setVideoPreviewUrl("");
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-slate-300 hover:text-white"
                      title="លុបចេញ"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-900/40 hover:bg-slate-800/40"
                  >
                    <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 mb-2">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-white">
                      ចុច Upload វីដេអូ (MP4, MOV, WebM)
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      ផុសផ្ទាល់ពី Browser ទៅកាន់ Facebook គ្មានដែនកំណត់ទំហំ (No Size Limit)
                    </span>
                  </div>
                )}

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                />
              </>
            )}

            {/* PHOTO MEDIA DISPLAY */}
            {mediaType === "photo" && (
              <>
                {photoPreviewUrl ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video flex items-center justify-center">
                    <img
                      src={photoPreviewUrl}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      onClick={() => {
                        setPhotoFile(null);
                        setPhotoPreviewUrl("");
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-slate-300 hover:text-white"
                      title="លុបចេញ"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => photoInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-900/40 hover:bg-slate-800/40"
                  >
                    <div className="p-3 rounded-full bg-emerald-500/10 text-emerald-400 mb-2">
                      <UploadCloud className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-bold text-white">
                      ចុច Upload រូបភាព (JPG, PNG, WEBP)
                    </span>
                    <span className="text-[11px] text-slate-500 mt-1">
                      រូបភាពច្បាស់សម្រាប់ផុសលើ Facebook Page Feed ផ្ទាល់
                    </span>
                  </div>
                )}

                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />
              </>
            )}

            {/* TEXT POST NOTICE */}
            {mediaType === "text" && (
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-xs">
                  <FileText className="h-4 w-4" />
                  <span>ផុសជាអត្ថបទសុទ្ធ (Status Feed Post)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  ការផុសនេះនឹងបញ្ជូនអត្ថបទ Caption ដែល AI បានសរសេរចូលទៅកាន់ផ្ទាំង Feed នៃ Page ទាំង ៨ ដោយផ្ទាល់ ដោយពុំចាំបាច់មានរូបភាព ឬវីដេអូនោះឡើយ។
                </p>
              </div>
            )}

            {/* Post Title Input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                ចំណងជើងការផុស ({mediaType === "video" ? "Video Title" : mediaType === "photo" ? "Photo Title" : "Post Title"}):
              </label>
              <input
                type="text"
                placeholder="ឧ. ប្រូម៉ូសិនពិសេសប្រចាំខែ..."
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Direct Media URL Alternative (Video or Photo) */}
            {mediaType !== "text" && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  ឬ ដាក់តំណភ្ជាប់ {mediaType === "video" ? "វីដេអូ" : "រូបភាព"} ផ្ទាល់ (Direct URL):
                </label>
                <input
                  type="text"
                  placeholder={mediaType === "video" ? "https://example.com/video.mp4" : "https://example.com/image.jpg"}
                  value={videoDirectUrl}
                  onChange={(e) => {
                    setVideoDirectUrl(e.target.value);
                    if (e.target.value.startsWith("http")) {
                      if (mediaType === "video") setVideoPreviewUrl(e.target.value);
                      if (mediaType === "photo") setPhotoPreviewUrl(e.target.value);
                    }
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>

          {/* 2. Target Pages Selector Card (PRE-CONNECTED 8 PAGES) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-400" />
                  <span>២. ភ្ជាប់ Pages ទាំង ៨ រួចរាល់</span>
                </h3>
                <span className="text-[10px] text-emerald-400">
                  ● បានភ្ជាប់ជាមួយ Access Token រួចជាស្រេច
                </span>
              </div>
              <span className="text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-mono">
                {selectedPageIds.length}/{allTargetPages.length} Pages
              </span>
            </div>

            {/* Shortcuts */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <span>ជ្រើសរើស Page ដែលត្រូវផុស៖</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllPages}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  រើសទាំងអស់ (៨)
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={deselectAllPages}
                  className="text-slate-400 hover:text-white"
                >
                  ដកចេញទាំងអស់
                </button>
              </div>
            </div>

            {/* 8 Connected Pages List */}
            <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
              {allTargetPages.map((page) => {
                const isSelected = selectedPageIds.includes(page.id);
                return (
                  <div
                    key={page.id}
                    onClick={() => togglePageSelect(page.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? "bg-purple-950/40 border-purple-500/50 text-white"
                        : "bg-slate-800/40 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                          isSelected
                            ? "bg-purple-600 border-purple-500 text-white"
                            : "border-slate-600 bg-slate-900"
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div className="truncate">
                        <div className="font-semibold truncate flex items-center gap-1.5">
                          <span>{page.name}</span>
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-normal">
                            Online
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          {page.description}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CAPTION STRATEGY SELECTOR & AI DEEP GENERATOR (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* AI Generator Control Box */}
          <div className="rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-indigo-950/30 to-slate-900 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    ៣. ជ្រើសរើសប្រភេទ Caption & AI បង្កើតដោយស្វ័យប្រវត្ត
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    ជ្រើសរើសយុទ្ធសាស្ត្រលក់ AI នឹងគិត និងសរសេរ Caption ៨ ទម្រង់ប្លែកៗគ្នាសម្រាប់ Page នីមួយៗ
                  </p>
                </div>
              </div>
            </div>

            {/* CAPTION STYLE / TYPE SELECTOR (User Requested) */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-2">
                ជ្រើសរើសប្រភេទ / ទម្រង់ Caption (Caption Strategy Style):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {/* 1. Promotion */}
                <button
                  type="button"
                  onClick={() => setCaptionStyle("promotion")}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    captionStyle === "promotion"
                      ? "bg-gradient-to-r from-rose-950 to-red-950 border-rose-500 text-white shadow-md shadow-rose-950/50"
                      : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-bold text-xs text-rose-300">
                    <Flame className="h-3.5 w-3.5 text-rose-400" />
                    <span>🔥 ប្រូម៉ូសិនកក្រើក</span>
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    ទិញ ២ ថែម ១, ចំនួនមានកំណត់, ដឹកឥតគិតថ្លៃ
                  </span>
                </button>

                {/* 2. Education */}
                <button
                  type="button"
                  onClick={() => setCaptionStyle("education")}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    captionStyle === "education"
                      ? "bg-gradient-to-r from-emerald-950 to-teal-950 border-emerald-500 text-white shadow-md shadow-emerald-950/50"
                      : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-bold text-xs text-emerald-300">
                    <Stethoscope className="h-3.5 w-3.5 text-emerald-400" />
                    <span>🩺 អប់រំសុខភាព</span>
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    រោគសញ្ញា, ផលប៉ះពាល់, ពិគ្រោះសុខភាព
                  </span>
                </button>

                {/* 3. Question / Viral */}
                <button
                  type="button"
                  onClick={() => setCaptionStyle("question")}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    captionStyle === "question"
                      ? "bg-gradient-to-r from-amber-950 to-yellow-950 border-amber-500 text-white shadow-md shadow-amber-950/50"
                      : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-bold text-xs text-amber-300">
                    <HelpCircle className="h-3.5 w-3.5 text-amber-400" />
                    <span>❓ សំណួរចាក់ដោត</span>
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    សំណួរទាក់ទាញ, ជំរុញឱ្យខមិនលេខទូរស័ព្ទ
                  </span>
                </button>

                {/* 4. Testimonial */}
                <button
                  type="button"
                  onClick={() => setCaptionStyle("testimonial")}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    captionStyle === "testimonial"
                      ? "bg-gradient-to-r from-blue-950 to-indigo-950 border-blue-500 text-white shadow-md shadow-blue-950/50"
                      : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-bold text-xs text-blue-300">
                    <Star className="h-3.5 w-3.5 text-blue-400" />
                    <span>🌟 Feedback ភ្ញៀវពិត</span>
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    មតិកែលម្អ, លទ្ធផលប្រើប្រាស់ជាក់ស្តែង
                  </span>
                </button>

                {/* 5. Branding & CEO */}
                <button
                  type="button"
                  onClick={() => setCaptionStyle("branding")}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    captionStyle === "branding"
                      ? "bg-gradient-to-r from-purple-950 to-indigo-950 border-purple-500 text-white shadow-md shadow-purple-950/50"
                      : "bg-slate-900/90 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <span className="flex items-center gap-1.5 font-bold text-xs text-purple-300">
                    <Award className="h-3.5 w-3.5 text-purple-400" />
                    <span>💎 ស្ដង់ដារ & CEO</span>
                  </span>
                  <span className="text-[10px] text-slate-400 leading-tight">
                    ការធានាពី CEO, ស្ដង់ដារក្រសួងសុខាភិបាល
                  </span>
                </button>
              </div>
            </div>

            {/* MASTER CAPTION TEMPLATE & GOLDEN PRESETS */}
            <div className="rounded-2xl border border-pink-500/40 bg-gradient-to-b from-pink-950/30 to-purple-950/20 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-pink-500/20 text-pink-300">
                    <FileText className="h-4 w-4" />
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      👑 គំរូ Caption ស្តង់ដារពេញចិត្ត (Master Caption Template)
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      ជ្រើសរើសគំរូស្ដង់ដារ ឬបិទភ្ជាប់ (Paste) Caption របស់បងនៅទីនេះ
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={applyMasterCaptionToAll}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition shrink-0"
                >
                  <Check className="h-3.5 w-3.5 stroke-[3]" />
                  <span>📋 ប្រើ Caption នេះគ្រប់ Page (Apply to All)</span>
                </button>
              </div>

              {/* Clickable Golden Presets */}
              <div className="flex flex-wrap gap-1.5">
                {GOLDEN_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setMasterCaption(preset.text)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition ${
                      masterCaption === preset.text
                        ? "bg-pink-600 border-pink-500 text-white shadow-sm"
                        : "bg-slate-900/80 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Master Caption Textarea */}
              <textarea
                rows={6}
                value={masterCaption}
                onChange={(e) => setMasterCaption(e.target.value)}
                placeholder="បិទភ្ជាប់ (Paste) Caption គំរូដែលបងស្រឡាញ់ពេញចិត្តនៅទីនេះ..."
                className="w-full bg-slate-900/90 border border-pink-500/40 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 font-sans shadow-inner leading-relaxed"
              />
            </div>

            {/* Dedicated Media Story Content for Gemini 3.8 AI */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                  <span>
                    ខ្លឹមសារបន្ថែមក្នុង{mediaType === "video" ? "វីដេអូ" : mediaType === "photo" ? "រូបភាព" : "ការផ្សព្វផ្សាយ"} (Media Story & Promo Note)៖
                  </span>
                </label>
                <span className="text-[10px] text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold">
                  ★ AI គិតតាមនេះ ១០០%
                </span>
              </div>
              <textarea
                rows={2}
                value={mediaStory}
                onChange={(e) => setMediaStory(e.target.value)}
                placeholder="ឧ. វីដេអូនេះបង្ហាញពីការណែនាំពីអត្ថប្រយោជន៍ Emmi ជួយបំបាត់ធ្លាក់ស និងរដូវមិនទៀង, មានប្រូម៉ូសិនទិញ ២ ថែម ១..."
                className="w-full bg-slate-900 border border-amber-500/40 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-sans shadow-inner"
              />
            </div>

            {/* Action Buttons: 1-Click Apply OR AI Generate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                onClick={applyMasterCaptionToAll}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition"
              >
                <Check className="h-4 w-4 stroke-[3]" />
                <span>📋 ប្រើ Caption គំរូខាងលើ (១០០% ដូចគំរូ)</span>
              </button>

              <button
                type="button"
                onClick={handleGenerateCaptions}
                disabled={isGeneratingAi || selectedPageIds.length === 0}
                className="py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Sparkles className={`h-4 w-4 ${isGeneratingAi ? "animate-spin" : ""}`} />
                <span>
                  {isGeneratingAi
                    ? "AI កំពុងកែច្នៃ Caption តាមគំរូ..."
                    : `🪄 AI កែច្នៃតាម Page នីមួយៗ (${selectedPageIds.length} Pages)`}
                </span>
              </button>
            </div>
          </div>

          {/* Individual Page Captions List (Accordion Cards) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>ពិនិត្យ និងកែសម្រួល Caption តាម Page នីមួយៗ (ខុសៗគ្នា ១០០%)៖</span>
              <span className="text-[11px] text-purple-300 font-semibold">
                {Object.keys(captionsMap).length > 0
                  ? "✅ Caption បានបង្កើតប្លែកៗគ្នាស្រេច"
                  : "💡 ចុចប៊ូតុងខាងលើដើម្បីបង្កើត"}
              </span>
            </div>

            {selectedPagesList.length === 0 ? (
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 text-center text-slate-500 text-xs">
                សូមជ្រើសរើស Page នៅខាងឆ្វេងជាមុនសិន
              </div>
            ) : (
              selectedPagesList.map((page) => {
                const isExpanded =
                  expandedCaptionPageId === page.id ||
                  selectedPagesList.length <= 2;
                const caption =
                  captionsMap[page.id] ||
                  `${videoTitle || "វីដេអូពិសេស"}\n\n${baseTopic}\n\n#${page.name.replace(/\s+/g, "")}`;

                return (
                  <div
                    key={page.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-sm"
                  >
                    {/* Header */}
                    <div
                      onClick={() =>
                        setExpandedCaptionPageId(isExpanded ? null : page.id)
                      }
                      className="px-4 py-3 bg-slate-850 flex items-center justify-between cursor-pointer hover:bg-slate-800/60 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        <span className="font-bold text-white text-xs">
                          {page.name}
                        </span>
                        <span className="text-[10px] text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2 py-0.2 rounded-full">
                          {page.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-[10px] font-mono text-slate-500">
                          {caption.length} តួអក្សរ
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </div>
                    </div>

                    {/* Expandable Caption Textarea */}
                    {isExpanded && (
                      <div className="p-3.5 space-y-2 border-t border-slate-800 bg-slate-950/40">
                        <textarea
                          rows={5}
                          value={caption}
                          onChange={(e) =>
                            handleUpdateCaption(page.id, e.target.value)
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-purple-500 font-sans"
                        />
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span className="text-purple-300 font-medium">
                            {captionsMap[page.id] ? "✨ AI Tailored Caption (ខុសប្លែកពីគេ)" : "📝 Default Caption"}
                          </span>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(caption)}
                            className="flex items-center gap-1 text-slate-400 hover:text-white"
                          >
                            <Copy className="h-3 w-3" />
                            <span>ចម្លង</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* 4. BIG PUBLISH BUTTON */}
          <div className="pt-2">
            <button
              onClick={handlePublishAll}
              disabled={isPublishing || selectedPageIds.length === 0}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white font-extrabold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2.5 transition active:scale-[0.99] disabled:opacity-50"
            >
              {isPublishing ? (
                <RefreshCw className="h-5 w-5 animate-spin text-white" />
              ) : (
                <Send className="h-5 w-5" />
              )}
              <span>
                {isPublishing
                  ? `កំពុងបញ្ជូន និងផុសទៅកាន់ Pages (${publishProgress?.completed || 0}/${selectedPageIds.length})...`
                  : `🚀 បញ្ជាផុស${mediaType === "video" ? "វីដេអូ" : mediaType === "photo" ? "រូបភាព" : "អត្ថបទ"}ទៅកាន់ ${selectedPageIds.length} Pages ព្រមគ្នា`}
              </span>
            </button>
          </div>

          {/* Progress Indicator */}
          {publishProgress && (
            <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-300 flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin text-cyan-400" />
                  <span>{publishProgress.status}</span>
                </span>
                <span className="font-mono text-cyan-300 font-bold">
                  {publishProgress.completed}/{publishProgress.total} Pages
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 h-2 transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.round(
                      (publishProgress.completed / (publishProgress.total || 1)) * 100
                    )}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Results Notification */}
          {publishResults && (
            <div className="space-y-3">
              {publishResults.some((r) => r.status === "error") ? (
                <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                      <AlertCircle className="h-5 w-5 text-amber-400 shrink-0" />
                      <span>Facebook ត្រូវការឱ្យអ្នកអនុញ្ញាតសិទ្ធិផុស (Permission Re-authorization)</span>
                    </div>
                    <button
                      type="button"
                      onClick={triggerFacebookReauth}
                      disabled={isReauthorizing}
                      className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition shrink-0"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isReauthorizing ? "animate-spin" : ""}`} />
                      <span>{isReauthorizing ? "កំពុងភ្ជាប់..." : "🔑 ចុចទីនេះដើម្បីភ្ជាប់សិទ្ធិឡើងវិញ"}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-amber-200/80 leading-relaxed">
                    មូលហេតុ៖ Facebook Graph API តម្រូវឱ្យ Account មានសិទ្ធិ <strong>pages_manage_posts</strong> ទើបអាចផុសចូល Page បានពិតប្រាកដ។ សូមចុចប៊ូតុងខាងលើម្តងដើម្បីអនុញ្ញាត ហើយចុចបញ្ជាផុសម្តងទៀត។
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-1">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>ការផុសទៅកាន់ Pages ទាំងអស់ត្រូវបានបញ្ជូនទៅកាន់ Facebook ជោគជ័យ!</span>
                  </div>
                </div>
              )}

              {/* Breakdown per Page */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3.5 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block pb-1 border-b border-slate-800">
                  ស្ថានភាពលម្អិតតាម Page នីមួយៗ (Posting Breakdown)៖
                </span>
                <div className="divide-y divide-slate-800/60 text-xs">
                  {publishResults.map((r) => (
                    <div
                      key={r.pageId}
                      className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-200"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            r.status === "success" ? "bg-emerald-400" : "bg-rose-400"
                          }`}
                        />
                        <span className="font-semibold text-white">{r.pageName}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        {r.status === "success" ? (
                          <>
                            <span className="text-emerald-400 font-semibold flex items-center gap-1 text-xs">
                              <Check className="h-3.5 w-3.5" />
                              <span>ចូល Page ជោគជ័យ</span>
                            </span>
                            {r.postId && (
                              <a
                                href={`https://facebook.com/${r.postId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1 text-[11px]"
                              >
                                <span>មើល Post ផ្ទាល់</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </>
                        ) : (
                          <span className="text-rose-400 font-medium text-[11px] flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{r.message || "មិនទាន់ចូល Page"}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. RECENT POSTING HISTORY */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl mt-8">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-slate-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              ប្រវត្តិនៃការផុសវីដេអូកន្លងមក (Posting History)
            </h3>
          </div>
          <button
            onClick={fetchHistory}
            className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${loadingHistory ? "animate-spin" : ""}`} />
            <span>ទាញយកឡើងវិញ</span>
          </button>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-800/40 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ចំណងជើង</th>
                <th className="py-3 px-4">ប្រភេទមេឌា & ទម្រង់</th>
                <th className="py-3 px-4">យុទ្ធសាស្ត្រ Caption</th>
                <th className="py-3 px-4">ចំនួន Pages</th>
                <th className="py-3 px-4">កាលបរិច្ឆេទ</th>
                <th className="py-3 px-4">ស្ថានភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    មិនទាន់មានប្រវត្តិផុសនៅឡើយទេ
                  </td>
                </tr>
              ) : (
                history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-semibold text-white">
                      {item.title}
                    </td>
                    <td className="py-3 px-4">
                      {item.mediaType === "photo" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-950/60 text-blue-300 border border-blue-500/30">
                          🖼️ Photo
                        </span>
                      ) : item.mediaType === "text" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
                          📝 Text
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-purple-300">
                          {item.postType === "reels" ? "🎥 Reels" : "📹 Video"}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 uppercase">
                        {item.captionStyle || "Promotion"}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-cyan-300">
                      {item.targetPagesCount} Pages
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(item.publishedAt).toLocaleString("km-KH")}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                        <Check className="h-3 w-3" />
                        <span>ជោគជ័យ</span>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
