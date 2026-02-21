import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Tab } from '@headlessui/react';
import { ArrowLeftIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useFollowupsStore } from '@/store/followups-store';
import { useCompaniesStore } from '@/store/companies-store';
import { useContactsStore } from '@/store/contacts-store';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { UnifiedAIGenerationModal } from '@/components/editor/UnifiedAIGenerationModal';
import { NextStepsForm } from '@/components/followups/NextStepsForm';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import type { NextStepItem, MeetingType, TemplateStyle } from '@meeting-followup/shared';

// Helper function to normalize URLs (add https:// if missing)
const normalizeUrl = (url: string): string => {
  if (!url || url.trim() === '') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const followupSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  senderCompanyId: z.string().min(1, 'Sender company is required'),
  receiverCompanyId: z.string().min(1, 'Receiver company is required'),
  senderId: z.string().optional(),
  receiverId: z.string().optional(),
  meetingDate: z.string().min(1, 'Meeting date is required'),
  meetingType: z.string().min(1, 'Meeting type is required'),
  meetingLocation: z.string().optional(),
  product: z.string().optional(),
  meetingRecap: z.string().optional(),
  valueProposition: z.string().optional(),
  template: z.enum(['MODERN', 'CONSERVATIVE', 'HYBRID']).optional(),
  meetingNotesUrl: z.string().optional().or(z.literal('')).transform((val) => {
    if (!val) return val;
    const normalized = normalizeUrl(val);
    // Validate the normalized URL
    try {
      new URL(normalized);
      return normalized;
    } catch {
      throw new Error('Must be a valid URL');
    }
  }),
  videoRecordingUrl: z.string().optional().or(z.literal('')).transform((val) => {
    if (!val) return val;
    const normalized = normalizeUrl(val);
    // Validate the normalized URL
    try {
      new URL(normalized);
      return normalized;
    } catch {
      throw new Error('Must be a valid URL');
    }
  }),
});

type FollowupFormData = z.infer<typeof followupSchema>;

export default function FollowupEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = id !== 'new';

  const { followups, currentFollowup, loading: followupsLoading, fetchFollowupById, createFollowup, updateFollowup } = useFollowupsStore();
  const { companies, loading: companiesLoading, fetchCompanies } = useCompaniesStore();
  const { contacts, fetchContacts } = useContactsStore();

  const [nextSteps, setNextSteps] = useState<NextStepItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const [senderContacts, setSenderContacts] = useState<typeof contacts>([]);
  const [receiverContacts, setReceiverContacts] = useState<typeof contacts>([]);
  const { showSuccess: showSuccessToast, showError } = useToast();

  // AI Generation Modal State
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FollowupFormData>({
    resolver: zodResolver(followupSchema),
    defaultValues: {
      title: '',
      senderCompanyId: '',
      receiverCompanyId: '',
      senderId: '',
      receiverId: '',
      meetingDate: new Date().toISOString().split('T')[0],
      meetingType: 'SALES',
      meetingLocation: '',
      product: '',
      meetingRecap: '',
      valueProposition: '',
      template: 'MODERN',
      meetingNotesUrl: '',
      videoRecordingUrl: '',
    },
  });

  const meetingRecap = watch('meetingRecap');
  const senderCompanyId = watch('senderCompanyId');
  const receiverCompanyId = watch('receiverCompanyId');
  const meetingType = watch('meetingType');
  const product = watch('product');

  // Get sender and receiver company names for AI context
  const senderCompany = companies.find(c => c.id === senderCompanyId);
  const receiverCompany = companies.find(c => c.id === receiverCompanyId);

  // Handle AI generation
  const handleOpenAIModal = () => {
    setIsAIModalOpen(true);
  };

  const handleApplyAIContent = (content: {
    recap: string;
    valueProposition: string;
    actionItems: Array<{ action: string; owner?: string; deadline?: string }>;
  }) => {
    if (content.recap) {
      setValue('meetingRecap', content.recap);
    }
    if (content.valueProposition) {
      setValue('valueProposition', content.valueProposition);
    }
    if (content.actionItems && content.actionItems.length > 0) {
      const newSteps: NextStepItem[] = content.actionItems.map((item, index) => ({
        id: `ai-${Date.now()}-${index}`,
        action: item.action,
        owner: item.owner,
        deadline: item.deadline,
        completed: false,
      }));
      setNextSteps([...nextSteps, ...newSteps]);
    }
  };

  // Load companies and followup (if editing)
  useEffect(() => {
    fetchCompanies();
    if (isEditMode && id) {
      fetchFollowupById(id, true); // Include relations for editing
    }
  }, [fetchCompanies, fetchFollowupById, isEditMode, id]);

  // Auto-select sender company if there's only one company and we're creating a new followup
  useEffect(() => {
    if (!isEditMode && companies.length === 1 && !watch('senderCompanyId')) {
      setValue('senderCompanyId', companies[0].id);
    }
  }, [companies, isEditMode, setValue, watch]);

  // Fetch sender contacts when sender company changes
  useEffect(() => {
    const loadSenderContacts = async () => {
      if (senderCompanyId) {
        await fetchContacts(senderCompanyId);
        // Contacts are now in the store, copy them to local state
        setSenderContacts([...contacts]);
      } else {
        setSenderContacts([]);
        setValue('senderId', '');
      }
    };
    loadSenderContacts();
  }, [senderCompanyId]);

  // Fetch receiver contacts when receiver company changes
  useEffect(() => {
    const loadReceiverContacts = async () => {
      if (receiverCompanyId && receiverCompanyId !== senderCompanyId) {
        await fetchContacts(receiverCompanyId);
        // Contacts are now in the store, copy them to local state
        setReceiverContacts([...contacts]);
      } else if (receiverCompanyId === senderCompanyId) {
        // Same company, use same contacts
        setReceiverContacts([...senderContacts]);
      } else {
        setReceiverContacts([]);
        setValue('receiverId', '');
      }
    };
    loadReceiverContacts();
  }, [receiverCompanyId, senderCompanyId]);

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && id && currentFollowup) {
      const dateStr = currentFollowup.meetingDate instanceof Date
        ? currentFollowup.meetingDate.toISOString().split('T')[0]
        : new Date(currentFollowup.meetingDate).toISOString().split('T')[0];

      setValue('title', currentFollowup.title);
      setValue('senderCompanyId', currentFollowup.senderCompanyId);
      setValue('receiverCompanyId', currentFollowup.receiverCompanyId);
      setValue('senderId', currentFollowup.senderId || '');
      setValue('receiverId', currentFollowup.receiverId || '');
      setValue('meetingDate', dateStr);
      setValue('meetingType', currentFollowup.meetingType);
      setValue('meetingLocation', currentFollowup.meetingLocation || '');
      setValue('product', currentFollowup.product || '');
      setValue('meetingRecap', currentFollowup.meetingRecap || '');
      setValue('valueProposition', currentFollowup.valueProposition || '');
      setValue('template', currentFollowup.template || 'MODERN');
      setValue('meetingNotesUrl', currentFollowup.meetingNotesUrl || '');
      setValue('videoRecordingUrl', currentFollowup.videoRecordingUrl || '');
      setNextSteps(currentFollowup.nextSteps || []);
    }
  }, [isEditMode, id, currentFollowup, setValue]);

  const onSubmit = async (data: FollowupFormData) => {
    setIsSaving(true);
    try {
      // Base payload for both create and update
      const basePayload = {
        senderId: data.senderId || undefined,
        receiverId: data.receiverId || undefined,
        title: data.title,
        meetingDate: new Date(data.meetingDate).toISOString(),
        meetingType: data.meetingType as MeetingType,
        meetingLocation: data.meetingLocation || undefined,
        product: data.product || undefined,
        meetingRecap: data.meetingRecap || undefined,
        valueProposition: data.valueProposition || undefined,
        template: (data.template || 'MODERN') as TemplateStyle,
        meetingNotesUrl: data.meetingNotesUrl || undefined,
        videoRecordingUrl: data.videoRecordingUrl || undefined,
        nextSteps,
      };

      let savedFollowup;
      if (isEditMode && id) {
        // Update: Don't send company IDs (they can't be changed)
        console.log('📝 Updating follow-up with payload:', {
          ...basePayload,
          meetingRecap: basePayload.meetingRecap ? `${basePayload.meetingRecap.substring(0, 50)}...` : 'empty',
          valueProposition: basePayload.valueProposition ? `${basePayload.valueProposition.substring(0, 50)}...` : 'empty',
        });
        savedFollowup = await updateFollowup(id, basePayload);
        console.log('✅ Updated follow-up:', savedFollowup?.id);
      } else {
        // Create: Include company IDs
        const createPayload = {
          senderCompanyId: data.senderCompanyId,
          receiverCompanyId: data.receiverCompanyId,
          ...basePayload,
        };
        console.log('📝 Creating follow-up with payload:', {
          ...createPayload,
          meetingRecap: createPayload.meetingRecap ? `${createPayload.meetingRecap.substring(0, 50)}...` : 'empty',
          valueProposition: createPayload.valueProposition ? `${createPayload.valueProposition.substring(0, 50)}...` : 'empty',
        });
        savedFollowup = await createFollowup(createPayload);
        console.log('✅ Created follow-up:', savedFollowup?.id);
      }

      // Show success message
      setShowSuccess(true);
      showSuccessToast(isEditMode ? 'Follow-up updated successfully!' : 'Follow-up created successfully!');

      // Navigate back to follow-ups list after a brief delay
      setTimeout(() => {
        navigate('/follow-ups');
      }, 1500);
    } catch (error: any) {
      console.error('❌ Failed to save follow-up:', error);

      // Extract user-friendly error message
      const message = error?.response?.data?.error?.message ||
                     error?.message ||
                     'Failed to save follow-up. Please try again.';

      showError(message);
      setIsSaving(false);
    }
  };

  if (followupsLoading || companiesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-slate-50">
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="bg-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-semibold">Follow-up saved successfully!</span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <button
            onClick={() => navigate('/follow-ups')}
            className="group inline-flex items-center text-sm font-semibold text-slate-600 hover:text-[#2E2827] mb-6 transition-colors duration-300"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Follow-ups
          </button>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <DocumentTextIcon className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-normal text-slate-900" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                {isEditMode ? 'Edit Follow-up' : 'New Follow-up'}
              </h1>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <div className="bg-white rounded-2xl border-2 border-[#D0CCE0] p-8 shadow-xl shadow-slate-500/10 animate-in fade-in duration-700" style={{ animationDelay: '200ms' }}>
            <h2 className="text-2xl font-semibold text-slate-900 mb-6" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Meeting Details
            </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Title */}
              <div className="sm:col-span-2">
                <label htmlFor="title" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Follow-up Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  {...register('title')}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  placeholder="e.g., Q4 Partnership Discussion"
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{errors.title.message}</p>
                )}
              </div>

              {/* Sender Company */}
              <div>
                <label htmlFor="senderCompanyId" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Your Company (From) <span className="text-red-500">*</span>
                </label>
                <select
                  id="senderCompanyId"
                  {...register('senderCompanyId')}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <option value="">Select your company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {errors.senderCompanyId && (
                  <p className="mt-2 text-sm text-red-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{errors.senderCompanyId.message}</p>
                )}
              </div>

              {/* Receiver Company */}
              <div>
                <label htmlFor="receiverCompanyId" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Prospect Company (To) <span className="text-red-500">*</span>
                </label>
                <select
                  id="receiverCompanyId"
                  {...register('receiverCompanyId')}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <option value="">Select prospect company</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
                {errors.receiverCompanyId && (
                  <p className="mt-2 text-sm text-red-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{errors.receiverCompanyId.message}</p>
                )}
              </div>

              {/* Sender Contact */}
              <div>
                <label htmlFor="senderId" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Your Representative
                </label>
                <select
                  id="senderId"
                  {...register('senderId')}
                  disabled={!senderCompanyId}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base disabled:bg-slate-100 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <option value="">Select representative (optional)</option>
                  {senderContacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} {contact.role ? `(${contact.role})` : ''}
                    </option>
                  ))}
                </select>
                {!senderCompanyId && (
                  <p className="mt-2 text-xs text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Select your company first</p>
                )}
              </div>

              {/* Receiver Contact */}
              <div>
                <label htmlFor="receiverId" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Prospect Contact
                </label>
                <select
                  id="receiverId"
                  {...register('receiverId')}
                  disabled={!receiverCompanyId}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base disabled:bg-slate-100 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <option value="">Select contact (optional)</option>
                  {receiverContacts.map((contact) => (
                    <option key={contact.id} value={contact.id}>
                      {contact.name} {contact.role ? `(${contact.role})` : ''}
                    </option>
                  ))}
                </select>
                {!receiverCompanyId && (
                  <p className="mt-2 text-xs text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Select prospect company first</p>
                )}
              </div>

              {/* Meeting Date */}
              <div>
                <label htmlFor="meetingDate" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Meeting Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="meetingDate"
                  {...register('meetingDate')}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                />
                {errors.meetingDate && (
                  <p className="mt-2 text-sm text-red-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{errors.meetingDate.message}</p>
                )}
              </div>

              {/* Meeting Type */}
              <div>
                <label htmlFor="meetingType" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Meeting Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="meetingType"
                  {...register('meetingType')}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <option value="SALES">Sales</option>
                  <option value="PARTNERSHIP">Partnership</option>
                  <option value="DEMO">Demo</option>
                  <option value="DISCOVERY">Discovery</option>
                  <option value="TECHNICAL">Technical</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.meetingType && (
                  <p className="mt-2 text-sm text-red-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{errors.meetingType.message}</p>
                )}
              </div>

              {/* Template Style */}
              <div>
                <label htmlFor="template" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Template Style
                </label>
                <select
                  id="template"
                  {...register('template')}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <option value="MODERN">Modern - Bold, colorful, editorial design</option>
                  <option value="CONSERVATIVE">Conservative - Clean, professional, corporate design</option>
                  <option value="HYBRID">Hybrid - Balanced modern + professional</option>
                </select>
                <p className="mt-1 text-sm text-slate-500" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Choose how your public follow-up page will look
                </p>
                {errors.template && (
                  <p className="mt-2 text-sm text-red-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{errors.template.message}</p>
                )}
              </div>

              {/* Meeting Location */}
              <div>
                <label htmlFor="meetingLocation" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Location
                </label>
                <input
                  type="text"
                  id="meetingLocation"
                  {...register('meetingLocation')}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  placeholder="e.g., Zoom, Office, Coffee Shop"
                />
              </div>

              {/* Product */}
              <div>
                <label htmlFor="product" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Product/Solution Discussed
                </label>
                <input
                  type="text"
                  id="product"
                  {...register('product')}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  placeholder="e.g., Enterprise Plan, Custom Solution"
                />
              </div>

              {/* Meeting Notes URL */}
              <div>
                <label htmlFor="meetingNotesUrl" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Meeting Notes Link
                </label>
                <input
                  type="text"
                  id="meetingNotesUrl"
                  {...register('meetingNotesUrl')}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  placeholder="docs.google.com/document/..."
                />
                {errors.meetingNotesUrl && (
                  <p className="mt-2 text-sm text-red-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{errors.meetingNotesUrl.message}</p>
                )}
              </div>

              {/* Video Recording URL */}
              <div>
                <label htmlFor="videoRecordingUrl" className="block text-sm font-semibold text-slate-700 mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  Video Recording Link
                </label>
                <input
                  type="text"
                  id="videoRecordingUrl"
                  {...register('videoRecordingUrl')}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  placeholder="zoom.us/rec/share/..."
                />
                {errors.videoRecordingUrl && (
                  <p className="mt-2 text-sm text-red-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{errors.videoRecordingUrl.message}</p>
                )}
              </div>
          </div>
        </div>

          {/* Tabbed Content */}
          <div className="bg-white rounded-2xl border-2 border-[#D0CCE0] shadow-xl shadow-slate-500/10 overflow-hidden animate-in fade-in duration-700" style={{ animationDelay: '300ms' }}>
            <Tab.Group selectedIndex={selectedTab} onChange={setSelectedTab}>
              <Tab.List className="border-b-2 border-[#D0CCE0] px-8 bg-white">
                <div className="flex items-center">
                  <div className="flex space-x-8">
                    <Tab
                      className={({ selected }) =>
                        `py-4 px-2 border-b-4 font-semibold text-base focus:outline-none transition-all duration-300 ${
                          selected
                            ? 'border-[#3E5CB8] text-[#2E2827]'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`
                      }
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Meeting Recap
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        `py-4 px-2 border-b-4 font-semibold text-base focus:outline-none transition-all duration-300 ${
                          selected
                            ? 'border-emerald-500 text-emerald-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`
                      }
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Value Proposition
                    </Tab>
                    <Tab
                      className={({ selected }) =>
                        `py-4 px-2 border-b-4 font-semibold text-base focus:outline-none transition-all duration-300 ${
                          selected
                            ? 'border-purple-500 text-purple-600'
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                        }`
                      }
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Next Steps ({nextSteps.length})
                    </Tab>
                  </div>
                  {/* Generate with AI button - to the right of tabs */}
                  <div className="ml-auto pl-4">
                    <button
                      type="button"
                      onClick={handleOpenAIModal}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-semibold text-sm rounded-lg hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 transition-all shadow-md shadow-purple-500/25 hover:shadow-lg hover:scale-105"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      <SparklesIcon className="h-4 w-4" />
                      Generate with AI
                    </button>
                  </div>
                </div>
              </Tab.List>
              <Tab.Panels className="p-8">
                {/* Meeting Recap Tab */}
                <Tab.Panel>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      What was discussed in the meeting?
                    </label>
                    <Controller
                      name="meetingRecap"
                      control={control}
                      render={({ field }) => (
                        <RichTextEditor
                          content={field.value || ''}
                          onChange={field.onChange}
                          placeholder="Capture the key discussion points, decisions made, and important notes from the meeting..."
                        />
                      )}
                    />
                  </div>
                </Tab.Panel>

                {/* Value Proposition Tab */}
                <Tab.Panel>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      What value are you proposing?
                    </label>
                    <Controller
                      name="valueProposition"
                      control={control}
                      render={({ field }) => (
                        <RichTextEditor
                          content={field.value || ''}
                          onChange={field.onChange}
                          placeholder="Describe the value proposition and benefits you're offering to the prospect..."
                        />
                      )}
                    />
                  </div>
                </Tab.Panel>

                {/* Next Steps Tab */}
                <Tab.Panel>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      Action Items
                    </label>
                    <NextStepsForm steps={nextSteps} onChange={setNextSteps} editable={true} />
                  </div>
                </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 animate-in fade-in duration-700" style={{ animationDelay: '400ms' }}>
            <button
              type="button"
              onClick={() => navigate('/follow-ups')}
              className="px-6 py-3 border-2 border-slate-300 rounded-xl shadow-sm text-sm font-semibold text-slate-700 bg-white hover:border-slate-400 hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-slate-500/10 transition-all duration-300"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || showSuccess}
              className={`inline-flex items-center px-6 py-3 rounded-xl shadow-lg text-sm font-semibold text-white hover:shadow-xl hover:shadow-blue-500/30 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 ${
                showSuccess ? 'bg-emerald-500' : 'bg-[#2E2827] disabled:opacity-50'
              }`}
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {showSuccess ? (
                <>
                  <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved!
                </>
              ) : isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : currentFollowup?.status === 'PUBLISHED' ? (
                'Save & Publish'
              ) : (
                'Save Draft'
              )}
            </button>
          </div>
        </form>

        {/* AI Generation Modal */}
        <UnifiedAIGenerationModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onApply={handleApplyAIContent}
          existingContent={{
            recap: meetingRecap,
            valueProposition: watch('valueProposition'),
            actionItems: nextSteps,
          }}
          context={{
            meetingType,
            companyName: receiverCompany?.name,
            productName: product,
          }}
        />

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
