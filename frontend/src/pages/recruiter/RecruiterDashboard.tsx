import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyCompany } from "@/api/companies";
import { getMyJobs } from "@/api/jobs";
import { Company, Job } from "@/api/types";
import { Spinner } from "@/components/Spinner";
import { StatusLadder } from "@/components/StatusLadder";
import { useAuth } from "@/context/AuthContext";

export const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState<Company | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getMyCompany(), getMyJobs()])
      .then(([c, j]) => {
        setCompany(c);
        setJobs(j);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading your dashboard" />;

  if (!company) {
    return (
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">
          Welcome, {user?.name.split(" ")[0]}
        </h1>
        <div className="card mt-6">
          <h2 className="font-display text-lg font-semibold text-ink">Set up your company first</h2>
          <p className="mt-1 text-sm text-slate-muted">
            You'll need a company profile before you can post any jobs.
          </p>
          <Link to="/recruiter/company" className="btn-accent mt-4 inline-flex">
            Create company profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">{company.name}</h1>
      <p className="mt-1 text-sm text-slate-muted">
        {jobs.length} job{jobs.length === 1 ? "" : "s"} posted so far.
      </p>

      <div className="mt-8 flex gap-3">
        <Link to="/recruiter/jobs/new" className="btn-accent">Post a job</Link>
        <Link to="/recruiter/company" className="btn-ghost">Edit company profile</Link>
      </div>

      <div className="mt-8 space-y-4">
        {jobs.slice(0, 5).map((job) => (
          <div key={job._id} className="card flex items-center justify-between">
            <div>
              <p className="font-display font-semibold text-ink">{job.title}</p>
              <p className="text-sm text-slate-muted">{job.applicantsCount} applicant(s)</p>
            </div>
            <StatusLadder status={job.status} />
          </div>
        ))}
        {jobs.length === 0 && (
          <div className="card text-center text-sm text-slate-muted">
            You haven't posted a job yet.
          </div>
        )}
      </div>
    </div>
  );
};
