import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from '../utils/auth';
import { toast } from '../utils/toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  withCredentials: true,     // still OK if you need cookies elsewhere
});

// Attach JWT to every outgoing request
api.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Refresh-token retry
api.interceptors.response.use(
  res => res,
  async err => {
    const orig = err.config;
    if (
      err.response?.status === 401 &&
      !orig._retry &&
      getRefreshToken()
    ) {
      orig._retry = true;
      try {
        const { data } = await axios.post(
          `${api.defaults.baseURL}/auth/refresh-token`,
          { refreshToken: getRefreshToken() }
        );
        // Save and re-attach the _new_ tokens
        saveTokens(data.accessToken, data.refreshToken);
        orig.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(orig);
      } catch (refreshErr) {
        clearTokens();
        window.location.replace('/login');
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(err);
  }
);

// Global error → toast
api.interceptors.response.use(
  res => res,
  err => {
    if (err?.config?.skipToast) {
      return Promise.reject(err);
    }
    const msg =
      err.response?.data?.message ||
      err.response?.data?.errorMessage ||
      err.message ||
      'Unexpected error';
    toast(msg, 'error');
    return Promise.reject(err);
  }
);

export default api;
