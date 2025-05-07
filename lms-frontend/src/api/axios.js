// src/api/axios.js
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../utils/auth";

// create your API client
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  withCredentials: true,
});

// attach the latest Access token on every request
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// on 401, try refreshing once, then retry original request
api.interceptors.response.use(
  res => res,
  async (err) => {
    const originalRequest = err.config;
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      getRefreshToken()
    ) {
      originalRequest._retry = true;
      try {
        // call your refresh endpoint (no interceptor on this one)
        const { data } = await axios.post(
          `${api.defaults.baseURL}/api/auth/refresh-token`,
          { refreshToken: getRefreshToken() }
        );
        // save the brand‐new pair
        saveTokens(data.accessToken, data.refreshToken);
        // update the header on the original request
        originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
        // retry
        return api(originalRequest);
      } catch (refreshErr) {
        // if refresh also fails, logout
        clearTokens();
        window.location.replace("/"); 
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
