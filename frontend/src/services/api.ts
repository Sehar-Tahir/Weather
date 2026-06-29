// ============================================================
// WEATHERVERSE — API Service
// ============================================================

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000, // ✅ INCREASED from 7000 to 30000 (30 seconds)
  withCredentials: true,
});

// ── Request interceptor ─────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ──────────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(`${API_BASE}/api/admin/refresh`, {}, {
          withCredentials: true,
        });
        if (response.data.success) {
          localStorage.setItem('accessToken', response.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('adminData');
        if (!window.location.pathname.includes('/admin')) {
          window.location.href = '/admin';
        }
      }
    }

    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authApi = {
  login: (email: string, password: string, isSuper: boolean = false) => {
    const endpoint = isSuper ? '/api/admin/login/super' : '/api/admin/login';
    return api.post(endpoint, { email, password });
  },
  refresh: () => api.post('/api/admin/refresh'),
  logout: () => api.post('/api/admin/logout'),
  getMe: () => api.get('/api/admin/me'),
  getAll: () => api.get('/api/admin/all'), // ✅ ADDED - for fetching all admins
  create: (data: any) => api.post('/api/admin/create', data), // ✅ ADDED
  update: (id: string, data: any) => api.put(`/api/admin/${id}`, data), // ✅ ADDED
  delete: (id: string) => api.delete(`/api/admin/${id}`), // ✅ ADDED
  changePassword: (data: any) => api.post('/api/admin/change-password', data),
};

// ==================== WEATHER API ====================
export const weatherApi = {
  getWeather: (city: string) => api.get(`/api/weather?city=${encodeURIComponent(city)}`),
  getWeatherByCoords: (lat: number, lon: number) =>
    api.get(`/api/weather/location?lat=${lat}&lon=${lon}`),
  getWeatherByZip: (zip: string, country: string = 'pk') =>
    api.get(`/api/weather/zip?code=${zip}&country=${country}`),
  getForecast: (city: string) => api.get(`/api/weather/forecast?city=${encodeURIComponent(city)}`),
  getAirQuality: (lat: number, lon: number) =>
    api.get(`/api/weather/air?lat=${lat}&lon=${lon}`),
};

// ==================== CONTENT API ====================
export const storyApi = {
  getAll: (params?: any) => api.get('/api/content/stories', { params }),
  getById: (id: string) => api.get(`/api/content/stories/${id}`),
  create: (data: any) => api.post('/api/content/stories', data),
  update: (id: string, data: any) => api.put(`/api/content/stories/${id}`, data),
  delete: (id: string) => api.delete(`/api/content/stories/${id}`),
};

export const blogApi = {
  getAll: (params?: any) => api.get('/api/content/blogs', { params }),
  getById: (id: string) => api.get(`/api/content/blogs/${id}`),
  create: (data: any) => api.post('/api/content/blogs', data),
  update: (id: string, data: any) => api.put(`/api/content/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/api/content/blogs/${id}`),
};

// ==================== UPLOAD API ====================
// ✅ CREATE A SEPARATE INSTANCE FOR UPLOADS WITH LONGER TIMEOUT
export const uploadApiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 120000, // 2 minutes for large files
  withCredentials: true,
});

// Add auth interceptor to upload client
uploadApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const uploadApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return uploadApiClient.post('/api/upload-pc', formData);
  },
  uploadMultiple: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    return uploadApiClient.post('/api/upload-multiple', formData);
  },
  uploadByUrl: (url: string, type?: string) => api.post('/api/upload-url', { url, type }),
  delete: (publicId: string) => api.delete(`/api/upload/${publicId}`),
};

// ==================== CONTACT API ====================
export const contactApi = {
  submit: (data: any) => api.post('/api/contact', data),
  getAll: () => api.get('/api/contact'),
  getById: (id: string) => api.get(`/api/contact/${id}`), // ✅ ADDED
  updateStatus: (id: string, status: string) => 
    api.patch(`/api/contact/${id}/status`, { status }),
  delete: (id: string) => api.delete(`/api/contact/${id}`),
};

export const USE_MOCK = false;
export default api;