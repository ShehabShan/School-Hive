import { COUNTRIES, HOME_BOARDS, STUDY_LEVELS, QUESTION_LANGUAGES } from "../../../constants/qa";
import SearchableCombobox from "./SearchableCombobox";

function ToggleChips({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-1.5 block text-xs font-extrabold tracking-wide text-slate-700 uppercase">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const val = opt.value || opt;
          const lab = opt.label || opt;
          const active = value === val;
          return (
            <button
              key={val}
              type="button"
              onClick={() => onChange(active ? "" : val)}
              className={`rounded-full px-3.5 py-2 text-sm font-semibold ring-1 transition-all ${active ? "bg-slate-900 text-white ring-slate-900 shadow-sm" : "bg-white text-slate-700 ring-slate-200 hover:bg-slate-50 hover:ring-slate-300"}`}
            >
              {lab}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MetadataStep({ context, language, onContextChange, onLanguageChange }) {
  const setField = (k, v) => onContextChange({ ...context, [k]: v });

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SearchableCombobox
          label="Destination country"
          placeholder="e.g. Canada"
          options={COUNTRIES}
          value={context.destinationCountry}
          onChange={(v) => setField("destinationCountry", v)}
          hint="Where you want to study — powers the 2-click filter Bangladesh → Germany."
        />
        <SearchableCombobox
          label="Home country / board"
          placeholder="e.g. Bangladesh — National Curriculum"
          options={[...COUNTRIES, ...HOME_BOARDS.map((h) => ({ value: h, label: h }))]}
          value={context.homeCountry}
          onChange={(v) => setField("homeCountry", v)}
          hint="Home board affects test/visa rules — e.g. CBSE vs National Curriculum."
        />
      </div>

      <ToggleChips label="Study level" options={STUDY_LEVELS} value={context.studyLevel} onChange={(v) => setField("studyLevel", v)} />

      <div>
        <label className="mb-1.5 block text-xs font-extrabold tracking-wide text-slate-700 uppercase">Field of study</label>
        <input
          value={context.fieldOfStudy}
          onChange={(e) => setField("fieldOfStudy", e.target.value)}
          placeholder="e.g. Computer Science"
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none placeholder:text-slate-400 hover:border-slate-300 focus:border-brand-500 focus:ring-4 focus:ring-brand-50"
        />
        <p className="mt-1 text-xs text-slate-500">Optional but helps matching to experts in that field.</p>
      </div>

      <ToggleChips
        label="Language"
        options={QUESTION_LANGUAGES}
        value={language}
        onChange={onLanguageChange}
      />
      <p className="text-xs text-slate-500">Body can be code-switched (Banglish/Hinglish) as typed — structured fields stay language-independent for search.</p>
    </div>
  );
}
