// Analytics types
import { EventType, DeviceType } from './enums';

// Event data structures
export interface SectionViewEventData {
  sectionId: string; // 'meeting-recap', 'value-proposition', 'next-steps'
  sectionType: string; // 'recap', 'nextSteps', 'aboutUs', etc.
  sectionTitle: string;
}

export interface SectionTimeEventData {
  sectionId: string; // 'meeting-recap', 'value-proposition', 'next-steps'
  timeSpentMs: number; // Time spent in milliseconds
}

export interface ScrollDepthEventData {
  scrollDepthPercent: number; // 0-100 percentage
  maxScrollDepthPercent: number; // Maximum scroll depth reached
}

export interface FileDownloadEventData {
  fileId: string;
  filename: string;
}

export interface LinkClickEventData {
  url: string;
  linkText?: string;
  sectionId?: string; // Which section the link was in (e.g., 'recap', 'valueProp', 'header')
}

export interface CopyEventData {
  value: string; // Email or phone (hashed on backend)
  contactId?: string;
}

export type AnalyticsEventData =
  | SectionViewEventData
  | SectionTimeEventData
  | ScrollDepthEventData
  | FileDownloadEventData
  | LinkClickEventData
  | CopyEventData
  | Record<string, unknown>;

// Analytics Event
export interface AnalyticsEvent {
  id: string;
  followupId: string;
  sessionId: string;
  eventType: EventType;
  eventData?: AnalyticsEventData | null;
  deviceType: DeviceType;
  browser?: string | null;
  locationCity?: string | null;
  locationCountry?: string | null;
  ipHash: string; // SHA-256 hashed IP (GDPR-safe)
  timestamp: Date;
}

// Analytics Session
export interface AnalyticsSession {
  id: string;
  followupId: string;
  sessionStart: Date;
  sessionEnd?: Date | null;
  pageDuration?: number | null; // seconds
  deviceType: DeviceType;
  browser?: string | null;
  locationCity?: string | null;
  locationCountry?: string | null;
}

// API types for tracking events
export interface TrackEventDTO {
  followupId: string;
  sessionId: string;
  eventType: EventType;
  eventData?: AnalyticsEventData;
  deviceType: DeviceType;
  browser?: string;
  locationCity?: string;
  locationCountry?: string;
}

export interface StartSessionDTO {
  followupId: string;
  deviceType: DeviceType;
  browser?: string;
  locationCity?: string;
  locationCountry?: string;
}

export interface EndSessionDTO {
  sessionId: string;
}

// Analytics aggregation types
export interface FollowupAnalytics {
  followupId: string;
  totalViews: number;
  uniqueVisitors: number;
  totalDuration: number; // seconds
  averageDuration: number; // seconds
  fileDownloads: number;
  linkClicks: number;
  emailCopies: number;
  phoneCopies: number;
  deviceBreakdown: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
  topLocations: Array<{
    city: string;
    country: string;
    count: number;
  }>;
  recentSessions: AnalyticsSession[];
}

export interface AnalyticsSummary {
  totalFollowups: number;
  publishedFollowups: number;
  totalViews: number;
  totalEngagements: number; // Downloads + clicks
  averageEngagementRate: number; // percentage
  topPerformingFollowups: Array<{
    followupId: string;
    title: string;
    companyName: string;
    views: number;
    engagements: number;
  }>;
}

// Time range filter
export type TimeRange = '24h' | '7d' | '30d' | '90d' | 'all';

export interface AnalyticsFilters {
  timeRange: TimeRange;
  followupId?: string;
  companyId?: string;
}
