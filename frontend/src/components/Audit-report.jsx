import React from 'react'

import {  Grid3x3,
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
  FileText,
  Star,
  AlertTriangle,
  CheckCircle2,
  Info,
  Target,
  KeyRound,
  Brain,
  BarChart3,
  Package,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
 
/* ---------------------------------------------------------
   Small building blocks
--------------------------------------------------------- */
 
// Circular progress ring used for all the score gauges
function ScoreRing({ score, size = 96, stroke = 8, color = "#16a34a" }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
 
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#e5e7eb"
        strokeWidth={stroke}
        fill="none"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  );
}
 
function scoreColor(score) {
  if (score >= 75) return "#16a34a"; // green
  if (score >= 60) return "#f59e0b"; // amber
  return "#ef4444"; // red
}
 
function scoreLabel(score) {
  if (score >= 75) return { text: "Good", color: "text-emerald-600" };
  if (score >= 60) return { text: "Average", color: "text-amber-500" };
  return { text: "Needs Work", color: "text-red-500" };
}
 
function ScoreCard({ title, score, percentile }) {
  const color = scoreColor(score);
  const label = scoreLabel(score);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center shadow-sm">
      <div className="flex items-center justify-between w-full mb-3">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <Info className="w-3.5 h-3.5 text-gray-300" />
      </div>
      <div className="relative flex items-center justify-center">
        <ScoreRing score={score} color={color} />
        <div className="absolute flex flex-col items-center">
          <span className="text-2xl font-bold text-gray-900">{score}</span>
          <span className="text-[10px] text-gray-400 -mt-1">/100</span>
        </div>
      </div>
      <span className={`text-sm font-semibold mt-3 ${label.color}`}>{label.text}</span>
      <span className="text-xs text-gray-400 mt-0.5">{percentile}</span>
    </div>
  );
}
 
function ProgressBar({ value }) {
  const color = scoreColor(value);
  return (
    <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}
 
function MetricRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600 w-24 shrink-0">{label}</span>
      <div className="flex-1 mx-3">
        <ProgressBar value={value} />
      </div>
      <span className="text-sm font-semibold text-gray-800 w-8 text-right">{value}</span>
      <ChevronDown className="w-3.5 h-3.5 text-gray-300 ml-2" />
    </div>
  );
}
 
function ImpactPill({ level }) {
  const styles = {
    High: "bg-red-50 text-red-500",
    Medium: "bg-amber-50 text-amber-500",
  };
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${styles[level]}`}>
      {level} Impact
    </span>
  );
}
 
/* ---------------------------------------------------------
   Sidebar
--------------------------------------------------------- */
 
function Sidebar() {
  const nav = [
    { icon: Grid3x3, label: "Dashboard", active: true },
    { icon: History, label: "History" },
    { icon: Bookmark, label: "Saved Reports" },
    { icon: Tag, label: "Pricing" },
    { icon: Settings, label: "Settings" },
    { icon: User, label: "Profile" },
  ];
 
  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-gray-100 bg-white h-screen sticky top-0 px-4 py-5">
      <div className="flex items-center gap-2 px-2 mb-8">
        <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">
          G
        </div>
        <span className="font-bold text-gray-900">GigBro</span>
      </div>
 
      <nav className="flex flex-col gap-1">
        {nav.map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              active
                ? "bg-emerald-50 text-emerald-600"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Icon className="w-4.5 h-4.5" />
            {label}
          </button>
        ))}
      </nav>
 
      <div className="mt-auto flex flex-col gap-4">
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-800">Pro Plan</p>
          <p className="text-xs text-gray-400 mb-3">Unlimited reports · Renews Aug 15, 2025</p>
          <button className="w-full text-sm font-medium bg-white border border-gray-200 rounded-lg py-1.5 hover:bg-gray-100">
            Upgrade Plan
          </button>
        </div>
 
        <div className="px-1">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>AI Credits</span>
            <span className="font-semibold text-gray-700">8,420 / ∞</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full w-3/4 rounded-full bg-emerald-500" />
          </div>
        </div>
 
        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <img
            src="https://i.pravatar.cc/64?img=13"
            className="w-8 h-8 rounded-full object-cover"
            alt="avatar"
          />
          <div className="leading-tight">
            <p className="text-sm font-medium text-gray-800">Shamroz Khan</p>
            <p className="text-xs text-gray-400">shamroz@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
 
/* ---------------------------------------------------------
   Topbar
--------------------------------------------------------- */
 
function Topbar() {
  return (
    <div className="flex items-center gap-4 px-6 lg:px-10 py-4 border-b border-gray-100 bg-white sticky top-0 z-10">
      <div className="flex-1 max-w-xl relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          placeholder="Search reports, gigs, keywords..."
          className="w-full bg-gray-50 rounded-xl pl-9 pr-12 py-2.5 text-sm outline-none border border-transparent focus:border-emerald-300"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-white border border-gray-200 rounded px-1.5 py-0.5">
          ⌘K
        </kbd>
      </div>
      <button className="relative w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-50">
        <Bell className="w-4.5 h-4.5 text-gray-500" />
        <span className="absolute top-1 right-1.5 w-4 h-4 text-[10px] flex items-center justify-center bg-emerald-500 text-white rounded-full">
          4
        </span>
      </button>
      <div className="flex items-center gap-2 pl-2">
        <img
          src="https://i.pravatar.cc/64?img=13"
          className="w-8 h-8 rounded-full object-cover"
          alt="avatar"
        />
        <div className="leading-tight hidden sm:block">
          <p className="text-sm font-medium text-gray-800">Shamroz Khan</p>
          <p className="text-xs text-gray-400">Pro Plan</p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
    </div>
  );
}
 
/* ---------------------------------------------------------
   Page sections
--------------------------------------------------------- */
 
function PageHeader() {
  return (
    <div className="flex items-start justify-between px-6 lg:px-10 pt-6">
      <div>
        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Reports
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          Gig Audit Report <Sparkles className="w-5 h-5 text-emerald-500" />
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Analyzed 3 minutes ago &nbsp;•&nbsp; Level 2 Seller &nbsp;•&nbsp; Programming &amp; Tech &nbsp;•&nbsp; WordPress
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button className="flex items-center gap-2 text-sm font-medium border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50">
          <Download className="w-4 h-4" />
          Export Report
        </button>
        <button className="flex items-center gap-2 text-sm font-medium bg-emerald-500 text-white rounded-xl px-4 py-2 hover:bg-emerald-600">
          <RefreshCw className="w-4 h-4" />
          Regenerate Report
        </button>
      </div>
    </div>
  );
}
 
function ScoreCards() {
  const cards = [
    { title: "Overall Score", score: 68, percentile: "Top 35% of gigs" },
    { title: "SEO Score", score: 72, percentile: "Top 30% of gigs" },
    { title: "Conversion Score", score: 64, percentile: "Top 45% of gigs" },
    { title: "Trust Score", score: 78, percentile: "Top 25% of gigs" },
    { title: "Buyer Clarity", score: 70, percentile: "Top 30% of gigs" },
    { title: "Ranking Potential", score: 66, percentile: "Top 40% of gigs" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 px-6 lg:px-10 mt-6">
      {cards.map((c) => (
        <ScoreCard key={c.title} {...c} />
      ))}
    </div>
  );
}
 
function Card({ title, icon: Icon, children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 p-5 shadow-sm ${className}`}>
      {title && (
        <div className="flex items-center gap-2 mb-4">
          {Icon && <Icon className="w-4.5 h-4.5 text-emerald-500" />}
          <h3 className="text-sm font-semibold text-gray-800">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}
 
function ExecutiveSummary() {
  return (
    <Card title="Executive Summary" icon={FileText}>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">
        This gig has solid foundations with room for significant improvement. Your SEO is
        decent but content optimization and keyword targeting could boost your rankings
        substantially.
      </p>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <div className="leading-tight">
            <p className="text-[11px] text-gray-400">Verdict</p>
            <p className="text-sm font-semibold text-gray-800">Good Foundation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-500" />
          <div className="leading-tight">
            <p className="text-[11px] text-gray-400">Key Opportunities</p>
            <p className="text-sm font-semibold text-gray-800">7 Identified</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-emerald-500" />
          <div className="leading-tight">
            <p className="text-[11px] text-gray-400">Potential Growth</p>
            <p className="text-sm font-semibold text-gray-800">+156%</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
 
function Strengths() {
  const items = [
    "Strong seller profile with good reviews",
    "Clear service delivery process",
    "Good use of gig image and gallery",
    "Relevant category and subcategory",
    "Decent response rate and communication",
  ];
  return (
    <Card title="Strengths" icon={Star}>
      <ul className="flex flex-col gap-3">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2 text-sm text-gray-600">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
            {t}
          </li>
        ))}
      </ul>
    </Card>
  );
}
 
function Weaknesses() {
  const items = [
    { t: "Title not optimized for search intent", level: "High" },
    { t: "Description missing key keywords", level: "High" },
    { t: "Tags could be more targeted", level: "Medium" },
    { t: "No FAQ section", level: "Medium" },
    { t: "Packages lack detailed features", level: "High" },
  ];
  return (
    <Card title="Weaknesses" icon={AlertTriangle}>
      <ul className="flex flex-col gap-3.5">
        {items.map(({ t, level }) => (
          <li key={t} className="flex items-start justify-between gap-3 text-sm">
            <span className="flex items-start gap-2 text-gray-600">
              <Info className="w-4 h-4 text-gray-300 mt-0.5 shrink-0" />
              {t}
            </span>
            <ImpactPill level={level} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
 
function TableOfContents() {
  const items = [
    "Executive Dashboard",
    "Executive Summary",
    "Strengths",
    "Weaknesses",
    "SEO Audit",
    "Search Intent",
    "Keyword Analysis",
    "Buyer Psychology",
    "Conversion Audit",
    "Package Analysis",
    "Recommendations",
    "Optimized Content",
    "Expected Growth",
    "AI Mentor",
  ];
  return (
    <Card title="On this page">
      <ul className="flex flex-col gap-2.5">
        {items.map((t, i) => (
          <li
            key={t}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 cursor-pointer"
          >
            <span className="text-xs text-gray-300 w-4">{String(i + 1).padStart(2, "0")}</span>
            {t}
          </li>
        ))}
      </ul>
    </Card>
  );
}
 
function SEOAudit() {
  return (
    <Card title="SEO Audit" icon={Search}>
      <div className="flex flex-col">
        <MetricRow label="Title" value={65} />
        <MetricRow label="Description" value={58} />
        <MetricRow label="Tags" value={71} />
        <MetricRow label="Seller Profile" value={80} />
      </div>
    </Card>
  );
}
 
function SearchIntentAnalysis() {
  const rows = [
    { label: "Business Website", value: 85 },
    { label: "WordPress", value: 92 },
    { label: "WooCommerce", value: 60 },
    { label: "Landing Page", value: 40 },
  ];
  return (
    <Card title="Search Intent Analysis" icon={Target}>
      <div className="flex flex-col gap-4 mb-5">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm text-gray-600">{r.label}</span>
              <span className="text-sm font-semibold text-gray-800">{r.value}%</span>
            </div>
            <ProgressBar value={r.value} />
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center border-t border-gray-50 pt-4">
        <p className="text-xs text-gray-400 mb-2">Intent Match Score</p>
        <div className="relative flex items-center justify-center">
          <ScoreRing score={72} size={84} color={scoreColor(72)} />
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-bold text-gray-900">72</span>
            <span className="text-[10px] text-gray-400 -mt-1">/100</span>
          </div>
        </div>
        <p className="text-sm font-semibold text-emerald-600 mt-2">Good Match</p>
        <p className="text-xs text-gray-400 text-center mt-1">
          Strong alignment with buyer search intent
        </p>
      </div>
    </Card>
  );
}
 
function KeywordAnalysis() {
  const rows = [
    { keyword: "wordpress website", occ: 3, importance: "High", coverage: "Good", risk: "Low" },
    { keyword: "business website", occ: 2, importance: "High", coverage: "Good", risk: "Low" },
    { keyword: "responsive design", occ: 2, importance: "Medium", coverage: "Fair", risk: "Low" },
    { keyword: "landing page", occ: 1, importance: "Medium", coverage: "Poor", risk: "Low" },
    { keyword: "elementor", occ: 1, importance: "Medium", coverage: "Fair", risk: "Low" },
  ];
  const heat = [3, 4, 2, 1, 4, 3, 2, 4, 1, 3, 2, 4, 1, 2, 3, 4];
 
  return (
    <Card title="Keyword Analysis" icon={KeyRound}>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 text-xs">
                <th className="text-left font-medium pb-2">Keyword</th>
                <th className="text-left font-medium pb-2">Occ.</th>
                <th className="text-left font-medium pb-2">Importance</th>
                <th className="text-left font-medium pb-2">Coverage</th>
                <th className="text-left font-medium pb-2">Stuffing Risk</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.keyword} className="border-t border-gray-50">
                  <td className="py-2.5 text-gray-700">{r.keyword}</td>
                  <td className="py-2.5 text-gray-500">{r.occ}</td>
                  <td className="py-2.5 text-gray-500">{r.importance}</td>
                  <td className="py-2.5 text-gray-500">{r.coverage}</td>
                  <td className="py-2.5 text-gray-500">{r.risk}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
 
        <div className="flex flex-col items-center gap-5">
          <div>
            <p className="text-xs text-gray-400 text-center mb-2">Keyword Distribution</p>
            <div className="relative flex items-center justify-center">
              <ScoreRing score={100} size={84} color="#16a34a" />
              <div className="absolute flex flex-col items-center">
                <span className="text-[10px] text-gray-400">Total</span>
                <span className="text-xl font-bold text-gray-900">24</span>
              </div>
            </div>
          </div>
          <div className="w-full">
            <p className="text-xs text-gray-400 mb-2">Keyword Heatmap</p>
            <div className="grid grid-cols-4 gap-1.5">
              {heat.map((v, i) => (
                <div
                  key={i}
                  className="w-full aspect-square rounded-md"
                  style={{
                    backgroundColor: `rgba(22,163,74,${0.15 + v * 0.18})`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
 
function BuyerPsychology() {
  const items = [
    { label: "Positive Reactions", quote: "Great portfolio, professionalism stands out" },
    { label: "Concerns", quote: "Not enough detail about the process" },
    { label: "Questions", quote: "Will this work for my specific business?" },
    { label: "Trust Signals", quote: "Good reviews and response rate" },
    { label: "Emotional Response", quote: "Feels professional but needs more clarity" },
  ];
  return (
    <Card title="Buyer Psychology" icon={Brain}>
      <p className="text-xs text-gray-400 mb-4">What buyers think when they see your gig</p>
      <ul className="flex flex-col gap-4">
        {items.map((it) => (
          <li key={it.label} className="flex items-start gap-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">{it.label}</p>
              <p className="text-xs text-gray-400">"{it.quote}"</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
 
function ConversionAudit() {
  const items = [
    { label: "CTA", value: 65, note: "Could be stronger" },
    { label: "Trust", value: 75, note: "Good trust signals" },
    { label: "Authority", value: 70, note: "Decent authority" },
    { label: "Differentiation", value: 60, note: "Needs improvement" },
    { label: "Urgency", value: 45, note: "Low urgency signals" },
    { label: "Packages", value: 68, note: "Good structure" },
  ];
  return (
    <Card title="Conversion Audit" icon={BarChart3}>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        {items.map((it) => (
          <div key={it.label}>
            <div className="flex items-baseline justify-between mb-1.5">
              <span className="text-sm text-gray-600">{it.label}</span>
              <span className="text-sm font-semibold text-gray-800">
                {it.value}
                <span className="text-xs text-gray-400">/100</span>
              </span>
            </div>
            <ProgressBar value={it.value} />
            <p className="text-xs text-gray-400 mt-1">{it.note}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
 
function PackageAnalysis() {
  const packages = [
    {
      name: "Basic",
      price: "$50",
      score: 65,
      points: ["Value: Good", "Pricing: Fair", "Missing: 2 key features", "Upsell: Good potential"],
    },
    {
      name: "Standard",
      price: "$100",
      score: 75,
      popular: true,
      points: ["Value: Good", "Pricing: Good", "Missing: 1 key feature", "Upsell: High potential"],
    },
    {
      name: "Premium",
      price: "$200",
      score: 70,
      points: ["Value: Good", "Pricing: Excellent", "Missing: 1 key feature", "Upsell: Medium potential"],
    },
  ];
 
  return (
    <Card title="Package Analysis" icon={Package}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {packages.map((p) => (
          <div
            key={p.name}
            className={`rounded-xl p-4 border relative ${
              p.popular ? "border-emerald-400 ring-1 ring-emerald-200" : "border-gray-100"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-2.5 right-3 bg-emerald-500 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Most Popular
              </span>
            )}
            <p className="text-sm font-semibold text-gray-800">{p.name}</p>
            <p className="text-xs text-gray-400 mb-3">{p.price}</p>
            <div className="flex justify-center mb-3">
              <div className="relative flex items-center justify-center">
                <ScoreRing score={p.score} size={72} stroke={7} color={scoreColor(p.score)} />
                <div className="absolute flex flex-col items-center">
                  <span className="text-lg font-bold text-gray-900">{p.score}</span>
                  <span className="text-[9px] text-gray-400 -mt-1">/100</span>
                </div>
              </div>
            </div>
            <ul className="flex flex-col gap-1">
              {p.points.map((pt) => (
                <li key={pt} className="text-xs text-gray-500">
                  • {pt}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
 
/* ---------------------------------------------------------
   Root component
--------------------------------------------------------- */

const AuditReport = () => {
 return (
    <div className="min-h-screen bg-[#F9FAFB] flex text-gray-900 font-sans">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        <PageHeader />
        <ScoreCards />
 
        <div className="px-6 lg:px-10 mt-6 grid grid-cols-1 xl:grid-cols-[1fr_1fr_1fr_260px] gap-4 items-start">
          <ExecutiveSummary />
          <Strengths />
          <Weaknesses />
          <TableOfContents />
        </div>
 
        <div className="px-6 lg:px-10 mt-4 grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
          <SEOAudit />
          <SearchIntentAnalysis />
          <KeywordAnalysis className="xl:col-span-1" />
        </div>
 
        <div className="px-6 lg:px-10 mt-4 mb-10 grid grid-cols-1 xl:grid-cols-3 gap-4 items-start">
          <BuyerPsychology />
          <ConversionAudit />
          <PackageAnalysis />
        </div>
      </div>
    </div>
  );
}

export default AuditReport