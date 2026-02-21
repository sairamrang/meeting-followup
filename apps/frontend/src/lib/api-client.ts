import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds default
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token or test user header
apiClient.interceptors.request.use(
  async (config) => {
    if (isTestMode) {
      // In test mode, send x-user-id header (backend dev bypass)
      // MUST match the test user ID in TestLogin.tsx and seed-clear.ts
      config.headers['x-user-id'] = 'test-user-001';
    } else {
      // Production: Get token from Clerk
      const token = localStorage.getItem('clerk_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle errors and extract data
apiClient.interceptors.response.use(
  (response) => {
    // Extract data from standardized API response
    // Backend returns: { success: true, data: {...}, meta?: {...} }
    return response.data.data ? { ...response, data: response.data.data } : response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean; _retryCount?: number };

    // Handle 401 Unauthorized - redirect to sign in
    if (error.response?.status === 401) {
      window.location.href = isTestMode ? '/test-login' : '/sign-in';
      return Promise.reject(error);
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Forbidden: You do not have permission to access this resource');
      return Promise.reject(error);
    }

    // Retry logic for 5xx errors
    if (error.response?.status && error.response.status >= 500) {
      const retryCount = originalRequest._retryCount || 0;
      const maxRetries = 3;

      if (retryCount < maxRetries) {
        originalRequest._retryCount = retryCount + 1;

        // Exponential backoff: 1s, 2s, 4s
        const delay = Math.pow(2, retryCount) * 1000;

        await new Promise((resolve) => setTimeout(resolve, delay));

        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  }
);

// Setup auth token setter (called from auth store)
export function setAuthToken(token: string | null) {
  if (token) {
    localStorage.setItem('clerk_token', token);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('clerk_token');
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

// File upload configuration (60s timeout)
export function createFileUploadConfig(): AxiosRequestConfig {
  return {
    timeout: 60000,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
}
