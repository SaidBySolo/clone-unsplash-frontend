// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Auth
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  username: string;
  email: string;
}

// User
export interface UserSummary {
  id: number;
  username: string;
  name: string;
  profileImageUrl: string;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  name: string;
  bio: string | null;
  profileImageUrl: string | null;
  location: string | null;
  portfolioUrl: string | null;
  instagramUsername: string | null;
  twitterUsername: string | null;
  photosCount: number;
  collectionsCount: number;
  followersCount: number;
  followingCount: number;
  createdAt: string;
}

export interface UserUpdateRequest {
  name?: string;
  bio?: string;
  location?: string;
  portfolioUrl?: string;
  instagramUsername?: string;
  twitterUsername?: string;
}

// Photo
export interface PhotoResponse {
  id: number;
  title: string;
  description: string | null;
  imageUrl: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  color: string;
  viewsCount: number;
  downloadsCount: number;
  likesCount: number;
  user: UserSummary;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likedByCurrentUser: boolean;
}

export interface PhotoUpdateRequest {
  title?: string;
  description?: string;
  tags?: string[];
}

// Collection
export interface CollectionResponse {
  id: number;
  title: string;
  description: string | null;
  isPrivate: boolean;
  user: UserSummary;
  photosCount: number;
  coverPhotos: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CollectionRequest {
  title: string;
  description?: string;
  isPrivate?: boolean;
}

export interface AddPhotoToCollectionRequest {
  photoId: number;
}
