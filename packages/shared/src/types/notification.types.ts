// Notification types
import { NotificationType, DeviceType } from './enums';

// Notification Preference
export interface NotificationPreference {
  id: string;
  userId: string;
  emailNotifications: boolean;
  notifyOnFirstView: boolean;
  notifyOnRevisit: boolean;
  notifyEmail?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Notification
export interface Notification {
  id: string;
  followupId: string;
  userId: string;
  type: NotificationType;
  sentAt: Date;
  viewerIpHash?: string | null;
  viewerDeviceType?: DeviceType | null;
  viewerBrowser?: string | null;
  viewerLocationCity?: string | null;
  viewerLocationCountry?: string | null;
  viewerSessionId?: string | null;
  delivered: boolean;
  error?: string | null;
}

// Notification with followup details (for display)
export interface NotificationWithFollowup extends Notification {
  followup: {
    id: string;
    title: string;
    slug?: string | null;
  };
}

// DTOs for API
export interface UpdateNotificationPreferenceDTO {
  emailNotifications?: boolean;
  notifyOnFirstView?: boolean;
  notifyOnRevisit?: boolean;
  notifyEmail?: string | null;
}

export interface CreateNotificationDTO {
  followupId: string;
  userId: string;
  type: NotificationType;
  viewerIpHash?: string;
  viewerDeviceType?: DeviceType;
  viewerBrowser?: string;
  viewerLocationCity?: string;
  viewerLocationCountry?: string;
  viewerSessionId?: string;
}

// Response types
export interface NotificationListResponse {
  notifications: Notification[];
  total: number;
}

export interface RevisitInfo {
  isRevisit: boolean;
  previousVisitCount: number;
  lastVisitAt?: Date;
}
