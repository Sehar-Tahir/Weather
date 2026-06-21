import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
  withCredentials: true, // Add this for cookies
});

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Change from 'adminToken' to 'accessToken'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminData');
      if (!window.location.pathname.includes('/admin')) {
        window.location.href = '/admin';
      }
    }
    return Promise.reject(error);
  }
);

// ==================== AUTH API ====================
export const authApi = {
  // ✅ FIXED - Use correct backend routes
  login: (email: string, password: string, isSuper: boolean = false) => {
    const endpoint = isSuper ? '/api/admin/login/super' : '/api/admin/login';
    return api.post(endpoint, { email, password });
  },
  refresh: () => api.post('/api/admin/refresh'),
  logout: () => api.post('/api/admin/logout'),
  getMe: () => api.get('/api/admin/me'),
};

// ==================== WEATHER API ====================
export const weatherApi = {
  getWeather: (city: string) => api.get(`/api/weather?city=${encodeURIComponent(city)}`),
  getWeatherByCoords: (lat: number, lon: number) => api.get(`/api/weather/location?lat=${lat}&lon=${lon}`),
  getWeatherByZip: (zip: string, country: string = 'pk') => api.get(`/api/weather/zip?code=${zip}&country=${country}`),
  getForecast: (city: string) => api.get(`/api/weather/forecast?city=${encodeURIComponent(city)}`),
  getAirQuality: (lat: number, lon: number) => api.get(`/api/weather/air?lat=${lat}&lon=${lon}`),
};

// ==================== STORY API ====================
export const storyApi = {
  getAll: () => api.get('/api/content/stories'),
  getById: (id: string) => api.get(`/api/content/stories/${id}`),
  create: (data: any) => api.post('/api/content/stories', data),
  update: (id: string, data: any) => api.put(`/api/content/stories/${id}`, data),
  delete: (id: string) => api.delete(`/api/content/stories/${id}`),
};

// ==================== BLOG API ====================
export const blogApi = {
  getAll: () => api.get('/api/content/blogs'),
  getById: (id: string) => api.get(`/api/content/blogs/${id}`),
  create: (data: any) => api.post('/api/content/blogs', data),
  update: (id: string, data: any) => api.put(`/api/content/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/api/content/blogs/${id}`),
};

// ==================== ADMIN API ====================
export const adminApi = {
  getAll: () => api.get('/api/admin/all'),
  getById: (id: string) => api.get(`/api/admin/${id}`),
  create: (data: any) => api.post('/api/admin/create', data),
  update: (id: string, data: any) => api.put(`/api/admin/${id}`, data),
  delete: (id: string) => api.delete(`/api/admin/${id}`),
  changePassword: (data: any) => api.post('/api/admin/change-password', data),
};

// ==================== UPLOAD API ====================
export const uploadApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/upload-pc', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadUrl: (url: string, type?: string) => api.post('/api/upload-url', { url, type }),
};

export const USE_MOCK = false;
export default api;