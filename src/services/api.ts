const API_BASE_URL = 'http://192.168.2.8:8080';

interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(
    status: number,
    message: string,
    data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { requiresAuth = true, headers = {}, ...restOptions } = options;

  const config: RequestInit = {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (token) {
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        error.message || `HTTP ${response.status}: ${response.statusText}`,
        error
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error('Network error or server unavailable');
  }
}

export async function apiUpload<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const token = localStorage.getItem('token');

  const config: RequestInit = {
    method: 'POST',
    body: formData,
    headers: {},
  };

  if (token) {
    (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        error.message || 'Upload failed',
        error
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error('Network error during upload');
  }
}
