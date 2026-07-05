import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { getJob, checkEligibility } from "@/api/jobs";
import { Job } from "@/api/types";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/Badge";
import { getErrorMessage } from "@/api/client";

export const JobDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [eligibility, setEligibility] = useState<{ eligible: boolean; reasons: string[] } | null>(null);

  useEffect(() => {
    if (!id) return;
    getJob(id)
      .then(setJob)
      .finally(() => setLoading(false));
  }, [id]);

  const runCheck = async () => {
    if (!id) return;
    setChecking(true);
    try {
      const result = await checkEligibility(id);
      setEligibility(result);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setChecking(false);
    }
  };

  if (loading) return <Spinner label="Loading job" />;
  if (!job) return <p className="text-sm text-slate-muted">Job not found.</p>;

  const company = typeof job.company === "object" ? job.company : null;

  return (
    <div className="max-w-2xl">
      <Link to="/student/jobs" className="text-sm text-slate-muted hover:text-ink">
        ← Back to jobs
      </Link>

      <div className="card mt-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-2xl font-semibold text-ink">{job.title}</h1>
            <p className="mt-1 text-sm text-slate-muted">
              {company?.name} · {job.location ?? "Location not set"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge tone="brass">{job.jobType.replace("_", " ")}</Badge>
            <Badge tone="neutral">{job.workMode}</Badge>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4 rounded-lg bg-paper p-4 font-mono text-sm">
          <div>
            <p className="text-xs uppercase text-slate-muted">Salary</p>
            <p className="text-ink">
              {job.salaryMin || job.salaryMax
                ? `${job.currency} ${job.salaryMin ?? "?"} – ${job.salaryMax ?? "?"}`
                : "Not disclosed"}
            </p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-muted">Apply by</p>
            <p className="text-ink">{new Date(job.applicationDeadline).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-muted">Vacancies</p>
            <p className="text-ink">{job.vacancies}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-muted">Min CGPA</p>
            <p className="text-ink">{job.eligibility.minCGPA ?? "—"}</p>
          </div>
        </div>

        <div className="mt-5">
          <h2 className="font-display text-base font-semibold text-ink">Description</h2>
          <p className="mt-2 whitespace-pre-line text-sm text-slate-text">{job.description}</p>
        </div>

        {job.skillsRequired.length > 0 && (
          <div className="mt-5">
            <h2 className="font-display text-base font-semibold text-ink">Skills</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {job.skillsRequired.map((s) => (
                <Badge key={s} tone="neutral">{s}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 border-t border-slate-100 pt-5">
          <button onClick={runCheck} disabled={checking} className="btn-accent">
            {checking ? "Checking…" : "Check my eligibility"}
          </button>

          {eligibility && (
            <div className={`mt-4 rounded-lg p-4 ${eligibility.eligible ? "bg-success/10" : "bg-danger/10"}`}>
              <p className={`font-semibold ${eligibility.eligible ? "text-success" : "text-danger"}`}>
                {eligibility.eligible ? "You're eligible for this role" : "You don't meet all criteria"}
              </p>
              {eligibility.reasons.length > 0 && (
                <ul className="mt-2 list-inside list-disc text-sm text-slate-text">
                  {eligibility.reasons.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
