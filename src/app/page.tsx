"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Package,
  Users,
  FileText,
  ShieldCheck,
  TrendingUp,
  Bell,
  CheckCircle2,
  ChevronRight,
  Send,
  Plus,
  Trash2,
  RefreshCw,
  ExternalLink,
  Power,
  Sparkles,
  Search,
  Lock,
  MessageCircle,
  HelpCircle,
  X,
} from "lucide-react";

export default function VSTAssistantApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [botActive, setBotActive] = useState(true);

  // Bot configuration state
  const [commentKeyword, setCommentKeyword] = useState("តម្លៃ, price, ប៉ុន្មាន, order");
  const [commentReplyTemplate, setCommentReplyTemplate] = useState(
    "សួស្ដីបង! 😊 ផលិតផលសុខភាពនារីយើងខ្ញុំគុណភាពខ្ពស់ ផ្ដល់ទំនុកចិត្ត១០០%! ខ្ញុំបានផ្ញើព័ត៌មានលម្អិត និងប្រូម៉ូសិនជូនក្នុងប្រអប់សារ Inbox ហើយបង 💬✨"
  );
  const [autoSendDm, setAutoSendDm] = useState(true);
  const [dmWelcomeText, setDmWelcomeText] = useState(
    "សូមស្វាគមន៍មកកាន់ VST Assistant 🌸! តើបងមានបញ្ហា ឬចង់បានការប្រឹក្សាលើរោគស្ត្រី និងផលិតផលថែរក្សាសុខភាពណាខ្លះដែរ?"
  );
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Chatbot Assistant widget state with category filtering
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatCategory, setChatCategory] = useState<"all" | "fb" | "bot" | "health" | "plan">("all");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    { from: "user" | "bot"; text: string; category?: string }[]
  >([
    {
      from: "bot",
      text: "សួស្ដី! 👋 ខ្ញុំជា VST Support Bot។\nខ្ញុំជួយឆ្លើយសំណួរដោយបែងចែកតាមប្រធានបទងាយស្រួលរក៖\n\n📘 ជំនួយ Facebook Page & Permissions\n⚙️ ការកំណត់ Bot Auto-Reply & Keywords\n🌿 ផលិតផល & ចំណេះដឹងសុខភាពនារី\n👥 គណនីសមាជិក & Plan\n\nជ្រើសរើសប្រធានបទខាងលើ ឬវាយសំណួររបស់អ្នកបានភ្លាមៗ!",
    },
  ]);

  const handleSaveBotSettings = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSendChat = async (customText?: string) => {
    const textToSend = (customText || chatInput).trim();
    if (!textToSend) return;
    setChatMessages((prev) => [...prev, { from: "user", text: textToSend }]);
    if (!customText) setChatInput("");

    // Show temporary typing indicator or loading
    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });
      const data = await res.json();
      const botReply = data.reply || "សូមអភ័យទោស ប្រព័ន្ធកំពុងដំណើរការ សូមសួរម្ដងទៀត!";
      setChatMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "🌸 【រោគសញ្ញាទូទៅនៃបញ្ហារោគស្ត្រី & វិធីដោះស្រាយ】៖\n\n១. ធ្លាក់សខុសប្រក្រតី (ពណ៌លឿង/បៃតង/កករ និងមានក្លិនមិនល្អ)\n២. រមាស់ រលាកក្រហាយនៅតំបន់ពិសេស\n៣. រដូវមកមិនទៀង ឬឈឺចុកចាប់ខ្លាំងពេលមករដូវ\n\n💡 ដំណោះស្រាយ៖ ប្រើប្រាស់ 'សេរ៉ូមថែទាំសុខភាពនារី VST ($18)' និង 'តែ Detox VST ($14)' ដើម្បីសម្អាតបាក់តេរី បំបាត់រមាស់ និងសម្រួលអ័រម៉ូនពីខាងក្នុង!",
        },
      ]);
    }
  };

  // 1. LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#030914] via-[#061730] to-[#0c2f60] p-4 overflow-hidden">
        {/* Glowing background circles */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />

        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="mb-8 text-center">
            <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-cyan-400/40 p-1 shadow-lg shadow-cyan-500/20">
              <Image
                src="/vst-logo.jpg"
                alt="VST Assistant Logo"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              VST Assistant
            </h1>
            <p className="mt-1 text-sm text-cyan-200/70">
              Facebook Automation & Page Management
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setIsLoggedIn(true)}
              className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3.5 px-4 font-semibold text-white shadow-lg shadow-blue-600/30 transition hover:from-blue-500 hover:to-cyan-500 hover:shadow-cyan-500/40"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>ចូលប្រើដោយ Facebook Login</span>
            </button>

            <div className="relative my-4 flex items-center justify-center">
              <div className="w-full border-t border-slate-700/60" />
              <span className="absolute bg-[#09152b] px-3 text-xs text-slate-400">
                ឬប្រើ Admin Account
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email / លេខសម្គាល់
              </label>
              <input
                type="text"
                defaultValue="admin@vst.com"
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
            >
              Sign In with Password
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-500">
            © 2026 VST Assistant — ដំណោះស្រាយស្វ័យប្រវត្តិកម្មអាជីវកម្ម
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN APPLICATION WORKSPACE
  return (
    <div className="flex min-h-screen bg-[#060c18] text-slate-100">
      {/* SIDEBAR */}
      <aside className="fixed left-0 top-0 bottom-0 z-30 flex w-64 flex-col border-r border-slate-800/80 bg-gradient-to-b from-[#061224] via-[#08172e] to-[#040a14]">
        {/* Brand header */}
        <div className="flex items-center gap-3 border-b border-slate-800/80 p-5">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-cyan-400/40 shadow-sm">
            <Image
              src="/vst-logo.jpg"
              alt="Logo"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              VST Assistant
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>Phase 1 Active</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {[
            { id: "dashboard", label: "ផ្ទាំងគ្រប់គ្រង (Dashboard)", icon: LayoutDashboard },
            { id: "bot", label: "ការកំណត់ Bot (Bot Settings)", icon: Bot },
            { id: "inbox", label: "ប្រអប់សារ (Inbox)", icon: MessageSquare, badge: "3" },
            { id: "customers", label: "អតិថិជន (Customers)", icon: Users },
            { id: "pages", label: "Facebook Pages", icon: FileText },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          <div className="pt-4 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Admin Management
          </div>

          {[
            { id: "admin", label: "Admin & Members", icon: ShieldCheck },
            { id: "reports", label: "របាយការណ៍ (Reports)", icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="border-t border-slate-800/80 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 font-bold text-white text-sm">
                V
              </div>
              <div>
                <div className="text-xs font-semibold text-white">VST Super Admin</div>
                <div className="text-[10px] text-cyan-400">Owner Account</div>
              </div>
            </div>
            <button
              onClick={() => setIsLoggedIn(false)}
              title="Logout"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <Power className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-800/80 bg-[#060c18]/80 px-8 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white capitalize">
              {activeTab === "dashboard" && "ផ្ទាំងគ្រប់គ្រងទូទៅ (Dashboard Overview)"}
              {activeTab === "bot" && "ការកំណត់មុខងារ Bot & Auto-Reply"}
              {activeTab === "inbox" && "ប្រអប់សារ & ការសន្ទនាផ្ទាល់"}
              {activeTab === "customers" && "គ្រប់គ្រងអតិថិជន (Customer CRM)"}
              {activeTab === "pages" && "Facebook Pages ដែលបានភ្ជាប់"}
              {activeTab === "admin" && "គ្រប់គ្រងសមាជិក (Owner Panel)"}
              {activeTab === "reports" && "ស្ថិតិ & របាយការណ៍លក់"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Global Bot Toggle */}
            <div className="flex items-center gap-2.5 rounded-full border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs font-medium">
              <span className="text-slate-400">Bot ដំណើរការ៖</span>
              <button
                onClick={() => setBotActive(!botActive)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  botActive ? "bg-cyan-500" : "bg-slate-700"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    botActive ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span className={botActive ? "text-cyan-400 font-bold" : "text-slate-500"}>
                {botActive ? "ON" : "OFF"}
              </span>
            </div>

            <button className="relative rounded-xl border border-slate-700/60 bg-slate-800/40 p-2 text-slate-300 hover:bg-slate-800">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400" />
            </button>
          </div>
        </header>

        {/* CONTENT TABS */}
        <div className="flex-1 p-8">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    title: "Comment តបស្វ័យប្រវត្តិថ្ងៃនេះ",
                    value: "148",
                    change: "+24% ធៀបម្សិលមិញ",
                    isPositive: true,
                    color: "border-blue-500/40 bg-gradient-to-br from-blue-950/30 to-slate-900/50",
                  },
                  {
                    title: "សារ DM ផ្ញើទៅ Inbox Auto",
                    value: "92",
                    change: "+15% ធៀបម្សិលមិញ",
                    isPositive: true,
                    color: "border-cyan-500/40 bg-gradient-to-br from-cyan-950/30 to-slate-900/50",
                  },
                  {
                    title: "អតិថិជនចាប់អារម្មណ៍ (Hot Leads)",
                    value: "35",
                    change: "ថ្ងៃនេះ",
                    isPositive: true,
                    color: "border-amber-500/40 bg-gradient-to-br from-amber-950/30 to-slate-900/50",
                  },
                  {
                    title: "ការកុម្ម៉ង់ជោគជ័យ (Orders)",
                    value: "18",
                    change: "+5 orders ថ្ងៃនេះ",
                    isPositive: true,
                    color: "border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 to-slate-900/50",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`rounded-2xl border p-5 shadow-lg backdrop-blur-sm ${stat.color}`}
                  >
                    <div className="text-xs font-medium text-slate-400">{stat.title}</div>
                    <div className="mt-2 text-3xl font-extrabold text-white tracking-tight">
                      {stat.value}
                    </div>
                    <div className="mt-2 text-xs font-semibold text-emerald-400">
                      {stat.change}
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Pages Status */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-white text-base">
                      Facebook Pages កំពុងភ្ជាប់ & ដំណើរការ
                    </h3>
                    <button
                      onClick={() => setActiveTab("pages")}
                      className="text-xs text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>គ្រប់គ្រង Pages ទាំងអស់</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        name: "សុខភាពនារី & សម្រស់ធម្មជាតិ (Official Page)",
                        followers: "24.5K Followers",
                        commentsToday: 84,
                        status: "Active",
                      },
                      {
                        name: "VST Health Plus Cambodia",
                        followers: "12.8K Followers",
                        commentsToday: 42,
                        status: "Active",
                      },
                      {
                        name: "ស្រីស្អាត ទំនុកចិត្តសុខភាព",
                        followers: "6.2K Followers",
                        commentsToday: 22,
                        status: "Active",
                      },
                    ].map((p, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/30 p-4 transition hover:border-slate-700"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 font-bold text-white">
                            FP
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-white">{p.name}</div>
                            <div className="text-xs text-slate-400">{p.followers}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <div className="text-xs text-slate-400">Comment ថ្ងៃនេះ</div>
                            <div className="text-sm font-bold text-cyan-400">{p.commentsToday}</div>
                          </div>
                          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                            ● ដំណើរការល្អ
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Setup Checklist */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base mb-2">
                      Phase 1 — ដំណើរការរៀបចំ Bot
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      មុខងារសំខាន់ៗត្រូវបានដំណើរការដោយជោគជ័យសម្រាប់តប Comment និង Inbox៖
                    </p>

                    <div className="space-y-2.5 text-xs">
                      {[
                        "បង្កើត Facebook App & Access Token",
                        "Webhook Subscription លើ Feed & Messages",
                        "ស្វ័យប្រវត្តិតប Comment លើរាល់ការ Comment",
                        "ផ្ញើសារ Private DM ចូល Messenger ភ្លាមៗ",
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-300">
                          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4">
                    <div className="text-xs font-semibold text-cyan-300">
                      Webhook Verification Endpoint:
                    </div>
                    <code className="mt-1 block text-[11px] text-slate-300 bg-slate-950/60 p-2 rounded-lg font-mono break-all">
                      https://your-domain.vercel.app/api/webhook
                    </code>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BOT SETTINGS */}
          {activeTab === "bot" && (
            <div className="max-w-4xl space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-white">
                      💬 កំណត់ការតប Comment ស្វ័យប្រវត្តិ (Auto Comment Reply)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      នៅពេលមានអតិថិជន comment សួរលើ Post ណាមួយ Bot នឹងតប Comment ភ្លាមៗ
                    </p>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                    Auto Active
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      ពាក្យគន្លឹះចាប់ផ្ដើមតប (Keywords Trigger)
                    </label>
                    <input
                      type="text"
                      value={commentKeyword}
                      onChange={(e) => setCommentKeyword(e.target.value)}
                      placeholder="តម្លៃ, price, ប៉ុន្មាន, order..."
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      ប្រសិនបើទុកទទេ Bot នឹងតបរាល់ Comment ទាំងអស់ដោយស្វ័យប្រវត្តិ។
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      សារតប Comment (Comment Reply Text)
                    </label>
                    <textarea
                      rows={3}
                      value={commentReplyTemplate}
                      onChange={(e) => setCommentReplyTemplate(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/60 p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    />
                  </div>

                  {/* Auto DM checkbox */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        📩 ផ្ញើសារ Private Message (DM) ទៅ Inbox អតិថិជនភ្លាមៗ
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        នៅពេលអតិថិជន comment ក្រៅពីតប comment ហើយ Bot នឹងផ្ញើសារចូល Inbox បន្ថែម
                      </div>
                    </div>
                    <button
                      onClick={() => setAutoSendDm(!autoSendDm)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                        autoSendDm ? "bg-cyan-500" : "bg-slate-700"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ${
                          autoSendDm ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {autoSendDm && (
                    <div className="pl-4 border-l-2 border-cyan-500/40">
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        សារស្វាគមន៍ផ្ញើចូល Inbox (Private Message Template)
                      </label>
                      <textarea
                        rows={3}
                        value={dmWelcomeText}
                        onChange={(e) => setDmWelcomeText(e.target.value)}
                        className="w-full rounded-xl border border-slate-700 bg-slate-800/60 p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                      />
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={handleSaveBotSettings}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-blue-500 hover:to-cyan-500"
                    >
                      <span>រក្សាទុកការកំណត់</span>
                    </button>

                    {savedSuccess && (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>បានរក្សាទុកដោយជោគជ័យ!</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PAGES */}
          {activeTab === "pages" && (
            <div className="max-w-4xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Facebook Pages ទាំងអស់ដែលបានភ្ជាប់
                  </h3>
                  <p className="text-xs text-slate-400">
                    សមាជិកម្នាក់ៗអាចភ្ជាប់ Pages ជាច្រើនតាមរយៈ Facebook Login
                  </p>
                </div>
                <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 shadow-md">
                  <Plus className="h-3.5 w-3.5" />
                  <span>ភ្ជាប់ Page ថ្មី</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "សុខភាពនារី & សម្រស់ធម្មជាតិ",
                    id: "109283749281",
                    followers: "24.5K Followers",
                    status: "Connected",
                  },
                  {
                    name: "VST Health Plus Cambodia",
                    id: "928374619283",
                    followers: "12.8K Followers",
                    status: "Connected",
                  },
                  {
                    name: "ស្រីស្អាត ទំនុកចិត្តសុខភាព",
                    id: "837461928374",
                    followers: "6.2K Followers",
                    status: "Connected",
                  },
                ].map((page, i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/20">
                          {page.status}
                        </span>
                        <span className="text-[11px] text-slate-500">ID: {page.id}</span>
                      </div>
                      <h4 className="mt-3 font-bold text-white text-base">{page.name}</h4>
                      <p className="text-xs text-slate-400 mt-1">{page.followers}</p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs text-cyan-400">Bot Reply: ON</span>
                      <button className="text-xs text-slate-400 hover:text-red-400">
                        ផ្តាច់ការភ្ជាប់
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ADMIN MANAGEMENT */}
          {activeTab === "admin" && (
            <div className="space-y-6 max-w-4xl">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <h3 className="text-base font-bold text-white mb-2">
                  👑 ផ្ទាំងគ្រប់គ្រង Super Admin (Owner Dashboard)
                </h3>
                <p className="text-xs text-slate-400 mb-6">
                  អ្នកជាម្ចាស់ Platform មានសិទ្ធិមើលការប្រើប្រាស់របស់សមាជិកទាំងអស់ បន្ថែមសមាជិក និងកំណត់កម្រិត Plan
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">ឈ្មោះសមាជិក</th>
                        <th className="p-3">ចំនួន Pages</th>
                        <th className="p-3">Plan កម្រិត</th>
                        <th className="p-3">ស្ថានភាព</th>
                        <th className="p-3 text-right">សកម្មភាព</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {[
                        { name: "Sokha (Owner)", pages: "3 Pages", plan: "Unlimited Pro", status: "Active" },
                        { name: "Dara Chan (Seller)", pages: "2 Pages", plan: "Pro Tier", status: "Active" },
                        { name: "Sreyleak Kim (Seller)", pages: "1 Page", plan: "Free Tier", status: "Active" },
                      ].map((member, i) => (
                        <tr key={i} className="hover:bg-slate-800/30">
                          <td className="p-3 font-semibold text-white">{member.name}</td>
                          <td className="p-3 text-slate-400">{member.pages}</td>
                          <td className="p-3">
                            <span className="rounded-md bg-blue-500/10 px-2 py-1 text-cyan-300 font-medium">
                              {member.plan}
                            </span>
                          </td>
                          <td className="p-3 text-emerald-400 font-medium">{member.status}</td>
                          <td className="p-3 text-right">
                            <button className="text-xs text-cyan-400 hover:underline">
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* FALLBACK TABS */}
          {["inbox", "customers", "reports"].includes(activeTab) && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
              <Bot className="h-12 w-12 text-cyan-400 mx-auto mb-3 opacity-60" />
              <h3 className="text-base font-bold text-white">ទិន្នន័យកំពុងធ្វើបច្ចុប្បន្នភាព</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                ប្រព័ន្ធកំពុងដំណើរការទាញទិន្នន័យជាក់ស្ដែងពី Facebook Webhook ចូលមកកាន់ផ្ទាំងនេះ!
              </p>
            </div>
          )}
        </div>
      </main>

      {/* FLOATING VST SUPPORT CHATBOT */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isChatOpen ? (
          <button
            onClick={() => setIsChatOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-400 text-white shadow-xl shadow-cyan-500/40 transition hover:scale-105 active:scale-95"
          >
            <MessageCircle className="h-6 w-6" />
          </button>
        ) : (
          <div className="flex h-[520px] w-84 sm:w-96 flex-col rounded-3xl border border-cyan-500/30 bg-[#0d1627] shadow-2xl shadow-cyan-950/80 overflow-hidden backdrop-blur-xl">
            {/* Chat header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-500 p-4 text-white shadow-md">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg shadow-inner">
                  🤖
                </div>
                <div>
                  <div className="text-sm font-bold leading-tight">VST Support Bot</div>
                  <div className="text-[11px] text-cyan-100 flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online 24/7 — ជួយគ្រប់ចំណោទ</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="rounded-xl p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Structured Category Buttons (ចុចសួរភ្លាម) */}
            <div className="border-b border-slate-800 bg-slate-900/80 p-3">
              <div className="text-[11px] font-semibold text-cyan-400 mb-2 flex items-center gap-1.5">
                <span>⚡</span>
                <span>ចុចជ្រើសរើសប្រធានបទសួរភ្លាមៗ៖</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: "📘 ភ្ជាប់ FB Page", text: "របៀបភ្ជាប់ Facebook Page និង permissions" },
                  { label: "⚙️ Bot Settings", text: "របៀបកំណត់ Auto Comment Reply និង DM" },
                  { label: "🌿 ផលិតផល & សុខភាព", text: "ផលិតផលសុខភាពនារី VST និងតម្លៃ" },
                  { label: "⚠️ FB Error", text: "ដំណោះស្រាយបញ្ហា Facebook Error" },
                  { label: "👥 Plans & សមាជិក", text: "កម្រិត Plan និងការគ្រប់គ្រងសមាជិក" },
                ].map((item, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendChat(item.text)}
                    className="rounded-full border border-cyan-500/20 bg-slate-800/90 px-3 py-1 text-[11px] font-medium text-slate-200 transition hover:bg-cyan-500/20 hover:border-cyan-400 hover:text-cyan-300"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat messages list */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-[#09111f]">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2.5 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.from === "bot" && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-xs text-white shadow-sm mt-0.5">
                      🤖
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-line text-xs shadow-sm ${
                      msg.from === "user"
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-none shadow-blue-500/20"
                        : "bg-slate-800/90 text-slate-100 border border-slate-700/80 rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat input */}
            <div className="border-t border-slate-800 p-3 bg-slate-900/95 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                placeholder="វាយសំណួររបស់អ្នកនៅទីនេះ..."
                className="flex-1 rounded-full border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
              />
              <button
                onClick={() => handleSendChat()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md shadow-cyan-500/30 transition hover:from-blue-500 hover:to-cyan-400"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
