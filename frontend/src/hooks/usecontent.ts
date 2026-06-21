import { useState, useEffect, useCallback } from 'react';
import { storyApi, blogApi } from '../services/weatherService';

interface ContentState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

export function useContent<T>(type: 'stories' | 'blogs') {
  const [state, setState] = useState<ContentState<T>>({
    items: [],
    loading: true,
    error: null,
  });

  const fetchItems = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const api = type === 'stories' ? storyApi : blogApi;
      const response = await api.getAll();
      const items = response.data.data || response.data;
      setState({ items: Array.isArray(items) ? items : [], loading: false, error: null });
    } catch (error: any) {
      console.error(`Failed to fetch ${type}:`, error);
      setState({ items: [], loading: false, error: error.response?.data?.error || error.message });
    }
  }, [type]);

  const createItem = useCallback(async (data: any) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const api = type === 'stories' ? storyApi : blogApi;
      const response = await api.create(data);
      const newItem = response.data.data || response.data;
      setState(prev => ({ ...prev, items: [newItem, ...prev.items], loading: false }));
      return newItem;
    } catch (error: any) {
      console.error(`Failed to create ${type}:`, error);
      setState(prev => ({ ...prev, loading: false, error: error.response?.data?.error || error.message }));
      throw error;
    }
  }, [type]);

  const updateItem = useCallback(async (id: string, data: any) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const api = type === 'stories' ? storyApi : blogApi;
      const response = await api.update(id, data);
      const updatedItem = response.data.data || response.data;
      setState(prev => ({
        ...prev,
        items: prev.items.map(item => (item as any)._id === id ? updatedItem : item),
        loading: false,
      }));
      return updatedItem;
    } catch (error: any) {
      console.error(`Failed to update ${type}:`, error);
      setState(prev => ({ ...prev, loading: false, error: error.response?.data?.error || error.message }));
      throw error;
    }
  }, [type]);

  const deleteItem = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const api = type === 'stories' ? storyApi : blogApi;
      await api.delete(id);
      setState(prev => ({
        ...prev,
        items: prev.items.filter(item => (item as any)._id !== id),
        loading: false,
      }));
    } catch (error: any) {
      console.error(`Failed to delete ${type}:`, error);
      setState(prev => ({ ...prev, loading: false, error: error.response?.data?.error || error.message }));
      throw error;
    }
  }, [type]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return {
    items: state.items,
    loading: state.loading,
    error: state.error,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  };
}