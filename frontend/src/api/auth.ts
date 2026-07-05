import { api, setAccessToken } from "./client";
import { Role, User } from "./types";

interface AuthResponse {
  data: { accessToken: string; user: User };
}

export const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role: Role;
}) => {
  const { data } = await api.post<AuthResponse>("/auth/register", payload);
  setAccessToken(data.data.accessToken);
  return data.data.user;
};

export const loginUser = async (payload: { email: string; password: string }) => {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  setAccessToken(data.data.accessToken);
  return data.data.user;
};

export const logoutUser = async () => {
  await api.post("/auth/logout");
  setAccessToken(null);
};

export const fetchMe = async (): Promise<User> => {
  const { data } = await api.get<{ data: User }>("/auth/me");
  return data.data;
};
