// Notification Service - Handles notification preferences, revisit detection, and sending notifications
import { prisma } from '../lib/prisma';
import { NotFoundError, handlePrismaError } from '../utils/errors';
import {
  NotificationType,
  type NotificationPreference,
  type Notification,
  type UpdateNotificationPreferenceDTO,
  type CreateNotificationDTO,
  type RevisitInfo,
  type DeviceType,
} from '@meeting-followup/shared';

export class NotificationService {
  /**
   * Get notification preferences for a user
   * Creates default preferences if none exist
   */
  async getPreferences(userId: string): Promise<NotificationPreference> {
    try {
      let preferences = await prisma.notificationPreference.findUnique({
        where: { userId },
      });

      if (!preferences) {
        // Create default preferences
        preferences = await prisma.notificationPreference.create({
          data: {
            userId,
            emailNotifications: true,
            notifyOnFirstView: true,
            notifyOnRevisit: true,
          },
        });
      }

      return preferences as NotificationPreference;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  /**
   * Update notification preferences for a user
   */
  async updatePreferences(
    userId: string,
    data: UpdateNotificationPreferenceDTO
  ): Promise<NotificationPreference> {
    try {
      // Ensure preferences exist
      await this.getPreferences(userId);

      const preferences = await prisma.notificationPreference.update({
        where: { userId },
        data: {
          ...(data.emailNotifications !== undefined && { emailNotifications: data.emailNotifications }),
          ...(data.notifyOnFirstView !== undefined && { notifyOnFirstView: data.notifyOnFirstView }),
          ...(data.notifyOnRevisit !== undefined && { notifyOnRevisit: data.notifyOnRevisit }),
          ...(data.notifyEmail !== undefined && { notifyEmail: data.notifyEmail }),
        },
      });

      return preferences as NotificationPreference;
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  /**
   * Check if a session is a revisit (same IP hash has viewed this followup before)
   */
  async checkRevisit(followupId: string, ipHash: string, currentSessionId: string): Promise<RevisitInfo> {
    try {
      // Find previous sessions with the same IP hash for this followup
      const previousSessions = await prisma.analyticsEvent.findMany({
        where: {
          followupId,
          ipHash,
          eventType: 'PAGE_VIEW',
          sessionId: { not: currentSessionId },
        },
        orderBy: { timestamp: 'desc' },
        select: {
          sessionId: true,
          timestamp: true,
        },
        distinct: ['sessionId'],
      });

      if (previousSessions.length === 0) {
        return {
          isRevisit: false,
          previousVisitCount: 0,
        };
      }

      return {
        isRevisit: true,
        previousVisitCount: previousSessions.length,
        lastVisitAt: previousSessions[0].timestamp,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  /**
   * Check if we should send a notification for this view
   * Prevents duplicate notifications within a time window
   */
  async shouldSendNotification(
    followupId: string,
    userId: string,
    type: NotificationType,
    viewerSessionId: string
  ): Promise<boolean> {
    try {
      // Get user's notification preferences
      const preferences = await this.getPreferences(userId);

      // Check if notifications are enabled
      if (!preferences.emailNotifications) {
        return false;
      }

      // Check type-specific preference
      if (type === NotificationType.FIRST_VIEW && !preferences.notifyOnFirstView) {
        return false;
      }
      if (type === NotificationType.REVISIT && !preferences.notifyOnRevisit) {
        return false;
      }

      // Check if we've already sent a notification for this session
      const existingNotification = await prisma.notification.findFirst({
        where: {
          followupId,
          userId,
          viewerSessionId,
        },
      });

      if (existingNotification) {
        return false;
      }

      // Throttle: Don't send more than 1 notification per followup per hour
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const recentNotifications = await prisma.notification.count({
        where: {
          followupId,
          userId,
          sentAt: { gte: oneHourAgo },
        },
      });

      if (recentNotifications >= 1) {
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error checking notification eligibility:', error);
      return false;
    }
  }

  /**
   * Create and "send" a notification (for MVP, logs to console)
   */
  async sendNotification(data: CreateNotificationDTO): Promise<Notification | null> {
    try {
      // Get followup details for the notification
      const followup = await prisma.followup.findUnique({
        where: { id: data.followupId },
        select: {
          id: true,
          title: true,
          slug: true,
          userId: true,
        },
      });

      if (!followup) {
        console.error(`Cannot send notification: Followup ${data.followupId} not found`);
        return null;
      }

      // Get user's notification preferences
      const preferences = await this.getPreferences(data.userId);
      const notifyEmail = preferences.notifyEmail || 'user-email@example.com'; // In production, get from Clerk

      // Create the notification record
      const notification = await prisma.notification.create({
        data: {
          followupId: data.followupId,
          userId: data.userId,
          type: data.type,
          viewerIpHash: data.viewerIpHash,
          viewerDeviceType: data.viewerDeviceType,
          viewerBrowser: data.viewerBrowser,
          viewerLocationCity: data.viewerLocationCity,
          viewerLocationCountry: data.viewerLocationCountry,
          viewerSessionId: data.viewerSessionId,
          delivered: false,
        },
      });

      // For MVP, log to console instead of actually sending email
      const isRevisit = data.type === NotificationType.REVISIT;
      const locationInfo = data.viewerLocationCity
        ? `${data.viewerLocationCity}${data.viewerLocationCountry ? `, ${data.viewerLocationCountry}` : ''}`
        : 'Unknown location';

      console.log('\n========================================');
      console.log(`EMAIL NOTIFICATION (${isRevisit ? 'REVISIT' : 'FIRST VIEW'})`);
      console.log('========================================');
      console.log(`To: ${notifyEmail}`);
      console.log(`Subject: ${isRevisit ? 'Someone revisited' : 'New view on'} your follow-up: "${followup.title}"`);
      console.log('----------------------------------------');
      console.log('Body:');
      console.log(`  ${isRevisit ? 'A prospect has returned to view' : 'Someone just viewed'} your follow-up page!`);
      console.log(`  `);
      console.log(`  Follow-up: ${followup.title}`);
      console.log(`  Time: ${new Date().toLocaleString()}`);
      console.log(`  Device: ${data.viewerDeviceType || 'Unknown'}`);
      console.log(`  Browser: ${data.viewerBrowser || 'Unknown'}`);
      console.log(`  Location: ${locationInfo}`);
      if (followup.slug) {
        console.log(`  `);
        console.log(`  View analytics: http://localhost:5173/follow-ups/${followup.id}`);
      }
      console.log('========================================\n');

      // Mark as delivered (for MVP, always succeeds)
      await prisma.notification.update({
        where: { id: notification.id },
        data: { delivered: true },
      });

      return notification as Notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw handlePrismaError(error);
    }
  }

  /**
   * Process a page view and send notification if appropriate
   */
  async processPageView(
    followupId: string,
    sessionId: string,
    ipHash: string,
    viewerInfo: {
      deviceType?: DeviceType;
      browser?: string;
      locationCity?: string;
      locationCountry?: string;
    }
  ): Promise<void> {
    try {
      // Get the followup to find the owner
      const followup = await prisma.followup.findUnique({
        where: { id: followupId },
        select: { userId: true },
      });

      if (!followup) {
        return;
      }

      // Check if this is a revisit
      const revisitInfo = await this.checkRevisit(followupId, ipHash, sessionId);
      const notificationType = revisitInfo.isRevisit ? NotificationType.REVISIT : NotificationType.FIRST_VIEW;

      // Check if we should send a notification
      const shouldSend = await this.shouldSendNotification(
        followupId,
        followup.userId,
        notificationType,
        sessionId
      );

      if (shouldSend) {
        await this.sendNotification({
          followupId,
          userId: followup.userId,
          type: notificationType,
          viewerIpHash: ipHash,
          viewerDeviceType: viewerInfo.deviceType,
          viewerBrowser: viewerInfo.browser,
          viewerLocationCity: viewerInfo.locationCity,
          viewerLocationCountry: viewerInfo.locationCountry,
          viewerSessionId: sessionId,
        });
      }
    } catch (error) {
      // Don't throw - notification failures shouldn't break tracking
      console.error('Error processing page view for notifications:', error);
    }
  }

  /**
   * Get notifications for a specific followup
   */
  async getNotificationsByFollowup(
    followupId: string,
    userId: string
  ): Promise<Notification[]> {
    try {
      // Verify user owns the followup
      const followup = await prisma.followup.findUnique({
        where: { id: followupId },
        select: { userId: true },
      });

      if (!followup) {
        throw new NotFoundError('Follow-up', followupId);
      }

      if (followup.userId !== userId) {
        throw new NotFoundError('Follow-up', followupId);
      }

      const notifications = await prisma.notification.findMany({
        where: { followupId },
        orderBy: { sentAt: 'desc' },
      });

      return notifications as Notification[];
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw handlePrismaError(error);
    }
  }

  /**
   * Get all notifications for a user
   */
  async getNotificationsByUser(
    userId: string,
    limit: number = 50
  ): Promise<Notification[]> {
    try {
      const notifications = await prisma.notification.findMany({
        where: { userId },
        orderBy: { sentAt: 'desc' },
        take: limit,
        include: {
          followup: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      });

      return notifications as any[];
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}

export const notificationService = new NotificationService();
