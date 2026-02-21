import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, MagnifyingGlassIcon, DocumentTextIcon, EyeIcon, CalendarIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { useFollowupsStore } from '@/store/followups-store';
import { useCompaniesStore } from '@/store/companies-store';
import { FollowupCard } from '@/components/followups/FollowupCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { analyticsApi } from '@/services/api';
import type { AnalyticsSummary } from '@meeting-followup/shared';

type StatusFilter = 'all' | 'draft' | 'published';

export default function FollowupsListPage() {
  const { followups, loading, error, fetchFollowups } = useFollowupsStore();
  const { companies, fetchCompanies } = useCompaniesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchFollowups();
    fetchCompanies();

    // Fetch analytics summary
    const fetchAnalytics = async () => {
      try {
        setAnalyticsLoading(true);
        const summary = await analyticsApi.getSummary('30d');
        setAnalyticsSummary(summary);
      } catch (err) {
        console.error('Failed to fetch analytics summary:', err);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchAnalytics();
  }, [fetchFollowups, fetchCompanies]);

  // Filter follow-ups based on search and status
  const filteredFollowups = followups.filter((followup) => {
    const matchesSearch =
      (followup.title?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
      (followup.meetingType?.toLowerCase() ?? '').includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'draft' && followup.status === 'DRAFT') ||
      (statusFilter === 'published' && followup.status === 'PUBLISHED');

    return matchesSearch && matchesStatus;
  });

  // Paginate filtered follow-ups
  const totalPages = Math.ceil(filteredFollowups.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFollowups = filteredFollowups.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Get sender and receiver company names
  const getSenderCompanyName = (senderCompanyId: string) => {
    return companies.find((c) => c.id === senderCompanyId)?.name;
  };

  const getReceiverCompanyName = (receiverCompanyId: string) => {
    return companies.find((c) => c.id === receiverCompanyId)?.name;
  };

  // Count by status
  const draftCount = followups.filter((f) => f.status === 'DRAFT').length;
  const publishedCount = followups.filter((f) => f.status === 'PUBLISHED').length;

  // Get most recent follow-up date
  const mostRecentFollowup = followups.length > 0
    ? followups.reduce((latest, current) => {
        const latestDate = latest.createdAt ? new Date(latest.createdAt) : new Date(0);
        const currentDate = current.createdAt ? new Date(current.createdAt) : new Date(0);
        // Handle invalid dates
        if (isNaN(latestDate.getTime())) return current;
        if (isNaN(currentDate.getTime())) return latest;
        return currentDate > latestDate ? current : latest;
      })
    : null;

  const mostRecentDate = (() => {
    if (!mostRecentFollowup?.createdAt) return null;
    const date = new Date(mostRecentFollowup.createdAt);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  })();

  if (loading && followups.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8E4E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex-1 min-w-0">
            <h1
              className="text-5xl md:text-6xl font-normal text-slate-900 mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Follow-ups
            </h1>
            <p className="text-lg text-slate-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Create and manage meeting follow-ups
            </p>
          </div>
          <div className="mt-6 flex md:mt-0 md:ml-4">
            <Link
              to="/follow-ups/new"
              className="group inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:shadow-xl hover:shadow-[#2E2827]/30 hover:scale-105 transition-all duration-300"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              New Follow-up
            </Link>
          </div>
        </div>

        {/* Analytics Summary Card */}
        <div className="mb-10 animate-in fade-in duration-700" style={{ animationDelay: '50ms' }}>
          <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-slate-800 rounded-2xl p-6 shadow-xl shadow-purple-900/20">
            <div className="flex items-center gap-3 mb-5">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <ChartBarIcon className="h-5 w-5 text-white" />
              </div>
              <h2
                className="text-lg font-semibold text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Analytics Overview
              </h2>
            </div>

            {analyticsLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-pulse flex gap-6">
                  <div className="h-16 w-32 bg-white/20 rounded-xl"></div>
                  <div className="h-16 w-32 bg-white/20 rounded-xl"></div>
                  <div className="h-16 w-40 bg-white/20 rounded-xl"></div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Follow-ups */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <DocumentTextIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p
                        className="text-2xl font-bold text-white"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {followups.length}
                      </p>
                      <p
                        className="text-xs text-white/70 font-medium uppercase tracking-wide"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        Total Follow-ups
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total Views */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <EyeIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p
                        className="text-2xl font-bold text-white"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {analyticsSummary?.totalViews ?? 0}
                      </p>
                      <p
                        className="text-xs text-white/70 font-medium uppercase tracking-wide"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        Total Views
                      </p>
                    </div>
                  </div>
                </div>

                {/* Most Recent */}
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p
                        className="text-lg font-bold text-white"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        {mostRecentDate ?? 'N/A'}
                      </p>
                      <p
                        className="text-xs text-white/70 font-medium uppercase tracking-wide"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        Most Recent
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Tabs */}
        <div className="mb-8 animate-in fade-in duration-700" style={{ animationDelay: '100ms' }}>
          <nav className="flex flex-wrap gap-3" aria-label="Tabs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-5 py-2.5 font-semibold text-sm rounded-xl border-2 transition-all duration-300 ${
                statusFilter === 'all'
                  ? 'bg-[#2E2827] border-[#3E5CB8] text-white shadow-lg shadow-[#2E2827]/30'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-[#2E2827] hover:bg-slate-50'
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              All ({followups.length})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-5 py-2.5 font-semibold text-sm rounded-xl border-2 transition-all duration-300 ${
                statusFilter === 'draft'
                  ? 'bg-gradient-to-br from-amber-400 to-amber-600 border-amber-500 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-amber-400 hover:bg-amber-50'
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Drafts ({draftCount})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-5 py-2.5 font-semibold text-sm rounded-xl border-2 transition-all duration-300 ${
                statusFilter === 'published'
                  ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 border-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-white border-slate-300 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50'
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Published ({publishedCount})
            </button>
          </nav>
        </div>

        {/* Search bar */}
        <div className="mb-10 animate-in fade-in duration-700" style={{ animationDelay: '200ms' }}>
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-12 pr-4 py-4 border-2 border-[#D0CCE0] rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300 text-base"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              placeholder="Search follow-ups by title or meeting type..."
            />
          </div>
        </div>

      {/* Error state */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading follow-ups</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => fetchFollowups()}
                  className="text-sm font-medium text-red-800 hover:text-red-900"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Follow-ups grid */}
        {paginatedFollowups.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-700" style={{ animationDelay: '300ms' }}>
              {paginatedFollowups.map((followup) => (
                <FollowupCard
                  key={followup.id}
                  followup={followup}
                  senderCompanyName={getSenderCompanyName(followup.senderCompanyId)}
                  receiverCompanyName={getReceiverCompanyName(followup.receiverCompanyId)}
                />
              ))}
            </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(startIndex + itemsPerPage, filteredFollowups.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredFollowups.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === currentPage
                            ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
          </>
        ) : !loading && (
          <div className="relative bg-[#D0CCE0]/20 rounded-3xl border-2 border-[#D0CCE0] p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center">
                <DocumentTextIcon className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {searchQuery ? 'No follow-ups found' : 'No follow-ups yet'}
              </h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'Get started by creating your first follow-up'}
              </p>
              {!searchQuery && (
                <Link
                  to="/follow-ups/new"
                  className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:shadow-xl hover:shadow-[#2E2827]/30 hover:scale-105 transition-all duration-300"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  New Follow-up
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Animation Styles */}
        <style>{`
          /* Import Space Grotesk font */
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slide-in-from-bottom-4 {
            from { transform: translateY(1rem); }
            to { transform: translateY(0); }
          }
          .animate-in {
            animation-fill-mode: both;
          }
          .fade-in {
            animation-name: fade-in;
          }
          .slide-in-from-bottom-4 {
            animation-name: slide-in-from-bottom-4;
          }
        `}</style>
      </div>
    </div>
  );
}
