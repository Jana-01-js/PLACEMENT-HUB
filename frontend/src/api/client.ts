import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

// The access token lives in memory only (never localStorage) — the refresh
// token is an httpOnly cookie the backend already sets, so a page reload
// re-authenticates silently via /api/auth/refresh rather than reading any
// browser storage.
let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const getAccessToken = () => accessToken;

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true, // send the refresh-token cookie
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const { data } = await axios.post(
      "/api/auth/refresh",
      {},
      { withCredentials: true }
    );
    const token = data?.data?.accessToken as string;
    setAccessToken(token);
    return token;
  } catch {
    setAccessToken(null);
    return null;
  }
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retried?: boolean;
    };

    const isAuthRoute = original?.url?.includes("/auth/");

    if (
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      !isAuthRoute
    ) {
      original._retried = true;
      refreshPromise = refreshPromise ?? refreshAccessToken();
      const token = await refreshPromise;
      refreshPromise = null;

      if (token) {
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }

    return Promise.reject(error);
  }
);

export const tryRestoreSession = refreshAccessToken;

// Normalizes Axios/API errors into a single human-readable string so every
// page can show one consistent message instead of reaching into response
// shapes individually.
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string })?.message ||
      "Something went wrong. Please try again."
    );
  }
  return "Something went wrong. Please try again.";
};
