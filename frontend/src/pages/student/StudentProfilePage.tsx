import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getMyStudentProfile, updateMyStudentProfile, uploadResume } from "@/api/students";
import { StudentProfile } from "@/api/types";
import { getErrorMessage } from "@/api/client";
import { Spinner } from "@/components/Spinner";

interface FormValues {
  department: string;
  graduationYear: number;
  cgpa?: number;
  activeBacklogs: number;
  phone?: string;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skillsText: string;
  projects: { title: string; description?: string; link?: string }[];
  certifications: { name: string; issuer?: string }[];
  internships: { company: string; role: string; description?: string }[];
  achievements: { title: string; description?: string }[];
}

const toFormValues = (p: StudentProfile | null): FormValues => ({
  department: p?.department ?? "",
  graduationYear: p?.graduationYear ?? new Date().getFullYear() + 1,
  cgpa: p?.cgpa,
  activeBacklogs: p?.activeBacklogs ?? 0,
  phone: p?.phone ?? "",
  bio: p?.bio ?? "",
  githubUrl: p?.githubUrl ?? "",
  linkedinUrl: p?.linkedinUrl ?? "",
  portfolioUrl: p?.portfolioUrl ?? "",
  skillsText: p?.skills?.join(", ") ?? "",
  projects: p?.projects?.length ? p.projects.map((x) => ({ title: x.title, description: x.description, link: x.link })) : [],
  certifications: p?.certifications?.length ? p.certifications.map((x) => ({ name: x.name, issuer: x.issuer })) : [],
  internships: p?.internships?.length ? p.internships.map((x) => ({ company: x.company, role: x.role, description: x.description })) : [],
  achievements: p?.achievements?.length ? p.achievements.map((x) => ({ title: x.title, description: x.description })) : [],
});

export const StudentProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const { register, control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: toFormValues(null),
  });

  const projects = useFieldArray({ control, name: "projects" });
  const certifications = useFieldArray({ control, name: "certifications" });
  const internships = useFieldArray({ control, name: "internships" });
  const achievements = useFieldArray({ control, name: "achievements" });

  useEffect(() => {
    getMyStudentProfile()
      .then((p) => {
        setProfile(p);
        reset(toFormValues(p));
      })
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const updated = await updateMyStudentProfile({
        department: values.department,
        graduationYear: Number(values.graduationYear),
        cgpa: values.cgpa !== undefined ? Number(values.cgpa) : undefined,
        activeBacklogs: Number(values.activeBacklogs),
        phone: values.phone,
        bio: values.bio,
        githubUrl: values.githubUrl || undefined,
        linkedinUrl: values.linkedinUrl || undefined,
        portfolioUrl: values.portfolioUrl || undefined,
        skills: values.skillsText
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        projects: values.projects.filter((p) => p.title),
        certifications: values.certifications.filter((c) => c.name),
        internships: values.internships.filter((i) => i.company && i.role),
        achievements: values.achievements.filter((a) => a.title),
      });
      setProfile(updated);
      toast.success("Profile saved");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const result = await uploadResume(file);
      setProfile((prev) => (prev ? { ...prev, ...result } : prev));
      toast.success("Resume uploaded");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (loading) return <Spinner label="Loading your profile" />;

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-ink">My profile</h1>
      <p className="mt-1 text-sm text-slate-muted">
        This is what recruiters and placement staff see about you.
      </p>

      {/* Resume upload */}
      <div className="card mt-6">
        <p className="label">Resume</p>
        <div className="flex items-center justify-between gap-4">
          <p className="truncate text-sm text-slate-text">
            {profile?.resumeOriginalName ?? "No resume uploaded yet"}
          </p>
          <label className="btn-ghost cursor-pointer whitespace-nowrap">
            {uploading ? "Uploading…" : "Upload PDF / DOC"}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleResumeChange}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        <div className="card space-y-4">
          <h2 className="font-display text-base font-semibold text-ink">Academics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Department</label>
              <input className="input" placeholder="Computer Science and Engineering" {...register("department", { required: true })} />
            </div>
            <div>
              <label className="label">Graduation year</label>
              <input type="number" className="input" {...register("graduationYear", { required: true })} />
            </div>
            <div>
              <label className="label">CGPA</label>
              <input type="number" step="0.01" className="input" {...register("cgpa")} />
            </div>
            <div>
              <label className="label">Active backlogs</label>
              <input type="number" className="input" {...register("activeBacklogs")} />
            </div>
          </div>
        </div>

        <div className="card space-y-4">
          <h2 className="font-display text-base font-semibold text-ink">About you</h2>
          <div>
            <label className="label">Bio</label>
            <textarea className="input" rows={3} {...register("bio")} />
          </div>
          <div>
            <label className="label">Skills (comma separated)</label>
            <input className="input" placeholder="React, Python, PyTorch, SQL" {...register("skillsText")} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="label">GitHub</label>
              <input className="input" {...register("githubUrl")} />
            </div>
            <div>
              <label className="label">LinkedIn</label>
              <input className="input" {...register("linkedinUrl")} />
            </div>
            <div>
              <label className="label">Portfolio</label>
              <input className="input" {...register("portfolioUrl")} />
            </div>
          </div>
        </div>

        <RepeatingSection
          title="Projects"
          items={projects.fields}
          onAdd={() => projects.append({ title: "", description: "", link: "" })}
          onRemove={projects.remove}
          renderFields={(index) => (
            <>
              <input className="input" placeholder="Project title" {...register(`projects.${index}.title`)} />
              <input className="input" placeholder="Link (optional)" {...register(`projects.${index}.link`)} />
              <textarea className="input col-span-2" rows={2} placeholder="Description" {...register(`projects.${index}.description`)} />
            </>
          )}
        />

        <RepeatingSection
          title="Certifications"
          items={certifications.fields}
          onAdd={() => certifications.append({ name: "", issuer: "" })}
          onRemove={certifications.remove}
          renderFields={(index) => (
            <>
              <input className="input" placeholder="Certification name" {...register(`certifications.${index}.name`)} />
              <input className="input" placeholder="Issuer" {...register(`certifications.${index}.issuer`)} />
            </>
          )}
        />

        <RepeatingSection
          title="Internships"
          items={internships.fields}
          onAdd={() => internships.append({ company: "", role: "", description: "" })}
          onRemove={internships.remove}
          renderFields={(index) => (
            <>
              <input className="input" placeholder="Company" {...register(`internships.${index}.company`)} />
              <input className="input" placeholder="Role" {...register(`internships.${index}.role`)} />
              <textarea className="input col-span-2" rows={2} placeholder="Description" {...register(`internships.${index}.description`)} />
            </>
          )}
        />

        <RepeatingSection
          title="Achievements"
          items={achievements.fields}
          onAdd={() => achievements.append({ title: "", description: "" })}
          onRemove={achievements.remove}
          renderFields={(index) => (
            <>
              <input className="input" placeholder="Achievement" {...register(`achievements.${index}.title`)} />
              <input className="input" placeholder="Detail (optional)" {...register(`achievements.${index}.description`)} />
            </>
          )}
        />

        <button type="submit" disabled={saving} className="btn-accent">
          {saving ? "Saving…" : "Save profile"}
        </button>
      </form>
    </div>
  );
};

function RepeatingSection<T extends { id: string }>({
  title,
  items,
  onAdd,
  onRemove,
  renderFields,
}: {
  title: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderFields: (index: number) => React.ReactNode;
}) {
  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-base font-semibold text-ink">{title}</h2>
        <button type="button" onClick={onAdd} className="btn-ghost !py-1 !px-2 text-sm text-brass-deep">
          + Add
        </button>
      </div>
      {items.length === 0 && (
        <p className="text-sm text-slate-muted">Nothing added yet.</p>
      )}
      {items.map((item, index) => (
        <div key={item.id} className="grid grid-cols-2 gap-3 rounded-lg border border-slate-100 p-3">
          {renderFields(index)}
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="col-span-2 justify-self-end text-xs font-semibold text-danger hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}
