import Spinner from "./Spinner";

export default function RouteFallback() {
  return (
    <div className="flex min-h-[70vh] w-full flex-col items-center justify-center py-20">
      <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white/80 p-8 shadow-lift backdrop-blur-xl">
        <Spinner className="h-12 w-12" />
        <p className="mt-4 text-base font-bold tracking-tight text-slate-800">
          Loading School<span className="text-brand-600">Hive</span>…
        </p>
        <p className="mt-1 text-xs font-medium text-slate-400">
          Preparing top scholarship opportunities
        </p>
      </div>
    </div>
  );
}

