import { apiFetch } from './api';
import type { LoginRequest, RegisterRequest, AuthResponse, ApiResponse } from '../types/api.types';

export const authService = {
  login: async (data: LoginRequest) => {
    const response = await apiFetch<ApiResponse<AuthResponse>>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: false,
    });

    if (response.success && response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId.toString());
      localStorage.setItem('username', response.data.username);
    }

    return response.data;
  },

  register: async (data: RegisterRequest) => {
    const response = await apiFetch<ApiResponse<AuthResponse>>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      requiresAuth: false,
    });

    if (response.success && response.data) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userId', response.data.userId.toString());
      localStorage.setItem('username', response.data.username);
    }

    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  },

  getToken: () => localStorage.getItem('token'),

  getUserId: () => {
    const userId = localStorage.getItem('userId');
    return userId ? parseInt(userId, 10) : null;
  },

  isAuthenticated: () => !!localStorage.getItem('token'),
};
