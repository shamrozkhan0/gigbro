import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FileText, Tag, TrendingUp, Sparkles } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const GREEN = "#1DBF73";
const GREEN_TINT = "#E7F9F0";

const phases = [
  { icon: FileText, label: "Reading title & description", highlight: "text" },
  { icon: Tag, label: "Checking tags & category fit", highlight: "tags" },
  { icon: TrendingUp, label: "Scoring SEO strength", highlight: "none" },
  { icon: Sparkles, label: "Drafting recommendations", highlight: "none" },
];

const Waiting = () => {
  const {username, content_id} = useParams()
  const [phaseIndex, setPhaseIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const navigate = useNavigate()
  const ANALYZER_URL = `${import.meta.env.VITE_BACKEND_URL}analyze/${username}/${content_id}`  

  useEffect(() => {
    const id = setInterval(() => {
      setPhaseIndex((i) => (i + 1) % phases.length);
    }, 1500);
    return () => clearInterval(id);
  }, []);


useEffect(() => {
  async function callReportRequest() {
    try {
      const response = await fetch(ANALYZER_URL, {
        credentials: "include",
      });

      if (!response.ok) {
        console.log("Something went wrong:", response.status);
        return;
      }

      const response_data = await response.json();

      if (!response_data.success) {
        console.log(response_data.message);
        return;
      }

      console.log(response_data);

      navigate(`/${username}/report/${response_data.report_id}`);
    } catch (error) {
      console.error("Analyzer request failed:", error);
    }
  }

  callReportRequest();
}, [ANALYZER_URL, navigate, username]);


  const phase = phases[phaseIndex];
  const ActiveIcon = phase.icon;

  return (
    <div className="w-full h-full min-h-screen flex flex-col items-center justify-center bg-white px-6">
      {/* brand / live status */}
      <div className="mb-8 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          {!reduceMotion && (
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: GREEN }}
            />
          )}
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ backgroundColor: GREEN }}
          />
        </span>
        <span className="text-sm font-semibold text-gray-900">GigBro</span>
      </div>

      {/* gig card being scanned */}
      <div className="relative w-72 rounded-2xl border border-gray-100 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
        <div className="relative h-36 bg-gray-50 overflow-hidden">
          {!reduceMotion && (
            <>
              <motion.div
                className="absolute inset-x-0 h-16"
                style={{
                  background: `linear-gradient(to bottom, transparent, ${GREEN}1a, transparent)`,
                }}
                animate={{ y: ["-4rem", "9rem"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute inset-x-0 h-px"
                style={{ backgroundColor: GREEN }}
                animate={{ y: ["-2px", "144px"], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </>
          )}
        </div>

        <div className="p-4 space-y-2.5">
          <div
            className="h-2.5 w-4/5 rounded-full transition-colors duration-500"
            style={{ backgroundColor: phase.highlight === "text" ? GREEN_TINT : "#F3F4F6" }}
          />
          <div
            className="h-2.5 w-3/5 rounded-full transition-colors duration-500"
            style={{ backgroundColor: phase.highlight === "text" ? GREEN_TINT : "#F3F4F6" }}
          />
          <div className="flex gap-1.5 pt-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-5 w-12 rounded-full transition-colors duration-500"
                style={{ backgroundColor: phase.highlight === "tags" ? GREEN_TINT : "#F3F4F6" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* cycling status */}
      <div className="mt-6 h-5 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={phaseIndex}
            initial={reduceMotion ? false : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.25 }}
            className="flex items-center gap-2"
          >
            <ActiveIcon className="w-3.5 h-3.5" style={{ color: GREEN }} strokeWidth={2.5} />
            <span className="text-sm text-gray-500">{phase.label}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* indeterminate progress */}
      <div className="mt-4 w-40 h-1 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          className="h-full w-1/3 rounded-full"
          style={{ backgroundColor: GREEN }}
          animate={reduceMotion ? {} : { x: ["-100%", "300%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default Waiting;