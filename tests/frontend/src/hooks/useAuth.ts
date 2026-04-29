import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('auth_token'),
    isAuthenticated: !!localStorage.getItem('auth_token'),
    isLoading: true,
  });

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('auth_token', token);
      setState({ user, token, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  useEffect(() => {
    if (state.token) {
      api.get('/auth/me').then((response) => {
        setState((prev) => ({ ...prev, user: response.data, isLoading: false }));
      }).catch(() => {
        logout();
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [state.token, logout]);

  return { ...state, login, logout };
}
