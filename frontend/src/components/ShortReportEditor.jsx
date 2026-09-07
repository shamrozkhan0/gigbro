import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Star,
    Tag as TagIcon,
    X,
    Plus,
    Check,
    ChevronDown,
    Clock,
    Code2,
} from "lucide-react";
import { Helmet } from "react-helmet-async";


const emptyPackage = () => ({ name: "", price: "", description: "" });
const PACKAGE_TIERS = ["basic", "standard", "premium"];


export default function ShortReportEditor() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [tags, setTags] = useState([]);
    const [tagDraft, setTagDraft] = useState("");
    const [packages, setPackages] = useState({
        basic: emptyPackage(),
        standard: emptyPackage(),
        premium: emptyPackage(),
    });
    const [activeTier, setActiveTier] = useState("basic");
    const [saved, setSaved] = useState(false);
    const [showJSON, setShowJSON] = useState(false);

    const seller = { rating: 4.9, reviews: 120, orders_in_queue: 3 };

    const titleLimit = 80;
    const descLimit = 1200;

    const updatePackage = (tier, field, value) => {
        setPackages((prev) => ({ ...prev, [tier]: { ...prev[tier], [field]: value } }));
    };

    const addTag = () => {
        const clean = tagDraft.trim().replace(/,$/, "");
        if (!clean || tags.length >= 5 || tags.includes(clean)) {
            setTagDraft("");
            return;
        }
        setTags((prev) => [...prev, clean]);
        setTagDraft("");
    };

    const removeTag = (t) => setTags((prev) => prev.filter((x) => x !== t));

    const payload = useMemo(
        () => ({
            title,
            description,
            category,
            subcategory,
            tags,
            packages,
            seller,
        }),
        [title, description, category, subcategory, tags, packages]
    );

    const handleSave = () => {
        setSaved(true);
        setShowJSON(true);
        window.clearTimeout(handleSave._t);
        handleSave._t = window.setTimeout(() => setSaved(false), 2200);
    };

    const container = {
        hidden: {},
        show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
    };
    const item = {
        hidden: { opacity: 0, y: 14 },
        show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif" }} className="min-h-screen w-full bg-white text-[#1B1B1F]">
            <Helmet>
                <title>
                    {title
                        ? `${title} | GigBro Gig Editor`
                        : "Create & Optimize Your Fiverr Gig | GigBro"}
                </title>

                <meta
                    name="description"
                    content="Create your Fiverr gig and optimize its title, description, category, and search tags with GigBro."
                />

                <meta
                    name="robots"
                    content="noindex, nofollow, noarchive"
                />

                <meta
                    property="og:title"
                    content="Create & Optimize Your Fiverr Gig | GigBro"
                />

                <meta
                    property="og:description"
                    content="Create and optimize your Fiverr gig with GigBro."
                />

                <meta
                    property="og:type"
                    content="website"
                />

                <meta
                    name="twitter:card"
                    content="summary"
                />

                <meta
                    name="twitter:title"
                    content="Create & Optimize Your Fiverr Gig | GigBro"
                />

                <meta
                    name="twitter:description"
                    content="Create and optimize your Fiverr gig with GigBro."
                />
            </Helmet>


            <header className="sticky top-0 z-30 border-b border-[#E5E7EB] bg-white/90 backdrop-blur">
                <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 sm:px-10">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#1DBF73]">
                            <span className="text-sm font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                G
                            </span>
                        </div>
                        <span className="text-[17px] font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Gig<span className="text-[#1DBF73]">Bro</span>
                        </span>
                        <span className="ml-2 hidden text-sm text-[#6B6E76] sm:inline">Create a new gig</span>
                    </div>

                    <motion.button
                        onClick={handleSave}
                        whileTap={{ scale: 0.97 }}
                        className="flex items-center gap-2 rounded-md bg-[#1DBF73] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0E9F62]"
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            {saved ? (
                                <motion.span
                                    key="saved"
                                    initial={{ opacity: 0, y: -4 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 4 }}
                                    className="flex items-center gap-1.5"
                                >
                                    <Check size={16} strokeWidth={2.5} /> Saved
                                </motion.span>
                            ) : (
                                <motion.span key="save" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}>
                                    Save gig
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>
            </header>

            <motion.main
                variants={container}
                initial="hidden"
                animate="show"
                className="mx-auto grid max-w-[1400px] grid-cols-1 gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_420px]"
            >
                <div className="min-w-0 space-y-10">
                    <motion.div variants={item}>
                        <h1 className="text-[28px] font-bold leading-tight tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                            Tell us about your gig
                        </h1>
                        <p className="mt-1.5 text-[15px] text-[#6B6E76]">
                            Fill in the details below — your live gig card updates on the right as you go.
                        </p>
                    </motion.div>

                    <motion.section variants={item} className="space-y-6">
                        <SectionHeading step="01" title="Basics" subtitle="What are you offering, in a single clear sentence?" />

                        <Field label="Gig title" hint={`${title.length}/${titleLimit}`}>
                            <input
                                value={title}
                                maxLength={titleLimit}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="I will design a modern minimalist logo for your brand"
                                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-[#B3B5BC] focus:border-[#1DBF73] focus:ring-4 focus:ring-[#1DBF73]/10"
                            />
                        </Field>

                        <Field label="Description" hint={`${description.length}/${descLimit}`}>
                            <textarea
                                value={description}
                                maxLength={descLimit}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={6}
                                placeholder="Describe exactly what buyers get, your process, and what makes you the right fit for this job..."
                                className="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] leading-relaxed outline-none transition-colors placeholder:text-[#B3B5BC] focus:border-[#1DBF73] focus:ring-4 focus:ring-[#1DBF73]/10"
                            />
                        </Field>

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <Field label="Category">
                                <input
                                    value={category}
                                    onChange={(category) => {
                                        setCategory(category.target.value)
                                    }}
                                    placeholder="logo designer"
                                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-[#B3B5BC] focus:border-[#1DBF73] focus:ring-4 focus:ring-[#1DBF73]/10"
                                />
                            </Field>
                            <Field label="Subcategory">
                                <input
                                    value={subcategory}
                                    onChange={(e) => setSubcategory(e.target.value)}
                                    placeholder={category ? "Select a subcategory" : "Choose a category first"}
                                    className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-[15px] outline-none transition-colors placeholder:text-[#B3B5BC] focus:border-[#1DBF73] focus:ring-4 focus:ring-[#1DBF73]/10"
                                />
                            </Field>
                        </div>
                    </motion.section>

                    {/* Tags */}
                    <motion.section variants={item} className="space-y-4">
                        <SectionHeading step="02" title="Search tags" subtitle="Up to 5 keywords buyers might search for." />
                        <div className="rounded-lg border border-[#E5E7EB] bg-white p-3">
                            <div className="flex flex-wrap items-center gap-2">
                                {tags.map((t) => (
                                    <motion.span
                                        key={t}
                                        initial={{ opacity: 0, scale: 0.85 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.85 }}
                                        className="flex items-center gap-1.5 rounded-full bg-[#E8FBF1] py-1.5 pl-3 pr-2 text-[13px] font-medium text-[#0E9F62]"
                                    >
                                        <TagIcon size={12} />
                                        {t}
                                        <button onClick={() => removeTag(t)} className="rounded-full p-0.5 hover:bg-[#1DBF73]/15">
                                            <X size={12} />
                                        </button>
                                    </motion.span>
                                ))}
                                {tags.length < 5 && (
                                    <div className="flex min-w-[140px] flex-1 items-center gap-1.5">
                                        <input
                                            value={tagDraft}
                                            onChange={(e) => setTagDraft(e.target.value)}
                                            onKeyDown={(e) => (e.key === "Enter" || e.key === ",") && (e.preventDefault(), addTag())}
                                            placeholder="Type a tag and press Enter"
                                            className="flex-1 border-none px-2 py-1.5 text-sm outline-none placeholder:text-[#B3B5BC]"
                                        />
                                        <button
                                            onClick={addTag}
                                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F1F3F4] text-[#6B6E76] transition-colors hover:bg-[#1DBF73] hover:text-white"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-[#9A9CA4]">{5 - tags.length} tags remaining</p>
                    </motion.section>

                    {/* Packages */}
                    <motion.section variants={item} className="space-y-4">
                        <SectionHeading step="03" title="Packages" subtitle="Give buyers three clear ways to work with you." />

                        <div className="flex rounded-lg bg-[#F1F3F4] p-1">
                            {PACKAGE_TIERS.map((tier) => (
                                <button
                                    key={tier}
                                    onClick={() => setActiveTier(tier)}
                                    className="relative flex-1 rounded-md py-2 text-sm font-semibold capitalize transition-colors"
                                    style={{ color: activeTier === tier ? "#1B1B1F" : "#6B6E76" }}
                                >
                                    {activeTier === tier && (
                                        <motion.span
                                            layoutId="tierPill"
                                            className="absolute inset-0 rounded-md bg-white shadow-sm"
                                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                                        />
                                    )}
                                    <span className="relative z-10">{tier}</span>
                                </button>
                            ))}
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTier}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -6 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-5 rounded-lg border border-[#E5E7EB] p-5"
                            >
                                <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1fr_160px]">
                                    <Field label="Package name">
                                        <input
                                            value={packages[activeTier].name}
                                            onChange={(e) => updatePackage(activeTier, "name", e.target.value)}
                                            placeholder={activeTier === "basic" ? "Starter Logo" : activeTier === "standard" ? "Brand Package" : "Full Identity"}
                                            className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-[15px] outline-none focus:border-[#1DBF73] focus:ring-4 focus:ring-[#1DBF73]/10"
                                        />
                                    </Field>
                                    <Field label="Price (USD)">
                                        <div className="flex items-center rounded-lg border border-[#E5E7EB] px-4 focus-within:border-[#1DBF73] focus-within:ring-4 focus-within:ring-[#1DBF73]/10">
                                            <span className="text-[#6B6E76]">$</span>
                                            <input
                                                value={packages[activeTier].price}
                                                onChange={(e) => updatePackage(activeTier, "price", e.target.value.replace(/[^0-9.]/g, ""))}
                                                placeholder="25"
                                                className="w-full border-none py-2.5 pl-1 text-[15px] outline-none"
                                            />
                                        </div>
                                    </Field>
                                </div>
                                <Field label="What's included">
                                    <textarea
                                        value={packages[activeTier].description}
                                        onChange={(e) => updatePackage(activeTier, "description", e.target.value)}
                                        rows={3}
                                        placeholder="1 logo concept, 2 revisions, source files delivered in 3 days..."
                                        className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-[15px] leading-relaxed outline-none focus:border-[#1DBF73] focus:ring-4 focus:ring-[#1DBF73]/10"
                                    />
                                </Field>
                            </motion.div>
                        </AnimatePresence>
                    </motion.section>

                    {/* JSON output */}
                    <motion.section variants={item}>
                        <button
                            onClick={() => setShowJSON((s) => !s)}
                            className="flex items-center gap-2 text-sm font-semibold text-[#6B6E76] hover:text-[#1B1B1F]"
                        >
                            <Code2 size={15} />
                            {showJSON ? "Hide" : "View"} generated JSON
                            <ChevronDown size={14} className={`transition-transform ${showJSON ? "rotate-180" : ""}`} />
                        </button>
                        <AnimatePresence>
                            {showJSON && (
                                <motion.pre
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 overflow-hidden rounded-lg bg-[#14151A] p-4 text-[12.5px] leading-relaxed text-[#E5E7EB]"
                                >
                                    {JSON.stringify(payload, null, 2)}
                                </motion.pre>
                            )}
                        </AnimatePresence>
                    </motion.section>
                </div>

                {/* RIGHT: LIVE PREVIEW */}
                <motion.aside variants={item} className="lg:sticky lg:top-24 lg:h-fit">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#9A9CA4]">Live preview</p>
                    <div className="overflow-hidden rounded-xl border border-[#E5E7EB] shadow-sm">
                        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-[#E8FBF1] to-[#F7F8F9]">
                            <span className="text-sm text-[#9A9CA4]">Gig cover image</span>
                        </div>

                        <div className="space-y-4 p-5">
                            <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-[#1DBF73]/20" />
                                <div>
                                    <div className="flex items-center gap-1 text-[13px] font-medium">
                                        <Star size={13} className="fill-[#FFB829] text-[#FFB829]" />
                                        <span>{seller.rating}</span>
                                        <span className="text-[#9A9CA4]">({seller.reviews})</span>
                                    </div>
                                </div>
                                <span className="ml-auto flex items-center gap-1 rounded-full bg-[#FFF6E5] px-2.5 py-1 text-[11px] font-medium text-[#B3781E]">
                                    <Clock size={11} />
                                    {seller.orders_in_queue} in queue
                                </span>
                            </div>

                            <p className="line-clamp-3 text-[15px] font-medium leading-snug text-[#1B1B1F]" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                {title || "Your gig title will appear here"}
                            </p>

                            {(category || subcategory) && (
                                <p className="text-xs text-[#9A9CA4]">
                                    {category}
                                    {subcategory ? ` › ${subcategory}` : ""}
                                </p>
                            )}

                            {tags.length > 0 && (
                                <div className="flex flex-wrap gap-1.5">
                                    {tags.map((t) => (
                                        <span key={t} className="rounded-full bg-[#F1F3F4] px-2.5 py-1 text-[11px] text-[#6B6E76]">
                                            #{t}
                                        </span>
                                    ))}
                                </div>
                            )}

                            <div className="border-t border-[#E5E7EB] pt-4">
                                <div className="mb-3 flex rounded-md bg-[#F1F3F4] p-0.5 text-xs">
                                    {PACKAGE_TIERS.map((tier) => (
                                        <button
                                            key={tier}
                                            onClick={() => setActiveTier(tier)}
                                            className={`flex-1 rounded py-1.5 font-semibold capitalize transition-colors ${activeTier === tier ? "bg-white text-[#1B1B1F] shadow-sm" : "text-[#9A9CA4]"
                                                }`}
                                        >
                                            {tier}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-baseline justify-between">
                                    <span className="text-sm font-semibold">{packages[activeTier].name || "Package name"}</span>
                                    <span className="text-lg font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                                        {packages[activeTier].price ? `$${packages[activeTier].price}` : "$—"}
                                    </span>
                                </div>
                                <p className="mt-1.5 text-[13px] leading-relaxed text-[#6B6E76]">
                                    {packages[activeTier].description || "Package details will appear here."}
                                </p>
                            </div>

                            <button className="w-full rounded-md bg-[#1DBF73] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#0E9F62]">
                                Continue (${packages[activeTier].price || "0"})
                            </button>
                        </div>
                    </div>
                </motion.aside>
            </motion.main>
        </div>
    );
}

function SectionHeading({ step, title, subtitle }) {
    return (
        <div className="flex items-start gap-3">
            <span className="mt-0.5 text-[13px] font-semibold text-[#1DBF73]">{step}</span>
            <div>
                <h2 className="text-[19px] font-bold tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {title}
                </h2>
                <p className="mt-0.5 text-[13.5px] text-[#6B6E76]">{subtitle}</p>
            </div>
        </div>
    );
}

function Field({ label, hint, children }) {
    return (
        <label className="block">
            <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[13.5px] font-medium text-[#1B1B1F]">{label}</span>
                {hint && <span className="text-xs text-[#B3B5BC]">{hint}</span>}
            </div>
            {children}
        </label>
    );
}