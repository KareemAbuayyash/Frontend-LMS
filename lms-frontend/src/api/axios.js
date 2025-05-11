// src/api/axios.js
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../utils/auth";
import { toast } from "../utils/toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  withCredentials: true,
});

/* ──────────────────────────────────────────────────────────────
   Attach JWT to every outgoing request
   ──────────────────────────────────────────────────────────── */
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ──────────────────────────────────────────────────────────────
   Refresh-token retry (unchanged)
   ──────────────────────────────────────────────────────────── */
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (
      err.response?.status === 401 &&
      !original._retry &&
      getRefreshToken()
    ) {
      original._retry = true;
      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          { refreshToken: getRefreshToken() }
        );
        saveTokens(data.accessToken, data.refreshToken);
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        clearTokens();
        localStorage.removeItem("username");
        window.location.replace("/login");
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err); // bubble up to the next interceptor
  }
);

/* ──────────────────────────────────────────────────────────────
   Generic catch-all: show a toast unless { skipToast: true }
   ──────────────────────────────────────────────────────────── */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    /* caller opted-out? */
    if (err?.config?.skipToast) {
      return Promise.reject(err);
    }

    const msg =
      err.response?.data?.message ??
      err.response?.data?.errorMessage ??
      err.message ??
      "Unexpected error";

    toast(msg, "error");
    return Promise.reject(err);
  }
);

export default api;
