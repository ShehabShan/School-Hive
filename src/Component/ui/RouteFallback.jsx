import Spinner from "./Spinner";

export default function RouteFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center py-16">
      <div className="text-center">
        <Spinner />
        <p className="mt-3 text-sm font-medium text-slate-500">Loading…</p>
      </div>
    </div>
  );
}
