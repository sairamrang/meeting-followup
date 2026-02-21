import { useEffect, useState } from 'react';
import {
  BellIcon,
  EnvelopeIcon,
  EyeIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { notificationsApi } from '@/services/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { NotificationPreference, UpdateNotificationPreferenceDTO } from '@meeting-followup/shared';

export default function SettingsPage() {
  const [preferences, setPreferences] = useState<NotificationPreference | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [notifyEmail, setNotifyEmail] = useState('');

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const prefs = await notificationsApi.getPreferences();
      setPreferences(prefs);
      setNotifyEmail(prefs.notifyEmail || '');
    } catch (error) {
      console.error('Failed to fetch notification preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePreference = async (updates: UpdateNotificationPreferenceDTO) => {
    if (!preferences) return;

    try {
      setSaving(true);
      setSaveStatus('idle');
      const updated = await notificationsApi.updatePreferences(updates);
      setPreferences(updated);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (field: keyof NotificationPreference) => {
    if (!preferences) return;
    const currentValue = preferences[field];
    if (typeof currentValue === 'boolean') {
      updatePreference({ [field]: !currentValue });
    }
  };

  const handleEmailSave = () => {
    const email = notifyEmail.trim() || null;
    updatePreference({ notifyEmail: email });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">
          Manage your notification preferences and account settings.
        </p>
      </div>

      {/* Save Status Indicator */}
      {saveStatus !== 'idle' && (
        <div
          className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
            saveStatus === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {saveStatus === 'success' ? (
            <>
              <CheckCircleIcon className="h-5 w-5" />
              <span>Settings saved successfully</span>
            </>
          ) : (
            <>
              <ExclamationCircleIcon className="h-5 w-5" />
              <span>Failed to save settings. Please try again.</span>
            </>
          )}
        </div>
      )}

      {/* Notification Settings Card */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-pink-600">
          <div className="flex items-center gap-3 text-white">
            <BellIcon className="h-6 w-6" />
            <div>
              <h2 className="text-lg font-semibold">Notification Preferences</h2>
              <p className="text-sm text-white/80">
                Get notified when prospects view your follow-ups
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <EnvelopeIcon className="h-6 w-6 text-gray-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">
                  Master switch for all email notifications
                </p>
              </div>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              disabled={saving}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                preferences?.emailNotifications ? 'bg-primary-600' : 'bg-gray-200'
              } ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  preferences?.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sub-options (only visible when master is on) */}
          <div
            className={`space-y-4 pl-4 border-l-2 ${
              preferences?.emailNotifications
                ? 'border-primary-200 opacity-100'
                : 'border-gray-200 opacity-50 pointer-events-none'
            }`}
          >
            {/* First View Toggle */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-start gap-3">
                <EyeIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">First View Alerts</p>
                  <p className="text-sm text-gray-500">
                    Notify me when someone views my follow-up for the first time
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('notifyOnFirstView')}
                disabled={saving || !preferences?.emailNotifications}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  preferences?.notifyOnFirstView ? 'bg-blue-600' : 'bg-gray-200'
                } ${saving || !preferences?.emailNotifications ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences?.notifyOnFirstView ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Revisit Toggle */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-start gap-3">
                <ArrowPathIcon className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Revisit Alerts</p>
                  <p className="text-sm text-gray-500">
                    Notify me when someone returns to view my follow-up again
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('notifyOnRevisit')}
                disabled={saving || !preferences?.emailNotifications}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                  preferences?.notifyOnRevisit ? 'bg-purple-600' : 'bg-gray-200'
                } ${saving || !preferences?.emailNotifications ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences?.notifyOnRevisit ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Override Email */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-start gap-3 mb-3">
              <EnvelopeIcon className="h-5 w-5 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">Notification Email</p>
                <p className="text-sm text-gray-500 mb-3">
                  Override the email address for notifications (leave empty to use your account email)
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="notifications@example.com"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  />
                  <button
                    onClick={handleEmailSave}
                    disabled={saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    ) : (
                      'Save'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex gap-3">
          <BellIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-blue-900">How notifications work</h3>
            <ul className="mt-2 text-sm text-blue-700 space-y-1">
              <li>
                When someone views your published follow-up, we detect if they've visited before
              </li>
              <li>
                Based on your preferences, you'll receive email alerts for first views or revisits
              </li>
              <li>
                Notifications include visitor information like device type and location (anonymized)
              </li>
              <li>
                We throttle notifications to prevent spam - max 1 per follow-up per hour
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
