import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { authService, type AuthUser, type ApiError } from '../services';
import type { AxiosError } from 'axios';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>(() => {
    const token = localStorage.getItem('auth_token');
    return {
      user: null,
      token,
      isAuthenticated: !!token,
      isLoading: false,
    };
  });

  const setAuthData = useCallback((token: string, user: AuthUser) => {
    localStorage.setItem('auth_token', token);
    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('auth_token');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setAuthData(response.token, response.user);
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Login failed. Please try again.';
      return { success: false, error: message };
    }
  }, [setAuthData]);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const response = await authService.register({ name, email, password, confirmPassword: password });
      setAuthData(response.token, response.user);
      return { success: true };
    } catch (error) {
      const axiosError = error as AxiosError<ApiError>;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Registration failed. Please try again.';
      return { success: false, error: message };
    }
  }, [setAuthData]);

  const logout = useCallback(() => {
    clearAuthData();
  }, [clearAuthData]);

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
