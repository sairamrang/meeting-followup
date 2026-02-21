import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ArrowRightIcon,
  UserIcon,
  CubeIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ArrowTopRightOnSquareIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { useFollowupsStore } from '@/store/followups-store';
import { useCompaniesStore } from '@/store/companies-store';
import { useContactsStore } from '@/store/contacts-store';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { NextStepsForm } from '@/components/followups/NextStepsForm';
import { PublishModal } from '@/components/followups/PublishModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FollowupAnalyticsCard } from '@/components/analytics/FollowupAnalyticsCard';
import { NotificationHistory } from '@/components/notifications/NotificationHistory';
import { TemplateStyle } from '@meeting-followup/shared';

export default function FollowupDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { followups, loading, fetchFollowupById, publishFollowup, unpublishFollowup } =
    useFollowupsStore();
  const { companies, fetchCompanies } = useCompaniesStore();
  const { contacts, fetchContacts } = useContactsStore();
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const followup = followups.find((f) => f.id === id);
  const senderCompany = companies.find((c) => c.id === followup?.senderCompanyId);
  const receiverCompany = companies.find((c) => c.id === followup?.receiverCompanyId);
  const senderContact = contacts.find((c) => c.id === followup?.senderId);
  const receiverContact = contacts.find((c) => c.id === followup?.receiverId);

  // Debug logging
  console.log('📊 FollowupDetailPage state:', {
    followupId: id,
    followup: followup ? { id: followup.id, senderCompanyId: followup.senderCompanyId, receiverCompanyId: followup.receiverCompanyId } : null,
    companiesCount: companies.length,
    senderCompany: senderCompany ? { id: senderCompany.id, name: senderCompany.name } : null,
    receiverCompany: receiverCompany ? { id: receiverCompany.id, name: receiverCompany.name } : null,
  });

  useEffect(() => {
    const loadData = async () => {
      if (id) {
        await fetchFollowupById(id);
      }
      await fetchCompanies();

      // Load contacts for both companies
      if (followup?.senderCompanyId) {
        await fetchContacts(followup.senderCompanyId);
      }
      if (followup?.receiverCompanyId && followup.receiverCompanyId !== followup.senderCompanyId) {
        await fetchContacts(followup.receiverCompanyId);
      }
    };
    loadData();
  }, [id, followup?.senderCompanyId, followup?.receiverCompanyId]);

  const handlePublish = async (slug: string, template?: TemplateStyle) => {
    if (!id) return;

    try {
      await publishFollowup(id, { slug, template });
      setShowPublishModal(false);
    } catch (error) {
      console.error('Failed to publish:', error);
      throw error;
    }
  };

  const handleUnpublish = async () => {
    if (!id || !confirm('Are you sure you want to unpublish this follow-up?')) return;

    try {
      await unpublishFollowup(id);
    } catch (error) {
      console.error('Failed to unpublish:', error);
    }
  };

  const copyPublicUrl = () => {
    if (followup?.slug) {
      const url = `${window.location.origin}/followup/${followup.slug}`;
      navigator.clipboard.writeText(url);
      setIsCopied(true);

      // Reset back to "Copy" after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
    }
  };

  const openPublicUrl = () => {
    if (followup?.slug) {
      const url = `${window.location.origin}/followup/${followup.slug}`;
      window.open(url, '_blank');
    }
  };

  if (loading || !followup) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const isPublished = followup.status === 'PUBLISHED';
  const meetingDate = new Date(followup.meetingDate);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/follow-ups')}
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Follow-ups
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold text-gray-900 mr-4">{followup.title}</h1>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  isPublished
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {isPublished ? (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-1" />
                    Published
                  </>
                ) : (
                  <>
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Draft
                  </>
                )}
              </span>
            </div>
            {senderCompany && receiverCompany && (
              <div className="flex items-center text-gray-600 mb-4">
                <BuildingOfficeIcon className="h-5 w-5 mr-2" />
                <Link
                  to={`/companies/${senderCompany.id}`}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  {senderCompany.name}
                </Link>
                <ArrowRightIcon className="h-4 w-4 mx-2 text-gray-400" />
                <Link
                  to={`/companies/${receiverCompany.id}`}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  {receiverCompany.name}
                </Link>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 ml-4">
            {isPublished && (
              <button
                onClick={() => navigate(`/follow-ups/${id}/analytics`)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <ChartBarIcon className="h-4 w-4 mr-2" />
                Analytics
              </button>
            )}
            <button
              onClick={() => navigate(`/follow-ups/${id}/edit`)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </button>

            {isPublished ? (
              <button
                onClick={handleUnpublish}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Unpublish
              </button>
            ) : (
              <button
                onClick={() => {
                  console.log('🚀 Publish button clicked');
                  console.log('ReceiverCompany:', receiverCompany);
                  console.log('SenderCompany:', senderCompany);
                  setShowPublishModal(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <EyeIcon className="h-4 w-4 mr-2" />
                Publish
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Public URL (if published) */}
      {isPublished && followup.slug && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 mb-1">Public URL</p>
              <code className="text-sm text-green-700 break-all">
                {window.location.origin}/followup/{followup.slug}
              </code>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={copyPublicUrl}
                className={`px-3 py-1 border rounded text-sm font-medium transition-colors ${
                  isCopied
                    ? 'border-blue-300 text-blue-700 bg-blue-50'
                    : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
                }`}
              >
                {isCopied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={openPublicUrl}
                className="px-3 py-1 border border-green-300 text-green-700 bg-white hover:bg-green-50 rounded text-sm font-medium transition-colors flex items-center gap-1"
                title="Open in new tab"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                Open
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Card */}
      {id && <FollowupAnalyticsCard followupId={id} isPublished={isPublished} />}

      {/* Notification History (only for published follow-ups) */}
      {id && isPublished && (
        <div className="mt-6 mb-6">
          <NotificationHistory followupId={id} />
        </div>
      )}

      {/* Meeting Details Card */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Meeting Details</h2>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-gray-500 flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Date
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {meetingDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Type</dt>
            <dd className="mt-1 text-sm text-gray-900 capitalize">
              {followup.meetingType ? followup.meetingType.toLowerCase() : 'N/A'}
            </dd>
          </div>
          {senderContact && (
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                Your Representative
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {senderContact.name}
                {senderContact.role && <span className="text-gray-500"> ({senderContact.role})</span>}
              </dd>
            </div>
          )}
          {receiverContact && (
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <UserIcon className="h-4 w-4 mr-2" />
                Prospect Contact
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {receiverContact.name}
                {receiverContact.role && <span className="text-gray-500"> ({receiverContact.role})</span>}
              </dd>
            </div>
          )}
          {followup.product && (
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CubeIcon className="h-4 w-4 mr-2" />
                Product/Solution
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{followup.product}</dd>
            </div>
          )}
          {followup.meetingLocation && (
            <div>
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MapPinIcon className="h-4 w-4 mr-2" />
                Location
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{followup.meetingLocation}</dd>
            </div>
          )}
          {followup.meetingNotesUrl && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <DocumentTextIcon className="h-4 w-4 mr-2" />
                Meeting Notes
              </dt>
              <dd className="mt-1">
                <a
                  href={followup.meetingNotesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 underline"
                >
                  View external notes →
                </a>
              </dd>
            </div>
          )}
          {followup.videoRecordingUrl && (
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <VideoCameraIcon className="h-4 w-4 mr-2" />
                Video Recording
              </dt>
              <dd className="mt-1">
                <a
                  href={followup.videoRecordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-600 hover:text-primary-700 underline"
                >
                  Watch recording →
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>

      {/* Meeting Recap Card */}
      {followup.meetingRecap && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Meeting Recap</h2>
          <RichTextEditor
            content={followup.meetingRecap}
            onChange={() => {}}
            editable={false}
          />
        </div>
      )}

      {/* Next Steps Card */}
      {followup.nextSteps && followup.nextSteps.length > 0 && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Next Steps ({followup.nextSteps.length})
          </h2>
          <NextStepsForm
            steps={followup.nextSteps}
            onChange={() => {}}
            editable={false}
          />
        </div>
      )}

      {/* Metadata */}
      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
        <div className="flex items-center justify-between">
          <span>
            Created: {(() => {
              const date = new Date(followup.createdAt);
              return !isNaN(date.getTime())
                ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                : 'Unknown';
            })()}
          </span>
          <span>
            Last updated: {(() => {
              const date = new Date(followup.updatedAt);
              return !isNaN(date.getTime())
                ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                : 'Unknown';
            })()}
          </span>
          {followup.publishedAt && (
            <span>
              Published: {(() => {
                const date = new Date(followup.publishedAt);
                return !isNaN(date.getTime())
                  ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                  : 'Unknown';
              })()}
            </span>
          )}
        </div>
      </div>

      {/* Publish Modal */}
      {showPublishModal && followup && (
        <PublishModal
          followupTitle={followup.title}
          companyName={receiverCompany?.name || senderCompany?.name || ''}
          onPublish={handlePublish}
          onClose={() => setShowPublishModal(false)}
        />
      )}
    </div>
  );
}
