// ============================================================
// WEATHERVERSE — App Context
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, storyApi, blogApi, uploadApi, contactApi } from '../services/api';

interface AppContextType {
  currentAdmin: any;
  isLoggedIn: boolean;
  token: string | null;
  stories: any[];
  blogs: any[];
  admins: any[];
  contacts: any[];
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
  refreshContacts: () => Promise<void>;
  updateContactStatus: (id: string, status: string) => Promise<void>;
  deleteContact: (id: string) => Promise<void>;
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
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessToken'));
  const [stories, setStories] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<any[]>(() => {
    const saved = localStorage.getItem('recent_searches');
    return saved ? JSON.parse(saved) : [];
  });

  // ── Load admin data ──────────────────────────────────────
  const loadAdminData = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await authApi.getMe();

      if (response.data.success) {
        setCurrentAdmin(response.data.data);
        setIsLoggedIn(true);

        // Load stories, blogs, and contacts in parallel
        const [storiesRes, blogsRes, contactsRes] = await Promise.all([
          storyApi.getAll().catch(() => ({ data: { data: [] } })),
          blogApi.getAll().catch(() => ({ data: { data: [] } })),
          contactApi.getAll().catch(() => ({ data: { data: [] } })),
        ]);

        setStories(storiesRes.data.data || []);
        setBlogs(blogsRes.data.data || []);
        setContacts(contactsRes.data.data || []);

        // Load admins only if superadmin
        if (response.data.data?.role === 'superadmin') {
          try {
            const adminsRes = await authApi.getAll();
            setAdmins(adminsRes.data.data || []);
          } catch (err) {
            console.error('Failed to load admins:', err);
          }
        }
      }
    } catch (error: any) {
      console.error('Failed to load admin data:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('adminData');
        setToken(null);
        setCurrentAdmin(null);
        setIsLoggedIn(false);
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ── Auto-load admin data ────────────────────────────────
  useEffect(() => {
    if (token && !currentAdmin) {
      loadAdminData();
    }
  }, [token, currentAdmin, loadAdminData]);

  // ── Login ────────────────────────────────────────────────
  const login = async (email: string, password: string, isSuper: boolean = false) => {
    setLoading(true);
    try {
      const response = await authApi.login(email, password, isSuper);

      if (response.data.success) {
        const { accessToken, admin } = response.data;

        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('adminData', JSON.stringify(admin));

        setToken(accessToken);
        setCurrentAdmin(admin);
        setIsLoggedIn(true);

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

  // ── Logout ────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('adminData');
      setToken(null);
      setCurrentAdmin(null);
      setIsLoggedIn(false);
      setStories([]);
      setBlogs([]);
      setAdmins([]);
      setContacts([]);
    }
  }, []);

  // ── ✅ FIXED: Refresh Stories (PUBLIC - No auth required) ──
  const refreshStories = useCallback(async () => {
    try {
      console.log('🔄 Fetching stories (public)...');
      const response = await storyApi.getAll();
      console.log('✅ Stories fetched:', response.data.data?.length || 0);
      setStories(response.data.data || []);
    } catch (error: any) {
      console.error('Failed to refresh stories:', error);
      // Don't throw, just set empty array
      setStories([]);
    }
  }, []);

  // ── ✅ FIXED: Refresh Blogs (PUBLIC - No auth required) ──
  const refreshBlogs = useCallback(async () => {
    try {
      console.log('🔄 Fetching blogs (public)...');
      const response = await blogApi.getAll();
      console.log('✅ Blogs fetched:', response.data.data?.length || 0);
      setBlogs(response.data.data || []);
    } catch (error: any) {
      console.error('Failed to refresh blogs:', error);
      // Don't throw, just set empty array
      setBlogs([]);
    }
  }, []);

  // ── Refresh Admins (Protected) ──────────────────────────
  const refreshAdmins = useCallback(async () => {
    if (!token || currentAdmin?.role !== 'superadmin') return;
    try {
      const response = await authApi.getAll();
      setAdmins(response.data.data || []);
    } catch (error) {
      console.error('Failed to refresh admins:', error);
      throw error;
    }
  }, [token, currentAdmin]);

  // ── Refresh Contacts (Protected) ────────────────────────
  const refreshContacts = useCallback(async () => {
    if (!token) {
      console.log('No token, skipping contacts fetch');
      return;
    }
    try {
      console.log('🔄 Fetching contacts...');
      const response = await contactApi.getAll();
      console.log('✅ Contacts fetched:', response.data);
      setContacts(response.data.data || []);
    } catch (error: any) {
      console.error('Failed to refresh contacts:', error);
      if (error.response?.status === 401) {
        console.log('Unauthorized - token may be expired');
      }
    }
  }, [token]);

  // ── Update Contact Status ───────────────────────────────
  const updateContactStatus = useCallback(async (id: string, status: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await contactApi.updateStatus(id, status);
      if (response.data.success) {
        setContacts(prev => 
          prev.map(c => c._id === id ? { ...c, status } : c)
        );
      }
    } catch (error) {
      console.error('Failed to update contact status:', error);
      throw error;
    }
  }, [token]);

  // ── Delete Contact ──────────────────────────────────────
  const deleteContact = useCallback(async (id: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await contactApi.delete(id);
      if (response.data.success) {
        setContacts(prev => prev.filter(c => c._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete contact:', error);
      throw error;
    }
  }, [token]);

  // ── Recent searches ──────────────────────────────────────
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

  // ── Story CRUD ──────────────────────────────────────────
  const addStory = useCallback(async (storyData: any) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await storyApi.create(storyData);
      if (response.data.success) {
        setStories(prev => [response.data.data, ...prev]);
        // ✅ Refresh stories after adding
        await refreshStories();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Add story error:', error);
      throw error;
    }
  }, [token, refreshStories]);

  const updateStory = useCallback(async (id: string, data: any) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await storyApi.update(id, data);
      if (response.data.success) {
        setStories(prev => prev.map(s => s._id === id ? response.data.data : s));
        await refreshStories();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update story error:', error);
      throw error;
    }
  }, [token, refreshStories]);

  const deleteStory = useCallback(async (id: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await storyApi.delete(id);
      if (response.data.success) {
        setStories(prev => prev.filter(s => s._id !== id));
        await refreshStories();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Delete story error:', error);
      throw error;
    }
  }, [token, refreshStories]);

  // ── Blog CRUD ────────────────────────────────────────────
  const addBlog = useCallback(async (blogData: any) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await blogApi.create(blogData);
      if (response.data.success) {
        setBlogs(prev => [response.data.data, ...prev]);
        // ✅ Refresh blogs after adding
        await refreshBlogs();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Add blog error:', error);
      throw error;
    }
  }, [token, refreshBlogs]);

  const updateBlog = useCallback(async (id: string, data: any) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await blogApi.update(id, data);
      if (response.data.success) {
        setBlogs(prev => prev.map(b => b._id === id ? response.data.data : b));
        await refreshBlogs();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update blog error:', error);
      throw error;
    }
  }, [token, refreshBlogs]);

  const deleteBlog = useCallback(async (id: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await blogApi.delete(id);
      if (response.data.success) {
        setBlogs(prev => prev.filter(b => b._id !== id));
        await refreshBlogs();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Delete blog error:', error);
      throw error;
    }
  }, [token, refreshBlogs]);

  // ── Admin management ──────────────────────────────────────
  const createAdmin = useCallback(async (adminData: any) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await authApi.create(adminData);
      if (response.data.success) {
        await refreshAdmins();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Create admin error:', error);
      throw error;
    }
  }, [token, refreshAdmins]);

  const updateAdmin = useCallback(async (id: string, data: any) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await authApi.update(id, data);
      if (response.data.success) {
        await refreshAdmins();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update admin error:', error);
      throw error;
    }
  }, [token, refreshAdmins]);

  const deleteAdmin = useCallback(async (id: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await authApi.delete(id);
      if (response.data.success) {
        await refreshAdmins();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Delete admin error:', error);
      throw error;
    }
  }, [token, refreshAdmins]);

  // ── Upload functions ──────────────────────────────────────
  const uploadFile = useCallback(async (file: File) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await uploadApi.upload(file);
      return response.data.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }, [token]);

  const uploadByUrl = useCallback(async (url: string, type?: string) => {
    if (!token) throw new Error('Not authenticated');
    try {
      const response = await uploadApi.uploadByUrl(url, type);
      return response.data.data;
    } catch (error) {
      console.error('URL upload error:', error);
      throw error;
    }
  }, [token]);

  // ── Context value ────────────────────────────────────────
  const value: AppContextType = {
    currentAdmin,
    isLoggedIn,
    token,
    stories,
    blogs,
    admins,
    contacts,
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
    refreshContacts,
    updateContactStatus,
    deleteContact,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};