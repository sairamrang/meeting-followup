import { useEffect, useState } from 'react';
import { MagnifyingGlassIcon, PlusIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { useCompaniesStore } from '@/store/companies-store';
import { CompanyCard } from '@/components/companies/CompanyCard';
import { CompanyForm } from '@/components/companies/CompanyForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Modal } from '@/components/ui/Modal';

export default function CompaniesListPage() {
  const { companies, loading, error, fetchCompanies } = useCompaniesStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // Filter companies based on search query
  const filteredCompanies = companies.filter((company) =>
    (company.name?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
    (company.website?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
    (company.industry?.toLowerCase() ?? '').includes(searchQuery.toLowerCase())
  );

  // Paginate filtered companies
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const handleNewCompany = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    fetchCompanies(); // Refresh the list
  };

  if (loading && companies.length === 0) {
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
              Companies
            </h1>
            <p className="text-lg text-slate-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Manage your prospect and partner companies
            </p>
          </div>
          <div className="mt-6 flex md:mt-0 md:ml-4">
            <button
              onClick={handleNewCompany}
              className="group inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#2E2827] hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <PlusIcon className="-ml-1 mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
              New Company
            </button>
          </div>
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
              className="block w-full pl-12 pr-4 py-4 border-2 border-[#D0CCE0] rounded-2xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              placeholder="Search companies by name, website, or industry..."
            />
          </div>
        </div>

      {/* Error state - only show if there's an error AND we're not just showing empty state */}
      {error && companies.length === 0 && !loading && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Unable to load companies</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => fetchCompanies()}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Companies grid */}
        {paginatedCompanies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-in fade-in duration-700" style={{ animationDelay: '300ms' }}>
              {paginatedCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-between border-t-2 border-[#D0CCE0] pt-8">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border-2 border-slate-300 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:border-[#2E2827] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border-2 border-slate-300 text-sm font-semibold rounded-xl text-slate-700 bg-white hover:border-[#2E2827] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Showing{' '}
                      <span className="font-semibold text-slate-900">{startIndex + 1}</span>
                      {' '}to{' '}
                      <span className="font-semibold text-slate-900">
                        {Math.min(startIndex + itemsPerPage, filteredCompanies.length)}
                      </span>
                      {' '}of{' '}
                      <span className="font-semibold text-slate-900">{filteredCompanies.length}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-xl shadow-sm gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-4 py-2 rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:border-[#2E2827] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        Previous
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 rounded-xl border-2 text-sm font-semibold transition-all duration-300 ${
                            page === currentPage
                              ? 'bg-[#2E2827] border-[#3E5CB8] text-white shadow-lg shadow-blue-500/30'
                              : 'bg-white border-slate-300 text-slate-700 hover:border-[#2E2827] hover:bg-slate-50'
                          }`}
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-4 py-2 rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-700 hover:border-[#2E2827] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
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
            <div className="relative bg-white rounded-3xl border-2 border-[#D0CCE0] p-16 text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-[#3E5CB8]/10 to-purple-500/10 flex items-center justify-center">
                  <BuildingOfficeIcon className="h-10 w-10 text-[#2E2827]" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {searchQuery ? 'No companies found' : 'No companies yet'}
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Get started by creating your first company'}
                </p>
                {!searchQuery && (
                  <button
                    onClick={handleNewCompany}
                    className="inline-flex items-center px-6 py-3 rounded-full text-sm font-semibold text-white bg-[#2E2827] hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                    New Company
                  </button>
                )}
              </div>
            </div>
          )}

        {/* Company Form Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          title="New Company"
          size="lg"
        >
          <CompanyForm
            onSuccess={handleFormSuccess}
            onCancel={handleModalClose}
          />
        </Modal>

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
