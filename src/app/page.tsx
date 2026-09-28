"use client";

import React, { useState, useEffect } from "react";
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
  Globe,
  Eye,
  EyeOff,
} from "lucide-react";
import { translations, Language } from "@/lib/i18n";

export default function VSTAssistantApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [botActive, setBotActive] = useState(true);
  const [lang, setLang] = useState<Language>("km");

  // Authentication state
  const [loginEmail, setLoginEmail] = useState("admin@vst.com");
  const [loginPassword, setLoginPassword] = useState("vst@2026");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("vst_lang") as Language;
      if (savedLang === "km" || savedLang === "en") {
        setLang(savedLang);
      }

      // Check existing admin session (Remember Me)
      const savedSession =
        localStorage.getItem("vst_admin_session") ||
        sessionStorage.getItem("vst_admin_session");
      if (savedSession) {
        setIsLoggedIn(true);
      }
    } catch {}
    setIsCheckingSession(false);
  }, []);

  const handleToggleLang = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem("vst_lang", newLang);
    } catch {}
  };

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });
      const data = await res.json();

      if (data.success && data.token) {
        if (rememberMe) {
          localStorage.setItem("vst_admin_session", JSON.stringify(data));
        } else {
          sessionStorage.setItem("vst_admin_session", JSON.stringify(data));
        }
        setIsLoggedIn(true);
      } else {
        setLoginError(t.login.invalidCredentials);
      }
    } catch (err) {
      setLoginError(t.login.invalidCredentials);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("vst_admin_session");
      sessionStorage.removeItem("vst_admin_session");
    } catch {}
    setIsLoggedIn(false);
  };

  const t = translations[lang];

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

  // Customers CRM state
  const [customersList, setCustomersList] = useState<any[]>([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

  const fetchCustomers = async () => {
    setIsLoadingCustomers(true);
    try {
      const res = await fetch("/api/customers");
      const data = await res.json();
      if (data.customers) {
        setCustomersList(data.customers);
      }
    } catch (e) {
      console.error("Failed to fetch customers", e);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "customers" || activeTab === "reports") {
      fetchCustomers();
    }
  }, [activeTab]);

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch("/api/bot-settings");
        const data = await res.json();
        if (data) {
          if (data.reply_templates && data.reply_templates.length > 0) {
            setCommentReplyTemplate(data.reply_templates[0]);
          }
          if (typeof data.is_active === "boolean") {
            setBotActive(data.is_active);
          }
          if (typeof data.auto_dm_enabled === "boolean") {
            setAutoSendDm(data.auto_dm_enabled);
          }
          if (data.dm_template) {
            setDmWelcomeText(data.dm_template);
          }
        }
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    }
    loadSettings();
  }, []);

  const handleSaveBotSettings = async () => {
    try {
      await fetch("/api/bot-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_active: botActive,
          reply_templates: [commentReplyTemplate],
          auto_dm_enabled: autoSendDm,
          dm_template: dmWelcomeText,
        }),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (e) {
      console.error("Failed to save settings:", e);
    }
  };

  // Real-time Facebook Activities & Auto-Scanner state
  const [activities, setActivities] = useState<Array<{
    commentId: string;
    postId: string;
    senderName: string;
    senderId?: string;
    message: string;
    createdTime: string;
    hasReplied: boolean;
    replyText?: string;
    permalink?: string;
  }>>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScannedTime, setLastScannedTime] = useState<string>("");
  const [liveCommentCount, setLiveCommentCount] = useState<number>(0);

  const runScanner = async () => {
    try {
      setIsScanning(true);
      const res = await fetch("/api/auto-scanner");
      const data = await res.json();
      if (data.activities && Array.isArray(data.activities)) {
        setActivities(data.activities);
      }
      if (typeof data.totalComments === "number") {
        setLiveCommentCount(data.totalComments);
      }
      setLastScannedTime(new Date().toLocaleTimeString("km-KH", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    } catch (err) {
      console.error("Auto-scanner error:", err);
    } finally {
      setIsScanning(false);
    }
  };

  // Background Auto-Scanner that scans and replies without needing Webhook / App Review
  useEffect(() => {
    if (!botActive) return;
    runScanner();
    const interval = setInterval(runScanner, 12000);
    return () => clearInterval(interval);
  }, [botActive]);

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

  // Language Switcher Component
  const LangSwitcher = () => (
    <div className="flex items-center rounded-xl border border-slate-700/60 bg-slate-800/60 p-1 text-xs shadow-inner">
      <button
        onClick={() => handleToggleLang("km")}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition ${
          lang === "km"
            ? "bg-gradient-to-r from-blue-600/40 to-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <span>🇰🇭</span>
        <span>ខ្មែរ</span>
      </button>
      <button
        onClick={() => handleToggleLang("en")}
        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition ${
          lang === "en"
            ? "bg-gradient-to-r from-blue-600/40 to-cyan-500/30 text-cyan-300 border border-cyan-500/40 shadow-sm"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <span>🇬🇧</span>
        <span>English</span>
      </button>
    </div>
  );

  // 1. LOGIN SCREEN
  if (!isLoggedIn) {
    if (isCheckingSession) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#030914]">
          <div className="flex items-center gap-2 text-cyan-400">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Checking session...</span>
          </div>
        </div>
      );
    }

    return (
      <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-[#030914] via-[#061730] to-[#0c2f60] p-4 overflow-hidden">
        {/* Language switcher on top-right */}
        <div className="absolute top-6 right-6 z-20">
          <LangSwitcher />
        </div>

        {/* Glowing background circles */}
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-blue-600/15 blur-3xl" />

        <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/70 p-8 shadow-2xl backdrop-blur-2xl">
          <div className="mb-6 text-center">
            <div className="relative mx-auto mb-4 h-24 w-24 overflow-hidden rounded-full border-2 border-cyan-400/40 p-1 shadow-lg shadow-cyan-500/20">
              <Image
                src="/vst-logo.jpg"
                alt="VST Assistant Logo"
                fill
                className="rounded-full object-cover"
              />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white">
              {t.login.title}
            </h1>
            <p className="mt-1 text-sm text-cyan-200/70">
              {t.login.subtitle}
            </p>
          </div>

          {/* Error alert */}
          {loginError && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t.login.emailLabel}
              </label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder={t.login.emailPlaceholder}
                required
                className="w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                {t.login.passLabel}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder={t.login.passPlaceholder}
                  required
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-800/50 px-4 py-2.5 pr-10 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer h-4 w-4"
                />
                <span>{t.login.rememberMe}</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 py-3 px-4 font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-blue-500 hover:to-cyan-500 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>{t.login.signingIn}</span>
                </>
              ) : (
                <span>{t.login.signInBtn}</span>
              )}
            </button>
          </form>

          {/* Quick Default Creds Hint */}
          <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-800/30 p-2.5 text-center text-[11px] text-slate-400">
            <span>🔑 {t.login.defaultHint}</span>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            {t.login.copyright}
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
              {t.brandName}
            </h2>
            <div className="flex items-center gap-1.5 text-[11px] text-cyan-400">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span>{t.phaseBadge}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3">
          {[
            { id: "dashboard", label: t.nav.dashboard, icon: LayoutDashboard },
            { id: "bot", label: t.nav.botSettings, icon: Bot },
            { id: "inbox", label: t.nav.inbox, icon: MessageSquare, badge: "3" },
            { id: "customers", label: t.nav.customers, icon: Users },
            { id: "pages", label: t.nav.pages, icon: FileText },
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
            {t.nav.adminHeader}
          </div>

          {[
            { id: "admin", label: t.nav.admin, icon: ShieldCheck },
            { id: "reports", label: t.nav.reports, icon: TrendingUp },
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
                <div className="text-[10px] text-cyan-400">{t.ownerAccount}</div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title={t.logout}
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
              {t.headerTitles[activeTab as keyof typeof t.headerTitles] || t.headerTitles.dashboard}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <LangSwitcher />

            {/* Global Bot Toggle */}
            <div className="flex items-center gap-2.5 rounded-full border border-slate-700/60 bg-slate-800/40 px-3 py-1.5 text-xs font-medium">
              <span className="text-slate-400">{t.botStatusLabel}</span>
              <button
                onClick={async () => {
                  const newState = !botActive;
                  setBotActive(newState);
                  try {
                    await fetch("/api/bot-status", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ active: newState }),
                    });
                  } catch (e) {
                    console.error("Failed to update bot status", e);
                  }
                }}
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
                {botActive ? t.on : t.off}
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
                    title: "Comment តបស្វ័យប្រវត្តិ",
                    value: liveCommentCount > 0 ? liveCommentCount.toString() : "148",
                    change: liveCommentCount > 0 ? `${liveCommentCount} Comments ស្កេនបាន` : "+24% ធៀបម្សិលមិញ",
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
                        name: "Kidney Pro ឃីដនី ប្រូ (Official Connected)",
                        followers: "Active Live Page",
                        commentsToday: 12,
                        status: "Active",
                      },
                      {
                        name: "Emmi អេមមី",
                        followers: "Active Live Page",
                        commentsToday: 24,
                        status: "Active",
                      },
                      {
                        name: "Emmi By CEO",
                        followers: "Active Live Page",
                        commentsToday: 18,
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
                      https://vst-assistant.vercel.app/api/webhook
                    </code>
                  </div>
                </div>
              </div>

              {/* LIVE REAL-TIME FACEBOOK COMMENTS & REPLIES FEED */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-xl backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-base">
                          សកម្មភាព Comment ផ្ទាល់លើ Facebook (Live Activities Feed)
                        </h3>
                        <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live Real-time
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        បង្ហាញរាល់ Comment របស់អតិថិជន និងការឆ្លើយតបរបស់ Bot ភ្លាមៗ {lastScannedTime && `(ស្កេនចុងក្រោយ៖ ម៉ោង ${lastScannedTime})`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={runScanner}
                      disabled={isScanning}
                      className="flex items-center gap-2 rounded-xl border border-slate-700/60 bg-slate-800/80 px-3.5 py-2 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/40 hover:bg-slate-700 hover:text-white disabled:opacity-50"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isScanning ? "animate-spin text-cyan-400" : ""}`} />
                      <span>{isScanning ? "កំពុងស្កេន..." : "ស្កេនទិន្នន័យឥឡូវនេះ"}</span>
                    </button>
                  </div>
                </div>

                {/* Activity Feed List */}
                <div className="mt-5 space-y-3.5">
                  {activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <RefreshCw className="h-8 w-8 text-cyan-500/40 animate-spin mb-3" />
                      <p className="text-sm font-medium text-slate-300">
                        កំពុងទាញយក Comment ផ្ទាល់ពី Facebook Page Kidney Pro...
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        រាល់ Comment ថ្មីៗនឹងលោតឡើងនៅត្រង់នេះដោយស្វ័យប្រវត្តិ
                      </p>
                    </div>
                  ) : (
                    activities.map((act, idx) => (
                      <div
                        key={act.commentId || idx}
                        className="rounded-xl border border-slate-800/90 bg-slate-800/30 p-4.5 transition hover:border-slate-700/80 hover:bg-slate-800/50"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          {/* User info & comment */}
                          <div className="flex items-start gap-3 flex-1 min-w-[280px]">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 font-bold text-white text-sm shadow-sm">
                              {(act.senderName && act.senderName !== "Customer" ? act.senderName.charAt(0) : "អ")}
                            </div>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm text-white">
                                  {act.senderName && act.senderName !== "Customer" ? act.senderName : "អតិថិជន Facebook"}
                                </span>
                                {act.senderId && (
                                  <span className="text-[10px] text-cyan-400 font-mono bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/40">
                                    ID: {act.senderId}
                                  </span>
                                )}
                                <span className="text-[11px] text-slate-500">
                                  {new Date(act.createdTime).toLocaleString("km-KH", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>

                              {/* User's comment text */}
                              <div className="rounded-xl bg-slate-900/60 p-3 text-xs text-slate-200 border border-slate-800">
                                <span className="text-slate-400 font-medium">មតិយោបល់៖ </span>
                                <span className="font-medium text-cyan-100">"{act.message}"</span>
                              </div>

                              {/* Bot Reply text */}
                              {act.replyText && (
                                <div className="mt-2 rounded-xl bg-cyan-950/20 p-3 text-xs text-cyan-200/90 border border-cyan-500/20">
                                  <div className="flex items-center gap-1.5 text-cyan-400 font-semibold mb-1">
                                    <Bot className="h-3.5 w-3.5" />
                                    <span>ការឆ្លើយតបរបស់ Bot ៖</span>
                                  </div>
                                  <p className="whitespace-pre-line leading-relaxed text-slate-300">
                                    {act.replyText}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right badges & direct link */}
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>បានតបរួចរាល់</span>
                            </span>

                            {act.permalink && (
                              <a
                                href={act.permalink}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 hover:underline mt-1"
                              >
                                <span>មើលលើ Facebook</span>
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                      💬 {t.settings.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {t.settings.subtitle}
                    </p>
                  </div>
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                    Auto Active
                  </span>
                </div>

                <div className="mt-5 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t.settings.keywordsLabel}
                    </label>
                    <input
                      type="text"
                      value={commentKeyword}
                      onChange={(e) => setCommentKeyword(e.target.value)}
                      placeholder={t.settings.keywordsPlaceholder}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      {t.settings.keywordsHint}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      {t.settings.replyTemplateLabel}
                    </label>
                    <textarea
                      rows={3}
                      value={commentReplyTemplate}
                      onChange={(e) => setCommentReplyTemplate(e.target.value)}
                      className="w-full rounded-xl border border-slate-700 bg-slate-800/60 p-4 text-sm text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    />
                    <p className="text-[11px] text-cyan-400/80 mt-1">
                      {t.settings.tagHint}
                    </p>
                  </div>

                  {/* Auto DM checkbox */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-800/30 p-4">
                    <div>
                      <div className="text-sm font-semibold text-white">
                        {t.settings.autoDmTitle}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {t.settings.autoDmDesc}
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
                        {t.settings.dmTemplateLabel}
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
                      <span>{t.settings.saveBtn}</span>
                    </button>

                    {savedSuccess && (
                      <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{t.savedSuccess}</span>
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
                    name: "Kidney Pro ឃីដនី ប្រូ",
                    id: "955747057621489",
                    followers: "Connected & Live Bot",
                    status: "Connected",
                  },
                  {
                    name: "Emmi អេមមី",
                    id: "101267342561819",
                    followers: "Connected & Live Bot",
                    status: "Connected",
                  },
                  {
                    name: "Emmi By CEO",
                    id: "985673367962860",
                    followers: "Connected & Live Bot",
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

          {/* TAB: CUSTOMERS CRM */}
          {activeTab === "customers" && (
            <div className="max-w-6xl space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-800 gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-base font-bold text-white">
                        👥 {t.crm.title}
                      </h3>
                      <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
                        {customersList.length} {lang === "km" ? "នាក់" : "Leads"}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {t.crm.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={fetchCustomers}
                      disabled={isLoadingCustomers}
                      className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 transition"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isLoadingCustomers ? "animate-spin text-cyan-400" : ""}`} />
                      <span>{isLoadingCustomers ? t.saving : t.crm.refreshBtn}</span>
                    </button>
                  </div>
                </div>

                {isLoadingCustomers ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-cyan-400" />
                    {t.crm.loading}
                  </div>
                ) : customersList.length === 0 ? (
                  <div className="py-12 text-center">
                    <Users className="h-10 w-10 text-slate-600 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-300">{t.crm.noData}</p>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      {lang === "km"
                        ? "នៅពេលមានអតិថិជន Comment លើ Page ប្រព័ន្ធ Bot នឹងកត់ត្រាឈ្មោះ និងព័ត៌មានរបស់ពួកគាត់ចូលក្នុងតារាងនេះដោយស្វ័យប្រវត្តិ!"
                        : "Whenever customers comment on your Facebook posts, the bot will automatically capture their profiles and display them here!"}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-800/60 text-slate-400 uppercase text-[10px]">
                        <tr>
                          <th className="p-3.5">{t.crm.colName}</th>
                          <th className="p-3.5">{t.crm.colFbId}</th>
                          <th className="p-3.5">{t.crm.colComments}</th>
                          <th className="p-3.5">{t.crm.colStatus}</th>
                          <th className="p-3.5">{t.crm.colLastActivity}</th>
                          <th className="p-3.5 text-right">{t.crm.colActions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800">
                        {customersList.map((c, i) => (
                          <tr key={c.id || i} className="hover:bg-slate-800/30 transition">
                            <td className="p-3.5 font-semibold text-white flex items-center gap-2.5">
                              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                                {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                              </div>
                              <span>{c.name}</span>
                            </td>
                            <td className="p-3.5 font-mono text-[11px] text-slate-400">
                              {c.fb_user_id || "N/A"}
                            </td>
                            <td className="p-3.5">
                              <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-cyan-300 font-medium">
                                {c.total_comments || 1} {lang === "km" ? "ដង" : "times"}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                                {c.status === "new" ? t.crm.statusNew : c.status || "Lead"}
                              </span>
                            </td>
                            <td className="p-3.5 text-slate-400 text-[11px]">
                              {c.last_activity_at
                                ? new Date(c.last_activity_at).toLocaleString(lang === "km" ? "km-KH" : "en-US")
                                : "Recent"}
                            </td>
                            <td className="p-3.5 text-right">
                              <a
                                href="https://m.me/955747057621489"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/30 px-3 py-1 text-xs text-blue-300 transition"
                              >
                                <MessageSquare className="h-3 w-3" />
                                <span>{t.crm.chatWithCustomer}</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: INBOX */}
          {activeTab === "inbox" && (
            <div className="max-w-4xl space-y-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-8 text-center shadow-xl">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-cyan-500/20">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-white">ប្រអប់សារ Messenger (Inbox)</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                  អតិថិជនដែលចុច Link ពីការឆ្លើយតប Comment របស់ Bot នឹងចូលទៅកាន់ Messenger របស់ Page ដោយផ្ទាល់។ បងអាចគ្រប់គ្រង និងជជែកជាមួយភ្ញៀវតាមរយៈ Meta Business Suite ផ្លូវការ។
                </p>
                <div className="mt-6 flex justify-center gap-4">
                  <a
                    href="https://business.facebook.com/latest/inbox/all?asset_id=955747057621489"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/30 hover:from-blue-500 hover:to-cyan-500 transition"
                  >
                    <span>បើកប្រអប់សារ Meta Business Suite</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* TAB: REPORTS */}
          {activeTab === "reports" && (
            <div className="max-w-6xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                    <span>ចំនួនអតិថិជនសរុប (Leads)</span>
                    <Users className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-2">{customersList.length} នាក់</div>
                  <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>កត់ត្រាចូល Supabase Database</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                    <span>ស្ថានភាព Bot</span>
                    <Bot className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-2">
                    {botActive ? "ដំណើរការ (ON)" : "ផ្អាកបណ្ដោះអាសន្ន (OFF)"}
                  </div>
                  <div className="text-[11px] text-cyan-400 mt-1">
                    គ្រប់គ្រងដោយ Master Kill Switch
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
                  <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
                    <span>Page ដែលកំពុងភ្ជាប់</span>
                    <FileText className="h-4 w-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black text-white mt-2">Kidney Pro</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Page ID: 955747057621489
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6">
                <h3 className="text-base font-bold text-white mb-2">📊 សង្ខេបដំណើរការលក់ (Conversion Funnel)</h3>
                <p className="text-xs text-slate-400 mb-6">
                  ស្ថិតិនៃការបម្លែងពីអ្នក Comment ទៅជាការចូលឆាត Messenger
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>អតិថិជន Comment លើ Post</span>
                      <span className="font-semibold text-white">{customersList.length}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full w-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-slate-300 mb-1">
                      <span>Bot ឆ្លើយតប និងបញ្ជូន Link Inbox</span>
                      <span className="font-semibold text-white">100%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full w-full" />
                    </div>
                  </div>
                </div>
              </div>
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
