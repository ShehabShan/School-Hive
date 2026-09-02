import { Image as ImageIcon, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function GalleryStrip({ images = [], videoUrl, orgGallery = [] }) {
  const gallery = images.length ? images : orgGallery;
  const hasGallery = Array.isArray(gallery) && gallery.filter(Boolean).length > 0;
  const hasVideo = Boolean(videoUrl);
  if (!hasGallery && !hasVideo) return null;
  const ytId = hasVideo ? extractYouTubeId(videoUrl) : null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="rounded-2xl bg-white p-5 shadow-soft ring-1 ring-slate-100 sm:p-6">
      <h3 className="flex items-center gap-2 text-base font-bold text-slate-900"><ImageIcon className="h-4 w-4 text-brand-500" /> Featured</h3>
      {hasVideo && ytId && (
        <div className="mt-3 overflow-hidden rounded-xl ring-1 ring-slate-200">
          <div className="relative aspect-video">
            <iframe src={`https://www.youtube.com/embed/${ytId}`} title="Intro video" className="h-full w-full" allowFullScreen />
          </div>
        </div>
      )}
      {hasVideo && !ytId && (
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800">
          <Play className="h-4 w-4" /> Watch Intro Video
        </a>
      )}
      {hasGallery && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {gallery.slice(0,6).map((src,i)=> (
            <div key={i} className="overflow-hidden rounded-xl ring-1 ring-slate-100">
              <img src={src} alt={`gallery ${i+1}`} className="h-28 w-full object-cover hover:scale-105 transition duration-300 sm:h-32" loading="lazy" onError={(e)=> e.currentTarget.style.display='none'} />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function extractYouTubeId(url) {
  try {
    const u = String(url);
    const m = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  } catch { return null; }
}
