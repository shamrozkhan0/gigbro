import React from "react";
import {
  LayoutDashboard,
  History,
  Bookmark,
  Tag,
  Settings,
  User,
  Search,
  Bell,
  ChevronDown,
  ArrowLeft,
  Sparkles,
  Download,
  RefreshCw,
  Info,
  Star,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Lightbulb,
  TrendingUp,
  Smile,
  HelpCircle,
  Shield,
  Heart,
  ThumbsDown,
} from "lucide-react";

/* ---------------------------------------------------------- helpers */

const tone = (score) =>
  score >= 70
    ? { ring: "#16a34a", text: "text-emerald-600", chip: "text-emerald-600", label: "Good" }
    : score >= 50
    ? { ring: "#eab308", text: "text-amber-500", chip: "text-amber-500", label: "Average" }
    : { ring: "#ef4444", text: "text-red-500", chip: "text-red-500", label: "Poor" };

const barTone = (score) =>
  score >= 70 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";

/* Circular score ring */
function Ring({ value, size = 64, stroke = 7, sub, big = false }) {
  const t = tone(value);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#eef0f2" strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={t.ring}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span className={`font-bold text-slate-800 ${big ? "text-xl" : "text-base"}`}>{value}</span>
        {sub && <span className="text-[8px] text-slate-400 -mt-0.5">{sub}</span>}
      </div>
    </div>
  );
}

/* Linear bar with caret */
function Bar({ label, value }) {
  return (
    <div className="flex items-center gap-2 py-[3px]">
      <span className="w-16 text-[10.5px] text-slate-500 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${barTone(value)}`} style={{ width: `${value}%` }} />
      </div>
      <span className="w-6 text-right text-[10.5px] font-semibold text-slate-600">{value}</span>
      <ChevronDown size={11} className="text-slate-300 shrink-0" />
    </div>
  );
}

function Card({ title, icon, children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col min-h-0 ${className}`}>
      <div className="flex items-center gap-1.5 px-3.5 pt-3 pb-2 shrink-0">
        {icon}
        <h3 className="text-[12.5px] font-semibold text-slate-800">{title}</h3>
      </div>
      <div className="px-3.5 pb-3 flex-1 min-h-0 overflow-hidden">{children}</div>
    </div>
  );
}

/* ---------------------------------------------------------- static data */

const scores = [
  { label: "Overall Score", value: 68, top: "Top 35% of gigs" },
  { label: "SEO Score", value: 72, top: "Top 30% of gigs" },
  { label: "Conversion Score", value: 64, top: "Top 45% of gigs" },
  { label: "Trust Score", value: 78, top: "Top 25% of gigs" },
  { label: "Buyer Clarity", value: 70, top: "Top 30% of gigs" },
  { label: "Ranking Potential", value: 66, top: "Top 40% of gigs" },
];

const strengths = [
  "Strong seller profile with good reviews",
  "Clear service delivery process",
  "Good use of gig image and gallery",
  "Relevant category and subcategory",
  "Decent response rate and communication",
];

const weaknesses = [
  { label: "Title not optimized for search intent", impact: "High Impact" },
  { label: "Description missing key keywords", impact: "High Impact" },
  { label: "Tags could be more targeted", impact: "Medium Impact" },
  { label: "No FAQ section", impact: "Medium Impact" },
  { label: "Packages lack detailed features", impact: "High Impact" },
];

const seoBars = [
  { label: "Title", value: 65 },
  { label: "Description", value: 58 },
  { label: "Tags", value: 71 },
  { label: "Seller Profile", value: 80 },
];

const intent = [
  { label: "Business Website", value: 85 },
  { label: "WordPress", value: 92 },
  { label: "WooCommerce", value: 60 },
  { label: "Landing Page", value: 40 },
];

const keywords = [
  { kw: "wordpress website", occ: 3, imp: "High", cov: "Good", risk: "Low" },
  { kw: "business website", occ: 2, imp: "High", cov: "Good", risk: "Low" },
  { kw: "responsive design", occ: 2, imp: "Medium", cov: "Fair", risk: "Low" },
  { kw: "landing page", occ: 1, imp: "Medium", cov: "Poor", risk: "Low" },
  { kw: "elementor", occ: 1, imp: "Medium", cov: "Fair", risk: "Low" },
];

const heatmap = [40, 70, 55, 85, 30, 60, 90, 45, 75, 20, 65, 95, 50, 35, 80];

const buyerPsych = [
  { icon: Smile, color: "text-emerald-500", label: "Positive Reactions", note: "“Great portfolio, professionalism stands out”" },
  { icon: ThumbsDown, color: "text-red-500", label: "Concerns", note: "“Not enough detail about the process”" },
  { icon: HelpCircle, color: "text-sky-500", label: "Questions", note: "“Will this work for my specific business?”" },
  { icon: Shield, color: "text-violet-500", label: "Trust Signals", note: "“Good reviews and response rate”" },
  { icon: Heart, color: "text-orange-500", label: "Emotional Response", note: "“Feels professional but needs more clarity”" },
];

const conversion = [
  { label: "CTA", value: 65 },
  { label: "Trust", value: 75 },
  { label: "Authority", value: 70 },
  { label: "Differentiation", value: 60 },
  { label: "Urgency", value: 45 },
  { label: "Packages", value: 68 },
];

const convNote = {
  65: "Could be stronger",
  75: "Good trust signals",
  70: "Decent authority",
  60: "Needs improvement",
  45: "Low urgency signals",
  68: "Good structure",
};

const packages = [
  { name: "Basic", price: "$50", score: 65, feats: ["Value: Good", "Pricing: Fair", "Missing: 2 key features", "Upsell: Good potential"] },
  { name: "Standard", price: "$100", score: 75, popular: true, feats: ["Value: Good", "Pricing: Good", "Missing: 1 key feature", "Upsell: High potential"] },
  { name: "Premium", price: "$200", score: 70, feats: ["Value: Good", "Pricing: Excellent", "Missing: 1 key feature", "Upsell: Medium potential"] },
];

const pageNav = [
  "Executive Dashboard", "Executive Summary", "Strengths", "Weaknesses", "SEO Audit",
  "Search Intent", "Keyword Analysis", "Buyer Psychology", "Conversion Audit",
  "Package Analysis", "Recommendations", "Optimized Content", "Expected Growth", "AI Mentor",
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: History, label: "History" },
  { icon: Bookmark, label: "Saved Reports" },
  { icon: Tag, label: "Pricing" },
  { icon: Settings, label: "Settings" },
  { icon: User, label: "Profile" },
];

/* ---------------------------------------------------------- component */

export default function FullReport() {
  return (
    <div className="h-screen w-full bg-[#F7F8FA] flex overflow-hidden text-slate-700 font-sans lg:overflow-hidden overflow-y-auto">
      {/* Sidebar */}
      <aside className="hidden md:flex w-[190px] shrink-0 border-r border-slate-100 bg-white flex-col py-4 px-3">
        <div className="flex items-center gap-1.5 px-1 mb-6">
          <div className="w-6 h-6 rounded-md bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">G</div>
          <span className="font-bold text-slate-800 text-sm">GigBro</span>
        </div>
        <nav className="flex flex-col gap-0.5">
          {navItems.map((it) => (
            <div
              key={it.label}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-lg text-[12.5px] cursor-pointer ${
                it.active ? "bg-emerald-50 text-emerald-600 font-medium" : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <it.icon size={15} />
              {it.label}
            </div>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] font-semibold text-slate-700">Pro Plan</p>
            <p className="text-[10px] text-slate-400 mb-2">Unlimited reports</p>
            <button className="w-full text-[10.5px] font-medium bg-white border border-slate-200 rounded-lg py-1.5">
              Upgrade Plan
            </button>
          </div>
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-[11px] font-semibold text-slate-700">AI Credits</p>
            <p className="text-[10px] text-slate-400 mb-1.5">8,420 / ∞</p>
            <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full w-3/4 bg-emerald-500 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
              <User size={13} className="text-slate-500" />
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-medium text-slate-700">Shamroz Khan</p>
              <p className="text-[9.5px] text-slate-400">shamroz@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Header */}
        <header className="h-14 shrink-0 border-b border-slate-100 bg-white flex items-center justify-between px-4 gap-4">
          <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md bg-slate-50 rounded-lg px-3 py-1.5">
            <Search size={14} className="text-slate-400" />
            <span className="text-[12px] text-slate-400 flex-1">Search reports, gigs, keywords...</span>
            <kbd className="text-[9px] text-slate-400 border border-slate-200 rounded px-1">⌘K</kbd>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <div className="relative">
              <Bell size={16} className="text-slate-400" />
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center">4</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
                <User size={13} className="text-slate-500" />
              </div>
              <div className="hidden sm:block leading-tight">
                <p className="text-[11.5px] font-medium text-slate-700">Shamroz Khan</p>
                <p className="text-[9.5px] text-slate-400">Pro Plan</p>
              </div>
              <ChevronDown size={12} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Body: content + right page-nav */}
        <div className="flex-1 min-h-0 flex overflow-hidden">
          {/* Content column */}
          <main className="flex-1 min-w-0 min-h-0 grid grid-rows-[auto_auto_1fr_1fr] gap-2.5 p-3">
            {/* Title row */}
            <div className="flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
                  <ArrowLeft size={11} /> Back to Reports
                </div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-bold text-slate-800">Gig Audit Report</h1>
                  <Sparkles size={15} className="text-emerald-500" />
                </div>
                <p className="text-[10.5px] text-slate-400">
                  Analyzed 3 minutes ago &nbsp;•&nbsp; Level 2 Seller &nbsp;•&nbsp; Programming &amp; Tech &nbsp;•&nbsp; WordPress
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 text-[11.5px] font-medium border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600">
                  <Download size={13} /> Export Report
                </button>
                <button className="flex items-center gap-1.5 text-[11.5px] font-medium bg-emerald-500 text-white rounded-lg px-3 py-1.5">
                  <RefreshCw size={13} /> Regenerate Report
                </button>
              </div>
            </div>

            {/* Score cards */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 shrink-0">
              {scores.map((s) => {
                const t = tone(s.value);
                return (
                  <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex flex-col items-center">
                    <div className="flex items-center gap-1 w-full mb-1.5">
                      <span className="text-[10.5px] text-slate-500 flex-1 truncate">{s.label}</span>
                      <Info size={11} className="text-slate-300" />
                    </div>
                    <Ring value={s.value} size={64} sub="/100" />
                    <span className={`text-[11px] font-semibold mt-1.5 ${t.chip}`}>{t.label}</span>
                    <span className="text-[9.5px] text-slate-400">{s.top}</span>
                  </div>
                );
              })}
            </div>

            {/* Row: summary / strengths / weaknesses */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 min-h-0">
              <Card title="Executive Summary" icon={<FileText size={14} className="text-emerald-500" />}>
                <p className="text-[10.5px] text-slate-500 leading-snug mb-2.5">
                  This gig has solid foundations with room for significant improvement. Your SEO is decent but
                  content optimization and keyword targeting could boost your rankings substantially.
                </p>
                <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={13} className="text-emerald-500" />
                    <div className="leading-tight">
                      <p className="text-[9px] text-slate-400">Verdict</p>
                      <p className="text-[10.5px] font-semibold text-slate-700">Good Foundation</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Lightbulb size={13} className="text-amber-500" />
                    <div className="leading-tight">
                      <p className="text-[9px] text-slate-400">Key Opportunities</p>
                      <p className="text-[10.5px] font-semibold text-slate-700">7 Identified</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendingUp size={13} className="text-emerald-500" />
                    <div className="leading-tight">
                      <p className="text-[9px] text-slate-400">Potential Growth</p>
                      <p className="text-[10.5px] font-semibold text-slate-700">+156%</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card title="Strengths" icon={<Star size={14} className="text-emerald-500" />}>
                <ul className="flex flex-col gap-1.5">
                  {strengths.map((s) => (
                    <li key={s} className="flex items-start gap-1.5 text-[10.5px] text-slate-500">
                      <CheckCircle2 size={12} className="text-emerald-500 mt-[1px] shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </Card>

              <Card title="Weaknesses" icon={<AlertTriangle size={14} className="text-red-500" />}>
                <ul className="flex flex-col gap-1.5">
                  {weaknesses.map((w) => (
                    <li key={w.label} className="flex items-center justify-between gap-2 text-[10.5px]">
                      <span className="flex items-start gap-1.5 text-slate-500">
                        <AlertTriangle size={12} className="text-red-500 mt-[1px] shrink-0" />
                        {w.label}
                      </span>
                      <span
                        className={`shrink-0 text-[8.5px] font-medium px-1.5 py-0.5 rounded-full ${
                          w.impact === "High Impact" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
                        }`}
                      >
                        {w.impact}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Row: SEO / Search Intent / Keyword Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 min-h-0">
              <Card title="SEO Audit" icon={<Search size={14} className="text-emerald-500" />}>
                <div className="flex flex-col justify-center h-full">
                  {seoBars.map((b) => (
                    <Bar key={b.label} label={b.label} value={b.value} />
                  ))}
                </div>
              </Card>

              <Card title="Search Intent Analysis" icon={<Search size={14} className="text-emerald-500" />}>
                <div className="grid grid-cols-2 gap-2 h-full">
                  <div className="flex flex-col justify-center">
                    {intent.map((b) => (
                      <div key={b.label} className="py-[3px]">
                        <div className="flex justify-between text-[10px] mb-0.5">
                          <span className="text-slate-500">{b.label}</span>
                          <span className="font-semibold text-slate-600">{b.value}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div className={`h-full rounded-full ${barTone(b.value)}`} style={{ width: `${b.value}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center justify-center border-l border-slate-100 pl-2">
                    <Ring value={72} size={58} sub="/100" />
                    <p className="text-[10.5px] font-semibold text-emerald-600 mt-1.5">Good Match</p>
                    <p className="text-[9px] text-slate-400 text-center leading-snug">
                      Strong alignment with buyer search intent
                    </p>
                  </div>
                </div>
              </Card>

              <Card title="Keyword Analysis" icon={<Tag size={14} className="text-emerald-500" />}>
                <div className="grid grid-cols-5 gap-2 h-full">
                  <div className="col-span-3 overflow-hidden">
                    <div className="grid grid-cols-[1.4fr_0.4fr_0.6fr_0.6fr_0.7fr] text-[8.5px] text-slate-400 font-medium pb-1 border-b border-slate-100">
                      <span>Keyword</span><span>Occ.</span><span>Import.</span><span>Cover.</span><span>Risk</span>
                    </div>
                    {keywords.map((k) => (
                      <div key={k.kw} className="grid grid-cols-[1.4fr_0.4fr_0.6fr_0.6fr_0.7fr] text-[9.5px] text-slate-600 py-1 border-b border-slate-50">
                        <span className="truncate pr-1">{k.kw}</span>
                        <span>{k.occ}</span>
                        <span className="truncate">{k.imp}</span>
                        <span className="truncate">{k.cov}</span>
                        <span className="text-emerald-500">{k.risk}</span>
                      </div>
                    ))}
                  </div>
                  <div className="col-span-2 flex flex-col items-center justify-center gap-2 border-l border-slate-100 pl-1">
                    <div className="relative w-14 h-14">
                      <Ring value={24} size={56} />
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] text-slate-400" />
                    </div>
                    <p className="text-[8.5px] text-slate-400 -mt-1">Keyword Distribution</p>
                    <div className="grid grid-cols-5 gap-[3px]">
                      {heatmap.map((h, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-[2px]"
                          style={{ backgroundColor: `rgba(16,185,129,${0.15 + h / 130})` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Row: Buyer Psychology / Conversion Audit / Package Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 min-h-0">
              <Card title="Buyer Psychology" icon={<User size={14} className="text-emerald-500" />}>
                <p className="text-[9.5px] text-slate-400 mb-1.5 -mt-1">What buyers think when they see your gig</p>
                <ul className="flex flex-col gap-1.5">
                  {buyerPsych.map((b) => (
                    <li key={b.label} className="flex items-center gap-2 text-[10px]">
                      <b.icon size={13} className={`${b.color} shrink-0`} />
                      <span className="w-[110px] shrink-0 text-slate-600">{b.label}</span>
                      <span className="text-slate-400 italic truncate">{b.note}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card title="Conversion Audit" icon={<TrendingUp size={14} className="text-emerald-500" />}>
                <div className="grid grid-cols-3 gap-2 h-full content-center">
                  {conversion.map((c) => (
                    <div key={c.label}>
                      <div className="flex justify-between text-[10px] mb-0.5">
                        <span className="text-slate-500">{c.label}</span>
                        <span className="font-semibold text-slate-600">{c.value}/100</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-0.5">
                        <div className={`h-full rounded-full ${barTone(c.value)}`} style={{ width: `${c.value}%` }} />
                      </div>
                      <p className="text-[8.5px] text-slate-400">{convNote[c.value]}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Package Analysis" icon={<Bookmark size={14} className="text-emerald-500" />}>
                <div className="grid grid-cols-3 gap-2 h-full">
                  {packages.map((p) => (
                    <div
                      key={p.name}
                      className={`relative rounded-lg border p-2 flex flex-col items-center ${
                        p.popular ? "border-emerald-400 bg-emerald-50/40" : "border-slate-100"
                      }`}
                    >
                      {p.popular && (
                        <span className="absolute -top-2 bg-emerald-500 text-white text-[7.5px] px-1.5 py-0.5 rounded-full">
                          Most Popular
                        </span>
                      )}
                      <p className="text-[10px] font-semibold text-slate-700 mt-1">{p.name}</p>
                      <p className="text-[9px] text-slate-400 mb-1">{p.price}</p>
                      <Ring value={p.score} size={46} sub="/100" />
                      <ul className="mt-1.5 w-full">
                        {p.feats.map((f) => (
                          <li key={f} className="text-[8px] text-slate-500 leading-snug truncate">{f}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </main>

          {/* Right page nav */}
          <aside className="hidden xl:flex w-[170px] shrink-0 border-l border-slate-100 bg-white p-3 flex-col gap-1 overflow-y-auto">
            <p className="text-[10px] font-semibold text-slate-700 mb-1">On this page</p>
            {pageNav.map((label, i) => (
              <div
                key={label}
                className={`flex items-center gap-1.5 text-[10px] py-0.5 ${
                  i === 4 ? "text-emerald-600 font-medium" : "text-slate-400"
                }`}
              >
                <span className="w-4">{String(i + 1).padStart(2, "0")}</span>
                {label}
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}