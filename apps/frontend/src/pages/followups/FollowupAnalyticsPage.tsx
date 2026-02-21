import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  EyeIcon,
  UserGroupIcon,
  ClockIcon,
  SparklesIcon,
  ChartBarIcon,
  CursorArrowRaysIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  LinkIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ChatBubbleLeftIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { useFollowupsStore } from '@/store/followups-store';
import { analyticsApi, confirmationsApi } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { ConfirmationMetrics, FollowupConfirmation } from '@meeting-followup/shared';

interface AnalyticsData {
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
    MOBILE?: number;
    TABLET?: number;
    DESKTOP?: number;
  };
  topLocations: Array<{
    city: string;
    country: string;
    count: number;
  }>;
  recentSessions: Array<{
    id: string;
    sessionStart: string | Date;
    sessionEnd?: string | Date | null;
    pageDuration?: number | null;
    deviceType: string;
    browser?: string | null;
    locationCity?: string | null;
    locationCountry?: string | null;
  }>;
}

interface LinkClickData {
  url: string;
  linkText?: string;
  sectionId?: string;
  count: number;
}

interface SectionEngagement {
  sectionId: string;
  sectionTitle: string;
  totalTimeMs: number;
  viewCount: number;
}

export default function FollowupAnalyticsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { followups, fetchFollowupById } = useFollowupsStore();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [confirmationMetrics, setConfirmationMetrics] = useState<ConfirmationMetrics | null>(null);
  const [feedbackComments, setFeedbackComments] = useState<FollowupConfirmation[]>([]);
  const [linkClicks, setLinkClicks] = useState<LinkClickData[]>([]);
  const [sectionEngagement, setSectionEngagement] = useState<SectionEngagement[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  const followup = followups.find((f) => f.id === id);
  const isPublished = followup?.status === 'PUBLISHED';

  useEffect(() => {
    if (id) {
      fetchFollowupById(id);
    }
  }, [id, fetchFollowupById]);

  useEffect(() => {
    if (!id || !isPublished) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [analyticsData, confirmationsData, allConfirmations] = await Promise.all([
          analyticsApi.getFollowupAnalytics(id, timeRange),
          confirmationsApi.getMetrics(id).catch(() => null),
          confirmationsApi.getByFollowup(id).catch(() => []),
        ]);
        setAnalytics(analyticsData);
        setConfirmationMetrics(confirmationsData);

        // Filter to only show confirmations that have comments (feedback)
        const commentsWithFeedback = (allConfirmations || []).filter(
          (c: FollowupConfirmation) => c.comment && c.comment.trim().length > 0
        );
        setFeedbackComments(commentsWithFeedback);

        // Extract link clicks from events (this would ideally be a separate API endpoint)
        // For now, we'll aggregate from the analytics data
        const linkClicksMap = new Map<string, LinkClickData>();
        // Note: In a full implementation, you'd have a dedicated API for this
        // For now, showing total link clicks as a single entry
        if (analyticsData.linkClicks > 0) {
          linkClicksMap.set('all', {
            url: 'All clicked links',
            count: analyticsData.linkClicks,
          });
        }
        setLinkClicks(Array.from(linkClicksMap.values()));

        // Section engagement would also come from a dedicated API
        // For demonstration, we'll show the three main sections
        setSectionEngagement([
          { sectionId: 'meeting-recap', sectionTitle: 'Meeting Recap', totalTimeMs: 0, viewCount: 0 },
          { sectionId: 'value-proposition', sectionTitle: 'Value Proposition', totalTimeMs: 0, viewCount: 0 },
          { sectionId: 'next-steps', sectionTitle: 'Next Steps', totalTimeMs: 0, viewCount: 0 },
        ]);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [id, timeRange, isPublished]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8E4E4] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!followup) {
    return (
      <div className="min-h-screen bg-[#E8E4E4] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Follow-up not found
          </h2>
          <Link to="/follow-ups" className="text-[#2E2827] hover:underline">
            Back to Follow-ups
          </Link>
        </div>
      </div>
    );
  }

  if (!isPublished) {
    return (
      <div className="min-h-screen bg-[#E8E4E4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(`/follow-ups/${id}`)}
              className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-4 transition-colors"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Back to Follow-up
            </button>
            <h1 className="text-4xl font-bold text-[#2E2827]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {followup.title}
            </h1>
          </div>

          {/* Not Published State */}
          <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-2xl border-2 border-slate-200 p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2E2827] to-purple-700 rounded-2xl mb-6 shadow-lg">
              <ChartBarIcon className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Analytics Not Available
            </h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Publish this follow-up to start tracking engagement and collecting analytics data.
            </p>
            <Link
              to={`/follow-ups/${id}`}
              className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#2E2827] hover:shadow-xl transition-all duration-300"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Go to Follow-up
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate derived metrics
  const deviceBreakdown = {
    desktop: analytics?.deviceBreakdown?.desktop || analytics?.deviceBreakdown?.DESKTOP || 0,
    mobile: analytics?.deviceBreakdown?.mobile || analytics?.deviceBreakdown?.MOBILE || 0,
    tablet: analytics?.deviceBreakdown?.tablet || analytics?.deviceBreakdown?.TABLET || 0,
  };
  const totalDevices = deviceBreakdown.desktop + deviceBreakdown.mobile + deviceBreakdown.tablet;

  // Feedback calculations
  const recapPositive = confirmationMetrics?.byType?.RECAP_ACCURATE || 0;
  const recapNegative = confirmationMetrics?.byType?.RECAP_INACCURATE || 0;
  const recapTotal = recapPositive + recapNegative;
  const recapPositivePercent = recapTotal > 0 ? Math.round((recapPositive / recapTotal) * 100) : 0;

  const valuePropPositive = confirmationMetrics?.byType?.VALUE_PROP_CLEAR || 0;
  const valuePropNegative = confirmationMetrics?.byType?.VALUE_PROP_UNCLEAR || 0;
  const valuePropTotal = valuePropPositive + valuePropNegative;
  const valuePropPositivePercent = valuePropTotal > 0 ? Math.round((valuePropPositive / valuePropTotal) * 100) : 0;

  const interestCount = (confirmationMetrics?.byType?.INTERESTED || 0) + (confirmationMetrics?.byType?.SCHEDULE_CALL || 0);

  const totalFeedbackPositive = recapPositive + valuePropPositive + interestCount;
  const totalFeedbackNegative = recapNegative + valuePropNegative;
  const totalFeedback = totalFeedbackPositive + totalFeedbackNegative;
  const overallFeedbackScore = totalFeedback > 0 ? Math.round((totalFeedbackPositive / totalFeedback) * 100) : 0;

  // Format duration
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  };

  return (
    <div className="min-h-screen bg-[#E8E4E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/follow-ups/${id}`)}
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-4 transition-colors"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to Follow-up
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-[#2E2827] mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {followup.title}
              </h1>
              <p className="text-slate-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Detailed analytics and engagement insights
              </p>
            </div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 bg-white border-2 border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#2E2827] focus:border-[#2E2827] transition-all"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <option value="24h">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="all">All time</option>
            </select>
          </div>
        </div>

        {/* Summary Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Unique Visitors */}
          <div className="bg-white rounded-2xl border-2 border-[#D0CCE0] p-6 hover:border-[#2E2827] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Visitors
              </span>
            </div>
            <p className="text-4xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {analytics?.uniqueVisitors || 0}
            </p>
            <p className="text-sm text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Unique visitors
            </p>
          </div>

          {/* Total Page Views */}
          <div className="bg-white rounded-2xl border-2 border-[#D0CCE0] p-6 hover:border-[#2E2827] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <EyeIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Views
              </span>
            </div>
            <p className="text-4xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {analytics?.totalViews || 0}
            </p>
            <p className="text-sm text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Total page views
            </p>
          </div>

          {/* Average Time on Page */}
          <div className="bg-white rounded-2xl border-2 border-[#D0CCE0] p-6 hover:border-[#2E2827] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Avg Time
              </span>
            </div>
            <p className="text-4xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {formatDuration(analytics?.averageDuration || 0)}
            </p>
            <p className="text-sm text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Average time on page
            </p>
          </div>

          {/* Interest Signals */}
          <div className="bg-white rounded-2xl border-2 border-[#D0CCE0] p-6 hover:border-[#2E2827] hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <SparklesIcon className="h-6 w-6 text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Interest
              </span>
            </div>
            <p className="text-4xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              {interestCount}
            </p>
            <p className="text-sm text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Interested confirmations
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Feedback Section */}
            <div className="bg-white rounded-2xl border-2 border-[#D0CCE0] overflow-hidden hover:border-[#2E2827] transition-colors duration-300">
              <div className="px-6 py-5 border-b-2 border-slate-100 bg-gradient-to-r from-white to-slate-50">
                <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Feedback Overview
                </h2>
                <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Prospect responses and sentiment
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Overall Score */}
                <div className="bg-gradient-to-br from-slate-50 to-purple-50 rounded-xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Overall Feedback Score
                    </span>
                    <span className="text-2xl font-bold text-[#2E2827]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {overallFeedbackScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#2E2827] to-purple-600 rounded-full transition-all duration-500"
                      style={{ width: `${overallFeedbackScore}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Based on {totalFeedback} total responses
                  </p>
                </div>

                {/* Recap Feedback */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Recap Feedback
                    </span>
                    <span className="text-sm text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {recapTotal} responses
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircleIcon className="h-5 w-5 text-emerald-500" />
                        <span className="text-sm font-medium text-slate-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          Positive: {recapPositive}
                        </span>
                        <span className="text-xs text-slate-400">({recapPositivePercent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${recapPositivePercent}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircleIcon className="h-5 w-5 text-rose-500" />
                        <span className="text-sm font-medium text-slate-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          Negative: {recapNegative}
                        </span>
                        <span className="text-xs text-slate-400">({recapTotal > 0 ? 100 - recapPositivePercent : 0}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-rose-500 rounded-full transition-all duration-500"
                          style={{ width: `${recapTotal > 0 ? 100 - recapPositivePercent : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Value Prop Feedback */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-semibold text-slate-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Value Proposition Feedback
                    </span>
                    <span className="text-sm text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {valuePropTotal} responses
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <HandThumbUpIcon className="h-5 w-5 text-emerald-500" />
                        <span className="text-sm font-medium text-slate-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          Resonates: {valuePropPositive}
                        </span>
                        <span className="text-xs text-slate-400">({valuePropPositivePercent}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${valuePropPositivePercent}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <HandThumbDownIcon className="h-5 w-5 text-amber-500" />
                        <span className="text-sm font-medium text-slate-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                          Needs more: {valuePropNegative}
                        </span>
                        <span className="text-xs text-slate-400">({valuePropTotal > 0 ? 100 - valuePropPositivePercent : 0}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-500"
                          style={{ width: `${valuePropTotal > 0 ? 100 - valuePropPositivePercent : 0}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Comments Section */}
            <div className="bg-white rounded-2xl border-2 border-[#D0CCE0] overflow-hidden hover:border-[#2E2827] transition-colors duration-300">
              <div className="px-6 py-5 border-b-2 border-slate-100 bg-gradient-to-r from-white to-slate-50">
                <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Feedback Comments
                </h2>
                <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Comments from prospect feedback
                </p>
              </div>
              <div className="p-6">
                {feedbackComments.length > 0 ? (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {feedbackComments.map((confirmation) => {
                      // Parse the comment to extract name if format is [Name] Comment
                      const commentMatch = confirmation.comment?.match(/^\[([^\]]+)\]\s*(.*)$/);
                      const name = commentMatch ? commentMatch[1] : null;
                      const comment = commentMatch ? commentMatch[2] : confirmation.comment;

                      // Determine badge color and label based on type
                      const typeInfo: Record<string, { label: string; color: string }> = {
                        RECAP_INACCURATE: { label: 'Recap Feedback', color: 'bg-rose-100 text-rose-700 border-rose-200' },
                        VALUE_PROP_UNCLEAR: { label: 'Value Prop Feedback', color: 'bg-amber-100 text-amber-700 border-amber-200' },
                        RECAP_ACCURATE: { label: 'Recap Positive', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                        VALUE_PROP_CLEAR: { label: 'Value Prop Positive', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                        INTERESTED: { label: 'Interest', color: 'bg-blue-100 text-blue-700 border-blue-200' },
                        SCHEDULE_CALL: { label: 'Schedule Call', color: 'bg-purple-100 text-purple-700 border-purple-200' },
                      };

                      const info = typeInfo[confirmation.type] || { label: confirmation.type, color: 'bg-slate-100 text-slate-700 border-slate-200' };
                      const timestamp = new Date(confirmation.confirmedAt);

                      return (
                        <div
                          key={confirmation.id}
                          className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors duration-200"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0">
                              <ChatBubbleLeftIcon className="h-5 w-5 text-slate-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                {name && (
                                  <span className="font-semibold text-slate-900 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                    {name}
                                  </span>
                                )}
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${info.color}`} style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                  {info.label}
                                </span>
                                <span className="text-xs text-slate-400" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                  {timestamp.toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })} at {timestamp.toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                  })}
                                </span>
                              </div>
                              <p className="text-sm text-slate-700 leading-relaxed" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {comment || '(No comment provided)'}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <ChatBubbleLeftIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif" }}>No feedback comments yet</p>
                    <p className="text-xs mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Comments will appear here when visitors provide feedback
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Section Engagement */}
            <div className="bg-white rounded-2xl border-2 border-[#D0CCE0] overflow-hidden hover:border-[#2E2827] transition-colors duration-300">
              <div className="px-6 py-5 border-b-2 border-slate-100 bg-gradient-to-r from-white to-slate-50">
                <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Section Engagement
                </h2>
                <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Time spent on each section
                </p>
              </div>
              <div className="p-6 space-y-4">
                {sectionEngagement.length > 0 ? (
                  sectionEngagement.map((section, index) => {
                    const maxTime = Math.max(...sectionEngagement.map(s => s.totalTimeMs), 1);
                    const percentage = (section.totalTimeMs / maxTime) * 100;
                    const colors = [
                      'from-blue-500 to-blue-600',
                      'from-purple-500 to-purple-600',
                      'from-emerald-500 to-emerald-600',
                    ];
                    return (
                      <div key={section.sectionId}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-slate-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {section.sectionTitle}
                          </span>
                          <span className="text-sm text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            {section.totalTimeMs > 0 ? formatDuration(Math.floor(section.totalTimeMs / 1000)) : 'No data'}
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                            style={{ width: section.totalTimeMs > 0 ? `${percentage}%` : '5%' }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <ChartBarIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif" }}>No section engagement data yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Link Clicks */}
            <div className="bg-white rounded-2xl border-2 border-[#D0CCE0] overflow-hidden hover:border-[#2E2827] transition-colors duration-300">
              <div className="px-6 py-5 border-b-2 border-slate-100 bg-gradient-to-r from-white to-slate-50">
                <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Link Clicks
                </h2>
                <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  External links clicked by visitors
                </p>
              </div>
              <div className="p-6">
                {analytics?.linkClicks && analytics.linkClicks > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#2E2827] flex items-center justify-center">
                          <LinkIcon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            Total Link Clicks
                          </p>
                          <p className="text-xs text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                            All external links
                          </p>
                        </div>
                      </div>
                      <span className="text-xl font-bold text-[#2E2827]" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {analytics.linkClicks}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <CursorArrowRaysIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif" }}>No link clicks yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Device Breakdown */}
            <div className="bg-white rounded-2xl border-2 border-[#D0CCE0] overflow-hidden hover:border-[#2E2827] transition-colors duration-300">
              <div className="px-6 py-5 border-b-2 border-slate-100 bg-gradient-to-r from-white to-slate-50">
                <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Device Breakdown
                </h2>
                <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  How visitors access your follow-up
                </p>
              </div>
              <div className="p-6 space-y-4">
                {/* Desktop */}
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ComputerDesktopIcon className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-semibold text-slate-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Desktop
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {deviceBreakdown.desktop}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({totalDevices > 0 ? Math.round((deviceBreakdown.desktop / totalDevices) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 group-hover:scale-x-105 origin-left"
                      style={{ width: `${totalDevices > 0 ? (deviceBreakdown.desktop / totalDevices) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Mobile */}
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DevicePhoneMobileIcon className="h-5 w-5 text-purple-600" />
                      <span className="text-sm font-semibold text-slate-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Mobile
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {deviceBreakdown.mobile}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({totalDevices > 0 ? Math.round((deviceBreakdown.mobile / totalDevices) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 group-hover:scale-x-105 origin-left"
                      style={{ width: `${totalDevices > 0 ? (deviceBreakdown.mobile / totalDevices) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Tablet */}
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ComputerDesktopIcon className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-semibold text-slate-700" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        Tablet
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                        {deviceBreakdown.tablet}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({totalDevices > 0 ? Math.round((deviceBreakdown.tablet / totalDevices) * 100) : 0}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-500 group-hover:scale-x-105 origin-left"
                      style={{ width: `${totalDevices > 0 ? (deviceBreakdown.tablet / totalDevices) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visitor Timeline */}
            <div className="bg-white rounded-2xl border-2 border-[#D0CCE0] overflow-hidden hover:border-[#2E2827] transition-colors duration-300">
              <div className="px-6 py-5 border-b-2 border-slate-100 bg-gradient-to-r from-white to-slate-50">
                <h2 className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Visitor Timeline
                </h2>
                <p className="text-sm text-slate-500 mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Recent sessions ({analytics?.recentSessions?.length || 0})
                </p>
              </div>
              <div className="p-6">
                {analytics?.recentSessions && analytics.recentSessions.length > 0 ? (
                  <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
                    {analytics.recentSessions.map((session, index) => {
                      const timestamp = session.sessionStart ? new Date(session.sessionStart) : null;
                      const isValidDate = timestamp && !isNaN(timestamp.getTime());

                      return (
                        <div
                          key={session.id || index}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-300"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-slate-900 text-sm" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {isValidDate
                                  ? timestamp.toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                    })
                                  : 'Recent'}
                              </span>
                              {isValidDate && (
                                <span className="text-xs text-slate-500 font-medium" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                  {timestamp.toLocaleTimeString('en-US', {
                                    hour: 'numeric',
                                    minute: '2-digit',
                                    hour12: true,
                                  })}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              {session.locationCity && (
                                <span className="flex items-center gap-1">
                                  <GlobeAltIcon className="h-3 w-3" />
                                  {session.locationCity}
                                  {session.locationCountry && `, ${session.locationCountry}`}
                                </span>
                              )}
                              {session.pageDuration && session.pageDuration > 0 && (
                                <span className="flex items-center gap-1">
                                  <ClockIcon className="h-3 w-3" />
                                  {formatDuration(session.pageDuration)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            {session.browser && (
                              <span className="px-2 py-1 bg-white rounded-md text-slate-700 font-medium border border-slate-200" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                                {session.browser}
                              </span>
                            )}
                            <span className="px-2 py-1 bg-[#2E2827] text-white rounded-md font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              {session.deviceType}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <UserGroupIcon className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                    <p style={{ fontFamily: "'Space Grotesk', sans-serif" }}>No visitors yet</p>
                    <p className="text-xs mt-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Share your follow-up to start tracking
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Animation Styles */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        `}</style>
      </div>
    </div>
  );
}
