export const Spinner = ({ label = "Loading" }: { label?: string }) => (
  <div className="flex items-center justify-center gap-3 py-16 text-slate-muted">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-brass" />
    <span className="text-sm font-medium">{label}…</span>
  </div>
);
