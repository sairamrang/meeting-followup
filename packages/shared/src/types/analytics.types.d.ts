import { EventType, DeviceType } from './enums';
export interface SectionViewEventData {
    sectionType: string;
    sectionTitle: string;
}
export interface FileDownloadEventData {
    fileId: string;
    filename: string;
}
export interface LinkClickEventData {
    url: string;
    linkText?: string;
}
export interface CopyEventData {
    value: string;
    contactId?: string;
}
export type AnalyticsEventData = SectionViewEventData | FileDownloadEventData | LinkClickEventData | CopyEventData | Record<string, unknown>;
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
    ipHash: string;
    timestamp: Date;
}
export interface AnalyticsSession {
    id: string;
    followupId: string;
    sessionStart: Date;
    sessionEnd?: Date | null;
    pageDuration?: number | null;
    deviceType: DeviceType;
    browser?: string | null;
    locationCity?: string | null;
    locationCountry?: string | null;
}
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
export interface FollowupAnalytics {
    followupId: string;
    totalViews: number;
    uniqueVisitors: number;
    totalDuration: number;
    averageDuration: number;
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
    totalEngagements: number;
    averageEngagementRate: number;
    topPerformingFollowups: Array<{
        followupId: string;
        title: string;
        companyName: string;
        views: number;
        engagements: number;
    }>;
}
export type TimeRange = '24h' | '7d' | '30d' | '90d' | 'all';
export interface AnalyticsFilters {
    timeRange: TimeRange;
    followupId?: string;
    companyId?: string;
}
//# sourceMappingURL=analytics.types.d.ts.map