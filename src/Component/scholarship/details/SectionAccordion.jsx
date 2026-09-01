/* eslint-disable react/prop-types */
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function SectionAccordion({ id, icon: Icon, title, excerpt, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-slate-100 bg-white shadow-soft">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center gap-3 p-5 text-left">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white"><Icon className="h-4 w-4" /></span>
        <span className="flex-1">
          <span className="block text-base font-bold text-slate-900">{title}</span>
          {!open && excerpt && <span className="block text-sm text-slate-500 line-clamp-1">{excerpt}</span>}
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="border-t border-slate-100 p-5 pt-5">{children}</div>}
    </section>
  );
}
