import axios from 'axios';
import toast from 'react-hot-toast';

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  timeout: 30000,
});

let isRefreshing = false;
let failedQueue = [];

function processQueue(error, token = null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
}

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return client(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        isRefreshing = false;
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL || ''}/api/auth/refresh`, { refreshToken });
        const newToken = data.data.accessToken;
        localStorage.setItem('accessToken', newToken);
        if (data.data.refreshToken) {
          localStorage.setItem('refreshToken', data.data.refreshToken);
        }
        processQueue(null, newToken);
        original.headers.Authorization = `Bearer ${newToken}`;
        return client(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Network errors (no response)
    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        toast.error('Request timed out. Please try again.');
      } else {
        toast.error('Network error. Please check your connection.');
      }
    }

    return Promise.reject(error);
  }
);

export default client;
