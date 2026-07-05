import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingJobs } from "@/api/jobs";
import { Job } from "@/api/types";
import { Spinner } from "@/components/Spinner";

export const OfficerDashboard = () => {
  const [pending, setPending] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPendingJobs()
      .then(setPending)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading dashboard" />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Placement office</h1>
      <p className="mt-1 text-sm text-slate-muted">
        Keep the pipeline moving — approvals and student records, all in one place.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
        <Link to="/officer/pending" className="card block hover:shadow-lg transition-shadow">
          <p className="label">Awaiting approval</p>
          <p className="font-mono text-4xl font-semibold text-ink">{pending.length}</p>
          <p className="mt-2 text-sm text-brass-deep">Review the queue →</p>
        </Link>
        <Link to="/officer/students" className="card block hover:shadow-lg transition-shadow">
          <p className="label">Student directory</p>
          <p className="mt-2 text-sm text-slate-muted">
            Search and filter every registered student's profile.
          </p>
          <p className="mt-2 text-sm text-brass-deep">Open directory →</p>
        </Link>
      </div>
    </div>
  );
};
