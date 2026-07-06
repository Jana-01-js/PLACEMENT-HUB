import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getMyCompany, createCompany, updateMyCompany } from "@/api/companies";
import { Company } from "@/api/types";
import { getErrorMessage } from "@/api/client";
import { Spinner } from "@/components/Spinner";

interface FormValues {
  name: string;
  description?: string;
  website?: string;
  industry?: string;
  location?: string;
  size?: string;
}

export const CompanyProfilePage = () => {
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm<FormValues>();

  useEffect(() => {
    getMyCompany()
      .then((c) => {
        setCompany(c);
        if (c) reset(c);
      })
      .finally(() => setLoading(false));
  }, [reset]);

  const onSubmit = async (values: FormValues) => {
    setSaving(true);
    try {
      const saved = company
        ? await updateMyCompany(values)
        : await createCompany(values);
      setCompany(saved);
      toast.success("Company profile saved");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading company profile" />;

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Company profile</h1>
      <p className="mt-1 text-sm text-slate-muted">
        This is what students see when they view your job postings.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="card mt-6 space-y-4">
        <div>
          <label className="label">Company name</label>
          <input className="input" {...register("name", { required: true })} />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input" rows={3} {...register("description")} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Website</label>
            <input className="input" placeholder="https://" {...register("website")} />
          </div>
          <div>
            <label className="label">Industry</label>
            <input className="input" {...register("industry")} />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" {...register("location")} />
          </div>
          <div>
            <label className="label">Company size</label>
            <select className="input" {...register("size")}>
              <option value="">Select</option>
              <option value="1-50">1–50</option>
              <option value="51-200">51–200</option>
              <option value="201-500">201–500</option>
              <option value="100-500">100–500</option>
              <option value="501-1000">501–1000</option>
              <option value="1000+">1000+</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn-accent">
          {saving ? "Saving…" : company ? "Save changes" : "Create profile"}
        </button>
      </form>
    </div>
  );
};
