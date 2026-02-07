import axios, { type InternalAxiosRequestConfig } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearTokens,
} from "./auth-token";

type RequestConfigWithRetry = InternalAxiosRequestConfig & { _retry?: boolean };

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "https://api.otcayxe.com";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

function processQueue(error: unknown, newAccessToken: string | null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(newAccessToken);
    }
  });
  failedQueue = [];
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: { response?: { status?: number }; config?: RequestConfigWithRetry }) => {
    const originalRequest = error.config as RequestConfigWithRetry | undefined;
    if (!originalRequest) return Promise.reject(error);

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      if (typeof window !== "undefined") {
        const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?callbackUrl=${callbackUrl}`;
      }
      processQueue(error, null);
      isRefreshing = false;
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post<{
        accessToken?: string;
        access_token?: string;
      }>(
        `${BASE_URL}/auth/refresh`,
        { refreshToken, refresh_token: refreshToken },
        { withCredentials: true }
      );
      const newAccessToken = data?.accessToken ?? data?.access_token;
      if (newAccessToken) {
        setAccessToken(newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);
        return api(originalRequest);
      }
      throw new Error("No accessToken in refresh response");
    } catch (refreshError) {
      processQueue(refreshError as Error, null);
      clearTokens();
      if (typeof window !== "undefined") {
        const callbackUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?callbackUrl=${callbackUrl}`;
      }
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);
