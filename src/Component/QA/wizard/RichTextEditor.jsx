import { useRef, useState } from "react";
import { Bold, Italic, Link2, List, Code2, Image as ImageIcon, Eye, PenLine, X, Upload } from "lucide-react";
import MarkdownBody from "../MarkdownBody";
import toast from "react-hot-toast";
import { optimizeImage, formatBytes } from "../../../lib/optimizeImage";

function insertAtCursor(textarea, before, after = "", placeholder = "") {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end) || placeholder;
  const next = textarea.value.slice(0, start) + before + selected + after + textarea.value.slice(end);
  return { next };
}

export default function RichTextEditor({ value, onChange, images = [], onImagesChange, error, label = "Details" }) {
  const ref = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);

  const apply = (before, after, placeholder) => {
    const ta = ref.current;
    if (!ta) return;
    const { next } = insertAtCursor(ta, before, after, placeholder);
    onChange(next);
    requestAnimationFrame(() => ta.focus());
  };

  const handleUpload = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Only images allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
    if (!key) {
      toast.error("Image hosting not configured (VITE_IMAGE_HOSTING_KEY missing)");
      return;
    }
    setUploading(true);
    try {
      toast.loading("Optimizing image…", { id: "rich-optimize" });
      const optimized = await optimizeImage(file, { maxSizeMB: 0.8, maxWidthOrHeight: 1280, quality: 0.82 });
      if (optimized.size < file.size) toast.loading(`Uploading ${formatBytes(optimized.size)} (was ${formatBytes(file.size)})…`, { id: "rich-optimize" });
      const fd = new FormData();
      fd.append("image", optimized);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: fd });
      const j = await res.json();
      const url = j?.data?.url || j?.data?.display_url;
      if (!url) throw new Error(j?.error?.message || "Upload failed");
      const nextImages = [...(images || []), { id: `${Date.now()}-${file.name}`, name: file.name, url }];
      onImagesChange?.(nextImages);
      toast.success("Image added", { id: "rich-optimize" });
    } catch (e) {
      toast.error(e?.message || "Upload failed", { id: "rich-optimize" });
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (id) => {
    const next = (images || []).filter((img) => img.id !== id);
    onImagesChange?.(next);
    toast.success("Image removed");
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files || []);
    const img = files.find((f) => f.type.startsWith("image/"));
    if (img) handleUpload(img);
  };

  const short = value.trim().length > 0 && value.trim().length < 40;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-900">{label} <span className="text-rose-500">*</span></label>
        <div className="inline-flex rounded-full border border-slate-200 bg-white p-0.5 shadow-sm">
          <button type="button" onClick={() => setPreview(false)} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${!preview ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}><PenLine className="h-3.5 w-3.5" /> Edit</button>
          <button type="button" onClick={() => setPreview(true)} className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${preview ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}><Eye className="h-3.5 w-3.5" /> Preview</button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-2">
        <button type="button" onClick={() => apply("**", "**", "bold")} className="rounded-lg p-2 hover:bg-white hover:shadow-sm" title="Bold"><Bold className="h-4 w-4" /></button>
        <button type="button" onClick={() => apply("*", "*", "italic")} className="rounded-lg p-2 hover:bg-white hover:shadow-sm" title="Italic"><Italic className="h-4 w-4" /></button>
        <button type="button" onClick={() => apply("[", "](https://)", "link text")} className="rounded-lg p-2 hover:bg-white hover:shadow-sm" title="Link"><Link2 className="h-4 w-4" /></button>
        <button type="button" onClick={() => apply("\n- ", "", "list item")} className="rounded-lg p-2 hover:bg-white hover:shadow-sm" title="List"><List className="h-4 w-4" /></button>
        <button type="button" onClick={() => apply("`", "`", "code")} className="rounded-lg p-2 hover:bg-white hover:shadow-sm" title="Code"><Code2 className="h-4 w-4" /></button>
        <label className={`ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-white ${uploading ? "bg-slate-400" : "bg-slate-900 hover:bg-black"}`}>
          <ImageIcon className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} disabled={uploading} />
        </label>
      </div>

      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragEnter={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`rounded-2xl border bg-white shadow-sm transition-all ${dragOver ? "border-brand-400 ring-4 ring-brand-50" : error ? "border-rose-300 focus-within:border-rose-500 focus-within:ring-4 focus-within:ring-rose-50" : "border-slate-200 hover:border-slate-300 focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-50"}`}
        >
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={9}
            placeholder="Describe the context, what you already tried, and what you need. Markdown supported. Drag & drop an image here — e.g. screenshot of portal, rejection letter, test score."
            className="min-h-[180px] w-full resize-y rounded-t-2xl bg-transparent px-4 py-3 text-[14px] leading-relaxed placeholder:text-slate-400 focus:outline-none"
          />
          {dragOver && (
            <div className="mx-2 mb-2 flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-brand-300 bg-brand-50 px-4 py-6 text-sm font-semibold text-brand-700">
              <Upload className="h-4 w-4" /> Drop image to upload
            </div>
          )}
          {images && images.length > 0 && (
            <div className="border-t border-slate-100 bg-slate-50/70 px-3 py-3">
              <p className="mb-2 text-xs font-bold text-slate-700">{images.length} image{images.length > 1 ? "s" : ""} attached — will be appended as markdown on post, not shown as raw text</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {images.map((img) => (
                  <div key={img.id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <img src={img.url} alt={img.name} className="h-24 w-full object-cover" loading="lazy" />
                    <div className="p-2">
                      <p className="truncate text-xs font-medium text-slate-700">{img.name}</p>
                      <p className="truncate text-[11px] text-slate-400">{img.url.slice(0, 32)}…</p>
                    </div>
                    <button type="button" onClick={() => handleRemove(img.id)} className="absolute right-1.5 top-1.5 rounded-full bg-slate-900/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-rose-600" title="Remove image">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-xs">
            <span className="text-slate-500">Bold/Italic/Link/List/Code supported — images show as thumbnails above, not raw text</span>
            <span className={`font-medium ${value.trim().length < 20 ? "text-slate-400" : "text-emerald-600"}`}>{value.trim().length} chars</span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {value.trim() ? <MarkdownBody text={value} /> : <p className="text-sm text-slate-400">Nothing to preview yet — write something in Edit.</p>}
          {images && images.length > 0 && (
            <div className="mt-3 grid grid-cols-2 gap-2">
              {images.map((img) => (
                <img key={img.id} src={img.url} alt={img.name} className="w-full rounded-xl border" loading="lazy" />
              ))}
            </div>
          )}
          {images && images.length > 0 && <p className="mt-2 text-xs text-slate-500">{images.length} image{images.length > 1 ? "s" : ""} will be included as markdown on post.</p>}
        </div>
      )}

      {short && <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 ring-1 ring-amber-200">Add a bit more detail — short bodies get fewer high-quality answers (aim for 2–3 short paragraphs).</p>}
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}
