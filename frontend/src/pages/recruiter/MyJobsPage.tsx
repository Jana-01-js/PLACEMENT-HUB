import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyJobs, closeJob } from "@/api/jobs";
import { Job, JobStatus } from "@/api/types";
import { Spinner } from "@/components/Spinner";
import { StatusLadder } from "@/components/StatusLadder";
import { Badge } from "@/components/Badge";
import { getErrorMessage } from "@/api/client";

const FILTERS: { value: JobStatus | ""; label: string }[] = [
  { value: "", label: "All" },
  { value: "pending_approval", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "closed", label: "Closed" },
];

export const MyJobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<JobStatus | "">("");

  const load = () => {
    setLoading(true);
    getMyJobs(filter || undefined)
      .then(setJobs)
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const handleClose = async (id: string) => {
    try {
      await closeJob(id);
      toast.success("Job closed");
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">My jobs</h1>

      <div className="mt-4 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium ${
              filter === f.value ? "bg-ink text-white" : "bg-white text-slate-muted hover:bg-slate-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-4">
        {loading && <Spinner label="Loading jobs" />}
        {!loading && jobs.length === 0 && (
          <div className="card text-center text-sm text-slate-muted">No jobs in this view.</div>
        )}
        {jobs.map((job) => (
          <div key={job._id} className="card">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-display text-lg font-semibold text-ink">{job.title}</p>
                <p className="text-sm text-slate-muted">
                  {job.applicantsCount} applicant(s) · {job.vacancies} vacancy(ies)
                </p>
                {job.status === "rejected" && job.rejectionReason && (
                  <p className="mt-2 text-sm text-danger">Reason: {job.rejectionReason}</p>
                )}
              </div>
              <StatusLadder status={job.status} />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
              <Badge tone="neutral">{job.jobType.replace("_", " ")}</Badge>
              {job.status === "approved" && (
                <button onClick={() => handleClose(job._id)} className="btn-ghost !py-1 !px-2 text-sm text-danger">
                  Close job
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
