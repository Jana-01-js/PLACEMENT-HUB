import { api } from "./client";
import { Company } from "./types";

export const getMyCompany = async (): Promise<Company | null> => {
  try {
    const { data } = await api.get("/companies/me/profile");
    return data.data as Company;
  } catch {
    return null;
  }
};

export const createCompany = async (payload: Partial<Company>) => {
  const { data } = await api.post("/companies", payload);
  return data.data as Company;
};

export const updateMyCompany = async (payload: Partial<Company>) => {
  const { data } = await api.patch("/companies/me/profile", payload);
  return data.data as Company;
};

export const getCompany = async (id: string) => {
  const { data } = await api.get(`/companies/${id}`);
  return data.data as Company;
};
