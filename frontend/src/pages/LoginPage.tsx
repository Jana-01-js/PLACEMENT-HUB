import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/api/client";

interface FormValues {
  email: string;
  password: string;
}

const DASHBOARD_BY_ROLE: Record<string, string> = {
  student: "/student",
  recruiter: "/recruiter",
  placement_officer: "/officer",
  admin: "/officer",
};

const BENEFITS = [
  "Manage placements without scattered spreadsheets",
  "Keep applicants, recruiters, and officers aligned",
  "Access a polished workspace from any device",
];

export const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const user = await login(values.email, values.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}`);
      navigate(DASHBOARD_BY_ROLE[user.role] ?? "/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(201,138,62,0.16),_transparent_32%),linear-gradient(135deg,_#f8fafc_0%,_#f3f5f7_100%)] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-card backdrop-blur">
          <div className="inline-flex items-center rounded-full border border-brass/20 bg-brass/10 px-3 py-1 text-sm font-semibold text-brass-deep">
            Secure sign-in
          </div>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight text-ink">
            Continue your professional placement journey.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-slate-muted">
            Access your role-based dashboard and stay connected to opportunities, approvals, and updates in one trusted workspace.
          </p>
          <ul className="mt-8 space-y-3">
            {BENEFITS.map((benefit) => (
              <li key={benefit} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-paper px-4 py-3 text-sm text-slate-muted">
                <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brass" />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full">
          <Link to="/" className="mb-6 flex items-center justify-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink font-display text-sm font-bold text-white">
              PH
            </span>
            <span className="font-display text-lg font-semibold text-ink">Placement Hub</span>
          </Link>

          <div className="card rounded-[2rem] border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="mb-1 font-display text-2xl font-semibold text-ink">Sign in</h2>
            <p className="mb-6 text-sm text-slate-muted">Pick up where you left off.</p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="you@college.edu"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-danger">{errors.email.message}</p>
                )}
              </div>
              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
                )}
              </div>
              <button type="submit" disabled={submitting} className="btn-accent w-full">
                {submitting ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>

          <p className="mt-6 text-center text-sm text-slate-muted">
            New here?{" "}
            <Link to="/register" className="font-semibold text-brass-deep hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
