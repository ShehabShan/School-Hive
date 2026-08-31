/* eslint-disable react/prop-types */
import { CloudOff, RefreshCw } from "lucide-react";

export default function DataNotAvailable({ onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-16">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
        <CloudOff className="h-10 w-10" />
      </div>
      <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">
        Data not available
      </h2>
      <p className="mt-3 max-w-md text-center text-sm leading-relaxed text-slate-500">
        We were unable to load the requested data right now. This could be a temporary
        network issue — please try again.
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-brand-700"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      )}
    </div>
  );
}
