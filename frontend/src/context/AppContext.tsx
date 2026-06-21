// src/context/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// const API_URL = 'http://localhost:5000';
// const API_URL = import.meta.env.VITE_API_URL || 'https://karachiweather-backend-1.onrender.com';
const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api`;


interface AppContextType {
  currentAdmin: any;
  isLoggedIn: boolean;
  token: string | null;
  stories: any[];
  blogs: any[];
  admins: any[];
  recentSearches: any[];
  loading: boolean;
  login: (email: string, password: string, isSuper?: boolean) => Promise<boolean>;
  logout: () => void;
  createAdmin: (data: any) => Promise<boolean>;
  updateAdmin: (id: string, data: any) => Promise<boolean>;
  deleteAdmin: (id: string) => Promise<boolean>;
  uploadFile: (file: File) => Promise<any>;
  uploadByUrl: (url: string, type?: string) => Promise<any>;
  addStory: (data: any) => Promise<boolean>;
  updateStory: (id: string, data: any) => Promise<boolean>;
  deleteStory: (id: string) => Promise<boolean>;
  addBlog: (data: any) => Promise<boolean>;
  updateBlog: (id: string, data: any) => Promise<boolean>;
  deleteBlog: (id: string) => Promise<boolean>;
  addRecent: (search: any) => void;
  clearRecent: () => void;
  refreshStories: () => Promise<void>;
  refreshBlogs: () => Promise<void>;
  refreshAdmins: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('accessToken');
  });
  const [stories, setStories] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<any[]>(() => {
    const saved = localStorage.getItem('recent_searches');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Helper function to get auth headers
  const getAuthHeaders = useCallback(() => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }), [token]);

  // Helper for FormData uploads
  const getUploadHeaders = useCallback(() => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    }
  }), [token]);

  // Load admin data
  const loadAdminData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      console.log('🔄 Loading admin data...');

      const response = await axios.get(`${API_URL}/api/admin/me`, getAuthHeaders());

      if (response.data.success) {
        setCurrentAdmin(response.data.data);
        setIsLoggedIn(true);

        // Load stories and blogs in parallel
        const [storiesRes, blogsRes] = await Promise.all([
          axios.get(`${API_URL}/api/content/stories`, getAuthHeaders()),
          axios.get(`${API_URL}/api/content/blogs`, getAuthHeaders())
        ]);

        setStories(storiesRes.data.data || []);
        setBlogs(blogsRes.data.data || []);

        // Load admins only if superadmin
        if (response.data.data?.role === 'superadmin') {
          try {
            const adminsRes = await axios.get(`${API_URL}/api/admin/all`, getAuthHeaders());
            setAdmins(adminsRes.data.data || []);
          } catch (err) {
            console.error('Failed to load admins:', err);
          }
        }
      }
    } catch (error: any) {
      console.error('Failed to load admin data:', error);
      if (error.response?.status === 401) {
        // Token expired or invalid
        localStorage.removeItem('accessToken');
        localStorage.removeItem('adminData');
        setToken(null);
        setCurrentAdmin(null);
        setIsLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  }, [token, getAuthHeaders]);

  // Auto-load admin data when token changes
  useEffect(() => {
    if (token && !currentAdmin) {
      loadAdminData();
    }
  }, [token, currentAdmin, loadAdminData]);

  // Login
  const login = async (email: string, password: string, isSuper: boolean = false) => {
    setLoading(true);
    try {
      const endpoint = isSuper ? '/api/admin/login/super' : '/api/admin/login';
      const response = await axios.post(`${API_URL}${endpoint}`, { email, password });

      console.log('🔐 Login response:', response.data);

      if (response.data.success) {
        const { accessToken, admin } = response.data;
        
        // Store tokens
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('adminData', JSON.stringify(admin));
        
        // Update state
        setToken(accessToken);
        setCurrentAdmin(admin);
        setIsLoggedIn(true);
        
        // Load full data
        await loadAdminData();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('adminData');
    setToken(null);
    setCurrentAdmin(null);
    setIsLoggedIn(false);
    setStories([]);
    setBlogs([]);
    setAdmins([]);
  }, []);

  // Refresh functions
  const refreshStories = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/api/content/stories`, getAuthHeaders());
      setStories(response.data.data || []);
    } catch (error) {
      console.error('Failed to refresh stories:', error);
      throw error;
    }
  }, [token, getAuthHeaders]);

  const refreshBlogs = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${API_URL}/api/content/blogs`, getAuthHeaders());
      setBlogs(response.data.data || []);
    } catch (error) {
      console.error('Failed to refresh blogs:', error);
      throw error;
    }
  }, [token, getAuthHeaders]);

  const refreshAdmins = useCallback(async () => {
    if (!token || currentAdmin?.role !== 'superadmin') return;
    try {
      const response = await axios.get(`${API_URL}/api/admin/all`, getAuthHeaders());
      setAdmins(response.data.data || []);
    } catch (error) {
      console.error('Failed to refresh admins:', error);
      throw error;
    }
  }, [token, currentAdmin, getAuthHeaders]);

  // Recent searches
  const addRecent = useCallback((search: any) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.city !== search.city);
      const updated = [search, ...filtered].slice(0, 8);
      localStorage.setItem('recent_searches', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearRecent = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recent_searches');
  }, []);

  // ============================================================
  // STORY CRUD
  // ============================================================
  const addStory = useCallback(async (storyData: any) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await axios.post(`${API_URL}/api/content/stories`, storyData, getAuthHeaders());
      if (response.data.success) {
        setStories(prev => [response.data.data, ...prev]);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Add story error:', error.response?.data || error);
      throw error;
    }
  }, [token, getAuthHeaders]);

  const updateStory = useCallback(async (id: string, data: any) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await axios.put(`${API_URL}/api/content/stories/${id}`, data, getAuthHeaders());
      if (response.data.success) {
        setStories(prev => prev.map(s => s._id === id ? response.data.data : s));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Update story error:', error);
      throw error;
    }
  }, [token, getAuthHeaders]);

  const deleteStory = useCallback(async (id: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await axios.delete(`${API_URL}/api/content/stories/${id}`, getAuthHeaders());
      if (response.data.success) {
        setStories(prev => prev.filter(s => s._id !== id));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Delete story error:', error);
      throw error;
    }
  }, [token, getAuthHeaders]);

  // ============================================================
  // BLOG CRUD
  // ============================================================
  const addBlog = useCallback(async (blogData: any) => {
    if (!token) throw new Error('Not authenticated');
    try {
      console.log('📝 Adding blog...');
      const response = await axios.post(`${API_URL}/api/content/blogs`, blogData, getAuthHeaders());
      console.log('✅ Blog added:', response.data);
      if (response.data.success) {
        setBlogs(prev => [response.data.data, ...prev]);
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Add blog error:', error.response?.data || error);
      throw error;
    }
  }, [token, getAuthHeaders]);

  const updateBlog = useCallback(async (id: string, data: any) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await axios.put(`${API_URL}/api/content/blogs/${id}`, data, getAuthHeaders());
      if (response.data.success) {
        setBlogs(prev => prev.map(b => b._id === id ? response.data.data : b));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Update blog error:', error);
      throw error;
    }
  }, [token, getAuthHeaders]);

  const deleteBlog = useCallback(async (id: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await axios.delete(`${API_URL}/api/content/blogs/${id}`, getAuthHeaders());
      if (response.data.success) {
        setBlogs(prev => prev.filter(b => b._id !== id));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Delete blog error:', error);
      throw error;
    }
  }, [token, getAuthHeaders]);

  // ============================================================
  // ADMIN MANAGEMENT
  // ============================================================
  const createAdmin = useCallback(async (adminData: any) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await axios.post(`${API_URL}/api/admin/create`, adminData, getAuthHeaders());
      if (response.data.success) {
        await refreshAdmins();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Create admin error:', error);
      throw error;
    }
  }, [token, getAuthHeaders, refreshAdmins]);

  const updateAdmin = useCallback(async (id: string, data: any) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await axios.put(`${API_URL}/api/admin/${id}`, data, getAuthHeaders());
      if (response.data.success) {
        await refreshAdmins();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Update admin error:', error);
      throw error;
    }
  }, [token, getAuthHeaders, refreshAdmins]);

  const deleteAdmin = useCallback(async (id: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await axios.delete(`${API_URL}/api/admin/${id}`, getAuthHeaders());
      if (response.data.success) {
        await refreshAdmins();
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Delete admin error:', error);
      throw error;
    }
  }, [token, getAuthHeaders, refreshAdmins]);

  // ============================================================
  // UPLOAD FUNCTIONS
  // ============================================================
  const uploadFile = useCallback(async (file: File) => {
    if (!token) throw new Error('Not authenticated');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${API_URL}/api/upload-pc`, formData, getUploadHeaders());
      return response.data.data;
    } catch (error: any) {
      console.error('Upload error:', error);
      throw error;
    }
  }, [token, getUploadHeaders]);

  const uploadByUrl = useCallback(async (url: string, type?: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await axios.post(`${API_URL}/api/upload-url`, { url, type }, getAuthHeaders());
      return response.data.data;
    } catch (error: any) {
      console.error('URL upload error:', error);
      throw error;
    }
  }, [token, getAuthHeaders]);

  // ============================================================
  // CONTEXT VALUE
  // ============================================================
  const value = {
    currentAdmin,
    isLoggedIn,
    token,
    stories,
    blogs,
    admins,
    recentSearches,
    loading,
    login,
    logout,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    uploadFile,
    uploadByUrl,
    addStory,
    updateStory,
    deleteStory,
    addBlog,
    updateBlog,
    deleteBlog,
    addRecent,
    clearRecent,
    refreshStories,
    refreshBlogs,
    refreshAdmins,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};