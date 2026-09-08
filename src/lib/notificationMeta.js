import {
  Bell,
  MessagesSquare,
  CheckCircle2,
  UserPlus,
  FileText,
  CheckCircle,
  XCircle,
  Star,
  Building2,
  GraduationCap,
  MessageSquareReply,
} from "lucide-react";

export const TYPE_META = {
  // Q&A
  question_answered: {
    Icon: MessagesSquare,
    tone: "bg-brand-50 text-brand-600",
    label: "Answers",
    group: "qa",
    text: (n) => `${n.actorEmail || "Someone"} answered "${n.payload?.questionTitle || n.payload?.scholarshipName || "your question"}"`,
  },
  answer_accepted: {
    Icon: CheckCircle2,
    tone: "bg-emerald-50 text-emerald-600",
    label: "Accepted",
    group: "qa",
    text: (n) => `Your answer on "${n.payload?.questionTitle || "a question"}" was accepted`,
  },
  question_followed: {
    Icon: UserPlus,
    tone: "bg-amber-50 text-amber-600",
    label: "Follows",
    group: "qa",
    text: (n) => `${n.actorEmail || "Someone"} is following "${n.payload?.questionTitle || "your question"}"`,
  },
  comment_reply: {
    Icon: MessageSquareReply,
    tone: "bg-indigo-50 text-indigo-600",
    label: "Comments",
    group: "qa",
    text: (n) => `${n.actorEmail || "Someone"} replied to your comment on "${n.payload?.questionTitle || "a thread"}"`,
  },
  // Scholarship — application lifecycle
  application_submitted: {
    Icon: FileText,
    tone: "bg-blue-50 text-blue-600",
    label: "Applications",
    group: "applications",
    text: (n) => `New application for "${n.payload?.scholarshipName || "a scholarship"}" from ${n.actorEmail || "a student"}`,
  },
  application_accepted: {
    Icon: CheckCircle,
    tone: "bg-emerald-50 text-emerald-700",
    label: "Applications",
    group: "applications",
    text: (n) => `Your application for "${n.payload?.scholarshipName || "a scholarship"}" was accepted`,
  },
  application_rejected: {
    Icon: XCircle,
    tone: "bg-rose-50 text-rose-600",
    label: "Applications",
    group: "applications",
    text: (n) => `Your application for "${n.payload?.scholarshipName || "a scholarship"}" was rejected`,
  },
  // Reviews
  review_submitted: {
    Icon: Star,
    tone: "bg-amber-50 text-amber-700",
    label: "Reviews",
    group: "reviews",
    text: (n) => `${n.actorEmail || "Someone"} reviewed "${n.payload?.scholarshipName || "your scholarship"}"`,
  },
  review_moderated: {
    Icon: GraduationCap,
    tone: "bg-violet-50 text-violet-600",
    label: "Reviews",
    group: "reviews",
    text: (n) => {
      const s = n.payload?.newStatus || n.payload?.status || "moderated";
      return `Your review for "${n.payload?.scholarshipName || "a scholarship"}" was ${s}`;
    },
  },
  // Scholarships
  scholarship_published: {
    Icon: Building2,
    tone: "bg-cyan-50 text-cyan-700",
    label: "Scholarships",
    group: "scholarships",
    text: (n) => `"${n.payload?.scholarshipName || "A scholarship"}" is now published`,
  },
  scholarship_updated: {
    Icon: Building2,
    tone: "bg-slate-100 text-slate-700",
    label: "Scholarships",
    group: "scholarships",
    text: (n) => `"${n.payload?.scholarshipName || "A scholarship"}" was updated`,
  },
};

export const FILTERS = [
  { key: "all", label: "All Notifications", match: () => true },
  { key: "qa", label: "Q&A", match: (n) => (TYPE_META[n.type]?.group || "qa") === "qa" },
  { key: "applications", label: "Applications", match: (n) => TYPE_META[n.type]?.group === "applications" },
  { key: "reviews", label: "Reviews", match: (n) => TYPE_META[n.type]?.group === "reviews" },
  { key: "scholarships", label: "Scholarships", match: (n) => TYPE_META[n.type]?.group === "scholarships" },
];

export const timeAgo = (date) => {
  if (!date) return "";
  const s = Math.max(1, Math.floor((Date.now() - new Date(date).getTime()) / 1000));
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export function getNotificationLink(n) {
  const p = n.payload || {};
  if (p.scholarshipId) return `/scholarships/${p.scholarshipId}`;
  if (p.applicationId) return `/userDashboard/myApplication`;
  if (p.reviewId && p.scholarshipId) return `/scholarships/${p.scholarshipId}`;
  if (p.questionId) return `/questions/${p.questionId}`;
  // fallback for scholarship types that only have scholarshipName
  if (n.type?.startsWith("application")) return "/userDashboard/myApplication";
  if (n.type?.startsWith("review")) return "/userDashboard/myReviews";
  if (n.type?.startsWith("scholarship")) return "/scholarships";
  if (n.type?.startsWith("question") || n.type?.startsWith("answer") || n.type === "comment_reply") return "/questions";
  return "/notifications";
}

export const FALLBACK_META = { Icon: Bell, tone: "bg-slate-100 text-slate-500", text: () => "New activity", group: "all" };
