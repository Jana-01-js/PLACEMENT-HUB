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
    <div className="flex min-h-screen items-center justify-center bg-paper px-4">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brass font-display text-sm font-bold text-ink900">
            PH
          </span>
          <span className="font-display text-lg font-semibold text-ink">
            Placement Hub
          </span>
        </Link>

        <div className="card">
          <h1 className="mb-1 font-display text-2xl font-semibold text-ink">
            Sign in
          </h1>
          <p className="mb-6 text-sm text-slate-muted">
            Pick up where you left off.
          </p>

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
  );
};
