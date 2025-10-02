// Fully conceptualized - Authentication hook
// Design choice: Zustand for global auth state management

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/login', { email, password });
          const { user, accessToken } = response.data;
          
          set({ user, token: accessToken, isLoading: false });
          
          // Set default authorization header
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          toast.success('Welcome back!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || 'Login failed');
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true });
        try {
          const response = await api.post('/auth/register', data);
          const { user, accessToken } = response.data;
          
          set({ user, token: accessToken, isLoading: false });
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
          
          toast.success('Account created successfully!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error.response?.data?.message || 'Registration failed');
          throw error;
        }
      },

      logout: () => {
        set({ user: null, token: null });
        delete api.defaults.headers.common['Authorization'];
        toast.success('Logged out successfully');
      },

      refreshToken: async () => {
        try {
          const response = await api.post('/auth/refresh');
          const { accessToken } = response.data;
          
          set({ token: accessToken });
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } catch (error) {
          get().logout();
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
