import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getPendingJobs, approveJob, rejectJob } from "@/api/jobs";
import { Job } from "@/api/types";
import { Spinner } from "@/components/Spinner";
import { getErrorMessage } from "@/api/client";

export const PendingJobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [reasonDrafts, setReasonDrafts] = useState<Record<string, string>>({});

  const load = () => {
    setLoading(true);
    getPendingJobs()
      .then(setJobs)
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleApprove = async (id: string) => {
    try {
      await approveJob(id);
      toast.success("Job approved — now visible to students");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleReject = async (id: string) => {
    const reason = reasonDrafts[id]?.trim();
    if (!reason) {
      toast.error("Add a reason before rejecting");
      return;
    }
    try {
      await rejectJob(id, reason);
      toast.success("Job rejected");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (loading) return <Spinner label="Loading approval queue" />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Approval queue</h1>
      <p className="mt-1 text-sm text-slate-muted">
        {jobs.length} job{jobs.length === 1 ? "" : "s"} waiting on a decision.
      </p>

      <div className="mt-6 space-y-4">
        {jobs.length === 0 && (
          <div className="card text-center text-sm text-slate-muted">Queue is clear.</div>
        )}
        {jobs.map((job) => {
          const company = typeof job.company === "object" ? job.company : null;
          const poster = typeof job.postedBy === "object" ? job.postedBy : null;
          return (
            <div key={job._id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display text-lg font-semibold text-ink">{job.title}</p>
                  <p className="text-sm text-slate-muted">
                    {company?.name} · posted by {poster?.name ?? "recruiter"}
                  </p>
                </div>
                <p className="font-mono text-xs text-slate-muted">
                  Deadline {new Date(job.applicationDeadline).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-3 text-sm text-slate-text">{job.description}</p>

              <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                <button onClick={() => handleApprove(job._id)} className="btn-accent">
                  Approve
                </button>
                <input
                  className="input"
                  placeholder="Rejection reason"
                  value={reasonDrafts[job._id] ?? ""}
                  onChange={(e) =>
                    setReasonDrafts((d) => ({ ...d, [job._id]: e.target.value }))
                  }
                />
                <button onClick={() => handleReject(job._id)} className="btn-danger whitespace-nowrap">
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
