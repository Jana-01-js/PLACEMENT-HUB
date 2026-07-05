import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StudentProfile } from "@/api/types";
import { getMyStudentProfile } from "@/api/students";
import { Spinner } from "@/components/Spinner";
import { Badge } from "@/components/Badge";
import { useAuth } from "@/context/AuthContext";

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyStudentProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner label="Loading your dashboard" />;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">
        Welcome, {user?.name.split(" ")[0]}
      </h1>
      <p className="mt-1 text-sm text-slate-muted">
        Here's where your placement journey stands.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
        <div className="card">
          <p className="label">Profile status</p>
          {profile?.profileCompleted ? (
            <Badge tone="success">Complete</Badge>
          ) : (
            <Badge tone="brass">Needs attention</Badge>
          )}
          <p className="mt-3 text-sm text-slate-muted">
            {profile?.profileCompleted
              ? "Recruiters can see your full profile."
              : "Fill in your department, CGPA, skills, and resume."}
          </p>
          <Link to="/student/profile" className="btn-ghost mt-4 !px-0 !py-0 text-brass-deep">
            {profile ? "Edit profile →" : "Create profile →"}
          </Link>
        </div>

        <div className="card">
          <p className="label">CGPA</p>
          <p className="font-mono text-3xl font-semibold text-ink">
            {profile?.cgpa ?? "—"}
          </p>
          <p className="mt-3 text-sm text-slate-muted">
            {profile?.activeBacklogs ?? 0} active backlog(s)
          </p>
        </div>

        <div className="card">
          <p className="label">Resume</p>
          {profile?.resumeUrl ? (
            <Badge tone="success">Uploaded</Badge>
          ) : (
            <Badge tone="neutral">Not uploaded</Badge>
          )}
          <p className="mt-3 truncate text-sm text-slate-muted">
            {profile?.resumeOriginalName ?? "No file yet"}
          </p>
        </div>
      </div>

      <div className="mt-8 card">
        <h2 className="font-display text-lg font-semibold text-ink">
          Ready to look for a role?
        </h2>
        <p className="mt-1 text-sm text-slate-muted">
          Browse jobs your college has approved and check your eligibility before you apply.
        </p>
        <Link to="/student/jobs" className="btn-accent mt-4 inline-flex">
          Browse jobs
        </Link>
      </div>
    </div>
  );
};
