import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Save, Trash2, Sparkles, Check } from "lucide-react";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import useRole from "../../Hooks/useRole";
import RoleBadge from "../../Component/profile/RoleBadge";
import QuestionTitleInput from "../../Component/QA/wizard/QuestionTitleInput";
import RichTextEditor from "../../Component/QA/wizard/RichTextEditor";
import MetadataStep from "../../Component/QA/wizard/MetadataStep";
import TagSelector from "../../Component/QA/wizard/TagSelector";
import GuidanceSidebar from "../../Component/QA/wizard/GuidanceSidebar";
import QuestionPreviewCard from "../../Component/QA/wizard/QuestionPreviewCard";
import { useQADraft } from "../../Hooks/useQADraft";
import { QUESTION_CATEGORIES } from "../../constants/qa";
import toast from "react-hot-toast";

const initial = {
  title: "",
  body: "",
  category: "",
  tags: [],
  context: { destinationCountry: "", homeCountry: "", studyLevel: "", fieldOfStudy: "" },
  language: "english",
};

export default function AskQuestionWizard() {
  const axiosSecure = useAxiosSecure();
  const { me, role } = useRole();
  const navigate = useNavigate();
  const [draft, setDraft, clearDraft] = useQADraft(initial);
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(true);
  const [errors, setErrors] = useState({});

  const isStaff = ["admin", "superadmin", "modaretor"].includes(role);
  const badgeRole = isStaff ? role : role === "institution" ? "institution" : null;

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!draft.title.trim() || draft.title.trim().length < 10) e.title = "Title required (at least 10 characters)";
      if (!draft.body.trim() || draft.body.trim().length < 20) e.body = "Body required (at least 20 characters)";
      if (!draft.category) e.category = "Category is required";
    }
    if (s === 3) {
      if (draft.tags.length < 1 || draft.tags.length > 5) e.tags = "Add 1 to 5 tags";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(3)) { setStep(1); return; }
    if (!draft.category) { setErrors((p) => ({ ...p, category: "Category is required" })); setStep(1); return; }
    setSubmitting(true);
    try {
      const payload = {
        title: draft.title.trim(),
        body: draft.body.trim(),
        category: draft.category,
        tags: draft.tags,
        context: draft.context,
        language: draft.language,
      };
      const res = await axiosSecure.post("/questions", payload);
      const q = res.data?.data;
      toast.success("Question posted — knowledge compounds!");
      clearDraft();
      if (q?._id) navigate(`/questions/${q._id}`);
      else navigate("/questions");
    } catch (e) {
      const msg = e?.response?.data?.message || e?.response?.data?.errors?.join(", ") || e.message || "Failed to post";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const progress = (step / 3) * 100;

  const stepLabel = useMemo(() => ["", "Core Question", "Context", "Tags & Review"][step], [step]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top progress */}
      <div className="sticky top-16 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-extrabold text-white">{step}</span>
            <span className="text-sm font-bold text-slate-900">Step {step} of 3 — {stepLabel}</span>
            <span className="hidden text-xs text-slate-500 sm:inline">· Draft autosaves</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => { clearDraft(); setErrors({}); toast.success("Draft cleared"); }} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              <Trash2 className="h-3.5 w-3.5" /> Clear draft
            </button>
            <span className="hidden items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200 sm:inline-flex">
              <Save className="h-3.5 w-3.5" /> Autosaved
            </span>
          </div>
        </div>
        <div className="h-1 bg-slate-100">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4, ease: "easeOut" }} className="h-full bg-gradient-to-r from-brand-600 via-indigo-500 to-amber-400" />
        </div>
      </div>

      {/* Header */}
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight text-slate-900">
              <Sparkles className="h-6 w-6 text-brand-600" /> Ask a question
            </h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">Wizard — 3 quick steps. Your context makes the answer relevant and powers the 2-click filter (Bangladesh → Canada, Masters).</p>
          </div>
          {me && (
            <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
              <img src={me.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(me.name || me.email)}`} alt="" className="h-8 w-8 rounded-full object-cover" />
              <span className="text-sm font-semibold text-slate-900">{me.name || me.email}</span>
              {badgeRole && <RoleBadge role={badgeRole} size="sm" />}
            </div>
          )}
        </div>

        {/* Step dots */}
        <div className="mt-4 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => n < step && setStep(n)}
              className={`flex h-8 flex-1 items-center justify-center rounded-full text-xs font-bold ring-1 transition-all ${n === step ? "bg-slate-900 text-white ring-slate-900" : n < step ? "bg-emerald-50 text-emerald-700 ring-emerald-200" : "bg-white text-slate-400 ring-slate-200"}`}
            >
              {n < step ? <Check className="h-4 w-4" /> : n}
              <span className="ml-1 hidden sm:inline">{["Core", "Context", "Review"][n - 1]}</span>
            </button>
          ))}
        </div>

        {/* 2-column layout */}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_0.9fr]">
          {/* Main form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                {step === 1 && (
                  <div className="space-y-5">
                    <QuestionTitleInput value={draft.title} onChange={(v) => setDraft({ ...draft, title: v })} error={errors.title} />
                    <div>
                      <label className="mb-1.5 block text-xs font-extrabold tracking-wide text-slate-700 uppercase">Category <span className="text-rose-500">*</span></label>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {QUESTION_CATEGORIES.map((c) => (
                          <button
                            key={c.value}
                            type="button"
                            onClick={() => setDraft({ ...draft, category: c.value })}
                            className={`rounded-2xl border p-3 text-left transition-all ${draft.category === c.value ? "border-brand-500 bg-brand-50 ring-2 ring-brand-100" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"}`}
                          >
                            <span className="block text-sm font-bold text-slate-900">{c.label}</span>
                            <span className="block text-xs text-slate-500">{c.value}</span>
                          </button>
                        ))}
                      </div>
                      {errors.category && <p className="mt-1 text-xs font-medium text-rose-600">{errors.category}</p>}
                    </div>
                    <RichTextEditor value={draft.body} onChange={(v) => setDraft({ ...draft, body: v })} error={errors.body} />
                  </div>
                )}

                {step === 2 && (
                  <MetadataStep
                    context={draft.context}
                    language={draft.language}
                    onContextChange={(ctx) => setDraft({ ...draft, context: ctx })}
                    onLanguageChange={(v) => setDraft({ ...draft, language: v })}
                  />
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <TagSelector value={draft.tags} onChange={(v) => setDraft({ ...draft, tags: v })} error={errors.tags} />
                    {previewMode && <QuestionPreviewCard data={draft} />}
                    <div className="rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
                      <p className="text-sm font-bold text-amber-900">Ready to post?</p>
                      <p className="text-xs text-amber-800">Title, category, body (≥20) and 1–5 tags are required. Context & language improve discoverability but don’t block.</p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
              <button type="button" onClick={back} disabled={step === 1} className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40">
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              {step < 3 ? (
                <button type="button" onClick={next} className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-bold text-white hover:bg-black">
                  Next <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit} disabled={submitting} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:from-brand-700 hover:to-indigo-700 disabled:opacity-60">
                  {submitting ? "Posting…" : "Post question"}
                  <Sparkles className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar — sticky on desktop */}
          <div className="space-y-4 lg:sticky lg:top-[124px] lg:self-start">
            <GuidanceSidebar step={step} previewMode={previewMode} onTogglePreview={() => setPreviewMode((v) => !v)} />
            {step !== 3 && previewMode && (
              <div className="hidden lg:block">
                <QuestionPreviewCard data={draft} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
