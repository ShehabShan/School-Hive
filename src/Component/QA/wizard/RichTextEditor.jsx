import { useRef, useState } from "react";
import { Bold, Italic, Link2, List, Code2, Image as ImageIcon, Eye, PenLine } from "lucide-react";

function insertAtCursor(textarea, before, after = "", placeholder = "") {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const selected = textarea.value.slice(start, end) || placeholder;
  const next = textarea.value.slice(0, start) + before + selected + after + textarea.value.slice(end);
  return { next, cursor: start + before.length + selected.length + after.length };
}

export default function RichTextEditor({ value, onChange, error }) {
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
    setUploading(true);
    try {
      const key = import.meta.env.VITE_IMAGE_HOSTING_KEY;
      if (!key) {
        onChange(value + `\n\n![${file.name}](upload-failed-no-key)`);
        return;
      }
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, { method: "POST", body: fd });
      const j = await res.json();
      const url = j?.data?.url;
      if (url) onChange(value + `\n\n![${file.name}](${url})`);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) handleUpload(file);
  };

  const short = value.trim().length > 0 && value.trim().length < 40;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-bold text-slate-900">Details <span className="text-rose-500">*</span></label>
        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          {preview ? <><PenLine className="h-3.5 w-3.5" /> Edit</> : <><Eye className="h-3.5 w-3.5" /> Preview</>}
        </button>
      </div>

      {/* Floating toolbar */}
      <div className="flex flex-wrap items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-2">
        <button type="button" onClick={() => apply("**", "**", "bold")} className="rounded-lg p-2 hover:bg-white hover:shadow-sm" title="Bold"><Bold className="h-4 w-4" /></button>
        <button type="button" onClick={() => apply("*", "*", "italic")} className="rounded-lg p-2 hover:bg-white hover:shadow-sm" title="Italic"><Italic className="h-4 w-4" /></button>
        <button type="button" onClick={() => apply("[", "](https://)", "link text")} className="rounded-lg p-2 hover:bg-white hover:shadow-sm" title="Link"><Link2 className="h-4 w-4" /></button>
        <button type="button" onClick={() => apply("\n- ", "", "list item")} className="rounded-lg p-2 hover:bg-white hover:shadow-sm" title="List"><List className="h-4 w-4" /></button>
        <button type="button" onClick={() => apply("`", "`", "code")} className="rounded-lg p-2 hover:bg-white hover:shadow-sm" title="Code"><Code2 className="h-4 w-4" /></button>
        <label className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-black">
          <ImageIcon className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Upload image"}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e.target.files?.[0])} disabled={uploading} />
        </label>
      </div>

      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
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
            className="min-h-[180px] w-full resize-y rounded-2xl bg-transparent px-4 py-3 text-[14px] leading-relaxed placeholder:text-slate-400 focus:outline-none"
          />
          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2 text-xs">
            <span className="text-slate-500">Markdown: **bold** *italic* [link](url) - list `code` ![image](url)</span>
            <span className={`font-medium ${value.trim().length < 20 ? "text-slate-400" : "text-emerald-600"}`}>{value.trim().length} chars</span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="prose max-w-none whitespace-pre-wrap text-sm leading-relaxed">
            {value.trim() ? value : <span className="text-slate-400">Nothing to preview yet — write something in Edit.</span>}
          </div>
          {value.includes("![") && <p className="mt-2 text-xs text-slate-500">Images: {value.match(/!\[.*?\]\(.*?\)/g)?.length || 0} markdown image(s) will render inline in the feed.</p>}
        </div>
      )}

      {short && <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 ring-1 ring-amber-200">Add a bit more detail — short bodies get fewer high-quality answers (aim for 2–3 short paragraphs).</p>}
      {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
      {dragOver && <p className="text-xs font-semibold text-brand-600">Drop image to upload and append as markdown.</p>}
    </div>
  );
}
