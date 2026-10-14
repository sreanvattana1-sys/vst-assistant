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
} from "lucide-react";
import { VideoPostRecord } from "@/app/api/video-publisher/route";

interface VideoPublisherTabProps {
  lang: "km" | "en";
  connectedPages: { id: string; name: string; category?: string }[];
}

export default function VideoPublisherTab({
  lang,
  connectedPages,
}: VideoPublisherTabProps) {
  // Video Source State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>("");
  const [videoDirectUrl, setVideoDirectUrl] = useState<string>("");
  const [videoTitle, setVideoTitle] = useState("");
  const [postType, setPostType] = useState<"reels" | "video">("reels");

  // Selected Pages State (default: all connected pages selected)
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);

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

  // Initialize selected pages from connectedPages
  useEffect(() => {
    if (connectedPages.length > 0 && selectedPageIds.length === 0) {
      setSelectedPageIds(connectedPages.map((p) => p.id));
    }
  }, [connectedPages]);

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
    setSelectedPageIds(connectedPages.map((p) => p.id));
  };

  const deselectAllPages = () => {
    setSelectedPageIds([]);
  };

  // Trigger AI Caption Generation with Gemini
  const handleGenerateCaptions = async () => {
    if (selectedPageIds.length === 0) {
      alert(lang === "km" ? "សូមជ្រើសរើស Page យ៉ាងហោចណាស់ ១ ជាមុនសិន!" : "Please select at least 1 page first!");
      return;
    }

    setIsGeneratingAi(true);
    try {
      const targetPages = connectedPages.filter((p) =>
        selectedPageIds.includes(p.id)
      );

      const res = await fetch("/api/video-publisher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generate_captions",
          baseTopic,
          pages: targetPages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.captions) {
          setCaptionsMap(data.captions);
          // Auto-expand the first caption
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
      alert(lang === "km" ? "សូមជ្រើសរើស Page ដែលចង់ផុស!" : "Please select target pages!");
      return;
    }

    if (!videoPreviewUrl && !videoDirectUrl) {
      alert(lang === "km" ? "សូម Upload វីដេអូ ឬបញ្ចូលតំណភ្ជាប់វីដេអូជាមុនសិន!" : "Please upload a video file or provide a video link!");
      return;
    }

    setIsPublishing(true);
    setPublishResults(null);
    setPublishProgress({
      total: selectedPageIds.length,
      completed: 0,
      status: lang === "km" ? "កំពុងរៀបចំការផុស..." : "Preparing publication...",
    });

    try {
      const targetPages = connectedPages.filter((p) =>
        selectedPageIds.includes(p.id)
      );

      const pageCaptions = targetPages.map((p) => ({
        pageId: p.id,
        pageName: p.name,
        caption:
          captionsMap[p.id] ||
          `${videoTitle}\n\n${baseTopic}\n\n#${p.name.replace(/\s+/g, "")}`,
      }));

      const res = await fetch("/api/video-publisher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "publish_video",
          title: videoTitle,
          videoUrl: videoDirectUrl || videoPreviewUrl,
          postType,
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

  const selectedPagesList = connectedPages.filter((p) =>
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
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              {lang === "km"
                ? "Multi-Page Video & Reels Publisher (ផុស Video ច្រើន Page)"
                : "Multi-Page Video & Reels Publisher"}
              <span className="text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                AI Powered 🪄
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              {lang === "km"
                ? "Upload វីដេអូតែ ១ ដង អាចផុសទៅកាន់ Page ទាំងអស់ក្នុងពេលតែមួយ ជាមួយ Caption ប្លែកៗគ្នាដោយស្វ័យប្រវត្ត"
                : "Upload once, publish across all Facebook Pages with unique AI-crafted captions per page"}
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
        {/* LEFT COLUMN: Video Upload & Page Selection (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* 1. Video Source Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3.5 shadow-lg">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Video className="h-4 w-4 text-blue-400" />
              <span>{lang === "km" ? "១. ជ្រើសរើសវីដេអូ (Video Source)" : "1. Select Video"}</span>
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
                  {lang === "km" ? "ចុច Upload វីដេអូ (MP4, MOV, WebM)" : "Click to Upload Video"}
                </span>
                <span className="text-[11px] text-slate-500 mt-1">
                  {lang === "km" ? "ទំហំសមរម្យសម្រាប់ Reels និង Video លើ Facebook" : "Suitable for Facebook Reels and Posts"}
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
                {lang === "km" ? "ចំណងជើងវីដេអូ (Video Title):" : "Video Title:"}
              </label>
              <input
                type="text"
                placeholder={lang === "km" ? "ឧ. ប្រូម៉ូសិនពិសេសប្រចាំខែ..." : "Enter video title..."}
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Direct Video URL Alternative */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                {lang === "km" ? "ឬ ដាក់តំណភ្ជាប់វីដេអូផ្ទាល់ (Direct Video URL):" : "Or Direct Video Link:"}
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

          {/* 2. Target Pages Selector Card */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3.5 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-400" />
                <span>{lang === "km" ? "២. ជ្រើសរើស Page គោលដៅ" : "2. Target Pages"}</span>
              </h3>
              <span className="text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-mono">
                {selectedPageIds.length}/{connectedPages.length}
              </span>
            </div>

            {/* Shortcuts: Select All / Deselect All */}
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
              <span>{lang === "km" ? "Page ទាំងអស់ដែលបានភ្ជាប់៖" : "All connected pages:"}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={selectAllPages}
                  className="text-blue-400 hover:text-blue-300 font-semibold"
                >
                  {lang === "km" ? "រើសទាំងអស់" : "Select All"}
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={deselectAllPages}
                  className="text-slate-400 hover:text-white"
                >
                  {lang === "km" ? "ដកចេញទាំងអស់" : "Deselect All"}
                </button>
              </div>
            </div>

            {/* Pages Checkbox List */}
            <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
              {connectedPages.map((page) => {
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
                        <div className="font-semibold truncate">{page.name}</div>
                        {page.category && (
                          <div className="text-[10px] text-slate-500 truncate">
                            {page.category}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI Caption Generator & Publishing Review (7 Cols) */}
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
                    {lang === "km"
                      ? "៣. AI បង្កើត Caption ខុសៗគ្នាសម្រាប់ Page នីមួយៗ"
                      : "3. AI Multi-Page Caption Generator"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {lang === "km"
                      ? "វាយតែគំនិតគោល AI Gemini នឹងបង្កើត Caption ៨ ទម្រង់ប្លែកៗគ្នាដោយស្វ័យប្រវត្ត"
                      : "Provide a base topic and Gemini AI crafts tailored captions for each target page"}
                  </p>
                </div>
              </div>
            </div>

            {/* Base Topic Textarea */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
                {lang === "km"
                  ? "គំនិតគោល / ប្រូម៉ូសិន ឬចំណុចសំខាន់នៃវីដេអូ (Base Topic):"
                  : "Base Topic / Offer Details:"}
              </label>
              <textarea
                rows={2}
                value={baseTopic}
                onChange={(e) => setBaseTopic(e.target.value)}
                placeholder={lang === "km" ? "ឧ. ប្រូម៉ូសិនទិញ ២ ថែម ១ ថែរក្សាសុខភាព..." : "Describe your offer, product benefits, etc."}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            {/* Magic Generate Button */}
            <button
              onClick={handleGenerateCaptions}
              disabled={isGeneratingAi || selectedPageIds.length === 0}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Sparkles className={`h-4 w-4 ${isGeneratingAi ? "animate-spin" : ""}`} />
              <span>
                {isGeneratingAi
                  ? (lang === "km" ? "AI កំពុងបង្កើត Caption ទាំង ៨..." : "AI Crafting Unique Captions...")
                  : (lang === "km" ? `🪄 AI បង្កើត ${selectedPageIds.length} Captions សម្រាប់ Pages ដែលបានរើស` : `Craft ${selectedPageIds.length} Captions with AI`)}
              </span>
            </button>
          </div>

          {/* Individual Page Captions List (Accordion Cards) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>{lang === "km" ? "ពិនិត្យ និងកែសម្រួល Caption តាម Page នីមួយៗ៖" : "Review Captions per Page:"}</span>
              <span className="text-[11px] text-purple-300">
                {Object.keys(captionsMap).length > 0
                  ? (lang === "km" ? "✅ បានបង្កើត Captions រួចរាល់" : "Captions Ready")
                  : (lang === "km" ? "💡 ចុចប៊ូតុងខាងលើដើម្បីបង្កើត" : "Click above to generate")}
              </span>
            </div>

            {selectedPagesList.length === 0 ? (
              <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/30 text-center text-slate-500 text-xs">
                {lang === "km" ? "សូមជ្រើសរើស Page នៅខាងឆ្វេងជាមុនសិន" : "Select target pages on the left"}
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
                        {page.category && (
                          <span className="text-[10px] text-slate-500 hidden sm:inline">
                            ({page.category})
                          </span>
                        )}
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
                          rows={4}
                          value={caption}
                          onChange={(e) =>
                            handleUpdateCaption(page.id, e.target.value)
                          }
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-purple-500 font-sans"
                        />
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                          <span>
                            {captionsMap[page.id] ? "✨ AI Generated Caption" : "📝 Default Caption"}
                          </span>
                          <button
                            type="button"
                            onClick={() => navigator.clipboard.writeText(caption)}
                            className="flex items-center gap-1 text-slate-400 hover:text-white"
                          >
                            <Copy className="h-3 w-3" />
                            <span>{lang === "km" ? "ចម្លង" : "Copy"}</span>
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
                  ? (lang === "km" ? "កំពុងផុសទៅកាន់ Pages..." : "Publishing to Pages...")
                  : (lang === "km" ? `🚀 បញ្ជាផុសទៅកាន់ ${selectedPageIds.length} Pages ព្រមគ្នា` : `Publish to ${selectedPageIds.length} Pages Now`)}
              </span>
            </button>
          </div>

          {/* Results Notification */}
          {publishResults && (
            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="h-4 w-4" />
                <span>
                  {lang === "km" ? "ការផុសត្រូវបានបញ្ចប់ជោគជ័យ!" : "Publication Completed!"}
                </span>
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
              {lang === "km" ? "ប្រវត្តិនៃការផុសវីដេអូកន្លងមក (Posting History)" : "Posting History"}
            </h3>
          </div>
          <button
            onClick={fetchHistory}
            className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <RefreshCw className={`h-3 w-3 ${loadingHistory ? "animate-spin" : ""}`} />
            <span>{lang === "km" ? "ទាញយកឡើងវិញ" : "Refresh"}</span>
          </button>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-800/40 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">{lang === "km" ? "ចំណងជើងវីដេអូ" : "Title"}</th>
                <th className="py-3 px-4">{lang === "km" ? "ប្រភេទ" : "Type"}</th>
                <th className="py-3 px-4">{lang === "km" ? "ចំនួន Pages" : "Pages"}</th>
                <th className="py-3 px-4">{lang === "km" ? "កាលបរិច្ឆេទ" : "Date"}</th>
                <th className="py-3 px-4">{lang === "km" ? "ស្ថានភាព" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    {lang === "km" ? "មិនទាន់មានប្រវត្តិផុសនៅឡើយទេ" : "No publishing history yet"}
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
