import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import { createJob } from "@/api/jobs";
import { getErrorMessage } from "@/api/client";

interface FormValues {
  title: string;
  description: string;
  jobType: "full_time" | "internship" | "part_time";
  workMode: "onsite" | "remote" | "hybrid";
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  vacancies: number;
  applicationDeadline: string;
  skillsText: string;
  minCGPA?: number;
  maxBacklogs?: number;
  allowedDepartmentsText?: string;
  graduationYear?: number;
}

export const PostJobPage = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { jobType: "full_time", workMode: "onsite", vacancies: 1 },
  });

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      await createJob({
        title: values.title,
        description: values.description,
        jobType: values.jobType,
        workMode: values.workMode,
        location: values.location,
        salaryMin: values.salaryMin ? Number(values.salaryMin) : undefined,
        salaryMax: values.salaryMax ? Number(values.salaryMax) : undefined,
        vacancies: Number(values.vacancies),
        applicationDeadline: values.applicationDeadline,
        skillsRequired: values.skillsText
          ? values.skillsText.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        eligibility: {
          minCGPA: values.minCGPA ? Number(values.minCGPA) : undefined,
          maxBacklogs: values.maxBacklogs !== undefined ? Number(values.maxBacklogs) : undefined,
          allowedDepartments: values.allowedDepartmentsText
            ? values.allowedDepartmentsText.split(",").map((s) => s.trim()).filter(Boolean)
            : undefined,
          graduationYear: values.graduationYear ? Number(values.graduationYear) : undefined,
        },
      });
      toast.success("Job submitted for placement office approval");
      navigate("/recruiter/jobs");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Post a job</h1>
      <p className="mt-1 text-sm text-slate-muted">
        Your posting goes to the placement office for approval before students can see it.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="card space-y-4">
          <div>
            <label className="label">Job title</label>
            <input className="input" placeholder="Software Engineer — New Grad" {...register("title", { required: true })} />
          </div>
          <div>
            <label className="label">Description</label>
            <textarea className="input" rows={5} {...register("description", { required: true })} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Job type</label>
              <select className="input" {...register("jobType")}>
                <option value="full_time">Full-time</option>
                <option value="internship">Internship</option>
                <option value="part_time">Part-time</option>
              </select>
            </div>
            <div>
              <label className="label">Work mode</label>
              <select className="input" {...register("workMode")}>
                <option value="onsite">Onsite</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="label">Location</label>
              <input className="input" {...register("location")} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Salary min</label>
              <input type="number" className="input" {...register("salaryMin")} />
            </div>
            <div>
              <label className="label">Salary max</label>
              <input type="number" className="input" {...register("salaryMax")} />
            </div>
            <div>
              <label className="label">Vacancies</label>
              <input type="number" className="input" {...register("vacancies", { required: true })} />
            </div>
          </div>
          <div>
            <label className="label">Application deadline</label>
            <input type="date" className="input" {...register("applicationDeadline", { required: true })} />
          </div>
          <div>
            <label className="label">Required skills (comma separated)</label>
            <input className="input" placeholder="React, Node.js, SQL" {...register("skillsText")} />
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-display text-base font-semibold text-ink">Eligibility criteria</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">Min CGPA</label>
              <input type="number" step="0.1" className="input" {...register("minCGPA")} />
            </div>
            <div>
              <label className="label">Max backlogs</label>
              <input type="number" className="input" {...register("maxBacklogs")} />
            </div>
            <div>
              <label className="label">Graduation year</label>
              <input type="number" className="input" {...register("graduationYear")} />
            </div>
          </div>
          <div>
            <label className="label">Allowed departments (comma separated, blank = any)</label>
            <input className="input" placeholder="CSE, IT, ECE" {...register("allowedDepartmentsText")} />
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-accent">
          {submitting ? "Submitting…" : "Submit for approval"}
        </button>
      </form>
    </div>
  );
};
