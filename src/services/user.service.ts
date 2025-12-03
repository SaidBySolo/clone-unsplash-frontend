import { apiFetch, apiUpload } from './api';
import type { UserResponse, UserUpdateRequest, ApiResponse } from '../types/api.types';

export const userService = {
  getUserById: async (userId: number) => {
    const response = await apiFetch<ApiResponse<UserResponse>>(
      `/api/users/${userId}`,
      { requiresAuth: false }
    );
    return response.data;
  },

  getUserByUsername: async (username: string) => {
    const response = await apiFetch<ApiResponse<UserResponse>>(
      `/api/users/username/${username}`,
      { requiresAuth: false }
    );
    return response.data;
  },

  updateUser: async (userId: number, data: UserUpdateRequest) => {
    const response = await apiFetch<ApiResponse<UserResponse>>(
      `/api/users/${userId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },

  updateProfileImage: async (userId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiUpload<ApiResponse<UserResponse>>(
      `/api/users/${userId}/profile-image`,
      formData
    );
    return response.data;
  },

  followUser: async (userId: number) => {
    await apiFetch<ApiResponse<void>>(`/api/users/${userId}/follow`, {
      method: 'POST',
    });
  },

  unfollowUser: async (userId: number) => {
    await apiFetch<ApiResponse<void>>(`/api/users/${userId}/follow`, {
      method: 'DELETE',
    });
  },

  isFollowing: async (userId: number) => {
    const response = await apiFetch<ApiResponse<boolean>>(
      `/api/users/${userId}/is-following`
    );
    return response.data;
  },
};
