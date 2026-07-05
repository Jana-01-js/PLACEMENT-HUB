import { api } from "./client";
import { Job, JobStatus } from "./types";

export interface JobFilters {
  jobType?: string;
  workMode?: string;
  department?: string;
  search?: string;
  page?: number;
}

export const listJobs = async (filters: JobFilters = {}) => {
  const { data } = await api.get("/jobs", { params: filters });
  return data.data as { jobs: Job[]; pagination: { totalPages: number; page: number } };
};

export const getJob = async (id: string) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data.data as Job;
};

export const getMyJobs = async (status?: JobStatus) => {
  const { data } = await api.get("/jobs/mine", { params: { status } });
  return data.data as Job[];
};

export const createJob = async (payload: Partial<Job>) => {
  const { data } = await api.post("/jobs", payload);
  return data.data as Job;
};

export const updateJob = async (id: string, payload: Partial<Job>) => {
  const { data } = await api.patch(`/jobs/${id}`, payload);
  return data.data as Job;
};

export const deleteJob = async (id: string) => {
  await api.delete(`/jobs/${id}`);
};

export const closeJob = async (id: string) => {
  const { data } = await api.patch(`/jobs/${id}/close`);
  return data.data as Job;
};

export const getPendingJobs = async () => {
  const { data } = await api.get("/jobs/pending");
  return data.data as Job[];
};

export const approveJob = async (id: string) => {
  const { data } = await api.patch(`/jobs/${id}/approve`);
  return data.data as Job;
};

export const rejectJob = async (id: string, reason: string) => {
  const { data } = await api.patch(`/jobs/${id}/reject`, { reason });
  return data.data as Job;
};

export const checkEligibility = async (jobId: string) => {
  const { data } = await api.get(`/students/me/eligibility/${jobId}`);
  return data.data as { eligible: boolean; reasons: string[] };
};
