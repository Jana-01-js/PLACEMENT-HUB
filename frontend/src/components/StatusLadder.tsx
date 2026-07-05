import { JobStatus } from "@/api/types";

// The signature visual motif of the app: every job's lifecycle is drawn as
// a ladder being climbed, rung by rung, rather than a generic progress bar.
// Rejected/closed states break off the ladder instead of continuing it.

const RUNGS: { key: JobStatus; label: string }[] = [
  { key: "pending_approval", label: "Submitted" },
  { key: "approved", label: "Approved" },
  { key: "closed", label: "Closed" },
];

const rungIndex = (status: JobStatus) =>
  RUNGS.findIndex((r) => r.key === status);

export const StatusLadder = ({ status }: { status: JobStatus }) => {
  if (status === "rejected") {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-danger">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-danger/10 text-danger">
          ✕
        </span>
        Rejected
      </div>
    );
  }

  const activeIndex = rungIndex(status);

  return (
    <div className="flex items-center">
      {RUNGS.map((rung, i) => {
        const reached = i <= activeIndex;
        const isLast = i === RUNGS.length - 1;
        return (
          <div key={rung.key} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-[11px] font-bold ${
                  reached
                    ? "border-brass bg-brass text-ink900"
                    : "border-slate-200 bg-white text-slate-muted"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-[11px] font-medium ${
                  reached ? "text-ink" : "text-slate-muted"
                }`}
              >
                {rung.label}
              </span>
            </div>
            {!isLast && (
              <div
                className={`mx-1.5 mb-4 h-0.5 w-8 rounded ${
                  i < activeIndex ? "bg-brass" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};
