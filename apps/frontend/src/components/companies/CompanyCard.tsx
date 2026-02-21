import { Link } from 'react-router-dom';
import type { Company } from '@meeting-followup/shared';

interface CompanyCardProps {
  company: Company;
}

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <Link
      to={`/companies/${company.id}`}
      className="block group relative bg-white rounded-2xl border-2 border-[#D0CCE0] hover:border-[#2E2827] hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
    >
      {/* Hover gradient effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#3E5CB8]/0 to-[#3E5CB8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative p-8">
        {/* Header with logo and name */}
        <div className="flex items-start gap-5 mb-5">
          {company.logoUrl ? (
            <img
              src={company.logoUrl}
              alt={`${company.name} logo`}
              className="w-16 h-16 rounded-xl object-contain bg-white border border-gray-100 p-1 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-[#2E2827] flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <span className="text-white font-bold text-2xl">
                {company.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3
              className="text-xl font-semibold text-slate-900 group-hover:text-[#2E2827] transition-colors mb-2 truncate"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {company.name}
            </h3>
            {company.website && (
              <p className="text-sm text-slate-500 truncate flex items-center gap-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                <svg className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {company.website.replace(/^https?:\/\//, '')}
              </p>
            )}
          </div>
        </div>

        {/* Industry tag */}
        {company.industry && (
          <div className="mb-4">
            <span
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-100 to-purple-100 text-[#2E2827] border border-blue-200"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {company.industry}
            </span>
          </div>
        )}

        {/* Description */}
        {company.description && (
          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            {company.description}
          </p>
        )}

        {/* Hover arrow indicator */}
        <div className="mt-5 flex items-center text-sm font-semibold text-[#2E2827] opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          View details
          <svg className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
