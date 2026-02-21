// FollowupAnalyticsCard Component Tests
// Tests the analytics display component functionality
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { FollowupAnalyticsCard } from '@/components/analytics/FollowupAnalyticsCard';
import { ConfirmationType } from '@meeting-followup/shared';
import type { ConfirmationMetrics } from '@meeting-followup/shared';

// Mock the API modules
vi.mock('@/services/api', () => ({
  analyticsApi: {
    getFollowupAnalytics: vi.fn(),
  },
  confirmationsApi: {
    getMetrics: vi.fn(),
  },
}));

import { analyticsApi, confirmationsApi } from '@/services/api';

// Test data
const TEST_FOLLOWUP_ID = 'followup-test-123';

const MOCK_ANALYTICS_DATA = {
  followupId: TEST_FOLLOWUP_ID,
  totalViews: 150,
  uniqueVisitors: 45,
  totalDuration: 5400,
  averageDuration: 120,
  fileDownloads: 10,
  linkClicks: 25,
  emailCopies: 5,
  phoneCopies: 3,
  deviceBreakdown: {
    DESKTOP: 80,
    MOBILE: 55,
    TABLET: 15,
  },
  topLocations: [
    { city: 'New York', country: 'USA', count: 25 },
    { city: 'London', country: 'UK', count: 15 },
    { city: 'San Francisco', country: 'USA', count: 10 },
  ],
  recentSessions: [
    {
      id: 'session-1',
      sessionStart: '2026-02-11T10:00:00Z',
      deviceType: 'DESKTOP',
      browser: 'Chrome',
      locationCity: 'New York',
      locationCountry: 'USA',
    },
    {
      id: 'session-2',
      sessionStart: '2026-02-11T11:00:00Z',
      deviceType: 'MOBILE',
      browser: 'Safari',
      locationCity: 'London',
      locationCountry: 'UK',
    },
    {
      id: 'session-3',
      sessionStart: '2026-02-11T12:00:00Z',
      deviceType: 'TABLET',
      browser: 'Firefox',
      locationCity: 'San Francisco',
      locationCountry: 'USA',
    },
  ],
};

const MOCK_CONFIRMATION_METRICS: ConfirmationMetrics = {
  followupId: TEST_FOLLOWUP_ID,
  total: 22,
  byType: {
    [ConfirmationType.RECAP_ACCURATE]: 8,
    [ConfirmationType.RECAP_INACCURATE]: 2,
    [ConfirmationType.VALUE_PROP_CLEAR]: 6,
    [ConfirmationType.VALUE_PROP_UNCLEAR]: 1,
    [ConfirmationType.INTERESTED]: 4,
    [ConfirmationType.SCHEDULE_CALL]: 1,
  },
  recapAccuracyRate: 80,
  valuePropResonanceRate: 86,
  interestRate: 23,
  recentConfirmations: [
    {
      id: 'conf-1',
      followupId: TEST_FOLLOWUP_ID,
      sessionId: 'session-1',
      type: ConfirmationType.RECAP_ACCURATE,
      confirmedAt: new Date('2026-02-11T10:05:00Z'),
    },
    {
      id: 'conf-2',
      followupId: TEST_FOLLOWUP_ID,
      sessionId: 'session-2',
      type: ConfirmationType.INTERESTED,
      confirmedAt: new Date('2026-02-11T11:10:00Z'),
    },
  ],
};

describe('FollowupAnalyticsCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Unpublished State', () => {
    it('should display publish prompt when followup is not published', () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={false} />);

      expect(screen.getByText('Ready to Track Engagement?')).toBeInTheDocument();
      expect(screen.getByText(/Publish this follow-up to unlock/)).toBeInTheDocument();
    });

    it('should not fetch analytics when followup is not published', () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={false} />);

      expect(analyticsApi.getFollowupAnalytics).not.toHaveBeenCalled();
      expect(confirmationsApi.getMetrics).not.toHaveBeenCalled();
    });
  });

  describe('Loading State', () => {
    it('should display loading skeleton while fetching data', async () => {
      vi.mocked(analyticsApi.getFollowupAnalytics).mockImplementation(
        () => new Promise(() => {}) // Never resolves to keep loading state
      );
      vi.mocked(confirmationsApi.getMetrics).mockImplementation(
        () => new Promise(() => {})
      );

      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      // Check for loading skeleton elements
      const skeletonElements = document.querySelectorAll('.animate-pulse');
      expect(skeletonElements.length).toBeGreaterThan(0);
    });
  });

  describe('Analytics Data Display', () => {
    beforeEach(() => {
      vi.mocked(analyticsApi.getFollowupAnalytics).mockResolvedValue(MOCK_ANALYTICS_DATA);
      vi.mocked(confirmationsApi.getMetrics).mockResolvedValue(MOCK_CONFIRMATION_METRICS);
    });

    it('should display total views count', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(screen.getByText('150')).toBeInTheDocument();
      });

      expect(screen.getByText('Total Views')).toBeInTheDocument();
    });

    it('should display unique visitors count', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(screen.getByText('45')).toBeInTheDocument();
      });

      expect(screen.getByText('Unique Visitors')).toBeInTheDocument();
    });

    it('should display device breakdown', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(screen.getByText('Device Breakdown')).toBeInTheDocument();
      });

      // Check for device types
      expect(screen.getByText('Desktop')).toBeInTheDocument();
      expect(screen.getByText('Mobile')).toBeInTheDocument();
      expect(screen.getByText('Tablet')).toBeInTheDocument();
    });

    it('should display recent visitors list', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(screen.getByText(/Recent Visitors/)).toBeInTheDocument();
      });

      // Check for visitor details
      expect(screen.getByText('Chrome')).toBeInTheDocument();
      expect(screen.getByText('Safari')).toBeInTheDocument();
    });

    it('should calculate and display engagement rate', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        // 45 unique / 150 total = 30% engagement
        expect(screen.getByText(/30% engagement/)).toBeInTheDocument();
      });
    });
  });

  describe('Confirmation Metrics Display', () => {
    beforeEach(() => {
      vi.mocked(analyticsApi.getFollowupAnalytics).mockResolvedValue(MOCK_ANALYTICS_DATA);
      vi.mocked(confirmationsApi.getMetrics).mockResolvedValue(MOCK_CONFIRMATION_METRICS);
    });

    it('should display confirmation metrics section', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(screen.getByText(/Prospect Feedback/)).toBeInTheDocument();
      });
    });

    it('should display recap accuracy rate', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(screen.getByText('Recap Accuracy')).toBeInTheDocument();
        expect(screen.getByText('80%')).toBeInTheDocument();
      });
    });

    it('should display value prop resonance rate', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(screen.getByText('Value Prop')).toBeInTheDocument();
        expect(screen.getByText('86%')).toBeInTheDocument();
      });
    });

    it('should display interest count', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(screen.getByText('Interest')).toBeInTheDocument();
        // 4 interested + 1 schedule call = 5
        expect(screen.getByText('5')).toBeInTheDocument();
      });
    });

    it('should display confirmation breakdown by type', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(screen.getByText('Response Breakdown')).toBeInTheDocument();
      });

      // Use getAllByText since there may be multiple elements with same text
      // (breakdown section + recent confirmations)
      const recapAccurateElements = screen.getAllByText('Recap accurate');
      expect(recapAccurateElements.length).toBeGreaterThan(0);
      expect(screen.getByText('8')).toBeInTheDocument();
    });

    it('should display recent confirmations', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(screen.getByText('Recent Feedback')).toBeInTheDocument();
      });
    });
  });

  describe('Time Range Selection', () => {
    beforeEach(() => {
      vi.mocked(analyticsApi.getFollowupAnalytics).mockResolvedValue(MOCK_ANALYTICS_DATA);
      vi.mocked(confirmationsApi.getMetrics).mockResolvedValue(MOCK_CONFIRMATION_METRICS);
    });

    it('should display time range selector', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
      });
    });

    it('should have time range options', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
      });

      const select = screen.getByRole('combobox');
      expect(select).toHaveTextContent('Last 30 days');
    });

    it('should refetch data when time range changes', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(analyticsApi.getFollowupAnalytics).toHaveBeenCalledWith(
          TEST_FOLLOWUP_ID,
          '30d'
        );
      });

      // Change time range
      const select = screen.getByRole('combobox');
      fireEvent.change(select, { target: { value: '7d' } });

      await waitFor(() => {
        expect(analyticsApi.getFollowupAnalytics).toHaveBeenCalledWith(
          TEST_FOLLOWUP_ID,
          '7d'
        );
      });
    });
  });

  describe('Chart Display', () => {
    beforeEach(() => {
      vi.mocked(analyticsApi.getFollowupAnalytics).mockResolvedValue(MOCK_ANALYTICS_DATA);
      vi.mocked(confirmationsApi.getMetrics).mockResolvedValue(MOCK_CONFIRMATION_METRICS);
    });

    it('should display views over time chart when data exists', async () => {
      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(screen.getByText('Views Over Time')).toBeInTheDocument();
      });

      // Check for SVG chart element
      const svg = document.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should display empty state when no session data', async () => {
      vi.mocked(analyticsApi.getFollowupAnalytics).mockResolvedValue({
        ...MOCK_ANALYTICS_DATA,
        recentSessions: [],
      });

      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(screen.getByText('No views yet')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle analytics API error gracefully', async () => {
      // Suppress console.error for this test since we expect an error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(analyticsApi.getFollowupAnalytics).mockRejectedValue(
        new Error('Failed to fetch')
      );
      vi.mocked(confirmationsApi.getMetrics).mockResolvedValue(null as unknown as ConfirmationMetrics);

      // Should not throw and should render without crashing
      const { container } = render(
        <FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />
      );

      await waitFor(() => {
        expect(container).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });

    it('should handle confirmation metrics API error gracefully', async () => {
      vi.mocked(analyticsApi.getFollowupAnalytics).mockResolvedValue(MOCK_ANALYTICS_DATA);
      vi.mocked(confirmationsApi.getMetrics).mockRejectedValue(
        new Error('Failed to fetch')
      );

      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      // Should still display analytics data
      await waitFor(() => {
        expect(screen.getByText('150')).toBeInTheDocument();
      });

      // Confirmation metrics section should not be displayed
      expect(screen.queryByText('Prospect Feedback')).not.toBeInTheDocument();
    });
  });

  describe('No Confirmation Data', () => {
    it('should not display confirmation section when total is 0', async () => {
      vi.mocked(analyticsApi.getFollowupAnalytics).mockResolvedValue(MOCK_ANALYTICS_DATA);
      vi.mocked(confirmationsApi.getMetrics).mockResolvedValue({
        ...MOCK_CONFIRMATION_METRICS,
        total: 0,
        byType: {},
        recentConfirmations: [],
      });

      render(<FollowupAnalyticsCard followupId={TEST_FOLLOWUP_ID} isPublished={true} />);

      await waitFor(() => {
        expect(screen.getByText('150')).toBeInTheDocument();
      });

      // Confirmation metrics section should not be displayed when total is 0
      expect(screen.queryByText('Prospect Feedback')).not.toBeInTheDocument();
    });
  });
});
