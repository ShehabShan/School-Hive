/* eslint-disable react/prop-types */
export default function PageHeader({ title, subtitle, actions, icon: Icon }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
            <Icon className="h-5 w-5" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm leading-relaxed text-slate-500">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex shrink-0 items-center gap-3">{actions}</div>
      )}
    </div>
  );
}
