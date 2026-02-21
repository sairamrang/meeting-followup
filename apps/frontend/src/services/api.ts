import { apiClient } from '@/lib/api-client';
import type {
  Company,
  Contact,
  Followup,
  FollowupWithRelations,
  CreateCompanyDTO,
  CreateContactDTO,
  CreateFollowupDTO,
  UpdateCompanyDTO,
  UpdateContactDTO,
  UpdateFollowupDTO,
  PublishFollowupDTO,
} from '@meeting-followup/shared';

// ============================================
// COMPANIES API
// ============================================

export const companiesApi = {
  getAll: async (params?: { page?: number; pageSize?: number; search?: string }) => {
    const response = await apiClient.get<{ data: Company[]; meta: any }>('/api/companies', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Company>(`/api/companies/${id}`);
    return response.data;
  },

  create: async (data: CreateCompanyDTO) => {
    const response = await apiClient.post<Company>('/api/companies', data);
    return response.data;
  },

  update: async (id: string, data: UpdateCompanyDTO) => {
    const response = await apiClient.put<Company>(`/api/companies/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/api/companies/${id}`);
  },

  getStats: async (id: string) => {
    const response = await apiClient.get<any>(`/api/companies/${id}/stats`);
    return response.data;
  },
};

// ============================================
// CONTACTS API
// ============================================

export const contactsApi = {
  getByCompany: async (companyId: string) => {
    const response = await apiClient.get<Contact[]>(`/api/contacts/company/${companyId}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<Contact>(`/api/contacts/${id}`);
    return response.data;
  },

  create: async (data: CreateContactDTO) => {
    const response = await apiClient.post<Contact>('/api/contacts', data);
    return response.data;
  },

  update: async (id: string, data: UpdateContactDTO) => {
    const response = await apiClient.put<Contact>(`/api/contacts/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/api/contacts/${id}`);
  },
};

// ============================================
// FOLLOW-UPS API
// ============================================

export const followupsApi = {
  getAll: async (params?: {
    page?: number;
    pageSize?: number;
    companyId?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => {
    const response = await apiClient.get<{ data: Followup[]; meta: any }>('/api/followups', { params });
    return response.data;
  },

  getById: async (id: string, include?: boolean) => {
    const response = await apiClient.get<Followup>(`/api/followups/${id}`, {
      params: { include },
    });
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await apiClient.get<FollowupWithRelations>(`/api/followups/public/${slug}`);
    return response.data;
  },

  create: async (data: CreateFollowupDTO) => {
    const response = await apiClient.post<Followup>('/api/followups', data);
    return response.data;
  },

  update: async (id: string, data: UpdateFollowupDTO) => {
    const response = await apiClient.put<Followup>(`/api/followups/${id}`, data);
    return response.data;
  },

  publish: async (id: string, data: PublishFollowupDTO) => {
    const response = await apiClient.post<Followup>(`/api/followups/${id}/publish`, data);
    return response.data;
  },

  unpublish: async (id: string) => {
    const response = await apiClient.post<Followup>(`/api/followups/${id}/unpublish`);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/api/followups/${id}`);
  },
};

// ============================================
// LIBRARY API
// ============================================

export const libraryApi = {
  getAll: async (type?: string) => {
    const response = await apiClient.get<any>('/api/library', {
      params: type ? { type } : undefined,
    });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<any>(`/api/library/${id}`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post<any>('/api/library', data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put<any>(`/api/library/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/api/library/${id}`);
  },
};

// ============================================
// TEMPLATES API
// ============================================

export const templatesApi = {
  getAll: async () => {
    const response = await apiClient.get<any[]>('/api/templates');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<any>(`/api/templates/${id}`);
    return response.data;
  },

  getBySlug: async (slug: string) => {
    const response = await apiClient.get<any>(`/api/templates/slug/${slug}`);
    return response.data;
  },
};

// ============================================
// FILES API
// ============================================

export const filesApi = {
  getByFollowup: async (followupId: string) => {
    const response = await apiClient.get<any[]>(`/api/files/followup/${followupId}`);
    return response.data;
  },

  getPublicFiles: async (slug: string) => {
    const response = await apiClient.get<any[]>(`/api/files/public/${slug}/files`);
    return response.data;
  },

  create: async (data: any) => {
    const response = await apiClient.post<any>('/api/files', data);
    return response.data;
  },

  delete: async (id: string) => {
    await apiClient.delete(`/api/files/${id}`);
  },
};

// ============================================
// ANALYTICS API
// ============================================

export const analyticsApi = {
  trackEvent: async (data: any) => {
    await apiClient.post('/api/analytics/events', data);
  },

  startSession: async (data: any) => {
    const response = await apiClient.post<{ id: string; sessionId?: string }>('/api/analytics/sessions/start', data);
    return response.data;
  },

  endSession: async (sessionId: string) => {
    await apiClient.post('/api/analytics/sessions/end', { sessionId });
  },

  getFollowupAnalytics: async (id: string, timeRange: string = '30d') => {
    const response = await apiClient.get<any>(`/api/analytics/followups/${id}`, {
      params: { timeRange },
    });
    return response.data;
  },

  getSummary: async (timeRange: string = '30d') => {
    const response = await apiClient.get<any>('/api/analytics/summary', {
      params: { timeRange },
    });
    return response.data;
  },
};

// ============================================
// AI API
// ============================================

export const aiApi = {
  generateContent: async (data: {
    type: 'recap' | 'valueProposition' | 'actionItems';
    sourceContent: string;
    context?: {
      meetingType?: string;
      companyName?: string;
      productName?: string;
    };
  }) => {
    const response = await apiClient.post<any>('/api/ai/generate', data);
    return response.data;
  },
};

// ============================================
// CONFIRMATIONS API
// ============================================

import type {
  FollowupConfirmation,
  CreateConfirmationDTO,
  ConfirmationMetrics,
  NotificationPreference,
  UpdateNotificationPreferenceDTO,
  Notification,
} from '@meeting-followup/shared';

export const confirmationsApi = {
  /**
   * Record a confirmation (public - no auth required)
   * @param slug - The followup's public slug
   * @param data - Confirmation data
   */
  create: async (slug: string, data: CreateConfirmationDTO) => {
    const response = await apiClient.post<FollowupConfirmation>(
      `/api/confirmations/${slug}`,
      data
    );
    return response.data;
  },

  /**
   * Get all confirmations for a followup (authenticated - owner only)
   * @param followupId - The followup ID
   */
  getByFollowup: async (followupId: string) => {
    const response = await apiClient.get<FollowupConfirmation[]>(
      `/api/confirmations/followup/${followupId}`
    );
    return response.data;
  },

  /**
   * Get confirmation metrics for a followup (authenticated - owner only)
   * @param followupId - The followup ID
   */
  getMetrics: async (followupId: string) => {
    const response = await apiClient.get<ConfirmationMetrics>(
      `/api/confirmations/followup/${followupId}/metrics`
    );
    return response.data;
  },
};

// ============================================
// NOTIFICATIONS API
// ============================================

export const notificationsApi = {
  /**
   * Get current user's notification preferences
   */
  getPreferences: async () => {
    const response = await apiClient.get<NotificationPreference>(
      '/api/notifications/preferences'
    );
    return response.data;
  },

  /**
   * Update notification preferences
   * @param data - Updated preferences
   */
  updatePreferences: async (data: UpdateNotificationPreferenceDTO) => {
    const response = await apiClient.put<NotificationPreference>(
      '/api/notifications/preferences',
      data
    );
    return response.data;
  },

  /**
   * Get notifications for a specific followup
   * @param followupId - The followup ID
   */
  getByFollowup: async (followupId: string) => {
    const response = await apiClient.get<Notification[]>(
      `/api/notifications/followups/${followupId}`
    );
    return response.data;
  },

  /**
   * Get all notifications for current user
   * @param limit - Maximum number of notifications to return
   */
  getAll: async (limit: number = 50) => {
    const response = await apiClient.get<Notification[]>(
      '/api/notifications',
      { params: { limit } }
    );
    return response.data;
  },
};
