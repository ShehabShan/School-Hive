import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Shared markdown renderer for Q&A bodies (questions, answers, previews).
 * Safe by default: react-markdown escapes raw HTML (no rehype-raw), so
 * user content can't inject markup. Images lazy-load; links open safely.
 */
const MarkdownBody = memo(function MarkdownBody({ text, className = "", compact = false }) {
  return (
    <div
      className={
        (compact ? "prose prose-sm max-w-none prose-p:my-2 prose-li:my-0" : "prose prose-sm max-w-none prose-p:leading-relaxed") +
        " prose-headings:font-bold prose-a:text-brand-600 prose-a:no-underline hover:prose-a:underline prose-code:before:content-none prose-code:after:content-none prose-code:rounded prose-code:bg-slate-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.85em] prose-code:font-medium prose-code:text-rose-600 prose-pre:bg-slate-900 prose-img:rounded-xl prose-img:border prose-img:border-slate-200 " +
        className
      }
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: (props) => { const p = { ...props }; delete p.node; return <img {...p} loading="lazy" className="max-h-[560px] object-contain" alt={p.alt || ""} />; },
          a: (props) => { const p = { ...props }; delete p.node; return <a {...p} target="_blank" rel="noreferrer noopener" />; },
        }}
      >
        {String(text || "")}
      </ReactMarkdown>
    </div>
  );
});

export default MarkdownBody;
