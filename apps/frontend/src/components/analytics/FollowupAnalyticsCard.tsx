import { useEffect, useState } from 'react';
import { EyeIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, ChartBarIcon, ArrowTrendingUpIcon, ArrowTrendingDownIcon, SparklesIcon, HandThumbUpIcon, ChatBubbleLeftRightIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { analyticsApi, confirmationsApi } from '@/services/api';
import type { ConfirmationMetrics } from '@meeting-followup/shared';

interface AnalyticsData {
  totalViews: number;
  uniqueVisitors: number;
  deviceBreakdown: {
    MOBILE: number;
    TABLET: number;
    DESKTOP: number;
  };
  recentSessions: Array<{
    sessionStart: string | Date;
    deviceType: string;
    browser?: string;
    locationCity?: string;
    locationCountry?: string;
  }>;
}

interface FollowupAnalyticsCardProps {
  followupId: string;
  isPublished: boolean;
}

interface DataPoint {
  x: number;
  y: number;
  timestamp: number;
  label: string;
}

// Helper function to consolidate sessions by time periods with better labeling
const consolidateSessionsByTime = (sessions: Array<{ sessionStart: string | Date }>): {
  dataPoints: DataPoint[];
  useWeekly: boolean;
  maxCount: number;
  timeLabels: string[];
  totalCount?: number;
} => {
  if (sessions.length === 0) return { dataPoints: [], useWeekly: false, maxCount: 0, timeLabels: [] };

  // Sort sessions by sessionStart
  const sortedSessions = [...sessions].sort((a, b) =>
    new Date(a.sessionStart).getTime() - new Date(b.sessionStart).getTime()
  );

  const earliestTime = new Date(sortedSessions[0].sessionStart).getTime();
  const latestTime = new Date(sortedSessions[sortedSessions.length - 1].sessionStart).getTime();
  const elapsedDays = (latestTime - earliestTime) / (1000 * 60 * 60 * 24);

  // Choose grouping based on time range
  let bucketSize: number;
  let useWeekly = false;
  let formatLabel: (timestamp: number) => string;

  if (elapsedDays <= 1) {
    // Hourly for 24 hours or less
    bucketSize = 60 * 60 * 1000; // 1 hour
    formatLabel = (timestamp) => new Date(timestamp).toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
  } else if (elapsedDays <= 7) {
    // Daily for a week
    bucketSize = 24 * 60 * 60 * 1000; // 1 day
    formatLabel = (timestamp) => new Date(timestamp).toLocaleDateString('en-US', { weekday: 'short' });
  } else if (elapsedDays <= 30) {
    // Daily for a month
    bucketSize = 24 * 60 * 60 * 1000; // 1 day
    formatLabel = (timestamp) => new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } else {
    // Weekly for longer periods
    useWeekly = true;
    bucketSize = 7 * 24 * 60 * 60 * 1000; // 1 week
    formatLabel = (timestamp) => new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  // Create buckets
  const buckets = new Map<number, number>();

  sortedSessions.forEach(session => {
    const sessionTime = new Date(session.sessionStart).getTime();
    const bucketKey = Math.floor((sessionTime - earliestTime) / bucketSize);
    buckets.set(bucketKey, (buckets.get(bucketKey) || 0) + 1);
  });

  // Convert to array of data points with labels
  const dataPoints: DataPoint[] = Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([bucketIndex, count]) => {
      const timestamp = earliestTime + (bucketIndex * bucketSize);
      return {
        x: bucketIndex,
        y: count,
        timestamp,
        label: formatLabel(timestamp)
      };
    });

  // Generate all time labels (including empty buckets for better x-axis)
  const maxBucket = Math.max(...dataPoints.map(p => p.x), 0);
  const timeLabels: string[] = [];
  for (let i = 0; i <= maxBucket; i++) {
    const timestamp = earliestTime + (i * bucketSize);
    timeLabels.push(formatLabel(timestamp));
  }

  return {
    dataPoints,
    useWeekly,
    maxCount: Math.max(...dataPoints.map(p => p.y), 1),
    timeLabels,
    totalCount: sortedSessions.length
  };
};

export function FollowupAnalyticsCard({ followupId, isPublished }: FollowupAnalyticsCardProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [confirmationMetrics, setConfirmationMetrics] = useState<ConfirmationMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  useEffect(() => {
    if (!isPublished) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [analyticsData, confirmationsData] = await Promise.all([
          analyticsApi.getFollowupAnalytics(followupId, timeRange),
          confirmationsApi.getMetrics(followupId).catch(() => null),
        ]);
        setAnalytics(analyticsData);
        setConfirmationMetrics(confirmationsData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [followupId, timeRange, isPublished]);

  if (!isPublished) {
    return (
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl border-2 border-slate-200 p-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
          <ChartBarIcon className="h-8 w-8 text-white" />
        </div>
        <p className="text-base text-slate-700 font-semibold mb-2">
          Ready to Track Engagement?
        </p>
        <p className="text-sm text-slate-500">
          Publish this follow-up to unlock powerful analytics
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-6 border border-slate-200">
        <div className="animate-pulse">
          <div className="h-5 bg-slate-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            <div className="h-24 bg-slate-100 rounded-lg"></div>
            <div className="h-48 bg-slate-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const chartData = analytics.recentSessions?.length > 0
    ? consolidateSessionsByTime(analytics.recentSessions)
    : null;

  // Calculate engagement rate (unique vs total)
  const engagementRate = analytics.totalViews > 0
    ? ((analytics.uniqueVisitors / analytics.totalViews) * 100).toFixed(0)
    : '0';

  // Find peak day/time
  const peakPoint = chartData?.dataPoints.reduce((max, point) =>
    point.y > max.y ? point : max
  , chartData.dataPoints[0]);

  // Calculate device breakdown from recentSessions if backend data is missing/incorrect
  const deviceBreakdown = (() => {
    const backendTotal = (analytics.deviceBreakdown.DESKTOP || 0) +
                         (analytics.deviceBreakdown.MOBILE || 0) +
                         (analytics.deviceBreakdown.TABLET || 0);

    // If backend has valid data, use it
    if (backendTotal > 0) {
      return analytics.deviceBreakdown;
    }

    // Otherwise calculate from recentSessions
    const counts = { DESKTOP: 0, MOBILE: 0, TABLET: 0 };
    analytics.recentSessions?.forEach(session => {
      const deviceType = session.deviceType?.toUpperCase();
      if (deviceType && deviceType in counts) {
        counts[deviceType as keyof typeof counts]++;
      }
    });

    return counts;
  })();

  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-slate-200">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-6">
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <SparklesIcon className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Engagement Analytics</h2>
              <p className="text-sm text-white/80 mt-0.5">Real-time performance insights</p>
            </div>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="text-sm bg-white/20 backdrop-blur-sm border-white/30 text-white rounded-lg px-3 py-2 font-medium focus:ring-2 focus:ring-white/50 focus:border-white/50"
          >
            <option value="24h" className="text-slate-800">Last 24 hours</option>
            <option value="7d" className="text-slate-800">Last 7 days</option>
            <option value="30d" className="text-slate-800">Last 30 days</option>
            <option value="all" className="text-slate-800">All time</option>
          </select>
        </div>
      </div>

      <div className="p-6">
        {/* Key Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200 transform transition-all hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Total Views</span>
              <EyeIcon className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-3xl font-extrabold text-blue-900 mb-1">{analytics.totalViews}</p>
            <div className="flex items-center text-xs text-blue-600">
              <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
              <span className="font-semibold">Tracking</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200 transform transition-all hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Unique Visitors</span>
              <EyeIcon className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-3xl font-extrabold text-purple-900 mb-1">{analytics.uniqueVisitors}</p>
            <div className="flex items-center text-xs text-purple-600">
              <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
              <span className="font-semibold">{engagementRate}% engagement</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl p-5 border border-pink-200 transform transition-all hover:scale-105 hover:shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-pink-700">Peak Views</span>
              <ChartBarIcon className="h-5 w-5 text-pink-600" />
            </div>
            <p className="text-3xl font-extrabold text-pink-900 mb-1">{peakPoint?.y || 0}</p>
            <div className="text-xs text-pink-600 font-semibold truncate">
              {peakPoint?.label || 'N/A'}
            </div>
          </div>
        </div>

        {/* Enhanced Chart */}
        {chartData && chartData.dataPoints.length > 0 ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">
                Views Over Time
                <span className="text-sm font-normal text-slate-500 ml-2">
                  ({chartData.useWeekly ? 'Weekly' : chartData.dataPoints.length <= 24 ? 'Hourly' : 'Daily'})
                </span>
              </h3>
              <div className="text-sm text-slate-600">
                <span className="font-semibold">{chartData.totalCount}</span> total views
              </div>
            </div>

            <div className="relative bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 rounded-xl p-6 border border-slate-200 shadow-inner" style={{ height: '280px' }}>
              {/* Hover tooltip */}
              {hoveredPoint && (
                <div
                  className="absolute z-10 bg-slate-900 text-white px-3 py-2 rounded-lg shadow-xl text-xs font-semibold pointer-events-none"
                  style={{
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  }}
                >
                  <div className="text-center">
                    <div className="text-slate-300 mb-1">{hoveredPoint.label}</div>
                    <div className="text-lg">{hoveredPoint.y} view{hoveredPoint.y !== 1 ? 's' : ''}</div>
                  </div>
                </div>
              )}

              <svg
                className="w-full h-full"
                viewBox="0 0 800 200"
                preserveAspectRatio="none"
                onMouseLeave={() => setHoveredPoint(null)}
              >
                <defs>
                  {/* Gradient for line */}
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>

                  {/* Gradient for area fill */}
                  <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.05" />
                  </linearGradient>

                  {/* Glow filter */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                {/* Grid lines */}
                {[0, 1, 2, 3, 4].map(i => (
                  <g key={i}>
                    <line
                      x1="0"
                      y1={i * 50}
                      x2="800"
                      y2={i * 50}
                      stroke="#e2e8f0"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                    />
                    <text
                      x="5"
                      y={i * 50 - 5}
                      fill="#94a3b8"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {Math.round(chartData.maxCount * (1 - i / 4))}
                    </text>
                  </g>
                ))}

                {/* Area fill */}
                {chartData.dataPoints.length > 0 && (
                  <polygon
                    points={
                      chartData.dataPoints
                        .map((point, index) => {
                          const x = (index / Math.max(chartData.dataPoints.length - 1, 1)) * 800;
                          const y = 190 - ((point.y / chartData.maxCount) * 170);
                          return `${x},${y}`;
                        })
                        .join(' ') +
                      ` 800,200 0,200`
                    }
                    fill="url(#areaGradient)"
                    opacity="0.8"
                  />
                )}

                {/* Line chart with glow */}
                {chartData.dataPoints.length > 1 && (
                  <polyline
                    points={chartData.dataPoints
                      .map((point, index) => {
                        const x = (index / Math.max(chartData.dataPoints.length - 1, 1)) * 800;
                        const y = 190 - ((point.y / chartData.maxCount) * 170);
                        return `${x},${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="url(#lineGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#glow)"
                  />
                )}

                {/* Data points with hover interaction */}
                {chartData.dataPoints.map((point, index) => {
                  const x = (index / Math.max(chartData.dataPoints.length - 1, 1)) * 800;
                  const y = 190 - ((point.y / chartData.maxCount) * 170);
                  const isHovered = hoveredPoint?.x === point.x;

                  return (
                    <g key={index}>
                      {/* Invisible larger hitbox for easier hovering */}
                      <circle
                        cx={x}
                        cy={y}
                        r="12"
                        fill="transparent"
                        onMouseEnter={() => setHoveredPoint(point)}
                        style={{ cursor: 'pointer' }}
                      />
                      {/* Visible point */}
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? "7" : "5"}
                        fill={isHovered ? "#3b82f6" : "white"}
                        stroke="url(#lineGradient)"
                        strokeWidth="3"
                        filter={isHovered ? "url(#glow)" : undefined}
                        style={{
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                      />
                      {/* Pulse animation on hover */}
                      {isHovered && (
                        <circle
                          cx={x}
                          cy={y}
                          r="7"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          opacity="0.6"
                        >
                          <animate
                            attributeName="r"
                            from="7"
                            to="15"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="opacity"
                            from="0.6"
                            to="0"
                            dur="1s"
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                })}

                {/* X-axis labels */}
                {chartData.dataPoints.filter((_, i) => {
                  // Show fewer labels if there are too many data points
                  const step = Math.max(1, Math.floor(chartData.dataPoints.length / 8));
                  return i % step === 0;
                }).map((point, index) => {
                  const originalIndex = chartData.dataPoints.indexOf(point);
                  const x = (originalIndex / Math.max(chartData.dataPoints.length - 1, 1)) * 800;
                  return (
                    <text
                      key={index}
                      x={x}
                      y="198"
                      fill="#64748b"
                      fontSize="10"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {point.label}
                    </text>
                  );
                })}
              </svg>
            </div>
          </div>
        ) : (
          <div className="mb-8 text-center py-12 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
            <ChartBarIcon className="h-12 w-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-600 font-medium">No views yet</p>
            <p className="text-xs text-slate-500 mt-1">Share your follow-up to start tracking engagement!</p>
          </div>
        )}

        {/* Device Breakdown with visual bars */}
        <div className="mb-8">
          <h3 className="text-base font-bold text-slate-800 mb-4">Device Breakdown</h3>
          <div className="space-y-4">
            {/* Desktop */}
            {(() => {
              const count = deviceBreakdown.DESKTOP || 0;
              const percentage = analytics.totalViews > 0 ? ((count / analytics.totalViews) * 100).toFixed(0) : '0';
              return (
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ComputerDesktopIcon className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-semibold text-slate-700">Desktop</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{count}</span>
                      <span className="text-xs text-slate-500">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 group-hover:scale-x-105"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })()}

            {/* Mobile */}
            {(() => {
              const count = deviceBreakdown.MOBILE || 0;
              const percentage = analytics.totalViews > 0 ? ((count / analytics.totalViews) * 100).toFixed(0) : '0';
              return (
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <DevicePhoneMobileIcon className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-semibold text-slate-700">Mobile</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{count}</span>
                      <span className="text-xs text-slate-500">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500 group-hover:scale-x-105"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })()}

            {/* Tablet */}
            {(() => {
              const count = deviceBreakdown.TABLET || 0;
              const percentage = analytics.totalViews > 0 ? ((count / analytics.totalViews) * 100).toFixed(0) : '0';
              return (
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <ComputerDesktopIcon className="h-4 w-4 text-pink-600" />
                      <span className="text-sm font-semibold text-slate-700">Tablet</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{count}</span>
                      <span className="text-xs text-slate-500">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-pink-500 to-pink-600 rounded-full transition-all duration-500 group-hover:scale-x-105"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Micro-Commitment Confirmations */}
        {confirmationMetrics && confirmationMetrics.total > 0 && (
          <div className="mb-8">
            <h3 className="text-base font-bold text-slate-800 mb-4">
              Prospect Feedback ({confirmationMetrics.total} responses)
            </h3>

            {/* Feedback Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Recap Accuracy */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <HandThumbUpIcon className="h-4 w-4 text-green-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-green-700">Recap Accuracy</span>
                </div>
                {confirmationMetrics.recapAccuracyRate !== null ? (
                  <>
                    <p className="text-2xl font-extrabold text-green-900">{confirmationMetrics.recapAccuracyRate}%</p>
                    <p className="text-xs text-green-600">found recap accurate</p>
                  </>
                ) : (
                  <p className="text-sm text-green-600 italic">No responses yet</p>
                )}
              </div>

              {/* Value Prop Resonance */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-4 border border-purple-200">
                <div className="flex items-center gap-2 mb-2">
                  <ChatBubbleLeftRightIcon className="h-4 w-4 text-purple-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Value Prop</span>
                </div>
                {confirmationMetrics.valuePropResonanceRate !== null ? (
                  <>
                    <p className="text-2xl font-extrabold text-purple-900">{confirmationMetrics.valuePropResonanceRate}%</p>
                    <p className="text-xs text-purple-600">said it resonates</p>
                  </>
                ) : (
                  <p className="text-sm text-purple-600 italic">No responses yet</p>
                )}
              </div>

              {/* Interest */}
              <div className="bg-gradient-to-br from-cyan-50 to-teal-50 rounded-xl p-4 border border-cyan-200">
                <div className="flex items-center gap-2 mb-2">
                  <PhoneIcon className="h-4 w-4 text-cyan-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-700">Interest</span>
                </div>
                <p className="text-2xl font-extrabold text-cyan-900">
                  {(confirmationMetrics.byType?.INTERESTED || 0) + (confirmationMetrics.byType?.SCHEDULE_CALL || 0)}
                </p>
                <p className="text-xs text-cyan-600">expressed interest</p>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-700 mb-3">Response Breakdown</h4>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Recap accurate</span>
                  <span className="font-semibold text-green-700">{confirmationMetrics.byType?.RECAP_ACCURATE || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Recap issues</span>
                  <span className="font-semibold text-amber-700">{confirmationMetrics.byType?.RECAP_INACCURATE || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Value prop resonates</span>
                  <span className="font-semibold text-purple-700">{confirmationMetrics.byType?.VALUE_PROP_CLEAR || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Wants more info</span>
                  <span className="font-semibold text-blue-700">{confirmationMetrics.byType?.VALUE_PROP_UNCLEAR || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Interested</span>
                  <span className="font-semibold text-cyan-700">{confirmationMetrics.byType?.INTERESTED || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Schedule call</span>
                  <span className="font-semibold text-teal-700">{confirmationMetrics.byType?.SCHEDULE_CALL || 0}</span>
                </div>
              </div>
            </div>

            {/* Recent Confirmations */}
            {confirmationMetrics.recentConfirmations && confirmationMetrics.recentConfirmations.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Recent Feedback</h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                  {confirmationMetrics.recentConfirmations.slice(0, 5).map((confirmation, index) => {
                    const timestamp = new Date(confirmation.confirmedAt);
                    const typeLabels: Record<string, { label: string; color: string }> = {
                      RECAP_ACCURATE: { label: 'Recap accurate', color: 'green' },
                      RECAP_INACCURATE: { label: 'Recap issue', color: 'amber' },
                      VALUE_PROP_CLEAR: { label: 'Value prop resonates', color: 'purple' },
                      VALUE_PROP_UNCLEAR: { label: 'Wants more info', color: 'blue' },
                      INTERESTED: { label: 'Interested', color: 'cyan' },
                      SCHEDULE_CALL: { label: 'Schedule call', color: 'teal' },
                    };
                    const typeInfo = typeLabels[confirmation.type] || { label: confirmation.type, color: 'slate' };

                    return (
                      <div
                        key={confirmation.id || index}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircleIcon className={`h-4 w-4 text-${typeInfo.color}-500`} />
                          <span className={`text-sm font-medium text-${typeInfo.color}-700`}>
                            {typeInfo.label}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500">
                          {timestamp.toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Recent Visitors */}
        {analytics.recentSessions && analytics.recentSessions.length > 0 && (
          <div>
            <h3 className="text-base font-bold text-slate-800 mb-4">
              Recent Visitors ({analytics.recentSessions.length})
            </h3>
            <div className="space-y-2 max-h-[370px] overflow-y-auto pr-2">
              {analytics.recentSessions.map((session, index) => {
                const timestamp = session.sessionStart ? new Date(session.sessionStart) : null;
                const isValidDate = timestamp && !isNaN(timestamp.getTime());

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">
                          {isValidDate
                            ? timestamp.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'Recent'}
                        </span>
                        {isValidDate && (
                          <span className="text-xs text-slate-500 font-medium">
                            {timestamp.toLocaleTimeString('en-US', {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </span>
                        )}
                      </div>
                      {session.locationCity && (
                        <div className="text-xs text-slate-600">
                          📍 {session.locationCity}
                          {session.locationCountry && `, ${session.locationCountry}`}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      {session.browser && (
                        <span className="px-2 py-1 bg-white rounded-md text-slate-700 font-medium border border-slate-200">
                          {session.browser}
                        </span>
                      )}
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md font-semibold">
                        {session.deviceType}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
