import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/api/client";
import { Role } from "@/api/types";

interface FormValues {
  name: string;
  email: string;
  password: string;
  role: Role;
}

const ROLE_OPTIONS: { value: Role; label: string; hint: string }[] = [
  { value: "student", label: "Student", hint: "Apply to jobs, track applications" },
  { value: "recruiter", label: "Recruiter", hint: "Post jobs, find candidates" },
  { value: "placement_officer", label: "Placement Officer", hint: "Approve jobs, manage students" },
];

const DASHBOARD_BY_ROLE: Record<string, string> = {
  student: "/student",
  recruiter: "/recruiter",
  placement_officer: "/officer",
};

export const RegisterPage = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({ defaultValues: { role: "student" } });

  const selectedRole = watch("role");

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const user = await registerUser(values);
      toast.success(`Account created — welcome, ${user.name.split(" ")[0]}`);
      navigate(DASHBOARD_BY_ROLE[user.role] ?? "/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-10">
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
            Create your account
          </h1>
          <p className="mb-6 text-sm text-slate-muted">
            Choose the role that matches what you'll be doing here.
          </p>

          <div className="mb-5 grid grid-cols-1 gap-2">
            {ROLE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setValue("role", opt.value)}
                className={`rounded-lg border px-3.5 py-2.5 text-left transition-colors ${
                  selectedRole === opt.value
                    ? "border-brass bg-brass/10"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <p className="text-sm font-semibold text-ink">{opt.label}</p>
                <p className="text-xs text-slate-muted">{opt.hint}</p>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input
                className="input"
                placeholder="Janarthanan R"
                {...register("name", { required: "Name is required", minLength: { value: 2, message: "Too short" } })}
              />
              {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
            </div>
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@college.edu"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input"
                placeholder="At least 8 characters, 1 uppercase, 1 number"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={submitting} className="btn-accent w-full">
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-slate-muted">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brass-deep hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};
