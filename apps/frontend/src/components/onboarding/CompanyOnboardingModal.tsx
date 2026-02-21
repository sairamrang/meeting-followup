import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { BuildingOfficeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useCompaniesStore } from '@/store/companies-store';
import { useToast } from '@/hooks/useToast';

// Helper function to normalize URLs (add https:// if missing)
const normalizeUrl = (url: string): string => {
  if (!url || url.trim() === '') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
};

const companySetupSchema = z.object({
  name: z.string().min(1, 'Company name is required').max(255),
  website: z.string().optional().or(z.literal('')).transform((val) => {
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
  industry: z.string().optional(),
  description: z.string().optional(),
});

type CompanySetupFormData = z.infer<typeof companySetupSchema>;

interface CompanyOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export function CompanyOnboardingModal({ isOpen, onClose, onComplete }: CompanyOnboardingModalProps) {
  const { createCompany } = useCompaniesStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { showSuccess } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CompanySetupFormData>({
    resolver: zodResolver(companySetupSchema),
    defaultValues: {
      name: '',
      website: '',
      industry: '',
      description: '',
    },
  });

  const onSubmit = async (data: CompanySetupFormData) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await createCompany({
        name: data.name,
        website: data.website || undefined,
        industry: data.industry || undefined,
        description: data.description || undefined,
      });
      reset();
      showSuccess(`Company "${data.name}" created successfully!`);
      onComplete();
    } catch (error: any) {
      console.error('Failed to create company:', error);
      // Extract user-friendly error message
      const message = error?.response?.data?.error?.message ||
                     error?.message ||
                     'Failed to create company. Please try again.';
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#2E2827]/80 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-[#2E2827] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Decorative gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#D0CCE0]/30 via-transparent to-[#E8E4E4]/20 pointer-events-none"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-white/80 hover:bg-white border-2 border-[#D0CCE0] hover:border-[#2E2827] transition-all duration-300 z-10"
          >
            <XMarkIcon className="h-5 w-5 text-[#2E2827]" />
          </button>

          <div className="relative p-8 md:p-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#3E5CB8] to-[#2E2827] shadow-xl shadow-blue-500/30 mb-4">
                <BuildingOfficeIcon className="h-8 w-8 text-white" />
              </div>
              <h2
                className="text-3xl md:text-4xl font-bold text-[#2E2827] mb-3"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Welcome! Let's Get Started
              </h2>
              <p
                className="text-lg text-[#2E2827]/70 max-w-lg mx-auto"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Tell us about your company so you can start creating awesome follow-ups
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                      {errorMessage}
                    </p>
                  </div>
                  <div className="ml-auto pl-3">
                    <button
                      type="button"
                      onClick={() => setErrorMessage(null)}
                      className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none transition-colors"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Company Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-[#2E2827] mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Company Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name')}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  placeholder="e.g., Acme Corporation"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Website */}
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-semibold text-[#2E2827] mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Website
                </label>
                <input
                  type="text"
                  id="website"
                  {...register('website')}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  placeholder="www.acmecorp.com"
                />
                {errors.website && (
                  <p className="mt-2 text-sm text-red-600" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                    {errors.website.message}
                  </p>
                )}
              </div>

              {/* Industry */}
              <div>
                <label
                  htmlFor="industry"
                  className="block text-sm font-semibold text-[#2E2827] mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Industry
                </label>
                <input
                  type="text"
                  id="industry"
                  {...register('industry')}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  placeholder="e.g., SaaS, Consulting, E-commerce"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-semibold text-[#2E2827] mb-2"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Brief Description
                </label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={3}
                  className="block w-full rounded-xl border-2 border-slate-300 px-4 py-3 shadow-sm focus:border-[#3E5CB8] focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 text-base resize-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  placeholder="What does your company do?"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 border-2 border-slate-300 rounded-xl shadow-sm text-sm font-semibold text-slate-700 bg-white hover:border-slate-400 hover:bg-slate-50 transition-all duration-300"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Skip for now
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center px-8 py-3 rounded-xl shadow-lg text-sm font-semibold text-white bg-gradient-to-br from-[#3E5CB8] to-[#2E2827] hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    'Create Company Profile'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Animation Styles */}
          <style>{`
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
    </div>
  );
}
