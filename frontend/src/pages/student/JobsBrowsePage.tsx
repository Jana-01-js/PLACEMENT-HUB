import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listJobs, JobFilters } from "@/api/jobs";
import { Job } from "@/api/types";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/Badge";

const JOB_TYPES = [
  { value: "", label: "All types" },
  { value: "full_time", label: "Full-time" },
  { value: "internship", label: "Internship" },
  { value: "part_time", label: "Part-time" },
];

export const JobsBrowsePage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<JobFilters>({});

  useEffect(() => {
    setLoading(true);
    listJobs(filters)
      .then((res) => setJobs(res.jobs))
      .finally(() => setLoading(false));
  }, [filters]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Browse jobs</h1>
      <p className="mt-1 text-sm text-slate-muted">
        Only jobs your placement office has approved show up here.
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          className="input max-w-xs"
          placeholder="Search by title…"
          onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value || undefined }))}
        />
        <select
          className="input max-w-[10rem]"
          onChange={(e) => setFilters((f) => ({ ...f, jobType: e.target.value || undefined }))}
        >
          {JOB_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 space-y-4">
        {loading && <Spinner label="Finding jobs" />}
        {!loading && jobs.length === 0 && (
          <div className="card text-center text-sm text-slate-muted">
            No approved jobs match your filters right now.
          </div>
        )}
        {jobs.map((job) => {
          const company = typeof job.company === "object" ? job.company : null;
          return (
            <Link
              key={job._id}
              to={`/student/jobs/${job._id}`}
              className="card flex items-center justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <p className="font-display text-lg font-semibold text-ink">{job.title}</p>
                <p className="text-sm text-slate-muted">
                  {company?.name ?? "Company"} · {job.location ?? "Location not set"}
                </p>
                <div className="mt-2 flex gap-2">
                  <Badge tone="brass">{job.jobType.replace("_", " ")}</Badge>
                  <Badge tone="neutral">{job.workMode}</Badge>
                </div>
              </div>
              <p className="font-mono text-xs text-slate-muted">
                Apply by {new Date(job.applicationDeadline).toLocaleDateString()}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
