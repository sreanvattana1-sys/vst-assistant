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
  connectedPages?: { id: string; name: string; category?: string; memberName?: string }[];
  currentUser?: { name?: string; role?: string; id?: string };
}

export default function VideoPublisherTab({
  lang,
  connectedPages: propsPages = [],
  currentUser,
}: VideoPublisherTabProps) {
  // Dynamic Target Pages: Loaded live from API (all members' pages) + props
  const [allTargetPages, setAllTargetPages] = useState<{
    id: string;
    name: string;
    category?: string;
    memberName?: string;
    hasToken?: boolean;
  }[]>(OFFICIAL_COMPANY_PAGES);

  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>("all");

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

  // Selected Pages State
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>(
    OFFICIAL_COMPANY_PAGES.map((p) => p.id)
  );

  // Load all live connected pages from Supabase (Includes Sam Moto, Reamm Sunset, etc.)
  useEffect(() => {
    let isMounted = true;
    const fetchLivePublisherPages = async () => {
      try {
        const res = await fetch("/api/video-publisher?action=pages");
        if (res.ok) {
          const json = await res.json();
          if (json.pages && Array.isArray(json.pages) && json.pages.length > 0) {
            if (!isMounted) return;
            setAllTargetPages(json.pages);

            // If a specific member is logged in, select only their pages by default
            if (currentUser?.name && currentUser.name !== "VST Super Admin") {
              const myPages = json.pages.filter(
                (p: any) => p.memberName?.toLowerCase() === currentUser.name?.toLowerCase()
              );
              if (myPages.length > 0) {
                setSelectedPageIds(myPages.map((p: any) => p.id));
                setSelectedMemberFilter(currentUser.name);
                return;
              }
            }

            // Default for Super Admin: select all pages
            setSelectedPageIds(json.pages.map((p: any) => p.id));
            return;
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic pages for publisher:", err);
      }

      if (propsPages && propsPages.length > 0) {
        setAllTargetPages(propsPages);
        setSelectedPageIds(propsPages.map((p) => p.id));
      }
    };

    fetchLivePublisherPages();
    return () => {
      isMounted = false;
    };
  }, [currentUser?.name, propsPages]);

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

  // Refs for file inputs and video player
  const videoInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);

  // Thumbnail & Vision State
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>("");
  const [thumbnailDataUrl, setThumbnailDataUrl] = useState<string>("");
  const [capturedVideoFrames, setCapturedVideoFrames] = useState<string[]>([]);
  const [isExtractingFrames, setIsExtractingFrames] = useState<boolean>(false);

  // Re-authorize Facebook with pages_manage_posts and publish_video permissions
  const triggerFacebookReauth = () => {
    setIsReauthorizing(true);
    const redirectUri =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://vst-assistant.vercel.app";
    const scopes =
      "public_profile,pages_show_list,pages_read_engagement,pages_read_user_content,pages_manage_engagement,pages_manage_metadata,pages_messaging,pages_manage_posts";
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

  // Extract 3 distinct keyframes across the video duration for AI Vision
  const extractFramesFromFile = (file: File): Promise<string[]> => {
    return new Promise((resolve) => {
      try {
        const url = URL.createObjectURL(file);
        const tempVideo = document.createElement("video");
        tempVideo.preload = "metadata";
        tempVideo.muted = true;
        tempVideo.playsInline = true;
        tempVideo.crossOrigin = "anonymous";
        tempVideo.src = url;

        const frames: string[] = [];
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        let seekTargets: number[] = [];
        let currentTargetIdx = 0;

        const finish = () => {
          URL.revokeObjectURL(url);
          tempVideo.src = "";
          tempVideo.remove();
          resolve(frames);
        };

        const captureFrame = () => {
          if (!ctx || !tempVideo.videoWidth) {
            currentTargetIdx++;
            if (currentTargetIdx < seekTargets.length) {
              tempVideo.currentTime = seekTargets[currentTargetIdx];
            } else {
              finish();
            }
            return;
          }
          const scale = Math.min(1, 640 / Math.max(tempVideo.videoWidth, tempVideo.videoHeight));
          canvas.width = Math.round(tempVideo.videoWidth * scale);
          canvas.height = Math.round(tempVideo.videoHeight * scale);
          ctx.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          frames.push(dataUrl);

          currentTargetIdx++;
          if (currentTargetIdx < seekTargets.length) {
            tempVideo.currentTime = seekTargets[currentTargetIdx];
          } else {
            finish();
          }
        };

        tempVideo.onloadedmetadata = () => {
          const dur = tempVideo.duration || 10;
          seekTargets = [
            Math.min(dur * 0.15, 3),
            Math.max(dur * 0.5, 4),
            Math.max(dur * 0.8, dur - 2),
          ].filter((t, i, arr) => arr.indexOf(t) === i);

          tempVideo.currentTime = seekTargets[0];
        };

        tempVideo.onseeked = () => {
          captureFrame();
        };

        tempVideo.onerror = () => {
          finish();
        };

        setTimeout(() => {
          if (frames.length === 0) finish();
        }, 6000);
      } catch {
        resolve([]);
      }
    });
  };

  // Handle local video upload
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreviewUrl(url);
      if (!videoTitle) {
        setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
      }

      // Automatically extract keyframes for AI Vision Inspection & Thumbnails
      setIsExtractingFrames(true);
      try {
        const frames = await extractFramesFromFile(file);
        if (frames.length > 0) {
          setCapturedVideoFrames(frames);
          if (!thumbnailPreviewUrl) {
            setThumbnailPreviewUrl(frames[0]);
            setThumbnailDataUrl(frames[0]);
          }
        }
      } catch (err) {
        console.warn("Could not auto-extract frames:", err);
      } finally {
        setIsExtractingFrames(false);
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

  // Handle local thumbnail image upload
  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = (event.target?.result as string) || "";
        setThumbnailPreviewUrl(result);
        setThumbnailDataUrl(result);
        setCapturedVideoFrames((prev) => [result, ...prev.filter((f) => f !== result)].slice(0, 4));
      };
      reader.readAsDataURL(file);
    }
  };

  // 1-Click Frame Capture from currently playing / paused video
  const captureThumbnailFromCurrentVideo = () => {
    if (!mainVideoRef.current) {
      alert("សូម Upload វីដេអូ ឬរង់ចាំវីដេអូ Load រួចរាល់ជាមុនសិន!");
      return;
    }
    const video = mainVideoRef.current;
    if (!video.videoWidth || !video.videoHeight) {
      alert("វីដេអូមិនទាន់ Load រួចរាល់ទេ។ សូមចុច Play បន្តិចរួចសាកល្បងម្ដងទៀត!");
      return;
    }

    try {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      setThumbnailPreviewUrl(dataUrl);
      setThumbnailDataUrl(dataUrl);
      setThumbnailFile(null);
      setCapturedVideoFrames((prev) => [dataUrl, ...prev.filter((f) => f !== dataUrl)].slice(0, 4));
    } catch (e: any) {
      alert("មិនអាចចាប់យក Frame បានទេ (អាចបណ្ដាលមកពី CORS នៃ Video Link)។ សូម Upload រូបភាព Thumbnail ដោយផ្ទាល់");
    }
  };

  // Extract keyframes for Gemini Multimodal AI Video Inspection
  const extractVideoKeyframes = async (videoElement: HTMLVideoElement): Promise<string[]> => {
    return new Promise((resolve) => {
      try {
        const frames: string[] = [];
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx || !videoElement.videoWidth) {
          resolve([]);
          return;
        }

        // Limit dimension to 640px for super fast Gemini inference
        const scale = Math.min(1, 640 / Math.max(videoElement.videoWidth, videoElement.videoHeight));
        canvas.width = Math.round(videoElement.videoWidth * scale);
        canvas.height = Math.round(videoElement.videoHeight * scale);

        // 1. Always capture current visible frame
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        frames.push(canvas.toDataURL("image/jpeg", 0.82));

        // 2. If thumbnailDataUrl is already set, include it
        if (thumbnailDataUrl && !frames.includes(thumbnailDataUrl)) {
          frames.push(thumbnailDataUrl);
        }

        resolve(frames);
      } catch (err) {
        console.warn("Could not capture video frames:", err);
        resolve([]);
      }
    });
  };

  // Toggle page selection
  const togglePageSelect = (id: string) => {
    if (selectedPageIds.includes(id)) {
      setSelectedPageIds(selectedPageIds.filter((pId) => pId !== id));
    } else {
      setSelectedPageIds([...selectedPageIds, id]);
    }
  };

  const memberNames = Array.from(
    new Set(allTargetPages.map((p) => p.memberName).filter(Boolean))
  ) as string[];

  const displayedPages =
    selectedMemberFilter === "all"
      ? allTargetPages
      : allTargetPages.filter((p) => p.memberName === selectedMemberFilter);

  const selectAllPages = () => {
    const displayedIds = displayedPages.map((p) => p.id);
    setSelectedPageIds((prev) => Array.from(new Set([...prev, ...displayedIds])));
  };

  const deselectAllPages = () => {
    const displayedIds = displayedPages.map((p) => p.id);
    setSelectedPageIds((prev) => prev.filter((id) => !displayedIds.includes(id)));
  };

  // Trigger Deep AI Caption Generation with Gemini Multimodal Video Inspection
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

      // Extract real visual frames from video / photo for multimodal inspection
      let videoFrames: string[] = [...capturedVideoFrames];
      if (videoFrames.length === 0 && videoFile) {
        videoFrames = await extractFramesFromFile(videoFile);
        if (videoFrames.length > 0) setCapturedVideoFrames(videoFrames);
      }
      if (videoFrames.length === 0 && mainVideoRef.current && mainVideoRef.current.videoWidth) {
        const extraFrames = await extractVideoKeyframes(mainVideoRef.current);
        if (extraFrames.length > 0) videoFrames = extraFrames;
      }
      if (thumbnailDataUrl && !videoFrames.includes(thumbnailDataUrl)) {
        videoFrames.unshift(thumbnailDataUrl);
      } else if (mediaType === "photo" && photoPreviewUrl && photoPreviewUrl.startsWith("data:")) {
        videoFrames = [photoPreviewUrl];
      }

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
          videoFrames,
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
      status: "កំពុងរៀបចំទិន្នន័យសម្រាប់ផុស...",
    });

    try {
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

      // Fetch Page Access Tokens map from API
      const tokenRes = await fetch("/api/video-publisher?action=tokens");
      const tokenData = await tokenRes.json();
      const tokenMap: Record<string, string> = tokenData?.tokens || {};

      // DIRECT FACEBOOK VIDEO UPLOADER (Supports 10MB to 5,000MB videos with Live Progress)
      if (mediaType === "video" && videoFile) {
        const fileSizeMb = (videoFile.size / (1024 * 1024)).toFixed(1);
        const resultsList: any[] = [];

        // Helper for direct Facebook upload via XHR with live percentage progress
        const uploadToFacebookDirect = (
          pId: string,
          pToken: string,
          caption: string,
          onProgress?: (pct: number) => void
        ): Promise<{ id: string }> => {
          return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("POST", `https://graph-video.facebook.com/v19.0/${pId}/videos`);

            if (xhr.upload && onProgress) {
              xhr.upload.onprogress = (evt) => {
                if (evt.lengthComputable) {
                  const pct = Math.round((evt.loaded / evt.total) * 100);
                  onProgress(pct);
                }
              };
            }

            xhr.onload = () => {
              try {
                const data = JSON.parse(xhr.responseText);
                if (xhr.status >= 200 && xhr.status < 300 && (data.id || data.post_id)) {
                  resolve({ id: data.id || data.post_id });
                } else {
                  reject(new Error(data?.error?.message || "Facebook Graph API returned an error"));
                }
              } catch {
                reject(new Error("Invalid response from Facebook: " + xhr.responseText));
              }
            };

            xhr.onerror = () => {
              reject(new Error("Network error communicating with Facebook"));
            };

            const formData = new FormData();
            formData.append("source", videoFile, videoFile.name || "video.mp4");
            formData.append("description", caption);
            formData.append("title", videoTitle || "Video Post");
            formData.append("access_token", pToken);
            formData.append("published", "true");

            xhr.send(formData);
          });
        };

        // Helper for thumbnail upload directly to Facebook
        const setThumbnailDirect = async (postId: string, pToken: string, thumbData: string) => {
          try {
            const base64Data = thumbData.replace(/^data:image\/\w+;base64,/, "");
            const byteChars = atob(base64Data);
            const byteNums = new Array(byteChars.length);
            for (let i = 0; i < byteChars.length; i++) {
              byteNums[i] = byteChars.charCodeAt(i);
            }
            const blob = new Blob([new Uint8Array(byteNums)], { type: "image/jpeg" });
            const thumbForm = new FormData();
            thumbForm.append("source", blob, "thumbnail.jpg");
            thumbForm.append("is_preferred", "true");
            thumbForm.append("access_token", pToken);

            await fetch(`https://graph.facebook.com/v19.0/${postId}/thumbnails`, {
              method: "POST",
              body: thumbForm,
            });
          } catch (e) {
            console.warn("Could not set thumbnail directly:", e);
          }
        };

        // 1. Upload directly to the first page with live progress
        const firstItem = pageCaptions[0];
        const firstToken = tokenMap[firstItem.pageId];
        if (!firstToken) {
          throw new Error(`ពុំមាន Access Token សម្រាប់ Page "${firstItem.pageName}" ទេ`);
        }

        setPublishProgress({
          total: pageCaptions.length,
          completed: 0,
          status: `កំពុង Upload វីដេអូ (${fileSizeMb} MB) ទៅកាន់ Facebook [${firstItem.pageName}]: 0%...`,
        });

        const firstResult = await uploadToFacebookDirect(
          firstItem.pageId,
          firstToken,
          firstItem.caption,
          (pct) => {
            setPublishProgress({
              total: pageCaptions.length,
              completed: 0,
              status: `កំពុង Upload វីដេអូ (${fileSizeMb} MB) ទៅកាន់ Facebook [${firstItem.pageName}]: ${pct}%...`,
            });
          }
        );

        if (thumbnailDataUrl) {
          await setThumbnailDirect(firstResult.id, firstToken, thumbnailDataUrl);
        }

        resultsList.push({
          pageId: firstItem.pageId,
          pageName: firstItem.pageName,
          status: "success",
          postId: firstResult.id,
          captionPreview: firstItem.caption.slice(0, 70) + "...",
          message: "បានផុសទៅកាន់ Facebook Page ផ្ទាល់ជោគជ័យ!" + (thumbnailDataUrl ? " (រួមទាំង Thumbnail)" : ""),
        });

        // 2. If there are other pages, syndicate using Facebook's CDN or upload
        if (pageCaptions.length > 1) {
          let fbSourceUrl = "";
          setPublishProgress({
            total: pageCaptions.length,
            completed: 1,
            status: "វីដេអូបាន Upload ជោគជ័យ! កំពុងទាញយកតំណភ្ជាប់ CDN សម្រាប់ចែករំលែកទៅ Pages ផ្សេងទៀត...",
          });

          for (let attempt = 0; attempt < 4; attempt++) {
            await new Promise((r) => setTimeout(r, 1500));
            try {
              const srcRes = await fetch(
                `https://graph.facebook.com/v19.0/${firstResult.id}?fields=source&access_token=${firstToken}`
              );
              const srcData = await srcRes.json();
              if (srcData?.source) {
                fbSourceUrl = srcData.source;
                break;
              }
            } catch {}
          }

          const remainingItems = pageCaptions.slice(1);

          if (fbSourceUrl) {
            setPublishProgress({
              total: pageCaptions.length,
              completed: 1,
              status: `កំពុងផុសទៅកាន់ ${remainingItems.length} Pages ទៀតតាមរយៈ Facebook CDN ផ្ទាល់...`,
            });

            const pubRes = await fetch("/api/video-publisher", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "publish_video",
                title: videoTitle || "វីដេអូផ្សព្វផ្សាយ",
                videoUrl: fbSourceUrl,
                thumbnail: thumbnailDataUrl || undefined,
                mediaType: "video",
                postType,
                captionStyle,
                pageCaptions: remainingItems,
              }),
            });

            const pubData = await pubRes.json();
            if (pubData.results) {
              resultsList.push(...pubData.results);
            }
          } else {
            for (let i = 0; i < remainingItems.length; i++) {
              const item = remainingItems[i];
              const pToken = tokenMap[item.pageId];
              if (!pToken) {
                resultsList.push({
                  pageId: item.pageId,
                  pageName: item.pageName,
                  status: "error",
                  captionPreview: item.caption.slice(0, 70) + "...",
                  message: "ពុំមាន Access Token សម្រាប់ Page នេះទេ",
                });
                continue;
              }

              setPublishProgress({
                total: pageCaptions.length,
                completed: 1 + i,
                status: `កំពុងផុសទៅកាន់ [${item.pageName}]: 0%...`,
              });

              try {
                const res = await uploadToFacebookDirect(
                  item.pageId,
                  pToken,
                  item.caption,
                  (pct) => {
                    setPublishProgress({
                      total: pageCaptions.length,
                      completed: 1 + i,
                      status: `កំពុងផុសទៅកាន់ [${item.pageName}]: ${pct}%...`,
                    });
                  }
                );

                if (thumbnailDataUrl) {
                  await setThumbnailDirect(res.id, pToken, thumbnailDataUrl);
                }

                resultsList.push({
                  pageId: item.pageId,
                  pageName: item.pageName,
                  status: "success",
                  postId: res.id,
                  captionPreview: item.caption.slice(0, 70) + "...",
                  message: "បានផុសទៅកាន់ Facebook Page ផ្ទាល់ជោគជ័យ!" + (thumbnailDataUrl ? " (រួមទាំង Thumbnail)" : ""),
                });
              } catch (err: any) {
                resultsList.push({
                  pageId: item.pageId,
                  pageName: item.pageName,
                  status: "error",
                  captionPreview: item.caption.slice(0, 70) + "...",
                  message: err.message || "Failed to upload to page",
                });
              }
            }
          }
        }

        // Save Record to History
        const newRecord: VideoPostRecord = {
          id: `vpost_${Date.now()}`,
          title: videoTitle || "វីដេអូផ្សព្វផ្សាយ",
          videoUrl: "[Direct Video Upload to Facebook]",
          mediaType: "video",
          postType,
          captionStyle,
          targetPagesCount: pageCaptions.length,
          publishedAt: new Date().toISOString(),
          status: resultsList.every((r) => r.status === "success") ? "completed" : "partial",
          results: resultsList,
        };

        await fetch("/api/video-publisher", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "save_history",
            record: newRecord,
          }),
        });

        setPublishResults(resultsList);
        setHistory((prev) => [newRecord, ...prev.filter((r) => r.id !== newRecord.id)]);
        fetchHistory();
        return;
      }

      let finalMediaUrl = videoDirectUrl || "";

      // 2. Photo uploads or small files
      const activeFile = mediaType === "photo" ? photoFile : null;
      if (activeFile) {
        setPublishProgress({
          total: selectedPageIds.length,
          completed: 0,
          status: `កំពុង Upload រូបភាព (${(activeFile.size / (1024 * 1024)).toFixed(1)} MB) ទៅកាន់ Fast Storage...`,
        });

        const uploadUrlRes = await fetch(
          `/api/video-publisher?action=get_upload_url&fileName=${encodeURIComponent(activeFile.name)}`
        );
        const uploadUrlData = await uploadUrlRes.json();

        if (!uploadUrlRes.ok || !uploadUrlData?.signedUrl) {
          throw new Error(uploadUrlData?.error || "មិនអាចបង្កើតតំណភ្ជាប់ Upload បានទេ");
        }

        const putRes = await fetch(uploadUrlData.signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": activeFile.type || "image/jpeg",
          },
          body: activeFile,
        });

        if (!putRes.ok) {
          throw new Error("ការ Upload រូបភាពបរាជ័យ។");
        }

        finalMediaUrl = uploadUrlData.publicUrl;
      }

      // 2. Dispatch to Facebook via Server API (Node.js bypasses all browser CORS & AdBlockers)
      setPublishProgress({
        total: selectedPageIds.length,
        completed: 0,
        status: `កំពុងផុសទៅកាន់ ${pageCaptions.length} Pages តាមរយៈ Server (គ្មានបញ្ហា CORS / Block)...`,
      });

      const pubRes = await fetch("/api/video-publisher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish_video",
          title: videoTitle || (mediaType === "video" ? "វីដេអូផ្សព្វផ្សាយ" : mediaType === "photo" ? "រូបភាពផ្សព្វផ្សាយ" : "អត្ថបទផ្សព្វផ្សាយ"),
          videoUrl: finalMediaUrl,
          thumbnail: thumbnailDataUrl || undefined,
          mediaType,
          postType,
          captionStyle,
          pageCaptions,
        }),
      });

      const pubData = await pubRes.json();
      if (!pubRes.ok) {
        throw new Error(pubData.error || "ការផុសបរាជ័យ");
      }

      setPublishResults(pubData.results || []);
      if (pubData.record) {
        setHistory((prev: VideoPostRecord[]) => [
          pubData.record,
          ...prev.filter((r: VideoPostRecord) => r.id !== pubData.record.id),
        ]);
      }
      fetchHistory();
    } catch (err: any) {
      console.error("Failed to publish media:", err);
      alert("មានបញ្ហាក្នុងការផុស៖ " + (err.message || "Failed to publish"));
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
                ● ភ្ជាប់ {allTargetPages.length} Pages រួចរាល់
              </span>
              <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                AI Deep Thinking 🪄
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Upload វីដេអូតែ ១ ដង អាចផុសទៅកាន់ Page ទាំងអស់ ({allTargetPages.length} Pages) ព្រមគ្នា ដោយ AI បង្កើត Caption ខុសៗគ្នាតាមប្រភេទ Page នីមួយៗ
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
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video flex items-center justify-center">
                      <video
                        ref={mainVideoRef}
                        src={videoPreviewUrl}
                        controls
                        crossOrigin="anonymous"
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur border border-white/10 text-[11px] text-white flex items-center gap-1.5 shadow-lg">
                        {videoFile && videoFile.size > 48 * 1024 * 1024 ? (
                          <span className="text-amber-400 font-semibold flex items-center gap-1">
                            ⚡ {(videoFile.size / (1024 * 1024)).toFixed(1)} MB (ទំហំធំ: ប្រើប្រាស់ High-Capacity Cloud)
                          </span>
                        ) : (
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            ⚡ {videoFile ? `${(videoFile.size / (1024 * 1024)).toFixed(1)} MB (Fast Cloud)` : ""}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setVideoFile(null);
                          setVideoPreviewUrl("");
                          setThumbnailFile(null);
                          setThumbnailPreviewUrl("");
                          setThumbnailDataUrl("");
                          setCapturedVideoFrames([]);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-slate-300 hover:text-white"
                        title="លុបចេញ"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* AI VIDEO VISION INSPECTION FRAMES PREVIEW */}
                    {(capturedVideoFrames.length > 0 || isExtractingFrames) && (
                      <div className="rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 p-3 space-y-2 shadow-inner">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="p-1 rounded bg-cyan-500/20 text-cyan-300">
                              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                            </span>
                            <span className="text-xs font-bold text-white">
                              👁️ ប្លង់វីដេអូដែល AI បានពិនិត្យឃើញ ({capturedVideoFrames.length} Frames):
                            </span>
                          </div>
                          {isExtractingFrames ? (
                            <span className="text-[10px] text-amber-300 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold animate-pulse flex items-center gap-1">
                              <RefreshCw className="h-3 w-3 animate-spin" /> កំពុងស្កេនប្លង់...
                            </span>
                          ) : (
                            <span className="text-[10px] text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                              ✓ AI Vision Ready
                            </span>
                          )}
                        </div>

                        {capturedVideoFrames.length > 0 && (
                          <div className="grid grid-cols-3 gap-2">
                            {capturedVideoFrames.map((frame, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  setThumbnailPreviewUrl(frame);
                                  setThumbnailDataUrl(frame);
                                  setThumbnailFile(null);
                                }}
                                className={`relative aspect-video rounded-lg overflow-hidden border cursor-pointer transition group bg-black shadow ${
                                  thumbnailDataUrl === frame
                                    ? "border-emerald-400 ring-2 ring-emerald-500/50"
                                    : "border-cyan-500/30 hover:border-cyan-400"
                                }`}
                                title="ចុចដើម្បីកំណត់រូបនេះធ្វើជា Thumbnail ក្របវីដេអូ"
                              >
                                <img
                                  src={frame}
                                  alt={`Scene ${idx + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                                />
                                <span className="absolute bottom-1 right-1 text-[9px] bg-black/80 backdrop-blur text-cyan-300 px-1 py-0.2 rounded font-mono">
                                  ប្លង់ #{idx + 1}
                                </span>
                                {thumbnailDataUrl === frame && (
                                  <span className="absolute top-1 left-1 text-[8px] bg-emerald-500 text-white font-bold px-1 rounded">
                                    ★ Thumbnail
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <p className="text-[10px] text-slate-400 leading-tight">
                          💡 AI ពិនិត្យឃើញសកម្មភាព ផលិតផល និងអក្សរក្នុងប្លង់ទាំងនេះ ដើម្បីសរសេរ Caption ឱ្យចំសាច់រឿងជាក់ស្តែង (បងអាចចុចលើប្លង់ណា ១ ដើម្បីយកធ្វើជា Thumbnail ផងដែរ)
                        </p>
                      </div>
                    )}

                    {/* VIDEO THUMBNAIL / THEMNNEL CARD */}
                    <div className="rounded-xl border border-indigo-500/30 bg-slate-900/90 p-3 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-pink-500/20 text-pink-400">
                            <ImageIcon className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              🖼️ រូបភាពក្រប (Thumbnail / Themnel)
                            </span>
                            <p className="text-[10px] text-slate-400">
                              កំណត់រូបភាពក្របសម្រាប់បង្ហាញលើ Facebook Feed & Reels មុនចុចមើល
                            </p>
                          </div>
                        </div>
                        {thumbnailPreviewUrl && (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                            ✓ បានកំណត់
                          </span>
                        )}
                      </div>

                      {thumbnailPreviewUrl ? (
                        <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/80 border border-slate-700">
                          <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-slate-600 bg-black shrink-0">
                            <img
                              src={thumbnailPreviewUrl}
                              alt="Thumbnail Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <p className="text-[11px] font-semibold text-emerald-300 truncate">
                              {thumbnailFile ? `📁 រូបភាព: ${thumbnailFile.name}` : "📸 ចាប់យក Frame ពីវីដេអូ"}
                            </p>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={captureThumbnailFromCurrentVideo}
                                className="text-[10px] px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1"
                              >
                                <span>📸 ចាប់ Frame ថ្មី</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => thumbnailInputRef.current?.click()}
                                className="text-[10px] px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition flex items-center gap-1"
                              >
                                <span>🖼️ ប្តូររូប</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setThumbnailFile(null);
                                  setThumbnailPreviewUrl("");
                                  setThumbnailDataUrl("");
                                }}
                                className="text-[10px] p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900 border border-rose-800/50 text-rose-300 transition"
                                title="លុប Thumbnail"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={captureThumbnailFromCurrentVideo}
                            className="p-2.5 rounded-xl border border-indigo-500/40 bg-indigo-950/30 hover:bg-indigo-900/40 text-left transition flex items-center gap-2.5 group"
                          >
                            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 group-hover:scale-105 transition">
                              📸
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-white block">
                                ចាប់យក Frame ពីវីដេអូ
                              </span>
                              <span className="text-[9px] text-slate-400">
                                ផ្អាកត្រង់ប្លង់ស្អាត រួចចុចយក
                              </span>
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => thumbnailInputRef.current?.click()}
                            className="p-2.5 rounded-xl border border-purple-500/40 bg-purple-950/30 hover:bg-purple-900/40 text-left transition flex items-center gap-2.5 group"
                          >
                            <div className="p-2 rounded-lg bg-purple-500/20 text-purple-300 group-hover:scale-105 transition">
                              🖼️
                            </div>
                            <div>
                              <span className="text-[11px] font-bold text-white block">
                                Upload រូប Thumbnail
                              </span>
                              <span className="text-[9px] text-slate-400">
                                ជ្រើសរើសរូបពីម៉ាស៊ីន (JPG/PNG)
                              </span>
                            </div>
                          </button>
                        </div>
                      )}

                      <input
                        ref={thumbnailInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailFileChange}
                        className="hidden"
                      />
                    </div>
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
                      Upload ផ្ទាល់ពីកុំព្យូទ័របានរហូតដល់ 1,000 MB (1 GB) ឬប្រើ Link ដល់ 5 GB
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
                <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center justify-between">
                  <span>ឬ ដាក់តំណភ្ជាប់ {mediaType === "video" ? "វីដេអូ" : "រូបភាព"} ផ្ទាល់ (Google Drive / Direct URL):</span>
                  <span className="text-[10px] text-indigo-400 font-bold">គាំទ្រដល់ 5 GB - 10 GB 🚀</span>
                </label>
                <input
                  type="text"
                  placeholder={mediaType === "video" ? "https://drive.google.com/file/d/... ឬ https://example.com/video.mp4" : "https://example.com/image.jpg"}
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
                <p className="text-[10px] text-slate-500 mt-1">
                  💡 សម្រាប់វីដេអូធំៗ (1 GB ដល់ 5 GB) បងអាច Upload ចូល Google Drive រួច Copy Link យកមកដាក់ទីនេះ Facebook នឹងទាញយកដោយស្វ័យប្រវត្តិ។
                </p>
              </div>
            )}
          </div>

          {/* 2. Target Pages Selector Card (DYNAMIC MULTI-MEMBER PAGES) */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4 text-purple-400" />
                  <span>២. ជ្រើសរើស Pages សម្រាប់ផុស ({allTargetPages.length} Pages ភ្ជាប់រួចរាល់)</span>
                </h3>
                <span className="text-[10px] text-emerald-400">
                  ● គាំទ្រទាំង Page របស់ក្រុមហ៊ុន និង Page សមាជិកទាំងអស់
                </span>
              </div>
              <span className="text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-mono">
                {selectedPageIds.length}/{allTargetPages.length} Pages
              </span>
            </div>

            {/* Member Filter Pills */}
            {memberNames.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedMemberFilter("all");
                    setSelectedPageIds(allTargetPages.map((p) => p.id));
                  }}
                  className={`px-2.5 py-1 rounded-lg font-medium transition text-[11px] ${
                    selectedMemberFilter === "all"
                      ? "bg-purple-600 text-white shadow"
                      : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  ទាំងអស់ ({allTargetPages.length})
                </button>
                {memberNames.map((mName) => {
                  const mPagesCount = allTargetPages.filter((p) => p.memberName === mName).length;
                  return (
                    <button
                      key={mName}
                      type="button"
                      onClick={() => {
                        setSelectedMemberFilter(mName);
                        setSelectedPageIds(
                          allTargetPages.filter((p) => p.memberName === mName).map((p) => p.id)
                        );
                      }}
                      className={`px-2.5 py-1 rounded-lg font-medium transition text-[11px] flex items-center gap-1 ${
                        selectedMemberFilter === mName
                          ? "bg-indigo-600 text-white shadow"
                          : "text-slate-400 hover:text-white hover:bg-slate-700/50"
                      }`}
                    >
                      <span>👤 {mName}</span>
                      <span className="opacity-80">({mPagesCount})</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Shortcuts */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <span>
                {selectedMemberFilter === "all"
                  ? `Page ទាំងអស់ (${displayedPages.length})`
                  : `Page របស់ ${selectedMemberFilter} (${displayedPages.length})`}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllPages}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  រើសទាំងអស់ ({displayedPages.length})
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

            {/* Displayed Connected Pages List */}
            <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1">
              {displayedPages.map((page) => {
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
                          {page.memberName && (
                            <span className="text-[9px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded font-normal">
                              👤 {page.memberName}
                            </span>
                          )}
                          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-normal">
                            Online
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate">
                          ID: {page.id} {page.category ? `• ${page.category}` : ""}
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
                <Sparkles className={`h-4 w-4 ${isGeneratingAi ? "animate-spin text-amber-300" : ""}`} />
                <span>
                  {isGeneratingAi
                    ? "AI កំពុងមើលវីដេអូ & សរសេរ Caption..."
                    : `🪄 AI ពិនិត្យវីដេអូ & សរសេរតាម Page (${selectedPageIds.length} Pages)`}
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
