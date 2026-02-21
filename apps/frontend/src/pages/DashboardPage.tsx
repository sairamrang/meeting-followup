import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, BuildingOfficeIcon, DocumentTextIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/auth-store';
import { useCompaniesStore } from '@/store/companies-store';
import { useFollowupsStore } from '@/store/followups-store';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { companies, loading: companiesLoading, fetchCompanies } = useCompaniesStore();
  const { followups, loading: followupsLoading, fetchFollowups } = useFollowupsStore();

  useEffect(() => {
    fetchCompanies();
    fetchFollowups();
  }, [fetchCompanies, fetchFollowups]);

  const loading = companiesLoading || followupsLoading;

  // Get recent companies (last 3)
  const recentCompanies = companies
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Get recent follow-ups (last 5)
  const recentFollowups = followups
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  // Calculate total views from all follow-ups
  // The API may return viewsCount even though it's not in the base Followup type
  const totalViews = followups.reduce((sum, followup) => sum + ((followup as any).viewsCount || 0), 0);

  if (loading && companies.length === 0 && followups.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E8E4E4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1
            className="text-5xl md:text-6xl font-bold text-[#2E2827] mb-3"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Welcome back, {user?.firstName || 'there'}!
          </h1>
          <p className="text-lg text-[#2E2827]/70" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Here's what's happening with your follow-ups
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link
            to="/companies"
            className="group relative bg-white rounded-2xl border-2 border-[#D0CCE0] p-8 hover:border-[#2E2827] hover:shadow-2xl hover:shadow-[#2E2827]/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
            style={{ animationDelay: '100ms' }}
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-[#2E2827]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#2E2827] flex items-center justify-center shadow-lg shadow-[#2E2827]/30 group-hover:scale-110 transition-transform duration-300">
                  <BuildingOfficeIcon className="h-7 w-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {companies.length}
                  </p>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Companies
              </h3>
              <div className="inline-flex items-center text-sm font-semibold text-[#2E2827] group-hover:text-[#000000] transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                View all
                <svg className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            to="/follow-ups"
            className="group relative bg-[#D0CCE0]/20 rounded-2xl border-2 border-[#D0CCE0] p-8 hover:border-[#2E2827] hover:shadow-2xl hover:shadow-[#2E2827]/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer"
            style={{ animationDelay: '200ms' }}
          >
            <div className="absolute inset-0 bg-[#2E2827]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#2E2827] flex items-center justify-center shadow-lg shadow-[#2E2827]/30 group-hover:scale-110 transition-transform duration-300">
                  <DocumentTextIcon className="h-7 w-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {followups.length}
                  </p>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Follow-ups
              </h3>
              <div className="inline-flex items-center text-sm font-semibold text-[#2E2827] group-hover:text-[#000000] transition-colors" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                View all
                <svg className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <div
            className="group relative bg-white rounded-2xl border-2 border-[#D0CCE0] p-8 hover:border-[#2E2827] hover:shadow-2xl hover:shadow-[#2E2827]/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            style={{ animationDelay: '300ms' }}
          >
            <div className="absolute inset-0 bg-[#2E2827]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative">
              <div className="flex items-center justify-between mb-6">
                <div className="w-14 h-14 rounded-xl bg-[#2E2827] flex items-center justify-center shadow-lg shadow-[#2E2827]/30 group-hover:scale-110 transition-transform duration-300">
                  <EyeIcon className="h-7 w-7 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {totalViews}
                  </p>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Total Views
              </h3>
              <span className="text-sm text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                All time
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-12 animate-in fade-in duration-700" style={{ animationDelay: '400ms' }}>
          <Link
            to="/companies"
            className="group inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#2E2827] hover:shadow-xl hover:shadow-[#2E2827]/30 hover:scale-105 transition-all duration-300"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            New Company
          </Link>
          <Link
            to="/follow-ups/new"
            className="group inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold text-slate-700 bg-white border-2 border-slate-300 hover:border-[#2E2827] hover:shadow-xl hover:shadow-[#2E2827]/10 hover:scale-105 transition-all duration-300"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
            New Follow-up
          </Link>
        </div>

        {/* Empty State - Show if no follow-ups */}
        {followups.length === 0 && companies.length === 0 && (
          <div className="relative bg-white rounded-3xl border-2 border-[#D0CCE0] p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[#D0CCE0]/10"></div>
            <div className="relative">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#D0CCE0]/20 flex items-center justify-center">
                <DocumentTextIcon className="h-10 w-10 text-[#2E2827]" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                No follow-ups yet
              </h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                Get started by creating your first company and follow-up
              </p>
              <div className="flex justify-center gap-4">
                <Link
                  to="/companies"
                  className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#2E2827] hover:shadow-xl hover:shadow-[#2E2827]/30 hover:scale-105 transition-all duration-300"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Add First Company
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Recent Content */}
        {(recentCompanies.length > 0 || recentFollowups.length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-700" style={{ animationDelay: '500ms' }}>
            {/* Recent Companies */}
            {recentCompanies.length > 0 && (
              <div className="bg-white rounded-2xl border-2 border-[#D0CCE0] overflow-hidden hover:border-[#2E2827] transition-colors duration-300">
                <div className="px-8 py-6 border-b-2 border-slate-100 bg-white">
                  <h2 className="text-xl font-semibold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Recent Companies
                  </h2>
                </div>
                <ul className="divide-y divide-slate-100">
                  {recentCompanies.map((company, index) => (
                    <li key={company.id} className="animate-in fade-in slide-in-from-left-4 duration-500" style={{ animationDelay: `${600 + index * 100}ms` }}>
                      <Link
                        to={`/companies/${company.id}`}
                        className="group block hover:bg-white px-8 py-5 transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          {company.logoUrl ? (
                            <img
                              src={company.logoUrl}
                              alt={company.name}
                              className="h-12 w-12 rounded-xl object-cover shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-xl bg-[#2E2827] flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                              <span className="text-white font-bold text-lg">
                                {company.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-slate-900 group-hover:text-[#2E2827] transition-colors truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              {company.name}
                            </p>
                            <p className="text-sm text-slate-500 truncate" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              {company.industry || 'No industry'}
                            </p>
                          </div>
                          <svg className="h-5 w-5 text-slate-400 group-hover:text-[#2E2827] group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="px-8 py-5 border-t-2 border-slate-100 bg-white">
                  <Link
                    to="/companies"
                    className="inline-flex items-center text-sm font-semibold text-[#2E2827] hover:text-[#0A2463] transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    View all companies
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            {/* Recent Follow-ups */}
            {recentFollowups.length > 0 && (
              <div className="bg-[#D0CCE0]/20 rounded-2xl border-2 border-[#D0CCE0] overflow-hidden hover:border-[#2E2827] transition-colors duration-300">
                <div className="px-8 py-6 border-b-2 border-slate-100 bg-white">
                  <h2 className="text-xl font-semibold text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    Recent Follow-ups
                  </h2>
                </div>
                <ul className="divide-y divide-slate-100">
                  {recentFollowups.map((followup, index) => (
                    <li key={followup.id} className="animate-in fade-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${600 + index * 100}ms` }}>
                      <Link
                        to={`/follow-ups/${followup.id}`}
                        className="group block hover:bg-white px-8 py-5 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-base font-semibold text-slate-900 group-hover:text-[#2E2827] transition-colors truncate mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                              {followup.title}
                            </p>
                            <div className="flex items-center gap-2">
                              {followup.status === 'PUBLISHED' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                  Published
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                                  Draft
                                </span>
                              )}
                            </div>
                          </div>
                          <svg className="h-5 w-5 text-slate-400 group-hover:text-[#2E2827] group-hover:translate-x-1 transition-all flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="px-8 py-5 border-t-2 border-slate-100 bg-white">
                  <Link
                    to="/follow-ups"
                    className="inline-flex items-center text-sm font-semibold text-[#2E2827] hover:text-[#000000] transition-colors"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    View all follow-ups
                    <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}
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
          @keyframes slide-in-from-left-4 {
            from { transform: translateX(-1rem); }
            to { transform: translateX(0); }
          }
          @keyframes slide-in-from-right-4 {
            from { transform: translateX(1rem); }
            to { transform: translateX(0); }
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
          .slide-in-from-left-4 {
            animation-name: slide-in-from-left-4;
          }
          .slide-in-from-right-4 {
            animation-name: slide-in-from-right-4;
          }
        `}</style>
      </div>
    </div>
  );
}
