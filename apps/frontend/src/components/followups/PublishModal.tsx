import { useState } from 'react';
import { XMarkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/store/auth-store';
import { TemplateStyle } from '@meeting-followup/shared';
import { useToast } from '@/hooks/useToast';

interface PublishModalProps {
  followupTitle: string;
  companyName: string;
  onPublish: (slug: string, template?: TemplateStyle) => Promise<void>;
  onClose: () => void;
}

export function PublishModal({ followupTitle, companyName, onPublish, onClose }: PublishModalProps) {
  const { user } = useAuthStore();
  const { showSuccess, showError } = useToast();

  const [slug, setSlug] = useState(() => {
    // Generate slug from company name (or followup title) + user name
    const userName = user?.firstName && user?.lastName
      ? `${user.firstName}-${user.lastName}`
      : user?.username || 'user';

    // Use company name if available, otherwise use followup title
    const baseText = companyName && companyName.trim() !== '' && companyName !== 'Unknown'
      ? companyName
      : followupTitle;

    const baseSlug = baseText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    const userSlug = userName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    return `${baseSlug}-${userSlug}`.substring(0, 50);
  });
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateStyle>(TemplateStyle.MODERN);
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSlugChange = (value: string) => {
    // Only allow lowercase letters, numbers, and hyphens
    const sanitized = value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '')
      .replace(/--+/g, '-');
    setSlug(sanitized);
    setError(null);
  };

  const handlePublish = async () => {
    if (!slug || slug.length < 3) {
      setError('Slug must be at least 3 characters long');
      return;
    }

    setIsPublishing(true);
    setError(null);

    try {
      console.log('🚀 Publishing follow-up with slug:', slug, 'template:', selectedTemplate);
      await onPublish(slug, selectedTemplate);
      console.log('✅ Publish successful');

      // Show success toast
      showSuccess(`Follow-up published! Share your link: ${publicUrl}`);

      // Small delay before closing
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('❌ Publish failed:', err);
      const errorMessage = err?.response?.data?.error?.message || err?.message || 'Failed to publish follow-up';
      setError(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  };

  const publicUrl = `${window.location.origin}/followup/${slug}`;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <CheckCircleIcon className="h-6 w-6 mr-2 text-primary-600" />
              Publish Follow-up
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Make this follow-up publicly accessible via a custom URL
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          {/* Slug Input */}
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Custom Slug <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                {window.location.origin}/followup/
              </span>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                placeholder="my-follow-up"
                maxLength={50}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Only lowercase letters, numbers, and hyphens. 3-50 characters.
            </p>
          </div>

          {/* Template Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Choose Design Template
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Modern Template */}
              <button
                type="button"
                onClick={() => setSelectedTemplate(TemplateStyle.MODERN)}
                className={`relative flex flex-col items-start p-4 border-2 rounded-lg hover:border-primary-400 transition-all ${
                  selectedTemplate === TemplateStyle.MODERN
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="w-full h-20 rounded mb-2 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"></div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-gray-900">Modern</p>
                  <p className="text-xs text-gray-500 mt-0.5">Bold & colorful</p>
                </div>
                {selectedTemplate === TemplateStyle.MODERN && (
                  <div className="absolute top-2 right-2">
                    <CheckCircleIcon className="h-5 w-5 text-primary-600" />
                  </div>
                )}
              </button>

              {/* Conservative Template */}
              <button
                type="button"
                onClick={() => setSelectedTemplate(TemplateStyle.CONSERVATIVE)}
                className={`relative flex flex-col items-start p-4 border-2 rounded-lg hover:border-primary-400 transition-all ${
                  selectedTemplate === TemplateStyle.CONSERVATIVE
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="w-full h-20 rounded mb-2 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-400"></div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-gray-900">Conservative</p>
                  <p className="text-xs text-gray-500 mt-0.5">Clean & professional</p>
                </div>
                {selectedTemplate === TemplateStyle.CONSERVATIVE && (
                  <div className="absolute top-2 right-2">
                    <CheckCircleIcon className="h-5 w-5 text-primary-600" />
                  </div>
                )}
              </button>

              {/* Hybrid Template */}
              <button
                type="button"
                onClick={() => setSelectedTemplate(TemplateStyle.HYBRID)}
                className={`relative flex flex-col items-start p-4 border-2 rounded-lg hover:border-primary-400 transition-all ${
                  selectedTemplate === TemplateStyle.HYBRID
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="w-full h-20 rounded mb-2 bg-gradient-to-br from-blue-600 via-teal-500 to-emerald-400"></div>
                <div className="text-left">
                  <p className="font-semibold text-sm text-gray-900">Hybrid</p>
                  <p className="text-xs text-gray-500 mt-0.5">Balanced approach</p>
                </div>
                {selectedTemplate === TemplateStyle.HYBRID && (
                  <div className="absolute top-2 right-2">
                    <CheckCircleIcon className="h-5 w-5 text-primary-600" />
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Preview URL */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-1">Public URL Preview</p>
            <code className="text-sm text-primary-600 break-all">{publicUrl}</code>
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-md bg-red-50 p-3 border border-red-200">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Once published, anyone with this link can view your
              follow-up. You can unpublish it at any time.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            disabled={isPublishing}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing || !slug || slug.length < 3}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Publishing...
              </>
            ) : (
              'Publish Follow-up'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
