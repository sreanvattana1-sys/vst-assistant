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

  // Video Source State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [videoDirectUrl, setVideoDirectUrl] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState("");
  const [postType, setPostType] = useState<"reels" | "video">("reels");

  // Selected Pages State (default: ALL 8 PAGES PRE-SELECTED)
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>(
    allTargetPages.map((p) => p.id)
  );

  // Caption Strategy / Style Selector
  const [captionStyle, setCaptionStyle] = useState<
    "promotion" | "education" | "question" | "testimonial" | "branding"
  >("promotion");

  // Base Topic & Captions Map: pageId -> caption string
  const [baseTopic, setBaseTopic] = useState(
    "ប្រូម៉ូសិនពិសេសប្រចាំខែ ទិញ ២ ថែម ១ គុណភាពស្ដង់ដារខ្ពស់ ដឹកជញ្ជូនឥតគិតថ្លៃទូទាំង ២៥ ខេត្ត/ក្រុង"
  );
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
    message?: string;
  }[] | null>(null);

  // History State
  const [history, setHistory] = useState<VideoPostRecord[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  // Trigger Deep AI Caption Generation
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

  // Update caption for a specific page
  const handleUpdateCaption = (pageId: string, text: string) => {
    setCaptionsMap((prev) => ({
      ...prev,
      [pageId]: text,
    }));
  };

  // Submit and Publish Video to all selected pages
  const handlePublishAll = async () => {
    if (selectedPageIds.length === 0) {
      alert("សូមជ្រើសរើស Page ដែលចង់ផុស!");
      return;
    }

    if (!videoPreviewUrl && !videoDirectUrl) {
      alert("សូម Upload វីដេអូ ឬបញ្ចូលតំណភ្ជាប់វីដេអូជាមុនសិន!");
      return;
    }

    setIsPublishing(true);
    setPublishResults(null);
    setPublishProgress({
      total: selectedPageIds.length,
      completed: 0,
      status: "កំពុងរៀបចំ និងបញ្ជូនទៅកាន់ Facebook Pages...",
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
          `${videoTitle || "វីដេអូពិសេស"}\n\n${baseTopic}\n\n#${p.name.replace(/\s+/g, "")}`,
      }));

      const res = await fetch("/api/video-publisher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish_video",
          title: videoTitle,
          videoUrl: videoDirectUrl || videoPreviewUrl,
          postType,
          captionStyle,
          pageCaptions,
        }),
      });

      const json = await res.json();
      if (res.ok && json.results) {
        setPublishResults(json.results);
        fetchHistory();
      }
    } catch (err) {
      console.error("Failed to publish video:", err);
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

        {/* Post Type Selector (Reels vs Video) */}
        <div className="flex items-center bg-slate-800/90 border border-slate-700 rounded-xl p-1 text-xs">
          <button
            onClick={() => setPostType("reels")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold transition ${
              postType === "reels"
                ? "bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>🎥 Facebook Reels</span>
            <span className="text-[9px] bg-white/20 text-white px-1.5 py-0.2 rounded font-normal">
              High Reach
            </span>
          </button>
          <button
            onClick={() => setPostType("video")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-medium transition ${
              postType === "video"
                ? "bg-indigo-600 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>📹 Page Video ធម្មតា</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Video Source & 8 Pre-Connected Pages (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Video Source Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3.5 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Video className="h-4 w-4 text-blue-400" />
              <span>១. ជ្រើសរើសវីដេអូ (Video Source)</span>
            </h3>

            {/* Video Preview or Upload Dropzone */}
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
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition bg-slate-900/40 hover:bg-slate-800/40"
              >
                <div className="p-3 rounded-full bg-indigo-500/10 text-indigo-400 mb-2">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-white">
                  ចុច Upload វីដេអូ (MP4, MOV, WebM)
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  គាំទ្រវីដេអូទំហំច្បាស់សម្រាប់ Facebook Reels និង Post ធម្មតា
                </span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Video Title Input */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                ចំណងជើងវីដេអូ (Video Title):
              </label>
              <input
                type="text"
                placeholder="ឧ. ប្រូម៉ូសិនពិសេសប្រចាំខែ..."
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Direct Video URL Alternative */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                ឬ ដាក់តំណភ្ជាប់វីដេអូផ្ទាល់ (Direct Video URL):
              </label>
              <input
                type="text"
                placeholder="https://example.com/video.mp4"
                value={videoDirectUrl}
                onChange={(e) => {
                  setVideoDirectUrl(e.target.value);
                  if (e.target.value.startsWith("http")) {
                    setVideoPreviewUrl(e.target.value);
                  }
                }}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
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

            {/* Base Topic Textarea */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                គំនិតគោល / ប្រូម៉ូសិន ឬចំណុចសំខាន់នៃវីដេអូ (Base Topic):
              </label>
              <textarea
                rows={2}
                value={baseTopic}
                onChange={(e) => setBaseTopic(e.target.value)}
                placeholder="ឧ. ប្រូម៉ូសិនទិញ ២ ថែម ១ ថែរក្សាសុខភាព..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Magic Generate Button */}
            <button
              onClick={handleGenerateCaptions}
              disabled={isGeneratingAi || selectedPageIds.length === 0}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isGeneratingAi ? "animate-spin" : ""}`} />
              <span>
                {isGeneratingAi
                  ? "AI កំពុងគិត និងបង្កើត Caption ទាំង ៨ ប្លែកៗគ្នា..."
                  : `🪄 AI បង្កើត ${selectedPageIds.length} Captions ប្លែកៗគ្នា (${captionStyle.toUpperCase()})`}
              </span>
            </button>
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
                  ? "កំពុងបញ្ជូន និងផុសទៅកាន់ Pages ទាំង ៨..."
                  : `🚀 បញ្ជាផុសទៅកាន់ ${selectedPageIds.length} Pages ព្រមគ្នាឥឡូវនេះ`}
              </span>
            </button>
          </div>

          {/* Results Notification */}
          {publishResults && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>ការផុសទៅកាន់ Pages ទាំងអស់ត្រូវបានបញ្ចប់ជោគជ័យ!</span>
              </div>
              <div className="divide-y divide-emerald-900/40 text-xs">
                {publishResults.map((r) => (
                  <div
                    key={r.pageId}
                    className="py-1.5 flex items-center justify-between text-slate-200"
                  >
                    <span>{r.pageName}</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      <span>ជោគជ័យ</span>
                    </span>
                  </div>
                ))}
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
                <th className="py-3 px-4">ចំណងជើងវីដេអូ</th>
                <th className="py-3 px-4">ទម្រង់</th>
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
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 border border-slate-700 text-purple-300">
                        {item.postType === "reels" ? "🎥 Reels" : "📹 Video"}
                      </span>
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
