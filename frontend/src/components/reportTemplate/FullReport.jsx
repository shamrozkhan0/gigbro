import { useEffect, useRef, useState } from 'react';
import { gig_data } from '../../../data2';
import {
  ShoppingBag,
  ExternalLink,
  Clock,
  Award,
  TrendingUp,
  Search,
  Target,
  Users,
  Package,
  ListChecks,
  Sparkles,
  LineChart as LineChartIcon,
  Brain,
  LayoutDashboard,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ChevronDown,
  Tag,
  ThumbsUp,
  HelpCircle,
  ShieldCheck,
  MessageCircle,
  Quote,
  ArrowUpRight,
  Info,
  Star,
  Zap,
  Menu,
  X,
} from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';


const getScoreColors = (score) => {
  if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-500', soft: 'bg-emerald-50', stroke: '#10b981', border: 'border-emerald-200' };
  if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-500', soft: 'bg-amber-50', stroke: '#f59e0b', border: 'border-amber-200' };
  return { text: 'text-rose-600', bg: 'bg-rose-500', soft: 'bg-rose-50', stroke: '#f43f56', border: 'border-rose-200' };
};

const impactBadge = (impact) => {
  const map = {
    Low: 'bg-slate-100 text-slate-600',
    Medium: 'bg-amber-50 text-amber-700',
    High: 'bg-rose-50 text-rose-700',
  };
  return map[impact] || map.Low;
};

const riskBadge = (val) => {
  const map = {
    Low: 'bg-emerald-50 text-emerald-700',
    Medium: 'bg-amber-50 text-amber-700',
    High: 'bg-rose-50 text-rose-700',
    Good: 'bg-emerald-50 text-emerald-700',
    Fair: 'bg-amber-50 text-amber-700',
    Poor: 'bg-rose-50 text-rose-700',
  };
  return map[val] || 'bg-slate-100 text-slate-600';
};

function ScoreRing({ score, size = 128, strokeWidth = 10, sublabel }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const colors = getScoreColors(score);
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="stroke-slate-100" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
          stroke={colors.stroke}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`font-extrabold ${colors.text}`} style={{ fontSize: size * 0.28 }}>
          {score}
        </span>
        {sublabel && <span className="text-[11px] text-slate-400 font-medium -mt-0.5">{sublabel}</span>}
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="mb-6 flex items-start gap-3">
      {Icon && (
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="w-5 h-5 text-emerald-600" strokeWidth={2.2} />
        </div>
      )}
      <div>
        {eyebrow && <p className="text-xs font-semibold tracking-wide uppercase text-emerald-600 mb-1">{eyebrow}</p>}
        <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
        {description && <p className="text-sm text-slate-500 mt-1 max-w-2xl">{description}</p>}
      </div>
    </div>
  );
}

function Card({ children, className = '' }) {
  return (
    <div className={`bg-white border border-slate-100 rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.08)] ${className}`}>
      {children}
    </div>
  );
}


const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'seo-audit', label: 'SEO Audit', icon: Search },
  { id: 'intent-keywords', label: 'Intent & Keywords', icon: Target },
  { id: 'buyer-psychology', label: 'Buyer Psychology', icon: Users },
  { id: 'conversion', label: 'Conversion Audit', icon: TrendingUp },
  { id: 'packages', label: 'Packages', icon: Package },
  { id: 'recommendations', label: 'Recommendations', icon: ListChecks },
  { id: 'optimized-content', label: 'Optimized Content', icon: Sparkles },
  { id: 'growth', label: 'Growth Projection', icon: LineChartIcon },
  { id: 'ai-mentor', label: 'AI Mentor', icon: Brain },
];


export default function FullReport() {
  const [active, setActive] = useState('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const sectionRefs = useRef({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
    );
    NAV_ITEMS.forEach((item) => {
      const el = sectionRefs.current[item.id];
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setMobileNavOpen(false);
  };

  const s = gig_data.scores;
  const conversionRadarData = Object.entries(gig_data.conversion_audit).map(([key, val]) => ({
    subject: key.charAt(0).toUpperCase() + key.slice(1),
    score: val.score,
    fullMark: 100,
  }));
  const growthData = [
    { name: 'SEO Score', Current: gig_data.expected_growth.current_seo, Optimized: gig_data.expected_growth.optimized_seo },
    { name: 'Conversion', Current: gig_data.expected_growth.current_conversion, Optimized: gig_data.expected_growth.expected_conversion },
  ];

  const analyzedDate = new Date(gig_data.meta.analyzed_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* ---------------- Top bar ---------------- */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
              <ShoppingBag className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:inline">
              Gig<span className="text-emerald-500">Bro</span>
            </span>
          </div>

          <div className="hidden md:flex flex-col min-w-0">
            <span className="text-xs text-slate-400 truncate">
              {gig_data.meta.category} <span className="mx-1 text-slate-300">/</span> {gig_data.meta.subcategory}
            </span>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              {gig_data.meta.seller_status}
            </span>
            <a
              href={gig_data.meta.gig_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              View Gig
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => setMobileNavOpen((v) => !v)}
              className="lg:hidden w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600"
              aria-label="Toggle navigation"
            >
              {mobileNavOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden border-t border-slate-100 px-4 py-3 flex flex-wrap gap-2 bg-white">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  active === item.id
                    ? 'bg-emerald-500 border-emerald-500 text-white'
                    : 'border-slate-200 text-slate-600'
                }`}
              >
                <item.icon className="w-3.5 h-3.5" />
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-8 flex gap-10">
        {/* ---------------- Sidebar ---------------- */}
        <aside className="hidden lg:block w-60 shrink-0">
          <nav className="sticky top-24 flex flex-col gap-1 pb-10">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 px-3 mb-1">
              Report contents
            </p>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-left transition-colors ${
                  active === item.id
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <item.icon
                  className={`w-4 h-4 shrink-0 ${active === item.id ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-500'}`}
                />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ---------------- Main content ---------------- */}
        <main className="flex-1 min-w-0 py-8 space-y-16">
          {/* ============= OVERVIEW ============= */}
          <section id="overview" ref={(el) => (sectionRefs.current.overview = el)} className="scroll-mt-24">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-3">
              <Clock className="w-3.5 h-3.5" />
              Analyzed {analyzedDate}
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
              Gig Analysis Report
            </h1>
            <p className="text-slate-500 max-w-2xl mb-8">
              Design &amp; redesign business WordPress website — build WordPress website development
            </p>

            {/* Score hero */}
            <Card className="p-6 md:p-8 mb-6">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div className="flex flex-col items-center text-center shrink-0 md:pr-8 md:border-r md:border-slate-100">
                  <ScoreRing score={s.overall.score} size={144} strokeWidth={11} sublabel="/ 100" />
                  <div className="mt-3 flex items-center gap-1.5">
                    <span className="text-sm font-bold text-slate-800">{s.overall.label}</span>
                  </div>
                  <span className="text-xs text-emerald-600 font-medium mt-0.5">{s.overall.percentile_note}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                  {[
                    { key: 'seo', label: 'SEO' },
                    { key: 'trust', label: 'Trust' },
                    { key: 'buyer_clarity', label: 'Buyer Clarity' },
                    { key: 'ranking_potential', label: 'Ranking Potential' },
                  ].map(({ key, label }) => {
                    const data = s[key];
                    const colors = getScoreColors(data.score);
                    return (
                      <div key={key} className="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-slate-50/60">
                        <ScoreRing score={data.score} size={64} strokeWidth={6} />
                        <div>
                          <p className="text-xs font-semibold text-slate-700">{label}</p>
                          <p className={`text-[11px] font-medium ${colors.text}`}>{data.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Executive summary */}
            <Card className="p-6 md:p-8 mb-6 bg-emerald-50/50 border-emerald-100">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full bg-emerald-500 text-white">
                  <Award className="w-4 h-4" />
                  {gig_data.executive_summary.verdict}
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full bg-white text-emerald-700 border border-emerald-200">
                  <TrendingUp className="w-4 h-4" />
                  {gig_data.executive_summary.potential_growth_pct} potential growth
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full bg-white text-slate-600 border border-slate-200">
                  <Zap className="w-4 h-4" />
                  {gig_data.executive_summary.key_opportunities_count} key opportunities
                </span>
              </div>
              <p className="text-slate-700 leading-relaxed">{gig_data.executive_summary.explanation}</p>
            </Card>

            {/* Strengths & weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                  Strengths
                </h3>
                <ul className="space-y-3">
                  {gig_data.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      {item.text}
                    </li>
                  ))}
                </ul>
              </Card>
              <Card className="p-6">
                <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                  <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
                  Weaknesses
                </h3>
                <ul className="space-y-4">
                  {gig_data.weaknesses.map((item, i) => (
                    <li key={i}>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${impactBadge(item.impact)}`}>
                          {item.impact} impact
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.explanation}</p>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </section>

          {/* ============= SEO AUDIT ============= */}
          <section id="seo-audit" ref={(el) => (sectionRefs.current['seo-audit'] = el)} className="scroll-mt-24">
            <SectionHeader
              icon={Search}
              eyebrow="Deep dive"
              title="SEO Audit"
              description="How your title, description, tags and seller profile perform against Fiverr's search algorithm."
            />
            <div className="grid sm:grid-cols-2 gap-5">
              {Object.entries(gig_data.seo_audit).map(([key, val]) => (
                <Card key={key} className="p-6">
                  <div className="flex items-start gap-4">
                    <ScoreRing score={val.score} size={60} strokeWidth={6} />
                    <div className="flex-1">
                      <p className="font-bold text-slate-800 capitalize mb-1">{key.replace('_', ' ')}</p>
                      <p className="text-sm text-slate-500 leading-relaxed">{val.analysis}</p>
                    </div>
                  </div>
                  {val.suggestions?.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                      {val.suggestions.map((sug, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                          <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          {sug}
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </section>

          {/* ============= INTENT & KEYWORDS ============= */}
          <section id="intent-keywords" ref={(el) => (sectionRefs.current['intent-keywords'] = el)} className="scroll-mt-24">
            <SectionHeader
              icon={Target}
              eyebrow="Deep dive"
              title="Search Intent & Keywords"
              description="What buyers are searching for, and how well your gig covers those terms."
            />
            <div className="grid md:grid-cols-5 gap-5 mb-5">
              <Card className="p-6 md:col-span-2 flex flex-col items-center justify-center text-center">
                <ScoreRing score={gig_data.search_intent_analysis.intent_match_score} size={100} strokeWidth={8} />
                <p className="text-sm font-semibold text-slate-700 mt-3">Intent match score</p>
                <p className="text-xs text-slate-400 mt-1">How closely your gig aligns with real buyer intent</p>
              </Card>
              <Card className="p-6 md:col-span-3">
                <p className="font-bold text-slate-800 mb-4">Top buyer intents detected</p>
                <div className="space-y-3.5">
                  {gig_data.search_intent_analysis.intents.map((intent, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600 font-medium">{intent.label}</span>
                        <span className="text-slate-400">{intent.confidence_pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${intent.confidence_pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="font-bold text-slate-800">Keyword coverage</p>
                <span className="text-xs text-slate-400">{gig_data.keyword_analysis.total_keywords} keywords tracked</span>
              </div>
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[520px]">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
                      <th className="py-2 px-2 font-medium">Keyword</th>
                      <th className="py-2 px-2 font-medium">Occurrences</th>
                      <th className="py-2 px-2 font-medium">Importance</th>
                      <th className="py-2 px-2 font-medium">Coverage</th>
                      <th className="py-2 px-2 font-medium">Stuffing risk</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gig_data.keyword_analysis.keywords.map((k, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0">
                        <td className="py-3 px-2 font-medium text-slate-700 flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-slate-300" />
                          {k.keyword}
                        </td>
                        <td className="py-3 px-2 text-slate-500">{k.occurrences}</td>
                        <td className="py-3 px-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${riskBadge(k.importance)}`}>{k.importance}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${riskBadge(k.coverage)}`}>{k.coverage}</span>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${riskBadge(k.stuffing_risk)}`}>{k.stuffing_risk}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>

          {/* ============= BUYER PSYCHOLOGY ============= */}
          <section id="buyer-psychology" ref={(el) => (sectionRefs.current['buyer-psychology'] = el)} className="scroll-mt-24">
            <SectionHeader
              icon={Users}
              eyebrow="Deep dive"
              title="Buyer Psychology"
              description="Simulated buyer reactions when reading through your gig page."
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { title: 'Positive reactions', icon: ThumbsUp, color: 'text-emerald-500', items: gig_data.buyer_psychology.positive_reactions },
                { title: 'Concerns', icon: AlertTriangle, color: 'text-amber-500', items: gig_data.buyer_psychology.concerns },
                { title: 'Likely questions', icon: HelpCircle, color: 'text-slate-400', items: gig_data.buyer_psychology.questions },
                { title: 'Trust signals', icon: ShieldCheck, color: 'text-emerald-500', items: gig_data.buyer_psychology.trust_signals },
                { title: 'Emotional response', icon: MessageCircle, color: 'text-emerald-500', items: gig_data.buyer_psychology.emotional_response },
              ].map((group, i) => (
                <Card key={i} className="p-5">
                  <h3 className="flex items-center gap-2 font-bold text-slate-800 text-sm mb-3">
                    <group.icon className={`w-4 h-4 ${group.color}`} />
                    {group.title}
                  </h3>
                  <ul className="space-y-2">
                    {group.items.map((it, j) => (
                      <li key={j} className="text-sm text-slate-500 leading-relaxed">
                        {it.text}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          {/* ============= CONVERSION AUDIT ============= */}
          <section id="conversion" ref={(el) => (sectionRefs.current.conversion = el)} className="scroll-mt-24">
            <SectionHeader
              icon={TrendingUp}
              eyebrow="Deep dive"
              title="Conversion Audit"
              description="Six signals that influence whether a visitor becomes a buyer."
            />
            <Card className="p-4 md:p-6 mb-5">
              <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer>
                  <RadarChart data={conversionRadarData} outerRadius="75%">
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} tickCount={5} />
                    <Radar dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.28} strokeWidth={2} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <div className="grid sm:grid-cols-2 gap-5">
              {Object.entries(gig_data.conversion_audit).map(([key, val]) => {
                const colors = getScoreColors(val.score);
                return (
                  <Card key={key} className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-bold text-slate-800 capitalize">{key}</p>
                      <span className={`text-sm font-bold ${colors.text}`}>{val.score}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-3">
                      <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${val.score}%` }} />
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-2">{val.description}</p>
                    <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 leading-relaxed">
                      <span className="font-semibold">Recommendation: </span>
                      {val.recommendation}
                    </p>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* ============= PACKAGES ============= */}
          <section id="packages" ref={(el) => (sectionRefs.current.packages = el)} className="scroll-mt-24">
            <SectionHeader
              icon={Package}
              eyebrow="Deep dive"
              title="Package Analysis"
              description="Pricing, value and upsell potential across your three tiers."
            />
            <div className="grid md:grid-cols-3 gap-5">
              {Object.entries(gig_data.package_analysis).map(([tier, pkg]) => {
                const colors = getScoreColors(pkg.score);
                const isFeatured = tier === 'standard';
                return (
                  <Card
                    key={tier}
                    className={`p-6 flex flex-col ${isFeatured ? 'border-emerald-300 ring-1 ring-emerald-200' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{tier}</span>
                      {isFeatured && (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                          Best value
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{pkg.heading}</h3>
                    <p className="text-2xl font-extrabold text-slate-900 mb-3">{pkg.price}</p>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
                        <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${pkg.score}%` }} />
                      </div>
                      <span className={`text-xs font-bold ${colors.text}`}>{pkg.score}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed mb-3">{pkg.value}</p>
                    <p className="text-xs text-slate-400 mb-4">{pkg.pricing}</p>

                    {pkg.missing_features.length > 0 ? (
                      <div className="mt-auto space-y-1.5 pt-4 border-t border-slate-100">
                        <p className="text-xs font-semibold text-slate-500 mb-1.5">Missing features</p>
                        {pkg.missing_features.map((f, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
                            <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            {f}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-auto flex items-center gap-1.5 text-sm text-emerald-600 pt-4 border-t border-slate-100">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        All key features included
                      </div>
                    )}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs text-slate-400">Upsell potential</span>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskBadge(pkg.upsell_potential)}`}>
                        {pkg.upsell_potential}
                      </span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          {/* ============= RECOMMENDATIONS ============= */}
          <section id="recommendations" ref={(el) => (sectionRefs.current.recommendations = el)} className="scroll-mt-24">
            <SectionHeader
              icon={ListChecks}
              eyebrow="Action plan"
              title="Recommendations"
              description="Prioritized fixes, ordered by expected impact on ranking and conversion."
            />
            <div className="space-y-8">
              {[
                { key: 'high_priority', label: 'High priority', color: 'bg-rose-500', soft: 'bg-rose-50 text-rose-700' },
                { key: 'medium_priority', label: 'Medium priority', color: 'bg-amber-500', soft: 'bg-amber-50 text-amber-700' },
                { key: 'low_priority', label: 'Low priority', color: 'bg-slate-400', soft: 'bg-slate-100 text-slate-600' },
              ].map((tier) => (
                <div key={tier.key}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`w-2 h-2 rounded-full ${tier.color}`} />
                    <p className="font-bold text-slate-800 text-sm">{tier.label}</p>
                  </div>
                  <div className="space-y-3">
                    {gig_data.recommendations[tier.key].map((rec, i) => (
                      <Card key={i} className={`p-5 border-l-4 ${tier.key === 'high_priority' ? 'border-l-rose-400' : tier.key === 'medium_priority' ? 'border-l-amber-400' : 'border-l-slate-300'}`}>
                        <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                          <p className="font-semibold text-slate-800">{rec.problem}</p>
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${tier.soft}`}>
                            {rec.estimated_gain}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed mb-2">{rec.reason}</p>
                        <p className="text-sm text-slate-600">
                          <span className="font-semibold text-slate-700">Expected impact: </span>
                          {rec.expected_impact}
                        </p>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============= OPTIMIZED CONTENT ============= */}
          <section id="optimized-content" ref={(el) => (sectionRefs.current['optimized-content'] = el)} className="scroll-mt-24">
            <SectionHeader
              icon={Sparkles}
              eyebrow="Ready to use"
              title="AI-Optimized Content"
              description="Copy-ready title, description, tags and FAQ generated from the analysis above."
            />
            <div className="grid lg:grid-cols-2 gap-5 mb-5">
              <Card className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Optimized title</p>
                <p className="font-bold text-slate-900 leading-snug mb-5">{gig_data.optimized_content.title}</p>

                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Optimized description</p>
                <p className="text-sm text-slate-600 leading-relaxed">{gig_data.optimized_content.description}</p>
              </Card>
              <Card className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Suggested tags</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {gig_data.optimized_content.tags.map((tag, i) => (
                    <span key={i} className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
                      <Tag className="w-3.5 h-3.5" />
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Frequently asked questions</p>
                <div className="space-y-2">
                  {gig_data.optimized_content.faq.map((f, i) => (
                    <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                      >
                        {f.question}
                        <ChevronDown
                          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                        />
                      </button>
                      {openFaq === i && (
                        <p className="px-4 pb-3 text-sm text-slate-500 leading-relaxed">{f.answer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {Object.entries(gig_data.optimized_content.packages).map(([tier, pkg]) => (
                <Card key={tier} className="p-5">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{tier}</span>
                  <h4 className="font-bold text-slate-900 mb-1.5 mt-0.5">{pkg.heading}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed mb-3">{pkg.description}</p>
                  <ul className="space-y-1.5">
                    {pkg.includes.map((inc, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        {inc}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </section>

          {/* ============= GROWTH PROJECTION ============= */}
          <section id="growth" ref={(el) => (sectionRefs.current.growth = el)} className="scroll-mt-24">
            <SectionHeader
              icon={LineChartIcon}
              eyebrow="Forecast"
              title="Expected Growth"
              description="Projected impact if the recommendations above are implemented."
            />
            <Card className="p-6 mb-4">
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer>
                  <BarChart data={growthData} barGap={8}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
                    <Bar dataKey="Current" fill="#cbd5e1" radius={[6, 6, 0, 0]} maxBarSize={48} />
                    <Bar dataKey="Optimized" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <div className="grid sm:grid-cols-3 gap-5">
              <Card className="p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Ranking potential uplift</p>
                  <p className="font-bold text-slate-900">{gig_data.expected_growth.ranking_potential_uplift_pct}</p>
                </div>
              </Card>
              <Card className="p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Search className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">SEO score</p>
                  <p className="font-bold text-slate-900">
                    {gig_data.expected_growth.current_seo} <span className="text-slate-300 font-normal">&rarr;</span> {gig_data.expected_growth.optimized_seo}
                  </p>
                </div>
              </Card>
              <Card className="p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs text-slate-400">Conversion rate</p>
                  <p className="font-bold text-slate-900">
                    {gig_data.expected_growth.current_conversion} <span className="text-slate-300 font-normal">&rarr;</span> {gig_data.expected_growth.expected_conversion}
                  </p>
                </div>
              </Card>
            </div>
            <p className="flex items-start gap-2 text-xs text-slate-400 mt-4 leading-relaxed">
              <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              {gig_data.expected_growth.disclaimer}
            </p>
          </section>

          {/* ============= AI MENTOR ============= */}
          <section id="ai-mentor" ref={(el) => (sectionRefs.current['ai-mentor'] = el)} className="scroll-mt-24 pb-4">
            <SectionHeader
              icon={Brain}
              eyebrow="Guidance"
              title="AI Mentor Notes"
              description="Why each recommendation matters, and how the marketplace algorithm likely reads it."
            />
            <div className="space-y-5">
              {gig_data.ai_mentor.map((tip, i) => (
                <Card key={i} className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Quote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <p className="font-bold text-slate-900 leading-snug">{tip.recommendation}</p>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4 pl-8">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Why it matters</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{tip.why_it_matters}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3.5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1.5">Algorithm insight</p>
                      <p className="text-sm text-emerald-800 leading-relaxed">{tip.algorithm_interpretation}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Best practice</p>
                      <p className="text-sm text-slate-600 leading-relaxed">{tip.best_practice_tip}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// import React, { useEffect, useRef, useState } from 'react';
// import {
//   ShoppingBag,
//   ExternalLink,
//   Clock,
//   Award,
//   TrendingUp,
//   TrendingDown,
//   Search,
//   Target,
//   Users,
//   Package,
//   ListChecks,
//   Sparkles,
//   LineChart as LineChartIcon,
//   Brain,
//   LayoutDashboard,
//   CheckCircle2,
//   AlertTriangle,
//   XCircle,
//   ChevronDown,
//   Tag,
//   ThumbsUp,
//   HelpCircle,
//   ShieldCheck,
//   MessageCircle,
//   Quote,
//   ArrowUpRight,
//   Info,
//   Star,
//   Zap,
//   Menu,
//   X,
// } from 'lucide-react';
// import {
//   RadarChart,
//   PolarGrid,
//   PolarAngleAxis,
//   PolarRadiusAxis,
//   Radar,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
// } from 'recharts';

// import { gig_data } from '../../../data2';


// const getScoreColors = (score) => {
//   if (score >= 80) return { text: 'text-emerald-600', bg: 'bg-emerald-500', soft: 'bg-emerald-50', stroke: '#20B571', border: 'border-emerald-200' };
//   if (score >= 60) return { text: 'text-amber-600', bg: 'bg-amber-500', soft: 'bg-amber-50', stroke: '#f59e0b', border: 'border-amber-200' };
//   return { text: 'text-rose-600', bg: 'bg-rose-500', soft: 'bg-rose-50', stroke: '#f43f56', border: 'border-rose-200' };
// };

// const impactBadge = (impact) => {
//   const map = {
//     Low: 'bg-slate-100 text-slate-600',
//     Medium: 'bg-amber-50 text-amber-700',
//     High: 'bg-rose-50 text-rose-700',
//   };
//   return map[impact] || map.Low;
// };

// const riskBadge = (val) => {
//   const map = {
//     Low: 'bg-emerald-50 text-emerald-700',
//     Medium: 'bg-amber-50 text-amber-700',
//     High: 'bg-rose-50 text-rose-700',
//     Good: 'bg-emerald-50 text-emerald-700',
//     Fair: 'bg-amber-50 text-amber-700',
//     Poor: 'bg-rose-50 text-rose-700',
//   };
//   return map[val] || 'bg-slate-100 text-slate-600';
// };

// function ScoreRing({ score, size = 128, strokeWidth = 10, sublabel }) {
//   const radius = (size - strokeWidth) / 2;
//   const circumference = 2 * Math.PI * radius;
//   const offset = circumference - (score / 100) * circumference;
//   const colors = getScoreColors(score);
//   return (
//     <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
//       <svg width={size} height={size} className="-rotate-90">
//         <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={strokeWidth} className="stroke-slate-100" fill="none" />
//         <circle
//           cx={size / 2}
//           cy={size / 2}
//           r={radius}
//           strokeWidth={strokeWidth}
//           strokeDasharray={circumference}
//           strokeDashoffset={offset}
//           strokeLinecap="round"
//           fill="none"
//           stroke={colors.stroke}
//           style={{ transition: 'stroke-dashoffset 1s ease-out' }}
//         />
//       </svg>
//       <div className="absolute flex flex-col items-center">
//         <span className={`font-extrabold ${colors.text}`} style={{ fontSize: size * 0.28 }}>
//           {score}
//         </span>
//         {sublabel && <span className="text-[11px] text-slate-400 font-medium -mt-0.5">{sublabel}</span>}
//       </div>
//     </div>
//   );
// }

// function SectionHeader({ eyebrow, title, description, icon: Icon }) {
//   return (
//     <div className="mb-6 flex items-start gap-3">
//       {Icon && (
//         <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 mt-0.5">
//           <Icon className="w-5 h-5 text-emerald-600" strokeWidth={2.2} />
//         </div>
//       )}
//       <div>
//         {eyebrow && <p className="text-xs font-semibold tracking-wide uppercase text-emerald-600 mb-1">{eyebrow}</p>}
//         <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
//         {description && <p className="text-sm text-slate-500 mt-1 max-w-2xl">{description}</p>}
//       </div>
//     </div>
//   );
// }

// function Card({ children, className = '' }) {
//   return (
//     <div className={`bg-white border border-slate-100 rounded-2xl shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-16px_rgba(15,23,42,0.08)] ${className}`}>
//       {children}
//     </div>
//   );
// }

// /* ------------------------------------------------------------------ */
// /*  NAV CONFIG                                                         */
// /* ------------------------------------------------------------------ */

// const NAV_ITEMS = [
//   { id: 'overview', label: 'Overview', icon: LayoutDashboard },
//   { id: 'seo-audit', label: 'SEO Audit', icon: Search },
//   { id: 'intent-keywords', label: 'Intent & Keywords', icon: Target },
//   { id: 'buyer-psychology', label: 'Buyer Psychology', icon: Users },
//   { id: 'conversion', label: 'Conversion Audit', icon: TrendingUp },
//   { id: 'packages', label: 'Packages', icon: Package },
//   { id: 'recommendations', label: 'Recommendations', icon: ListChecks },
//   { id: 'optimized-content', label: 'Optimized Content', icon: Sparkles },
//   { id: 'growth', label: 'Growth Projection', icon: LineChartIcon },
//   { id: 'ai-mentor', label: 'AI Mentor', icon: Brain },
// ];

// /* ------------------------------------------------------------------ */
// /*  MAIN COMPONENT                                                     */
// /* ------------------------------------------------------------------ */

// export default function GigReport() {
//   const [active, setActive] = useState('overview');
//   const [mobileNavOpen, setMobileNavOpen] = useState(false);
//   const [openFaq, setOpenFaq] = useState(0);
//   const sectionRefs = useRef({});

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) setActive(entry.target.id);
//         });
//       },
//       { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
//     );
//     NAV_ITEMS.forEach((item) => {
//       const el = sectionRefs.current[item.id];
//       if (el) observer.observe(el);
//     });
//     return () => observer.disconnect();
//   }, []);

//   const scrollTo = (id) => {
//     const el = sectionRefs.current[id];
//     if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//     setMobileNavOpen(false);
//   };

//   const s = gig_data.scores;
//   const conversionRadarData = Object.entries(gig_data.conversion_audit).map(([key, val]) => ({
//     subject: key.charAt(0).toUpperCase() + key.slice(1),
//     score: val.score,
//     fullMark: 100,
//   }));
//   const growthData = [
//     { name: 'SEO Score', Current: gig_data.expected_growth.current_seo, Optimized: gig_data.expected_growth.optimized_seo },
//     { name: 'Conversion', Current: gig_data.expected_growth.current_conversion, Optimized: gig_data.expected_growth.expected_conversion },
//   ];

//   const analyzedDate = new Date(gig_data.meta.analyzed_at).toLocaleDateString(undefined, {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//   });

//   return (
//     <div className="min-h-screen bg-white text-slate-900 antialiased">
//       {/* ---------------- Top bar ---------------- */}
//       <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-100">
//         <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
//           <div className="flex items-center gap-2.5 shrink-0">
//             <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
//               <ShoppingBag className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
//             </div>
//             <span className="font-bold text-lg tracking-tight hidden sm:inline">
//               Gig<span className="text-emerald-500">Bro</span>
//             </span>
//           </div>

//           <div className="hidden md:flex flex-col min-w-0">
//             <span className="text-xs text-slate-400 truncate">
//               {gig_data.meta.category} <span className="mx-1 text-slate-300">/</span> {gig_data.meta.subcategory}
//             </span>
//           </div>

//           <div className="flex items-center gap-2 ml-auto">
//             <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
//               <ShieldCheck className="w-3.5 h-3.5" />
//               {gig_data.meta.seller_status}
//             </span>
//             <a
//               href={gig_data.meta.gig_url}
//               target="_blank"
//               rel="noreferrer"
//               className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
//             >
//               View Gig
//               <ExternalLink className="w-3.5 h-3.5" />
//             </a>
//             <button
//               onClick={() => setMobileNavOpen((v) => !v)}
//               className="lg:hidden w-9 h-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-600"
//               aria-label="Toggle navigation"
//             >
//               {mobileNavOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
//             </button>
//           </div>
//         </div>

//         {/* Mobile nav drawer */}
//         {mobileNavOpen && (
//           <div className="lg:hidden border-t border-slate-100 px-4 py-3 flex flex-wrap gap-2 bg-white">
//             {NAV_ITEMS.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => scrollTo(item.id)}
//                 className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
//                   active === item.id
//                     ? 'bg-emerald-500 border-emerald-500 text-white'
//                     : 'border-slate-200 text-slate-600'
//                 }`}
//               >
//                 <item.icon className="w-3.5 h-3.5" />
//                 {item.label}
//               </button>
//             ))}
//           </div>
//         )}
//       </header>

//       <div className="max-w-7xl mx-auto px-4 md:px-8 flex gap-10">
//         {/* ---------------- Sidebar ---------------- */}
//         <aside className="hidden lg:block w-60 shrink-0">
//           <nav className="sticky top-24 flex flex-col gap-1 pb-10">
//             <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400 px-3 mb-1">
//               Report contents
//             </p>
//             {NAV_ITEMS.map((item) => (
//               <button
//                 key={item.id}
//                 onClick={() => scrollTo(item.id)}
//                 className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-left transition-colors ${
//                   active === item.id
//                     ? 'bg-emerald-50 text-emerald-700'
//                     : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
//                 }`}
//               >
//                 <item.icon
//                   className={`w-4 h-4 shrink-0 ${active === item.id ? 'text-emerald-600' : 'text-slate-400 group-hover:text-slate-500'}`}
//                 />
//                 {item.label}
//               </button>
//             ))}
//           </nav>
//         </aside>

//         {/* ---------------- Main content ---------------- */}
//         <main className="flex-1 min-w-0 py-8 space-y-16">
//           {/* ============= OVERVIEW ============= */}
//           <section id="overview" ref={(el) => (sectionRefs.current.overview = el)} className="scroll-mt-24">
//             <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 mb-3">
//               <Clock className="w-3.5 h-3.5" />
//               Analyzed {analyzedDate}
//             </div>
//             <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
//               Gig Analysis Report
//             </h1>
//             <p className="text-slate-500 max-w-2xl mb-8">
//               Design &amp; redesign business WordPress website — build WordPress website development
//             </p>

//             {/* Score hero */}
//             <Card className="p-6 md:p-8 mb-6">
//               <div className="flex flex-col md:flex-row md:items-center gap-8">
//                 <div className="flex flex-col items-center text-center shrink-0 md:pr-8 md:border-r md:border-slate-100">
//                   <ScoreRing score={s.overall.score} size={144} strokeWidth={11} sublabel="/ 100" />
//                   <div className="mt-3 flex items-center gap-1.5">
//                     <span className="text-sm font-bold text-slate-800">{s.overall.label}</span>
//                   </div>
//                   <span className="text-xs text-fiver-green font-medium mt-0.5">{s.overall.percentile_note}</span>
//                 </div>

//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
//                   {[
//                     { key: 'seo', label: 'SEO' },
//                     { key: 'trust', label: 'Trust' },
//                     { key: 'buyer_clarity', label: 'Buyer Clarity' },
//                     { key: 'ranking_potential', label: 'Ranking Potential' },
//                   ].map(({ key, label }) => {
//                     const data = s[key];
//                     const colors = getScoreColors(data.score);
//                     return (
//                       <div key={key} className="flex flex-col items-center text-center gap-2 p-3 rounded-xl bg-slate-50/60">
//                         <ScoreRing score={data.score} size={64} strokeWidth={6} />
//                         <div>
//                           <p className="text-xs font-semibold text-slate-700">{label}</p>
//                           <p className={`text-[11px] font-medium ${colors.text}`}>{data.label}</p>
//                         </div>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>
//             </Card>

//             {/* Executive summary */}
//             <Card className="p-6 md:p-8 mb-6 bg-emerald-50/50 border-emerald-100">
//               <div className="flex flex-wrap items-center gap-3 mb-4">
//                 <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full bg-emerald-500 text-white">
//                   <Award className="w-4 h-4" />
//                   {gig_data.executive_summary.verdict}
//                 </span>
//                 <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full bg-white text-emerald-700 border border-emerald-200">
//                   <TrendingUp className="w-4 h-4" />
//                   {gig_data.executive_summary.potential_growth_pct} potential growth
//                 </span>
//                 <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3 py-1.5 rounded-full bg-white text-slate-600 border border-slate-200">
//                   <Zap className="w-4 h-4" />
//                   {gig_data.executive_summary.key_opportunities_count} key opportunities
//                 </span>
//               </div>
//               <p className="text-slate-700 leading-relaxed">{gig_data.executive_summary.explanation}</p>
//             </Card>

//             {/* Strengths & weaknesses */}
//             <div className="grid md:grid-cols-2 gap-6">
//               <Card className="p-6">
//                 <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
//                   <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
//                   Strengths
//                 </h3>
//                 <ul className="space-y-3">
//                   {gig_data.strengths.map((item, i) => (
//                     <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
//                       <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
//                       {item.text}
//                     </li>
//                   ))}
//                 </ul>
//               </Card>
//               <Card className="p-6">
//                 <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
//                   <AlertTriangle className="w-4.5 h-4.5 text-amber-500" />
//                   Weaknesses
//                 </h3>
//                 <ul className="space-y-4">
//                   {gig_data.weaknesses.map((item, i) => (
//                     <li key={i}>
//                       <div className="flex items-center justify-between gap-2 mb-1">
//                         <p className="text-sm font-semibold text-slate-800">{item.title}</p>
//                         <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${impactBadge(item.impact)}`}>
//                           {item.impact} impact
//                         </span>
//                       </div>
//                       <p className="text-sm text-slate-500 leading-relaxed">{item.explanation}</p>
//                     </li>
//                   ))}
//                 </ul>
//               </Card>
//             </div>
//           </section>

//           {/* ============= SEO AUDIT ============= */}
//           <section id="seo-audit" ref={(el) => (sectionRefs.current['seo-audit'] = el)} className="scroll-mt-24">
//             <SectionHeader
//               icon={Search}
//               eyebrow="Deep dive"
//               title="SEO Audit"
//               description="How your title, description, tags and seller profile perform against Fiverr's search algorithm."
//             />
//             <div className="grid sm:grid-cols-2 gap-5">
//               {Object.entries(gig_data.seo_audit).map(([key, val]) => (
//                 <Card key={key} className="p-6">
//                   <div className="flex items-start gap-4">
//                     <ScoreRing score={val.score} size={60} strokeWidth={6} />
//                     <div className="flex-1">
//                       <p className="font-bold text-slate-800 capitalize mb-1">{key.replace('_', ' ')}</p>
//                       <p className="text-sm text-slate-500 leading-relaxed">{val.analysis}</p>
//                     </div>
//                   </div>
//                   {val.suggestions?.length > 0 && (
//                     <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
//                       {val.suggestions.map((sug, i) => (
//                         <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
//                           <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
//                           {sug}
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </Card>
//               ))}
//             </div>
//           </section>

//           {/* ============= INTENT & KEYWORDS ============= */}
//           <section id="intent-keywords" ref={(el) => (sectionRefs.current['intent-keywords'] = el)} className="scroll-mt-24">
//             <SectionHeader
//               icon={Target}
//               eyebrow="Deep dive"
//               title="Search Intent & Keywords"
//               description="What buyers are searching for, and how well your gig covers those terms."
//             />
//             <div className="grid md:grid-cols-5 gap-5 mb-5">
//               <Card className="p-6 md:col-span-2 flex flex-col items-center justify-center text-center">
//                 <ScoreRing score={gig_data.search_intent_analysis.intent_match_score} size={100} strokeWidth={8} />
//                 <p className="text-sm font-semibold text-slate-700 mt-3">Intent match score</p>
//                 <p className="text-xs text-slate-400 mt-1">How closely your gig aligns with real buyer intent</p>
//               </Card>
//               <Card className="p-6 md:col-span-3">
//                 <p className="font-bold text-slate-800 mb-4">Top buyer intents detected</p>
//                 <div className="space-y-3.5">
//                   {gig_data.search_intent_analysis.intents.map((intent, i) => (
//                     <div key={i}>
//                       <div className="flex items-center justify-between text-sm mb-1">
//                         <span className="text-slate-600 font-medium">{intent.label}</span>
//                         <span className="text-slate-400">{intent.confidence_pct}%</span>
//                       </div>
//                       <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
//                         <div
//                           className="h-full rounded-full bg-emerald-500"
//                           style={{ width: `${intent.confidence_pct}%` }}
//                         />
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             </div>

//             <Card className="p-6">
//               <div className="flex items-center justify-between mb-4">
//                 <p className="font-bold text-slate-800">Keyword coverage</p>
//                 <span className="text-xs text-slate-400">{gig_data.keyword_analysis.total_keywords} keywords tracked</span>
//               </div>
//               <div className="overflow-x-auto -mx-2">
//                 <table className="w-full text-sm min-w-[520px]">
//                   <thead>
//                     <tr className="text-left text-xs uppercase tracking-wide text-slate-400 border-b border-slate-100">
//                       <th className="py-2 px-2 font-medium">Keyword</th>
//                       <th className="py-2 px-2 font-medium">Occurrences</th>
//                       <th className="py-2 px-2 font-medium">Importance</th>
//                       <th className="py-2 px-2 font-medium">Coverage</th>
//                       <th className="py-2 px-2 font-medium">Stuffing risk</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {gig_data.keyword_analysis.keywords.map((k, i) => (
//                       <tr key={i} className="border-b border-slate-50 last:border-0">
//                         <td className="py-3 px-2 font-medium text-slate-700 flex items-center gap-1.5">
//                           <Tag className="w-3.5 h-3.5 text-slate-300" />
//                           {k.keyword}
//                         </td>
//                         <td className="py-3 px-2 text-slate-500">{k.occurrences}</td>
//                         <td className="py-3 px-2">
//                           <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${riskBadge(k.importance)}`}>{k.importance}</span>
//                         </td>
//                         <td className="py-3 px-2">
//                           <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${riskBadge(k.coverage)}`}>{k.coverage}</span>
//                         </td>
//                         <td className="py-3 px-2">
//                           <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${riskBadge(k.stuffing_risk)}`}>{k.stuffing_risk}</span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </Card>
//           </section>

//           {/* ============= BUYER PSYCHOLOGY ============= */}
//           <section id="buyer-psychology" ref={(el) => (sectionRefs.current['buyer-psychology'] = el)} className="scroll-mt-24">
//             <SectionHeader
//               icon={Users}
//               eyebrow="Deep dive"
//               title="Buyer Psychology"
//               description="Simulated buyer reactions when reading through your gig page."
//             />
//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {[
//                 { title: 'Positive reactions', icon: ThumbsUp, color: 'text-emerald-500', items: gig_data.buyer_psychology.positive_reactions },
//                 { title: 'Concerns', icon: AlertTriangle, color: 'text-amber-500', items: gig_data.buyer_psychology.concerns },
//                 { title: 'Likely questions', icon: HelpCircle, color: 'text-slate-400', items: gig_data.buyer_psychology.questions },
//                 { title: 'Trust signals', icon: ShieldCheck, color: 'text-emerald-500', items: gig_data.buyer_psychology.trust_signals },
//                 { title: 'Emotional response', icon: MessageCircle, color: 'text-emerald-500', items: gig_data.buyer_psychology.emotional_response },
//               ].map((group, i) => (
//                 <Card key={i} className="p-5">
//                   <h3 className="flex items-center gap-2 font-bold text-slate-800 text-sm mb-3">
//                     <group.icon className={`w-4 h-4 ${group.color}`} />
//                     {group.title}
//                   </h3>
//                   <ul className="space-y-2">
//                     {group.items.map((it, j) => (
//                       <li key={j} className="text-sm text-slate-500 leading-relaxed">
//                         {it.text}
//                       </li>
//                     ))}
//                   </ul>
//                 </Card>
//               ))}
//             </div>
//           </section>

//           {/* ============= CONVERSION AUDIT ============= */}
//           <section id="conversion" ref={(el) => (sectionRefs.current.conversion = el)} className="scroll-mt-24">
//             <SectionHeader
//               icon={TrendingUp}
//               eyebrow="Deep dive"
//               title="Conversion Audit"
//               description="Six signals that influence whether a visitor becomes a buyer."
//             />
//             <Card className="p-4 md:p-6 mb-5">
//               <div style={{ width: '100%', height: 320 }}>
//                 <ResponsiveContainer>
//                   <RadarChart data={conversionRadarData} outerRadius="75%">
//                     <PolarGrid stroke="#e2e8f0" />
//                     <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 12 }} />
//                     <PolarRadiusAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} tickCount={5} />
//                     <Radar dataKey="score" stroke="#10b981" fill="#10b981" fillOpacity={0.28} strokeWidth={2} />
//                     <Tooltip
//                       contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }}
//                     />
//                   </RadarChart>
//                 </ResponsiveContainer>
//               </div>
//             </Card>
//             <div className="grid sm:grid-cols-2 gap-5">
//               {Object.entries(gig_data.conversion_audit).map(([key, val]) => {
//                 const colors = getScoreColors(val.score);
//                 return (
//                   <Card key={key} className="p-5">
//                     <div className="flex items-center justify-between mb-2">
//                       <p className="font-bold text-slate-800 capitalize">{key}</p>
//                       <span className={`text-sm font-bold ${colors.text}`}>{val.score}</span>
//                     </div>
//                     <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-3">
//                       <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${val.score}%` }} />
//                     </div>
//                     <p className="text-sm text-slate-500 leading-relaxed mb-2">{val.description}</p>
//                     <p className="text-sm text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 leading-relaxed">
//                       <span className="font-semibold">Recommendation: </span>
//                       {val.recommendation}
//                     </p>
//                   </Card>
//                 );
//               })}
//             </div>
//           </section>

//           {/* ============= PACKAGES ============= */}
//           <section id="packages" ref={(el) => (sectionRefs.current.packages = el)} className="scroll-mt-24">
//             <SectionHeader
//               icon={Package}
//               eyebrow="Deep dive"
//               title="Package Analysis"
//               description="Pricing, value and upsell potential across your three tiers."
//             />
//             <div className="grid md:grid-cols-3 gap-5">
//               {Object.entries(gig_data.package_analysis).map(([tier, pkg]) => {
//                 const colors = getScoreColors(pkg.score);
//                 const isFeatured = tier === 'standard';
//                 return (
//                   <Card
//                     key={tier}
//                     className={`p-6 flex flex-col ${isFeatured ? 'border-emerald-300 ring-1 ring-emerald-200' : ''}`}
//                   >
//                     <div className="flex items-center justify-between mb-1">
//                       <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{tier}</span>
//                       {isFeatured && (
//                         <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
//                           Best value
//                         </span>
//                       )}
//                     </div>
//                     <h3 className="font-bold text-slate-900 text-lg mb-1">{pkg.heading}</h3>
//                     <p className="text-2xl font-extrabold text-slate-900 mb-3">{pkg.price}</p>
//                     <div className="flex items-center gap-2 mb-4">
//                       <div className="h-1.5 flex-1 rounded-full bg-slate-100 overflow-hidden">
//                         <div className={`h-full rounded-full ${colors.bg}`} style={{ width: `${pkg.score}%` }} />
//                       </div>
//                       <span className={`text-xs font-bold ${colors.text}`}>{pkg.score}</span>
//                     </div>
//                     <p className="text-sm text-slate-500 leading-relaxed mb-3">{pkg.value}</p>
//                     <p className="text-xs text-slate-400 mb-4">{pkg.pricing}</p>

//                     {pkg.missing_features.length > 0 ? (
//                       <div className="mt-auto space-y-1.5 pt-4 border-t border-slate-100">
//                         <p className="text-xs font-semibold text-slate-500 mb-1.5">Missing features</p>
//                         {pkg.missing_features.map((f, i) => (
//                           <div key={i} className="flex items-center gap-1.5 text-sm text-slate-500">
//                             <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
//                             {f}
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <div className="mt-auto flex items-center gap-1.5 text-sm text-emerald-600 pt-4 border-t border-slate-100">
//                         <CheckCircle2 className="w-3.5 h-3.5" />
//                         All key features included
//                       </div>
//                     )}
//                     <div className="mt-3 flex items-center justify-between">
//                       <span className="text-xs text-slate-400">Upsell potential</span>
//                       <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${riskBadge(pkg.upsell_potential)}`}>
//                         {pkg.upsell_potential}
//                       </span>
//                     </div>
//                   </Card>
//                 );
//               })}
//             </div>
//           </section>

//           {/* ============= RECOMMENDATIONS ============= */}
//           <section id="recommendations" ref={(el) => (sectionRefs.current.recommendations = el)} className="scroll-mt-24">
//             <SectionHeader
//               icon={ListChecks}
//               eyebrow="Action plan"
//               title="Recommendations"
//               description="Prioritized fixes, ordered by expected impact on ranking and conversion."
//             />
//             <div className="space-y-8">
//               {[
//                 { key: 'high_priority', label: 'High priority', color: 'bg-rose-500', soft: 'bg-rose-50 text-rose-700' },
//                 { key: 'medium_priority', label: 'Medium priority', color: 'bg-amber-500', soft: 'bg-amber-50 text-amber-700' },
//                 { key: 'low_priority', label: 'Low priority', color: 'bg-slate-400', soft: 'bg-slate-100 text-slate-600' },
//               ].map((tier) => (
//                 <div key={tier.key}>
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className={`w-2 h-2 rounded-full ${tier.color}`} />
//                     <p className="font-bold text-slate-800 text-sm">{tier.label}</p>
//                   </div>
//                   <div className="space-y-3">
//                     {gig_data.recommendations[tier.key].map((rec, i) => (
//                       <Card key={i} className={`p-5 border-l-4 ${tier.key === 'high_priority' ? 'border-l-rose-400' : tier.key === 'medium_priority' ? 'border-l-amber-400' : 'border-l-slate-300'}`}>
//                         <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
//                           <p className="font-semibold text-slate-800">{rec.problem}</p>
//                           <span className={`text-xs font-semibold px-2.5 py-1 rounded-full shrink-0 ${tier.soft}`}>
//                             {rec.estimated_gain}
//                           </span>
//                         </div>
//                         <p className="text-sm text-slate-500 leading-relaxed mb-2">{rec.reason}</p>
//                         <p className="text-sm text-slate-600">
//                           <span className="font-semibold text-slate-700">Expected impact: </span>
//                           {rec.expected_impact}
//                         </p>
//                       </Card>
//                     ))}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </section>

//           {/* ============= OPTIMIZED CONTENT ============= */}
//           <section id="optimized-content" ref={(el) => (sectionRefs.current['optimized-content'] = el)} className="scroll-mt-24">
//             <SectionHeader
//               icon={Sparkles}
//               eyebrow="Ready to use"
//               title="AI-Optimized Content"
//               description="Copy-ready title, description, tags and FAQ generated from the analysis above."
//             />
//             <div className="grid lg:grid-cols-2 gap-5 mb-5">
//               <Card className="p-6">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Optimized title</p>
//                 <p className="font-bold text-slate-900 leading-snug mb-5">{gig_data.optimized_content.title}</p>

//                 <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Optimized description</p>
//                 <p className="text-sm text-slate-600 leading-relaxed">{gig_data.optimized_content.description}</p>
//               </Card>
//               <Card className="p-6">
//                 <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Suggested tags</p>
//                 <div className="flex flex-wrap gap-2 mb-6">
//                   {gig_data.optimized_content.tags.map((tag, i) => (
//                     <span key={i} className="inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700">
//                       <Tag className="w-3.5 h-3.5" />
//                       {tag}
//                     </span>
//                   ))}
//                 </div>
//                 <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-3">Frequently asked questions</p>
//                 <div className="space-y-2">
//                   {gig_data.optimized_content.faq.map((f, i) => (
//                     <div key={i} className="border border-slate-100 rounded-xl overflow-hidden">
//                       <button
//                         onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
//                         className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
//                       >
//                         {f.question}
//                         <ChevronDown
//                           className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
//                         />
//                       </button>
//                       {openFaq === i && (
//                         <p className="px-4 pb-3 text-sm text-slate-500 leading-relaxed">{f.answer}</p>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </Card>
//             </div>

//             <div className="grid md:grid-cols-3 gap-5">
//               {Object.entries(gig_data.optimized_content.packages).map(([tier, pkg]) => (
//                 <Card key={tier} className="p-5">
//                   <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{tier}</span>
//                   <h4 className="font-bold text-slate-900 mb-1.5 mt-0.5">{pkg.heading}</h4>
//                   <p className="text-sm text-slate-500 leading-relaxed mb-3">{pkg.description}</p>
//                   <ul className="space-y-1.5">
//                     {pkg.includes.map((inc, i) => (
//                       <li key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
//                         <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
//                         {inc}
//                       </li>
//                     ))}
//                   </ul>
//                 </Card>
//               ))}
//             </div>
//           </section>

//           {/* ============= GROWTH PROJECTION ============= */}
//           <section id="growth" ref={(el) => (sectionRefs.current.growth = el)} className="scroll-mt-24">
//             <SectionHeader
//               icon={LineChartIcon}
//               eyebrow="Forecast"
//               title="Expected Growth"
//               description="Projected impact if the recommendations above are implemented."
//             />
//             <Card className="p-6 mb-4">
//               <div style={{ width: '100%', height: 260 }}>
//                 <ResponsiveContainer>
//                   <BarChart data={growthData} barGap={8}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
//                     <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} />
//                     <YAxis domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
//                     <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0', fontSize: 13 }} />
//                     <Bar dataKey="Current" fill="#cbd5e1" radius={[6, 6, 0, 0]} maxBarSize={48} />
//                     <Bar dataKey="Optimized" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={48} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             </Card>
//             <div className="grid sm:grid-cols-3 gap-5">
//               <Card className="p-5 flex items-center gap-4">
//                 <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
//                   <TrendingUp className="w-5 h-5 text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-slate-400">Ranking potential uplift</p>
//                   <p className="font-bold text-slate-900">{gig_data.expected_growth.ranking_potential_uplift_pct}</p>
//                 </div>
//               </Card>
//               <Card className="p-5 flex items-center gap-4">
//                 <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
//                   <Search className="w-5 h-5 text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-slate-400">SEO score</p>
//                   <p className="font-bold text-slate-900">
//                     {gig_data.expected_growth.current_seo} <span className="text-slate-300 font-normal">&rarr;</span> {gig_data.expected_growth.optimized_seo}
//                   </p>
//                 </div>
//               </Card>
//               <Card className="p-5 flex items-center gap-4">
//                 <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
//                   <Star className="w-5 h-5 text-emerald-600" />
//                 </div>
//                 <div>
//                   <p className="text-xs text-slate-400">Conversion rate</p>
//                   <p className="font-bold text-slate-900">
//                     {gig_data.expected_growth.current_conversion} <span className="text-slate-300 font-normal">&rarr;</span> {gig_data.expected_growth.expected_conversion}
//                   </p>
//                 </div>
//               </Card>
//             </div>
//             <p className="flex items-start gap-2 text-xs text-slate-400 mt-4 leading-relaxed">
//               <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
//               {gig_data.expected_growth.disclaimer}
//             </p>
//           </section>

//           {/* ============= AI MENTOR ============= */}
//           <section id="ai-mentor" ref={(el) => (sectionRefs.current['ai-mentor'] = el)} className="scroll-mt-24 pb-4">
//             <SectionHeader
//               icon={Brain}
//               eyebrow="Guidance"
//               title="AI Mentor Notes"
//               description="Why each recommendation matters, and how the marketplace algorithm likely reads it."
//             />
//             <div className="space-y-5">
//               {gig_data.ai_mentor.map((tip, i) => (
//                 <Card key={i} className="p-6">
//                   <div className="flex items-start gap-3 mb-4">
//                     <Quote className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
//                     <p className="font-bold text-slate-900 leading-snug">{tip.recommendation}</p>
//                   </div>
//                   <div className="grid md:grid-cols-3 gap-4 pl-8">
//                     <div>
//                       <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Why it matters</p>
//                       <p className="text-sm text-slate-600 leading-relaxed">{tip.why_it_matters}</p>
//                     </div>
//                     <div className="bg-emerald-50 rounded-xl p-3.5">
//                       <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 mb-1.5">Algorithm insight</p>
//                       <p className="text-sm text-emerald-800 leading-relaxed">{tip.algorithm_interpretation}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">Best practice</p>
//                       <p className="text-sm text-slate-600 leading-relaxed">{tip.best_practice_tip}</p>
//                     </div>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           </section>
//         </main>
//       </div>
//     </div>
//   );
// }
// // import { useParams } from "react-router-dom";
// // import { gig_data } from "../../../data2";


// // import {
// //   LayoutDashboard,
// //   History,
// //   Bookmark,
// //   Tag,
// //   Settings,
// //   User,
// //   Search,
// //   Bell,
// //   ChevronDown,
// //   ArrowLeft,
// //   Sparkles,
// //   Download,
// //   RefreshCw,
// //   Info,
// //   Star,
// //   AlertTriangle,
// //   CheckCircle2,
// //   FileText,
// //   Lightbulb,
// //   TrendingUp,
// //   Smile,
// //   HelpCircle,
// //   Shield,
// //   Heart,
// //   ThumbsDown,
// // } from "lucide-react";
// // import { useEffect } from "react";


// // const tone = (score) =>
// //   score >= 70
// //     ? { ring: "#16a34a", text: "text-emerald-600", chip: "text-emerald-600", label: "Good" }
// //     : score >= 50
// //       ? { ring: "#eab308", text: "text-amber-500", chip: "text-amber-500", label: "Average" }
// //       : { ring: "#ef4444", text: "text-red-500", chip: "text-red-500", label: "Poor" };

// // const barTone = (score) =>
// //   score >= 70 ? "bg-emerald-500" : score >= 50 ? "bg-amber-500" : "bg-red-500";

// // /* Circular score ring */
// // function Ring({ value, size = 64, stroke = 7, sub, big = false }) {
// //   const t = tone(value);
// //   const r = (size - stroke) / 2;
// //   const c = 2 * Math.PI * r;
// //   const offset = c - (value / 100) * c;
// //   return (
// //     <div className="relative shrink-0" style={{ width: size, height: size }}>
// //       <svg width={size} height={size} className="-rotate-90">
// //         <circle cx={size / 2} cy={size / 2} r={r} stroke="#eef0f2" strokeWidth={stroke} fill="none" />
// //         <circle
// //           cx={size / 2}
// //           cy={size / 2}
// //           r={r}
// //           stroke={t.ring}
// //           strokeWidth={stroke}
// //           fill="none"
// //           strokeDasharray={c}
// //           strokeDashoffset={offset}
// //           strokeLinecap="round"
// //         />
// //       </svg>
// //       <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
// //         <span className={`font-bold text-slate-800 ${big ? "text-xl" : "text-base"}`}>{value}</span>
// //         {sub && <span className="text-[8px] text-slate-400 -mt-0.5">{sub}</span>}
// //       </div>
// //     </div>
// //   );
// // }

// // /* Linear bar with caret */
// // function Bar({ label, value }) {
// //   return (
// //     <div className="flex items-center gap-2 py-[3px]">
// //       <span className="w-16 text-[10.5px] text-slate-500 shrink-0">{label}</span>
// //       <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
// //         <div className={`h-full rounded-full ${barTone(value)}`} style={{ width: `${value}%` }} />
// //       </div>
// //       <span className="w-6 text-right text-[10.5px] font-semibold text-slate-600">{value}</span>
// //       <ChevronDown size={11} className="text-slate-300 shrink-0" />
// //     </div>
// //   );
// // }

// // function Card({ title, icon, children, className = "" }) {
// //   return (
// //     <div className={`bg-white rounded-xl border border-slate-100 shadow-sm flex flex-col min-h-0 ${className}`}>
// //       <div className="flex items-center gap-1.5 px-3.5 pt-3 pb-2 shrink-0">
// //         {icon}
// //         <h3 className="text-[12.5px] font-semibold text-slate-800">{title}</h3>
// //       </div>
// //       <div className="px-3.5 pb-3 flex-1 min-h-0 overflow-hidden">{children}</div>
// //     </div>
// //   );
// // }

// // /* ---------------------------------------------------------- static data */




// // const scores = [
// //   { label: "Overall Score", value: 68, top: "Top 35% of gigs", confidence: "high" },
// //   { label: "SEO Score", value: 72, top: "Top 30% of gigs", confidence: "high" },
// //   { label: "Conversion Score", value: 64, top: "Top 45% of gigs", confidence: "high" },
// //   { label: "Trust Score", value: 78, top: "Top 25% of gigs", confidence: "high" },
// //   { label: "Buyer Clarity", value: 70, top: "Top 30% of gigs", confidence: "high" },
// //   { label: "Ranking Potential", value: 66, top: "Top 40% of gigs", confidence: "high" },
// // ];

// // const strengths = [
// //   "Strong seller profile with good reviews",
// //   "Clear service delivery process",
// //   "Good use of gig image and gallery",
// //   "Relevant category and subcategory",
// //   "Decent response rate and communication",
// // ];

// // const weaknesses = [
// //   { label: "Title not optimized for search intent", impact: "High Impact" },
// //   { label: "Description missing key keywords", impact: "High Impact" },
// //   { label: "Tags could be more targeted", impact: "Medium Impact" },
// //   { label: "No FAQ section", impact: "Medium Impact" },
// //   { label: "Packages lack detailed features", impact: "High Impact" },
// // ];

// // const seoBars = [
// //   { label: "Title", value: 65 },
// //   { label: "Description", value: 58 },
// //   { label: "Tags", value: 71 },
// //   { label: "Seller Profile", value: 80 },
// // ];

// // const intent = [
// //   { label: "Business Website", value: 85 },
// //   { label: "WordPress", value: 92 },
// //   { label: "WooCommerce", value: 60 },
// //   { label: "Landing Page", value: 40 },
// // ];

// // const keywords = [
// //   { kw: "wordpress website", occ: 3, imp: "High", cov: "Good", risk: "Low" },
// //   { kw: "business website", occ: 2, imp: "High", cov: "Good", risk: "Low" },
// //   { kw: "responsive design", occ: 2, imp: "Medium", cov: "Fair", risk: "Low" },
// //   { kw: "landing page", occ: 1, imp: "Medium", cov: "Poor", risk: "Low" },
// //   { kw: "elementor", occ: 1, imp: "Medium", cov: "Fair", risk: "Low" },
// // ];

// // const heatmap = [40, 70, 55, 85, 30, 60, 90, 45, 75, 20, 65, 95, 50, 35, 80];

// // const buyerPsych = [
// //   { icon: Smile, color: "text-emerald-500", label: "Positive Reactions", note: "“Great portfolio, professionalism stands out”" },
// //   { icon: ThumbsDown, color: "text-red-500", label: "Concerns", note: "“Not enough detail about the process”" },
// //   { icon: HelpCircle, color: "text-sky-500", label: "Questions", note: "“Will this work for my specific business?”" },
// //   { icon: Shield, color: "text-violet-500", label: "Trust Signals", note: "“Good reviews and response rate”" },
// //   { icon: Heart, color: "text-orange-500", label: "Emotional Response", note: "“Feels professional but needs more clarity”" },
// // ];

// // const conversion = [
// //   { label: "CTA", value: 65 },
// //   { label: "Trust", value: 75 },
// //   { label: "Authority", value: 70 },
// //   { label: "Differentiation", value: 60 },
// //   { label: "Urgency", value: 45 },
// //   { label: "Packages", value: 68 },
// // ];

// // const convNote = {
// //   65: "Could be stronger",
// //   75: "Good trust signals",
// //   70: "Decent authority",
// //   60: "Needs improvement",
// //   45: "Low urgency signals",
// //   68: "Good structure",
// // };

// // const packages = [
// //   { name: "Basic", price: "$50", score: 65, feats: ["Value: Good", "Pricing: Fair", "Missing: 2 key features", "Upsell: Good potential"] },
// //   { name: "Standard", price: "$100", score: 75, popular: true, feats: ["Value: Good", "Pricing: Good", "Missing: 1 key feature", "Upsell: High potential"] },
// //   { name: "Premium", price: "$200", score: 70, feats: ["Value: Good", "Pricing: Excellent", "Missing: 1 key feature", "Upsell: Medium potential"] },
// // ];

// // const pageNav = [
// //   "Executive Dashboard", "Executive Summary", "Strengths", "Weaknesses", "SEO Audit",
// //   "Search Intent", "Keyword Analysis", "Buyer Psychology", "Conversion Audit",
// //   "Package Analysis", "Recommendations", "Optimized Content", "Expected Growth", "AI Mentor",
// // ];

// // const navItems = [
// //   { icon: LayoutDashboard, label: "Dashboard", active: true },
// //   { icon: History, label: "History" },
// //   { icon: Bookmark, label: "Saved Reports" },
// //   { icon: Tag, label: "Pricing" },
// //   { icon: Settings, label: "Settings" },
// //   { icon: User, label: "Profile" },
// // ];

// // /* ---------------------------------------------------------- component */

// // export default function FullReport() {
// //   const { username, id } = useParams()
// //   const BACKEND_URL = `${import.meta.env.VITE_BACKEND_URL}/getdashboard/${username}/${id}`

// //   // useEffect(()=>{
// //   //   async function getDashboard() {
// //   //     const response = await fetch(BACKEND_URL, {
// //   //       "credentials": "include"
// //   //   })
// //   //   }
// //   // })


// //   return (
// //     <div className="h-screen w-full bg-[#F7F8FA] flex overflow-hidden text-slate-700 font-sans lg:overflow-hidden overflow-y-auto">
// //       {/* Main */}
// //       <div className="flex-1 min-w-0 flex flex-col">
// //         {/* Header */}
// //         <header className="h-14 shrink-0 border-b border-slate-100 bg-white flex items-center justify-between px-4 gap-4">
// //           <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md bg-slate-50 rounded-lg px-3 py-1.5">
// //             <Search size={14} className="text-slate-400" />
// //             <span className="text-[12px] text-slate-400 flex-1">Search reports, gigs, keywords...</span>
// //             <kbd className="text-[9px] text-slate-400 border border-slate-200 rounded px-1">⌘K</kbd>
// //           </div>
// //           <div className="flex items-center gap-3 ml-auto">
// //             <div className="relative">
// //               <Bell size={16} className="text-slate-400" />
// //               <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[8px] rounded-full w-3.5 h-3.5 flex items-center justify-center">4</span>
// //             </div>
// //             <div className="flex items-center gap-2">
// //               <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center">
// //                 <User size={13} className="text-slate-500" />
// //               </div>
// //               <div className="hidden sm:block leading-tight">
// //                 <p className="text-[11.5px] font-medium text-slate-700">Shamroz Khan</p>
// //                 <p className="text-[9.5px] text-slate-400">Pro Plan</p>
// //               </div>
// //               <ChevronDown size={12} className="text-slate-400" />
// //             </div>
// //           </div>
// //         </header>

// //         {/* Body: content + right page-nav */}
// //         <div className="flex-1 min-h-0 flex overflow-hidden">
// //           {/* Content column */}
// //           <main className="flex-1 min-w-0 min-h-0 grid grid-rows-[auto_auto_1fr_1fr] gap-2.5 p-3">
// //             {/* Title row */}
// //             <div className="flex items-center justify-between shrink-0">
// //               <div>
// //                 <div className="flex items-center gap-1 text-[11px] text-slate-400 mb-0.5">
// //                   <ArrowLeft size={11} /> Back to Reports
// //                 </div>
// //                 <div className="flex items-center gap-1.5">
// //                   <h1 className="text-xl font-bold text-slate-800">Gig Audit Report</h1>
// //                   <Sparkles size={15} className="text-emerald-500" />
// //                 </div>
// //                 <p className="text-[10.5px] text-slate-400">
// //                   Analyzed 3 minutes ago &nbsp;•&nbsp; Level 2 Seller &nbsp;•&nbsp; Programming &amp; Tech &nbsp;•&nbsp; WordPress
// //                 </p>
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 <button className="flex items-center gap-1.5 text-[11.5px] font-medium border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600">
// //                   <Download size={13} /> Export Report
// //                 </button>
// //                 <button className="flex items-center gap-1.5 text-[11.5px] font-medium bg-emerald-500 text-white rounded-lg px-3 py-1.5">
// //                   <RefreshCw size={13} /> Regenerate Report
// //                 </button>
// //               </div>
// //             </div>

// //             {/* Score cards */}
// //             <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 shrink-0">
// //               {scores.map((s) => {
// //                 const t = tone(s.value);
// //                 return (
// //                   <div key={s.label} className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 flex flex-col items-center">
// //                     <div className="flex items-center gap-1 w-full mb-1.5">
// //                       <h1 className="text-[10.5px] text-slate-600 flex-1 truncate">{s.label}</h1>
// //                       {/* <Info size={11} className="text-slate-300" /> */}
// //                       <p className="text-[10.5px] text-slate-600 m-0">Gig Confidence: {s.confidence}</p>
// //                     </div>
// //                       <Ring value={s.value} size={64} sub="/100" />
// //                       <span className={`text-[11px] font-semibold mt-1.5 ${t.chip}`}>{t.label}</span>
// //                       <span className="text-[9.5px] text-slate-400">{s.top}</span>
// //                   </div>
// //                 );
// //               })}
// //             </div>

// //             {/* Row: summary / strengths / weaknesses */}
// //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 min-h-0">
// //               <Card title="Executive Summary" icon={<FileText size={14} className="text-emerald-500" />}>
// //                 <p className="text-[10.5px] text-slate-500 leading-snug mb-2.5">
// //                   This gig has solid foundations with room for significant improvement. Your SEO is decent but
// //                   content optimization and keyword targeting could boost your rankings substantially.
// //                 </p>
// //                 <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2">
// //                   <div className="flex items-center gap-1.5">
// //                     <CheckCircle2 size={13} className="text-emerald-500" />
// //                     <div className="leading-tight">
// //                       <p className="text-[9px] text-slate-400">Verdict</p>
// //                       <p className="text-[10.5px] font-semibold text-slate-700">Good Foundation</p>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center gap-1.5">
// //                     <Lightbulb size={13} className="text-amber-500" />
// //                     <div className="leading-tight">
// //                       <p className="text-[9px] text-slate-400">Key Opportunities</p>
// //                       <p className="text-[10.5px] font-semibold text-slate-700">7 Identified</p>
// //                     </div>
// //                   </div>
// //                   <div className="flex items-center gap-1.5">
// //                     <TrendingUp size={13} className="text-emerald-500" />
// //                     <div className="leading-tight">
// //                       <p className="text-[9px] text-slate-400">Potential Growth</p>
// //                       <p className="text-[10.5px] font-semibold text-slate-700">+156%</p>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </Card>

// //               <Card title="Strengths" icon={<Star size={14} className="text-emerald-500" />}>
// //                 <ul className="flex flex-col gap-1.5">
// //                   {strengths.map((s) => (
// //                     <li key={s} className="flex items-start gap-1.5 text-[10.5px] text-slate-500">
// //                       <CheckCircle2 size={12} className="text-emerald-500 mt-[1px] shrink-0" />
// //                       {s}
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </Card>

// //               <Card title="Weaknesses" icon={<AlertTriangle size={14} className="text-red-500" />}>
// //                 <ul className="flex flex-col gap-1.5">
// //                   {weaknesses.map((w) => (
// //                     <li key={w.label} className="flex items-center justify-between gap-2 text-[10.5px]">
// //                       <span className="flex items-start gap-1.5 text-slate-500">
// //                         <AlertTriangle size={12} className="text-red-500 mt-[1px] shrink-0" />
// //                         {w.label}
// //                       </span>
// //                       <span
// //                         className={`shrink-0 text-[8.5px] font-medium px-1.5 py-0.5 rounded-full ${w.impact === "High Impact" ? "bg-red-50 text-red-500" : "bg-amber-50 text-amber-500"
// //                           }`}
// //                       >
// //                         {w.impact}
// //                       </span>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </Card>
// //             </div>

// //             {/* Row: SEO / Search Intent / Keyword Analysis */}
// //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 min-h-0">
// //               <Card title="SEO Audit" icon={<Search size={14} className="text-emerald-500" />}>
// //                 <div className="flex flex-col justify-center h-full">
// //                   {seoBars.map((b) => (
// //                     <Bar key={b.label} label={b.label} value={b.value} />
// //                   ))}
// //                 </div>
// //               </Card>

// //               <Card title="Search Intent Analysis" icon={<Search size={14} className="text-emerald-500" />}>
// //                 <div className="grid grid-cols-2 gap-2 h-full">
// //                   <div className="flex flex-col justify-center">
// //                     {intent.map((b) => (
// //                       <div key={b.label} className="py-[3px]">
// //                         <div className="flex justify-between text-[10px] mb-0.5">
// //                           <span className="text-slate-500">{b.label}</span>
// //                           <span className="font-semibold text-slate-600">{b.value}%</span>
// //                         </div>
// //                         <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
// //                           <div className={`h-full rounded-full ${barTone(b.value)}`} style={{ width: `${b.value}%` }} />
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>
// //                   <div className="flex flex-col items-center justify-center border-l border-slate-100 pl-2">
// //                     <Ring value={72} size={58} sub="/100" />
// //                     <p className="text-[10.5px] font-semibold text-emerald-600 mt-1.5">Good Match</p>
// //                     <p className="text-[9px] text-slate-400 text-center leading-snug">
// //                       Strong alignment with buyer search intent
// //                     </p>
// //                   </div>
// //                 </div>
// //               </Card>

// //               <Card title="Keyword Analysis" icon={<Tag size={14} className="text-emerald-500" />}>
// //                 <div className="grid grid-cols-5 gap-2 h-full">
// //                   <div className="col-span-3 overflow-hidden">
// //                     <div className="grid grid-cols-[1.4fr_0.4fr_0.6fr_0.6fr_0.7fr] text-[8.5px] text-slate-400 font-medium pb-1 border-b border-slate-100">
// //                       <span>Keyword</span><span>Occ.</span><span>Import.</span><span>Cover.</span><span>Risk</span>
// //                     </div>
// //                     {keywords.map((k) => (
// //                       <div key={k.kw} className="grid grid-cols-[1.4fr_0.4fr_0.6fr_0.6fr_0.7fr] text-[9.5px] text-slate-600 py-1 border-b border-slate-50">
// //                         <span className="truncate pr-1">{k.kw}</span>
// //                         <span>{k.occ}</span>
// //                         <span className="truncate">{k.imp}</span>
// //                         <span className="truncate">{k.cov}</span>
// //                         <span className="text-emerald-500">{k.risk}</span>
// //                       </div>
// //                     ))}
// //                   </div>
// //                   <div className="col-span-2 flex flex-col items-center justify-center gap-2 border-l border-slate-100 pl-1">
// //                     <div className="relative w-14 h-14">
// //                       <Ring value={24} size={56} />
// //                       <span className="absolute inset-0 flex items-center justify-center text-[8px] text-slate-400" />
// //                     </div>
// //                     <p className="text-[8.5px] text-slate-400 -mt-1">Keyword Distribution</p>
// //                     <div className="grid grid-cols-5 gap-[3px]">
// //                       {heatmap.map((h, i) => (
// //                         <div
// //                           key={i}
// //                           className="w-2.5 h-2.5 rounded-[2px]"
// //                           style={{ backgroundColor: `rgba(16,185,129,${0.15 + h / 130})` }}
// //                         />
// //                       ))}
// //                     </div>
// //                   </div>
// //                 </div>
// //               </Card>
// //             </div>

// //             {/* Row: Buyer Psychology / Conversion Audit / Package Analysis */}
// //             <div className="grid grid-cols-1 lg:grid-cols-3 gap-2.5 min-h-0">
// //               <Card title="Buyer Psychology" icon={<User size={14} className="text-emerald-500" />}>
// //                 <p className="text-[9.5px] text-slate-400 mb-1.5 -mt-1">What buyers think when they see your gig</p>
// //                 <ul className="flex flex-col gap-1.5">
// //                   {buyerPsych.map((b) => (
// //                     <li key={b.label} className="flex items-center gap-2 text-[10px]">
// //                       <b.icon size={13} className={`${b.color} shrink-0`} />
// //                       <span className="w-[110px] shrink-0 text-slate-600">{b.label}</span>
// //                       <span className="text-slate-400 italic truncate">{b.note}</span>
// //                     </li>
// //                   ))}
// //                 </ul>
// //               </Card>

// //               <Card title="Conversion Audit" icon={<TrendingUp size={14} className="text-emerald-500" />}>
// //                 <div className="grid grid-cols-3 gap-2 h-full content-center">
// //                   {conversion.map((c) => (
// //                     <div key={c.label}>
// //                       <div className="flex justify-between text-[10px] mb-0.5">
// //                         <span className="text-slate-500">{c.label}</span>
// //                         <span className="font-semibold text-slate-600">{c.value}/100</span>
// //                       </div>
// //                       <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-0.5">
// //                         <div className={`h-full rounded-full ${barTone(c.value)}`} style={{ width: `${c.value}%` }} />
// //                       </div>
// //                       <p className="text-[8.5px] text-slate-400">{convNote[c.value]}</p>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </Card>

// //               <Card title="Package Analysis" icon={<Bookmark size={14} className="text-emerald-500" />}>
// //                 <div className="grid grid-cols-3 gap-2 h-full">
// //                   {packages.map((p) => (
// //                     <div
// //                       key={p.name}
// //                       className={`relative rounded-lg border p-2 flex flex-col items-center ${p.popular ? "border-emerald-400 bg-emerald-50/40" : "border-slate-100"
// //                         }`}
// //                     >
// //                       {p.popular && (
// //                         <span className="absolute -top-2 bg-emerald-500 text-white text-[7.5px] px-1.5 py-0.5 rounded-full">
// //                           Most Popular
// //                         </span>
// //                       )}
// //                       <p className="text-[10px] font-semibold text-slate-700 mt-1">{p.name}</p>
// //                       <p className="text-[9px] text-slate-400 mb-1">{p.price}</p>
// //                       <Ring value={p.score} size={46} sub="/100" />
// //                       <ul className="mt-1.5 w-full">
// //                         {p.feats.map((f) => (
// //                           <li key={f} className="text-[8px] text-slate-500 leading-snug truncate">{f}</li>
// //                         ))}
// //                       </ul>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </Card>
// //             </div>
// //           </main>

// //           {/* Right page nav */}
// //           <aside className="hidden xl:flex w-[170px] shrink-0 border-l border-slate-100 bg-white p-3 flex-col gap-1 overflow-y-auto">
// //             <p className="text-[10px] font-semibold text-slate-700 mb-1">On this page</p>
// //             {pageNav.map((label, i) => (
// //               <div
// //                 key={label}
// //                 className={`flex items-center gap-1.5 text-[10px] py-0.5 ${i === 4 ? "text-emerald-600 font-medium" : "text-slate-400"
// //                   }`}
// //               >
// //                 <span className="w-4">{String(i + 1).padStart(2, "0")}</span>
// //                 {label}
// //               </div>
// //             ))}
// //           </aside>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }