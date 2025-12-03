import { apiFetch } from './api';
import type {
  CollectionResponse,
  CollectionRequest,
  AddPhotoToCollectionRequest,
  PageResponse,
  ApiResponse,
} from '../types/api.types';

export const collectionService = {
  getPublicCollections: async (page = 0, size = 20) => {
    const response = await apiFetch<ApiResponse<PageResponse<CollectionResponse>>>(
      `/api/collections?page=${page}&size=${size}`,
      { requiresAuth: false }
    );
    return response.data;
  },

  getCollection: async (collectionId: number) => {
    const response = await apiFetch<ApiResponse<CollectionResponse>>(
      `/api/collections/${collectionId}`,
      { requiresAuth: false }
    );
    return response.data;
  },

  getUserCollections: async (userId: number, page = 0, size = 20) => {
    const response = await apiFetch<ApiResponse<PageResponse<CollectionResponse>>>(
      `/api/collections/user/${userId}?page=${page}&size=${size}`,
      { requiresAuth: false }
    );
    return response.data;
  },

  createCollection: async (data: CollectionRequest) => {
    const response = await apiFetch<ApiResponse<CollectionResponse>>(
      '/api/collections',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },

  updateCollection: async (collectionId: number, data: CollectionRequest) => {
    const response = await apiFetch<ApiResponse<CollectionResponse>>(
      `/api/collections/${collectionId}`,
      {
        method: 'PUT',
        body: JSON.stringify(data),
      }
    );
    return response.data;
  },

  deleteCollection: async (collectionId: number) => {
    await apiFetch<ApiResponse<void>>(`/api/collections/${collectionId}`, {
      method: 'DELETE',
    });
  },

  addPhotoToCollection: async (collectionId: number, data: AddPhotoToCollectionRequest) => {
    await apiFetch<ApiResponse<void>>(
      `/api/collections/${collectionId}/photos`,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  },

  removePhotoFromCollection: async (collectionId: number, photoId: number) => {
    await apiFetch<ApiResponse<void>>(
      `/api/collections/${collectionId}/photos/${photoId}`,
      {
        method: 'DELETE',
      }
    );
  },
};
