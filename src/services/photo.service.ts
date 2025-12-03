import { apiFetch, apiUpload } from './api';
import type {
  PhotoResponse,
  PhotoUpdateRequest,
  PageResponse,
  ApiResponse,
} from '../types/api.types';

export const photoService = {
  getPhotos: async (page = 0, size = 20) => {
    const response = await apiFetch<ApiResponse<PageResponse<PhotoResponse>>>(
      `/api/photos?page=${page}&size=${size}`,
      { requiresAuth: false }
    );
    return response.data;
  },

  getPhoto: async (photoId: number) => {
    const response = await apiFetch<ApiResponse<PhotoResponse>>(
      `/api/photos/${photoId}`,
      { requiresAuth: false }
    );
    return response.data;
  },

  getUserPhotos: async (userId: number, page = 0, size = 20) => {
    const response = await apiFetch<ApiResponse<PageResponse<PhotoResponse>>>(
      `/api/photos/user/${userId}?page=${page}&size=${size}`,
      { requiresAuth: false }
    );
    return response.data;
  },

  searchPhotos: async (keyword: string, page = 0, size = 20) => {
    const response = await apiFetch<ApiResponse<PageResponse<PhotoResponse>>>(
      `/api/photos/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`,
      { requiresAuth: false }
    );
    return response.data;
  },

  getPhotosByTag: async (tagName: string, page = 0, size = 20) => {
    const response = await apiFetch<ApiResponse<PageResponse<PhotoResponse>>>(
      `/api/photos/tag/${encodeURIComponent(tagName)}?page=${page}&size=${size}`,
      { requiresAuth: false }
    );
    return response.data;
  },

  uploadPhoto: async (
    file: File,
    title: string,
    description?: string,
    tags?: string[]
  ) => {
    const formData = new FormData();
    formData.append('file', file);

    const params = new URLSearchParams();
    params.append('title', title);
    if (description) params.append('description', description);
    if (tags && tags.length > 0) {
      tags.forEach((tag) => params.append('tags', tag));
    }

    const response = await apiUpload<ApiResponse<PhotoResponse>>(
      `/api/photos?${params.toString()}`,
      formData
    );
    return response.data;
  },

  updatePhoto: async (photoId: number, data: PhotoUpdateRequest) => {
    const response = await apiFetch<ApiResponse<PhotoResponse>>(
      `/api/photos/${photoId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },

  deletePhoto: async (photoId: number) => {
    await apiFetch<ApiResponse<void>>(`/api/photos/${photoId}`, {
      method: 'DELETE',
    });
  },

  likePhoto: async (photoId: number) => {
    await apiFetch<ApiResponse<void>>(`/api/photos/${photoId}/like`, {
      method: 'POST',
    });
  },

  unlikePhoto: async (photoId: number) => {
    await apiFetch<ApiResponse<void>>(`/api/photos/${photoId}/like`, {
      method: 'DELETE',
    });
  },

  downloadPhoto: async (photoId: number) => {
    await apiFetch<ApiResponse<void>>(`/api/photos/${photoId}/download`, {
      method: 'POST',
      requiresAuth: false,
    });
  },
};
