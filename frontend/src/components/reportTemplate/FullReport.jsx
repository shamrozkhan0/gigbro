import { useEffect, useRef, useState } from 'react';
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


export default function FullReport({gig_data}) {
  const [active, setActive] = useState('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const sectionRefs = useRef({});

  console.log("in report")
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
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900 mb-2">
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
                  <span className="text-xs text-emerald-600 font-medium mt-0.5" style={{width: "300px"}}>{s.overall.percentile_note}</span>
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
                    <p className="text-2xl font-bold text-slate-900 mb-3">{pkg.price}</p>
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