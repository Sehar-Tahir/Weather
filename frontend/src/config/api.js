// src/config/api.js
// export const API_BASE_URL = 'http://localhost:5000/api';
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;

export const API_ENDPOINTS = {
  // Auth
  ADMIN_LOGIN: '/admin/login',
  ADMIN_SUPER_LOGIN: '/admin/login/super',
  ADMIN_ME: '/admin/me',
  ADMIN_ALL: '/admin/all',
  ADMIN_CREATE: '/admin/create',
  ADMIN_UPDATE: (id) => `/admin/${id}`,
  ADMIN_DELETE: (id) => `/admin/${id}`,
  
  // Content
  STORIES: '/content/stories',
  STORY: (id) => `/content/stories/${id}`,
  BLOGS: '/content/blogs',
  BLOG: (id) => `/content/blogs/${id}`,
  
  // Upload
  UPLOAD_PC: '/upload-pc',
  UPLOAD_URL: '/upload-url',
  
  // Weather
  WEATHER: '/weather',
  WEATHER_ZIP: '/weather/zip',
  WEATHER_LOCATION: '/weather/location',
  FORECAST: '/weather/forecast',
  AIR_QUALITY: '/weather/air',
  HISTORY: '/weather/history',
};