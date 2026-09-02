import { useState } from "react";
import { ChevronLeft, ChevronRight, Play, Maximize2, X } from "lucide-react";

function ytEmbed(url) {
  if (!url) return null;
  try {
    const u = new URL(String(url));
    if (u.hostname.includes("youtu.be")) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube.com/embed/${v}`;
    }
  } catch { /* empty */ }
  return String(url).includes("youtube.com/embed") ? url : null;
}

export default function Gallery({ images = [], videoUrl, videoPoster, alt = "Scholarship" }) {
  const vEmbed = ytEmbed(videoUrl);
  const hasVideo = !!vEmbed;
  const items = [...images];
  // ensure at least 1
  const safe = items.length ? items : ["https://placehold.co/1200x800?text=No+Image"];
  const [idx, setIdx] = useState(0);
  const [light, setLight] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const main = showVideo ? null : safe[idx];

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        {showVideo && hasVideo ? (
          <iframe
            src={vEmbed}
            title="Video"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            src={main}
            alt={alt}
            className="h-full w-full object-cover"
            onClick={() => setLight(true)}
            onError={(e) => (e.currentTarget.src = "https://placehold.co/1200x800?text=No+Image")}
          />
        )}

        {!showVideo && (
          <>
            <button onClick={() => setIdx((i) => (i - 1 + safe.length) % safe.length)} aria-label="Prev" className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white md:inline-flex"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={() => setIdx((i) => (i + 1) % safe.length)} aria-label="Next" className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow hover:bg-white md:inline-flex"><ChevronRight className="h-5 w-5" /></button>
            <button onClick={() => setLight(true)} className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur hover:bg-slate-900"><Maximize2 className="h-3.5 w-3.5" /> View</button>
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-700 shadow">{idx + 1} / {safe.length}{hasVideo ? " + video" : ""}</span>
          </>
        )}
        {hasVideo && !showVideo && (
          <button onClick={() => setShowVideo(true)} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-bold text-slate-900 shadow-lift hover:bg-slate-50"><Play className="h-5 w-5 fill-slate-900" /> Watch tour</button>
        )}
        {showVideo && (
          <button onClick={() => setShowVideo(false)} className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-700 shadow">← Images</button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto p-3 scrollbar-thin">
        {safe.map((src, i) => (
          <button
            key={src + i}
            onClick={() => { setIdx(i); setShowVideo(false); }}
            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 ${i === idx && !showVideo ? "ring-brand-600" : "ring-transparent"} ${i === idx && !showVideo ? "" : "opacity-70 hover:opacity-100"}`}
          >
            <img src={src} alt="" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.src = "https://placehold.co/300x200?text=No")} />
          </button>
        ))}
        {hasVideo && (
          <button onClick={() => setShowVideo(true)} className={`relative flex h-16 w-24 shrink-0 items-center justify-center gap-1 overflow-hidden rounded-xl bg-slate-900 text-white ring-2 ${showVideo ? "ring-brand-600" : "ring-transparent"}`}>
            {videoPoster ? <img src={videoPoster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" /> : null}
            <span className="relative inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-slate-900"><Play className="h-3 w-3" /> Video</span>
          </button>
        )}
      </div>

      {light && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setLight(false)}>
          <button className="absolute right-4 top-4 rounded-full bg-white p-2 text-slate-800" onClick={() => setLight(false)}><X className="h-5 w-5" /></button>
          <img src={safe[idx]} alt={alt} className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i - 1 + safe.length) % safe.length); }} className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3"><ChevronLeft className="h-5 w-5" /></button>
          <button onClick={(e) => { e.stopPropagation(); setIdx((i) => (i + 1) % safe.length); }} className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-3"><ChevronRight className="h-5 w-5" /></button>
        </div>
      )}
    </div>
  );
}
