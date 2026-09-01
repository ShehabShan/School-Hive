import { motion } from "framer-motion";
import { CloudOff, RefreshCw } from "lucide-react";

export default function DataNotAvailable({ onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center px-4 py-16"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 16 }}
        className="relative"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 text-amber-500 ring-1 ring-amber-100">
          <CloudOff className="h-10 w-10" />
        </div>
        <span
          aria-hidden
          className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-amber-400 ring-2 ring-white"
        />
      </motion.div>
      <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-slate-900">
        Data not available
      </h2>
      <p className="mt-3 max-w-md text-center text-sm leading-relaxed text-slate-500">
        We were unable to load the requested data right now. This could be a
        temporary network issue — please try again.
      </p>
      {onRetry && (
        <motion.button
          whileHover={{ y: -2 }}
          onClick={onRetry}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-700 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:from-brand-700 hover:to-brand-800"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </motion.button>
      )}
    </motion.div>
  );
}
