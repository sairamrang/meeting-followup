import { Link } from 'react-router-dom';
import { DocumentTextIcon, EyeIcon, CalendarIcon, ArrowRightIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import type { Followup, FollowupWithRelations } from '@meeting-followup/shared';

interface FollowupCardProps {
  followup: Followup | FollowupWithRelations;
  senderCompanyName?: string;
  receiverCompanyName?: string;
}

export function FollowupCard({ followup, senderCompanyName, receiverCompanyName }: FollowupCardProps) {
  const isPublished = followup.status === 'PUBLISHED';
  const meetingDate = new Date(followup.meetingDate);

  return (
    <Link
      to={`/follow-ups/${followup.id}`}
      className="block group bg-white rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all duration-200"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
              {followup.title}
            </h3>
            {senderCompanyName && receiverCompanyName && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <span className="font-medium text-gray-700">{senderCompanyName}</span>
                <ArrowRightIcon className="h-3 w-3 mx-1.5" />
                <span className="font-medium text-gray-700">{receiverCompanyName}</span>
              </div>
            )}
          </div>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              isPublished
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        {/* Meeting Info */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <CalendarIcon className="h-4 w-4 mr-1" />
          {meetingDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
          {followup.meetingType && (
            <>
              <span className="mx-2">•</span>
              <span className="capitalize">{followup.meetingType.toLowerCase()}</span>
            </>
          )}
        </div>

        {/* Recap Preview */}
        {followup.meetingRecap && (
          <div className="text-sm text-gray-600 line-clamp-2 mb-3">
            <div
              dangerouslySetInnerHTML={{
                __html: followup.meetingRecap.replace(/<[^>]*>/g, '').substring(0, 150),
              }}
            />
          </div>
        )}

        {/* Footer Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <DocumentTextIcon className="h-4 w-4 mr-1" />
            {followup.nextSteps?.length || 0} steps
          </div>
          <div className="flex items-center gap-3">
            {isPublished && (
              <>
                {/* Views Count */}
                <div className="flex items-center text-sm text-gray-500">
                  <EyeIcon className="h-4 w-4 mr-1" />
                  <span className="font-medium">
                    {('viewsCount' in followup ? followup.viewsCount : 0) || 0}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">views</span>
                </div>
                {/* Analytics Link */}
                <span
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    window.location.href = `/follow-ups/${followup.id}#analytics`;
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-purple-700 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors cursor-pointer"
                >
                  <ChartBarIcon className="h-3.5 w-3.5" />
                  Analytics
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
