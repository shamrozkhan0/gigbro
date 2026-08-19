import { useState, useEffect, useRef } from 'react';
import {
  Home,
  Sparkles,
  Check,
  Search,
  BarChart3,
  MessageSquareText,
  Lightbulb,
} from 'lucide-react';

const TOTAL_DURATION = 30; // seconds
const STEPS = [
  {
    title: 'Understanding gig',
    description: 'Extracting and understanding your gig details',
  },
  {
    title: 'Checking SEO',
    description: 'Analyzing title, tags, category and SEO factors',
  },
  {
    title: 'Analyzing content',
    description: 'Evaluating description quality and buyer appeal',
  },
  {
    title: 'Finding opportunities',
    description: 'Discovering keyword and content opportunities',
  },
  {
    title: 'Building report',
    description: 'Generating AI recommendations and final report',
  },
];
const STEP_DURATION = TOTAL_DURATION / STEPS.length;

const INSIGHTS = [
  "We're checking whether your title matches how buyers actually search.",
  "We're scanning your tags for missed high-intent keywords.",
  "We're checking whether your keywords match buyer intent, not just keyword frequency.",
  "We're comparing your gig against top performers in your category.",
  "We're pulling everything together into your final recommendations.",
];

export default function Waiting() {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    startRef.current = performance.now();
    let raf;
    const tick = (now) => {
      const secs = (now - startRef.current) / 1000;
      setElapsed(Math.min(secs, TOTAL_DURATION));
      if (secs < TOTAL_DURATION) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const activeIndex = Math.min(
    Math.floor(elapsed / STEP_DURATION),
    STEPS.length - 1
  );
  const done = elapsed >= TOTAL_DURATION;

  const stepStatus = (i) => {
    if (i < activeIndex || (done && i <= activeIndex)) return 'completed';
    if (i === activeIndex && !done) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col">
      <header className="flex items-center justify-between px-6 md:px-10 py-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg tracking-tight">
            Gig<span className="text-emerald-500">Bro</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Analyzing your gig
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <Home className="w-3.5 h-3.5" />
            Go to Dashboard
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-2xl">
          {/* Hero */}
          <div className="flex flex-col items-center text-center mb-8">
            {/* <div className="relative w-40 h-40 mb-4 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-emerald-50 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-emerald-50/80" />
              <Sparkles className="absolute -top-1 left-6 w-4 h-4 text-emerald-400" />
              <Sparkles className="absolute top-4 -right-1 w-3 h-3 text-emerald-300" />
              <Sparkles className="absolute bottom-2 -left-2 w-3.5 h-3.5 text-emerald-300" />
              <div className="relative w-20 h-20 rounded-full bg-white shadow-lg shadow-emerald-100 flex items-center justify-center">
                <div className="w-11 h-11 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
              </div>
            </div> */}

            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs tracking-wide uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              GigBro AI
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-5">
              Analyzing your gig
            </h1>

            <div className="bg-emerald-50 rounded-2xl px-6 py-5 w-full">
              <p className="text-lg md:text-xl font-semibold text-slate-800 leading-snug">
                <span className="text-emerald-400 text-2xl align-top mr-1">
                  &ldquo;
                </span>
                I will build a modern WordPress website
                <span className="text-emerald-400 text-2xl align-bottom ml-1">
                  &rdquo;
                </span>
              </p>
            </div>
          </div>

          {/* Step list */}
          <div className="border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm mb-5">
            <ol className="relative">
              {STEPS.map((step, i) => {
                const status = stepStatus(i);
                const isLast = i === STEPS.length - 1;
                return (
                  <li key={step.title} className="relative flex gap-4 pb-6 last:pb-0">
                    {!isLast && (
                      <span className="absolute left-[15px] top-8 bottom-0 w-px bg-slate-200" />
                    )}
                    <span
                      className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 ${
                        status === 'completed'
                          ? 'bg-emerald-500'
                          : status === 'active'
                          ? 'bg-white border-2 border-emerald-500'
                          : 'bg-white border-2 border-slate-200'
                      }`}
                    >
                      {status === 'completed' && (
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      )}
                      {status === 'active' && (
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                    </span>
                    <div className="flex-1 flex items-start justify-between gap-3">
                      <div>
                        <p
                          className={`font-semibold ${
                            status === 'pending' ? 'text-slate-400' : 'text-slate-900'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p
                          className={`text-sm ${
                            status === 'pending' ? 'text-slate-300' : 'text-slate-500'
                          }`}
                        >
                          {step.description}
                        </p>
                      </div>
                      <span
                        className={`whitespace-nowrap text-xs font-medium px-2.5 py-1 rounded-full ${
                          status === 'completed'
                            ? 'bg-emerald-50 text-emerald-600'
                            : status === 'active'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {status === 'completed' && 'Completed'}
                        {status === 'active' && (
                          <span className="inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            In Progress
                          </span>
                        )}
                        {status === 'pending' && 'Pending'}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Insight card */}
          <div className="bg-emerald-50 rounded-2xl p-5 md:p-6 flex items-center gap-5 mb-6">
            <div className="hidden sm:flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
                <Lightbulb className="w-4 h-4 text-emerald-600 sm:hidden" />
                GigBro Insight
              </div>
              <p className="text-slate-600 text-sm leading-relaxed transition-opacity duration-500">
                &ldquo;{INSIGHTS[activeIndex]}&rdquo;
              </p>
            </div>
            <div className="ml-auto hidden md:flex items-center gap-2 opacity-70">
              <BarChart3 className="w-6 h-6 text-emerald-500" />
              <Search className="w-6 h-6 text-emerald-500" />
              <MessageSquareText className="w-6 h-6 text-emerald-500" />
            </div>
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="text-slate-400 text-xs mt-1">
              This may take a moment, but it's worth the wait.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}