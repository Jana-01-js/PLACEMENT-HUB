import { api } from "./client";
import { StudentProfile } from "./types";

export const getMyStudentProfile = async (): Promise<StudentProfile | null> => {
  const { data } = await api.get("/students/me");
  return data.data as StudentProfile | null;
};

export const updateMyStudentProfile = async (payload: Partial<StudentProfile>) => {
  const { data } = await api.patch("/students/me", payload);
  return data.data as StudentProfile;
};

export const uploadResume = async (file: File) => {
  const form = new FormData();
  form.append("resume", file);
  const { data } = await api.post("/students/me/resume", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data.data as { resumeUrl: string; resumeOriginalName: string };
};

export interface StudentFilters {
  department?: string;
  graduationYear?: number;
  minCgpa?: number;
  skill?: string;
  page?: number;
}

export const listStudents = async (filters: StudentFilters = {}) => {
  const { data } = await api.get("/students", { params: filters });
  return data.data as {
    students: StudentProfile[];
    pagination: { totalPages: number; page: number };
  };
};
