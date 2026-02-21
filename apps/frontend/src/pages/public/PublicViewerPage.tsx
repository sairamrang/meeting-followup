import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  CalendarIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  UserIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolidIcon } from '@heroicons/react/24/solid';
import { followupsApi } from '@/services/api';
import type { FollowupWithRelations } from '@meeting-followup/shared';
import { ConfirmationType } from '@meeting-followup/shared';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useConfirmations } from '@/hooks/useConfirmations';
import { useSectionTracking } from '@/hooks/useSectionTracking';

// Template configurations - DRAMATICALLY DIFFERENT STYLES
const TEMPLATES = {
  MODERN: {
    name: 'Modern',
    colors: {
      primary: '#0f0f0f',
      secondary: '#ff4d4d',
      accent: '#00d4aa',
      background: '#fafafa',
      surface: '#ffffff',
      text: '#333333',
      textLight: '#888888',
      headerBg: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 50%, #16213e 100%)',
      cardAccent: '#ff4d4d',
    },
    fonts: {
      heading: "'Space Grotesk', sans-serif",
      body: "'Inter', sans-serif",
    },
    layout: {
      borderRadius: '28px',
      cardShadow: '0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 25px rgba(0, 0, 0, 0.1)',
      cardBorder: 'none',
      headerStyle: 'bold',
      spacing: 'relaxed',
      maxWidth: '1200px',
      sectionGap: '2.5rem',
    },
    features: {
      gradientAccents: true,
      decorativeDots: true,
      boldNumbers: true,
      animatedUnderlines: true,
    },
  },
  CONSERVATIVE: {
    name: 'Conservative',
    colors: {
      primary: '#1e3a5f',
      secondary: '#2563eb',
      accent: '#059669',
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#1e293b',
      textLight: '#64748b',
      headerBg: '#1e3a5f',
      cardAccent: '#2563eb',
    },
    fonts: {
      heading: "'Times New Roman', 'Georgia', serif",
      body: "'Arial', 'Helvetica', sans-serif",
    },
    layout: {
      borderRadius: '4px',
      cardShadow: 'none',
      cardBorder: '1px solid #d1d5db',
      headerStyle: 'minimal',
      spacing: 'compact',
      maxWidth: '850px',
      sectionGap: '1.25rem',
    },
    features: {
      gradientAccents: false,
      decorativeDots: false,
      boldNumbers: false,
      animatedUnderlines: false,
    },
  },
  HYBRID: {
    name: 'Hybrid',
    colors: {
      primary: '#4c1d95',
      secondary: '#7c3aed',
      accent: '#06b6d4',
      background: '#faf5ff',
      surface: '#ffffff',
      text: '#374151',
      textLight: '#6b7280',
      headerBg: 'linear-gradient(135deg, #4c1d95 0%, #6d28d9 50%, #7c3aed 100%)',
      cardAccent: '#7c3aed',
    },
    fonts: {
      heading: "'Poppins', sans-serif",
      body: "'Nunito', sans-serif",
    },
    layout: {
      borderRadius: '16px',
      cardShadow: '0 10px 40px rgba(124, 58, 237, 0.12), 0 4px 15px rgba(0, 0, 0, 0.08)',
      cardBorder: '2px solid #e9d5ff',
      headerStyle: 'gradient',
      spacing: 'balanced',
      maxWidth: '1000px',
      sectionGap: '2rem',
    },
    features: {
      gradientAccents: true,
      decorativeDots: false,
      boldNumbers: true,
      animatedUnderlines: false,
    },
  },
};

export default function PublicViewerPage() {
  const { slug } = useParams<{ slug: string }>();
  const [followup, setFollowup] = useState<FollowupWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPanel, setExpandedPanel] = useState<'recap' | 'valueProp' | null>(null);

  // Feedback modal state
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    type: 'recap' | 'valueProp' | null;
    name: string;
    comment: string;
  }>({ isOpen: false, type: null, name: '', comment: '' });

  const openFeedbackModal = (type: 'recap' | 'valueProp') => {
    setFeedbackModal({ isOpen: true, type, name: '', comment: '' });
  };

  const closeFeedbackModal = () => {
    setFeedbackModal({ isOpen: false, type: null, name: '', comment: '' });
  };

  const submitFeedbackWithComment = async () => {
    if (!feedbackModal.type) return;

    const confirmationType = feedbackModal.type === 'recap'
      ? ConfirmationType.RECAP_INACCURATE
      : ConfirmationType.VALUE_PROP_UNCLEAR;

    const commentWithName = feedbackModal.name
      ? `[${feedbackModal.name}] ${feedbackModal.comment}`
      : feedbackModal.comment;

    await submitConfirmation(confirmationType, commentWithName);
    closeFeedbackModal();
  };

  // Track analytics for this page view
  const { trackLinkClick, sessionId } = useAnalytics(followup?.id);

  // Section engagement tracking (time spent, scroll depth)
  const { registerSection } = useSectionTracking(followup?.id);

  // Micro-commitment confirmations
  const {
    submitConfirmation,
    hasRecapConfirmation,
    hasValuePropConfirmation,
    hasInterestConfirmation,
    submitting,
    feedback,
  } = useConfirmations(slug, sessionId);

  // Refs for content sections to attach link click handlers and section tracking
  const recapContentRef = useRef<HTMLDivElement>(null);
  const valuePropositionRef = useRef<HTMLDivElement>(null);
  const nextStepsRef = useRef<HTMLDivElement>(null);

  // Section refs for engagement tracking
  const recapSectionRef = useCallback((node: HTMLElement | null) => {
    registerSection(node, 'meeting-recap', 'Meeting Recap');
  }, [registerSection]);

  const valuePropSectionRef = useCallback((node: HTMLElement | null) => {
    registerSection(node, 'value-proposition', 'Value Proposition');
  }, [registerSection]);

  const nextStepsSectionRef = useCallback((node: HTMLElement | null) => {
    registerSection(node, 'next-steps', 'Next Steps');
  }, [registerSection]);

  /**
   * Handle link clicks within content sections using event delegation
   * This intercepts clicks on anchor tags, tracks the click, then allows navigation
   */
  const handleContentLinkClick = useCallback((e: MouseEvent, sectionId: string) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest('a');

    if (anchor && anchor.href) {
      // Track the link click
      trackLinkClick(anchor.href, anchor.textContent || undefined, sectionId);
      // Allow the default navigation to proceed (no need to prevent default)
    }
  }, [trackLinkClick]);

  // Attach event listeners to content sections for link click tracking
  useEffect(() => {
    const recapEl = recapContentRef.current;
    const valuePropEl = valuePropositionRef.current;

    const handleRecapClick = (e: MouseEvent) => handleContentLinkClick(e, 'recap');
    const handleValuePropClick = (e: MouseEvent) => handleContentLinkClick(e, 'valueProp');

    if (recapEl) {
      recapEl.addEventListener('click', handleRecapClick);
    }
    if (valuePropEl) {
      valuePropEl.addEventListener('click', handleValuePropClick);
    }

    return () => {
      if (recapEl) {
        recapEl.removeEventListener('click', handleRecapClick);
      }
      if (valuePropEl) {
        valuePropEl.removeEventListener('click', handleValuePropClick);
      }
    };
  }, [handleContentLinkClick]);

  // Get template configuration
  const templateKey = (followup?.template || 'MODERN') as keyof typeof TEMPLATES;
  const template = TEMPLATES[templateKey];

  useEffect(() => {
    const fetchFollowup = async () => {
      if (!slug) {
        setError('Invalid follow-up link');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await followupsApi.getBySlug(slug);
        setFollowup(data);
      } catch (err: any) {
        setError(
          err.response?.status === 404
            ? 'Follow-up not found or has been unpublished'
            : 'Failed to load follow-up'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFollowup();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E8E4E4] flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !followup) {
    return (
      <div className="min-h-screen bg-[#2E2827] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-red-500/20 border border-red-500/50 mb-6">
            <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Unable to Load</h2>
          <p className="text-white/80" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>{error}</p>
        </div>
      </div>
    );
  }

  const meetingDate = new Date(followup.meetingDate);
  const completedSteps = followup.nextSteps?.filter((s) => s.completed).length || 0;
  const totalSteps = followup.nextSteps?.length || 0;
  const progressPercent = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  // Group and sort next steps by sender/receiver and deadline
  const groupedNextSteps = (() => {
    if (!followup.nextSteps || followup.nextSteps.length === 0) {
      return { senderSteps: [], receiverSteps: [] };
    }

    // Get all contacts from both companies
    const senderContacts = followup.followupContacts
      ?.filter(fc => fc.contact.companyId === followup.senderCompanyId)
      .map(fc => fc.contact) || [];
    const receiverContacts = followup.followupContacts
      ?.filter(fc => fc.contact.companyId === followup.receiverCompanyId)
      .map(fc => fc.contact) || [];

    // Add main sender and receiver if they exist
    if (followup.sender) senderContacts.push(followup.sender);
    if (followup.receiver) receiverContacts.push(followup.receiver);

    const senderSteps: typeof followup.nextSteps = [];
    const receiverSteps: typeof followup.nextSteps = [];

    followup.nextSteps.forEach(step => {
      // Determine ownership based on owner name matching contacts
      const isSenderStep = step.owner && senderContacts.some(
        contact => contact.name.toLowerCase().includes(step.owner!.toLowerCase()) ||
                   step.owner!.toLowerCase().includes(contact.name.toLowerCase())
      );
      const isReceiverStep = step.owner && receiverContacts.some(
        contact => contact.name.toLowerCase().includes(step.owner!.toLowerCase()) ||
                   step.owner!.toLowerCase().includes(contact.name.toLowerCase())
      );

      // If owner matches sender, add to sender steps
      if (isSenderStep) {
        senderSteps.push(step);
      }
      // If owner matches receiver or is unknown, add to receiver steps (default)
      else {
        receiverSteps.push(step);
      }
    });

    // Sort each group by deadline (soonest first)
    const sortByDeadline = (a: typeof followup.nextSteps[0], b: typeof followup.nextSteps[0]) => {
      if (!a.deadline && !b.deadline) return 0;
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    };

    senderSteps.sort(sortByDeadline);
    receiverSteps.sort(sortByDeadline);

    return { senderSteps, receiverSteps };
  })();

  return (
    <>
      {/* Custom Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Nunito:wght@400;600;700&display=swap');

        :root {
          --color-primary: ${template.colors.primary};
          --color-secondary: ${template.colors.secondary};
          --color-accent: ${template.colors.accent};
          --color-background: ${template.colors.background};
          --color-surface: ${template.colors.surface};
          --color-text: ${template.colors.text};
          --color-text-light: ${template.colors.textLight};
          --color-card-accent: ${template.colors.cardAccent};
          --font-heading: ${template.fonts.heading};
          --font-body: ${template.fonts.body};
          --border-radius: ${template.layout.borderRadius};
          --card-shadow: ${template.layout.cardShadow};
          --card-border: ${template.layout.cardBorder};
          --max-width: ${template.layout.maxWidth};
          --section-gap: ${template.layout.sectionGap};
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }

        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }

        /* Custom scrollbar styling */
        .editorial-prose::-webkit-scrollbar {
          width: 6px;
        }
        .editorial-prose::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }
        .editorial-prose::-webkit-scrollbar-thumb {
          background: ${templateKey === 'MODERN' ? 'linear-gradient(180deg, var(--color-secondary), var(--color-accent))' : 'var(--color-secondary)'};
          border-radius: 3px;
          opacity: 0.6;
        }
        .editorial-prose::-webkit-scrollbar-thumb:hover {
          opacity: 1;
        }

        /* Content section scroll indicator - subtle fade at bottom */
        .content-section {
          position: relative;
        }
        .content-section .editorial-prose {
          position: relative;
          mask-image: linear-gradient(to bottom, black calc(100% - 30px), transparent 100%);
          -webkit-mask-image: linear-gradient(to bottom, black calc(100% - 30px), transparent 100%);
        }
        .content-section .editorial-prose:hover,
        .content-section.expanded .editorial-prose {
          mask-image: none;
          -webkit-mask-image: none;
        }

        /* Expand button styling */
        .expand-btn {
          opacity: 0.7;
          transition: all 0.2s ease;
        }
        .expand-btn:hover {
          opacity: 1;
        }
        .content-section:hover .expand-btn {
          opacity: 1;
        }

        .editorial-title {
          font-family: var(--font-heading);
          line-height: 1.2;
          letter-spacing: ${templateKey === 'MODERN' ? '-0.03em' : templateKey === 'CONSERVATIVE' ? '0' : '-0.01em'};
        }

        .editorial-body {
          font-family: var(--font-body);
          line-height: ${templateKey === 'CONSERVATIVE' ? '1.5' : '1.7'};
        }

        /* MODERN: Clean, minimal texture */
        ${templateKey === 'MODERN' ? `
        .paper-texture {
          background: var(--color-background);
        }
        ` : ''}

        /* CONSERVATIVE: Classic paper look */
        ${templateKey === 'CONSERVATIVE' ? `
        .paper-texture {
          background-color: var(--color-background);
          background-image: none;
        }
        ` : ''}

        /* HYBRID: Subtle gradient texture */
        ${templateKey === 'HYBRID' ? `
        .paper-texture {
          background: linear-gradient(180deg, var(--color-background) 0%, #f3e8ff 100%);
        }
        ` : ''}

        .editorial-prose h2 {
          font-family: var(--font-heading);
          font-size: ${templateKey === 'MODERN' ? '2rem' : templateKey === 'CONSERVATIVE' ? '1.5rem' : '1.75rem'};
          font-weight: ${templateKey === 'MODERN' ? '700' : templateKey === 'CONSERVATIVE' ? '600' : '600'};
          color: var(--color-primary);
          margin-bottom: ${templateKey === 'CONSERVATIVE' ? '0.5rem' : '0.75rem'};
          line-height: 1.3;
          ${templateKey === 'MODERN' ? 'letter-spacing: -0.02em;' : ''}
        }

        .editorial-prose h3 {
          font-family: var(--font-heading);
          font-size: ${templateKey === 'MODERN' ? '1.5rem' : templateKey === 'CONSERVATIVE' ? '1.125rem' : '1.35rem'};
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: 0.5rem;
        }

        .editorial-prose p {
          font-family: var(--font-body);
          font-size: ${templateKey === 'CONSERVATIVE' ? '0.9375rem' : '1rem'};
          color: var(--color-text);
          margin-bottom: ${templateKey === 'CONSERVATIVE' ? '0.75rem' : '1rem'};
          line-height: ${templateKey === 'CONSERVATIVE' ? '1.6' : '1.75'};
        }

        .editorial-prose ul, .editorial-prose ol {
          font-family: var(--font-body);
          color: var(--color-text);
          margin: ${templateKey === 'CONSERVATIVE' ? '0.75rem 0' : '1rem 0'};
          padding-left: 1.5rem;
        }

        .editorial-prose li {
          margin-bottom: ${templateKey === 'CONSERVATIVE' ? '0.375rem' : '0.5rem'};
          line-height: ${templateKey === 'CONSERVATIVE' ? '1.5' : '1.7'};
        }

        .editorial-prose strong {
          font-weight: 700;
          color: var(--color-primary);
        }

        /* MODERN: Bold gradient accent line */
        ${templateKey === 'MODERN' ? `
        .decorative-line {
          width: 50px;
          height: 3px;
          background: linear-gradient(90deg, var(--color-secondary), var(--color-accent));
          border-radius: 1.5px;
        }
        ` : ''}

        /* CONSERVATIVE: Simple thin line */
        ${templateKey === 'CONSERVATIVE' ? `
        .decorative-line {
          width: 40px;
          height: 2px;
          background: var(--color-secondary);
        }
        ` : ''}

        /* HYBRID: Gradient with glow */
        ${templateKey === 'HYBRID' ? `
        .decorative-line {
          width: 40px;
          height: 2px;
          background: linear-gradient(90deg, var(--color-secondary), var(--color-accent));
          border-radius: 1px;
          box-shadow: 0 1px 4px rgba(124, 58, 237, 0.2);
        }
        ` : ''}

        .content-section {
          background-color: var(--color-surface);
          border-radius: var(--border-radius);
          box-shadow: var(--card-shadow);
          border: var(--card-border);
          padding: ${templateKey === 'CONSERVATIVE' ? '1rem 1.25rem' : templateKey === 'MODERN' ? '1.5rem 2rem' : '1.25rem 1.75rem'};
          margin-bottom: 0;
          ${templateKey === 'MODERN' ? 'position: relative; overflow: hidden;' : ''}
          ${templateKey === 'HYBRID' ? 'border-left: 4px solid var(--color-card-accent);' : ''}
        }

        /* MODERN: Decorative corner accent */
        ${templateKey === 'MODERN' ? `
        .content-section::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, transparent 50%, rgba(255, 77, 77, 0.05) 50%);
          pointer-events: none;
        }
        ` : ''}

        .step-card {
          border-radius: ${templateKey === 'CONSERVATIVE' ? '2px' : templateKey === 'MODERN' ? '20px' : '12px'};
          box-shadow: ${templateKey === 'CONSERVATIVE' ? 'none' : templateKey === 'MODERN' ? '0 8px 24px rgba(0, 0, 0, 0.1)' : '0 4px 12px rgba(124, 58, 237, 0.1)'};
          ${templateKey === 'MODERN' ? 'transition: transform 0.2s ease, box-shadow 0.2s ease;' : ''}
        }

        ${templateKey === 'MODERN' ? `
        .step-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
        }
        ` : ''}

        .main-container {
          max-width: var(--max-width);
        }

        /* MODERN: Bold section headers */
        ${templateKey === 'MODERN' ? `
        .section-header {
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }
        ` : ''}

        /* CONSERVATIVE: Traditional headers */
        ${templateKey === 'CONSERVATIVE' ? `
        .section-header {
          font-size: 0.8125rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        ` : ''}

        /* HYBRID: Modern but softer headers */
        ${templateKey === 'HYBRID' ? `
        .section-header {
          font-size: 0.875rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        ` : ''}

        /* Template-specific sidebar styling */
        ${templateKey === 'MODERN' ? `
        .sidebar-section {
          background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
        }
        ` : templateKey === 'CONSERVATIVE' ? `
        .sidebar-section {
          background: #f8fafc;
        }
        ` : `
        .sidebar-section {
          background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%);
        }
        `}
      `}</style>

      <div
        className="h-screen flex flex-col overflow-hidden paper-texture"
        style={{ backgroundColor: 'var(--color-background)' }}
      >
        {/* Header - Compact, centered design */}
        <header
          className={`relative overflow-hidden flex items-center flex-shrink-0 ${
            templateKey === 'MODERN' ? 'py-4' :
            templateKey === 'CONSERVATIVE' ? 'py-3' : 'py-4'
          }`}
          style={{
            background: template.colors.headerBg,
          }}
        >
          {/* MODERN: Geometric pattern overlay */}
          {templateKey === 'MODERN' && (
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="modern-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="30" cy="30" r="1.5" fill="white"/>
                    <circle cx="0" cy="0" r="1.5" fill="white"/>
                    <circle cx="60" cy="0" r="1.5" fill="white"/>
                    <circle cx="0" cy="60" r="1.5" fill="white"/>
                    <circle cx="60" cy="60" r="1.5" fill="white"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#modern-pattern)" />
              </svg>
            </div>
          )}

          {/* CONSERVATIVE: No pattern, clean solid color */}

          {/* HYBRID: Subtle wave pattern */}
          {templateKey === 'HYBRID' && (
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                <defs>
                  <pattern id="hybrid-waves" width="200" height="200" patternUnits="userSpaceOnUse">
                    <path d="M0 50 Q 50 0, 100 50 T 200 50" fill="none" stroke="white" strokeWidth="1"/>
                    <path d="M0 100 Q 50 50, 100 100 T 200 100" fill="none" stroke="white" strokeWidth="1"/>
                    <path d="M0 150 Q 50 100, 100 150 T 200 150" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#hybrid-waves)" />
              </svg>
            </div>
          )}

          {/* Quick Action Icons - Top Right */}
          {(followup.meetingNotesUrl || followup.videoRecordingUrl) && (
            <div className="absolute top-4 right-6 flex items-center gap-2 z-10">
              {followup.meetingNotesUrl && (
                <a
                  href={followup.meetingNotesUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackLinkClick(followup.meetingNotesUrl!, 'Meeting Notes', 'header')}
                  className={`p-2.5 rounded-full transition-all hover:scale-110 ${
                    templateKey === 'MODERN' ? 'bg-white/20 hover:bg-white/30' :
                    templateKey === 'CONSERVATIVE' ? 'bg-white/15 hover:bg-white/25' : 'bg-white/20 hover:bg-white/30'
                  }`}
                  title="Meeting Notes"
                >
                  <DocumentTextIcon className="h-5 w-5 text-white" />
                </a>
              )}
              {followup.videoRecordingUrl && (
                <a
                  href={followup.videoRecordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackLinkClick(followup.videoRecordingUrl!, 'Video Recording', 'header')}
                  className={`p-2.5 rounded-full transition-all hover:scale-110 ${
                    templateKey === 'MODERN' ? 'bg-white/20 hover:bg-white/30' :
                    templateKey === 'CONSERVATIVE' ? 'bg-white/15 hover:bg-white/25' : 'bg-white/20 hover:bg-white/30'
                  }`}
                  title="Video Recording"
                >
                  <VideoCameraIcon className="h-5 w-5 text-white" />
                </a>
              )}
            </div>
          )}

          <div className={`mx-auto w-full relative ${
            templateKey === 'MODERN' ? 'max-w-7xl px-10' :
            templateKey === 'CONSERVATIVE' ? 'max-w-5xl px-6' : 'max-w-6xl px-8'
          }`}>
            {/* Centered Header Content */}
            <div className="text-center">
              {/* Company flow indicator */}
              <div className={`inline-flex items-center gap-3 ${
                templateKey === 'MODERN' ? 'mb-2' :
                templateKey === 'CONSERVATIVE' ? 'mb-1' : 'mb-1.5'
              }`}>
                <div className={`editorial-body font-semibold tracking-wide uppercase ${
                  templateKey === 'MODERN' ? 'text-xs' :
                  templateKey === 'CONSERVATIVE' ? 'text-[10px]' : 'text-xs'
                }`} style={{ color: 'var(--color-accent)' }}>
                  {followup.senderCompany?.name || 'N/A'}
                </div>
                <ArrowRightIcon className={`${
                  templateKey === 'MODERN' ? 'h-4 w-4' : 'h-3 w-3'
                }`} style={{ color: 'var(--color-accent)' }} />
                <div className={`editorial-body font-semibold tracking-wide uppercase ${
                  templateKey === 'MODERN' ? 'text-xs' :
                  templateKey === 'CONSERVATIVE' ? 'text-[10px]' : 'text-xs'
                }`} style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  {followup.receiverCompany?.name || 'N/A'}
                </div>
              </div>

              {/* Title */}
              <h1 className={`editorial-title font-bold ${
                templateKey === 'MODERN' ? 'text-3xl mb-2' :
                templateKey === 'CONSERVATIVE' ? 'text-xl mb-1' : 'text-2xl mb-1.5'
              }`} style={{ color: 'white' }}>
                {followup.title}
              </h1>

              {/* Meta info */}
              <div className={`editorial-body inline-flex items-center gap-3 ${
                templateKey === 'MODERN' ? 'text-sm' :
                templateKey === 'CONSERVATIVE' ? 'text-[11px]' : 'text-xs'
              }`} style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className={`${templateKey === 'MODERN' ? 'h-4 w-4' : 'h-3 w-3'}`} />
                  <time>
                    {meetingDate.toLocaleDateString('en-US', {
                      month: templateKey === 'CONSERVATIVE' ? 'short' : 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
                {followup.sender && (
                  <>
                    <span>•</span>
                    <span>{followup.sender.name}</span>
                  </>
                )}
                {followup.meetingLocation && (
                  <>
                    <span>•</span>
                    <span>{followup.meetingLocation}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className={`flex flex-1 min-h-0 ${
          templateKey === 'MODERN' ? '' :
          templateKey === 'CONSERVATIVE' ? '' : ''
        }`}>
          {/* Left Column: Content - Fixed height panels that scroll internally */}
          <main className={`flex-1 min-h-0 flex flex-col ${
            templateKey === 'MODERN' ? 'px-8 py-3' :
            templateKey === 'CONSERVATIVE' ? 'px-5 py-2' : 'px-6 py-3'
          }`}>
            <div className="main-container mx-auto w-full flex-1 min-h-0 flex flex-col gap-3">
              {/* Meeting Recap - Takes 55% of available height (or full height when expanded) */}
              {followup.meetingRecap && (expandedPanel === null || expandedPanel === 'recap') && (
                <article
                  ref={recapSectionRef}
                  data-section-id="meeting-recap"
                  className={`content-section fade-in-up flex flex-col min-h-0 relative ${expandedPanel === 'recap' ? 'expanded' : ''}`}
                  style={{
                    flex: expandedPanel === 'recap' ? '1 1 100%' : '1.2 1 0',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <div className={`flex-shrink-0 ${
                    templateKey === 'MODERN' ? 'mb-2' :
                    templateKey === 'CONSERVATIVE' ? 'mb-1.5' : 'mb-2'
                  }`}>
                    <div className="decorative-line mb-1"></div>
                    <h2 className={`editorial-title section-header ${
                      templateKey === 'MODERN' ? 'text-sm' :
                      templateKey === 'CONSERVATIVE' ? 'text-xs' : 'text-sm'
                    }`} style={{ color: 'var(--color-accent)' }}>
                      Meeting Recap
                    </h2>
                  </div>
                  <div
                    ref={recapContentRef}
                    className={`editorial-prose flex-1 pr-3 min-h-0 ${expandedPanel === 'recap' ? '' : 'overflow-y-auto'}`}
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'var(--color-secondary) transparent',
                      overflowY: expandedPanel === 'recap' ? 'visible' : 'auto'
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: followup.meetingRecap }} />
                  </div>
                  {/* Recap Confirmation Buttons */}
                  <div className={`flex-shrink-0 pt-2 mt-auto border-t ${
                    templateKey === 'CONSERVATIVE' ? 'border-gray-200' : 'border-gray-100'
                  }`}>
                    {hasRecapConfirmation() ? (
                      <div className="flex items-center gap-2 editorial-body text-sm" style={{ color: 'var(--color-accent)' }}>
                        <CheckCircleSolidIcon className="h-5 w-5" />
                        <span>Thank you for your feedback!</span>
                      </div>
                    ) : feedback?.type === ConfirmationType.RECAP_ACCURATE || feedback?.type === ConfirmationType.RECAP_INACCURATE ? (
                      <div className="flex items-center gap-2 editorial-body text-sm animate-pulse" style={{ color: 'var(--color-accent)' }}>
                        <CheckCircleSolidIcon className="h-5 w-5" />
                        <span>{feedback.message}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="editorial-body text-xs font-medium" style={{ color: 'var(--color-text-light)' }}>
                          Is this recap accurate?
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => submitConfirmation(ConfirmationType.RECAP_ACCURATE)}
                            disabled={submitting === ConfirmationType.RECAP_ACCURATE}
                            className={`inline-flex items-center gap-1.5 editorial-body text-xs font-medium transition-all ${
                              templateKey === 'MODERN'
                                ? 'px-3 py-1.5 rounded-full bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                                : templateKey === 'CONSERVATIVE'
                                ? 'px-2.5 py-1 rounded bg-green-50 hover:bg-green-100 text-green-700 border border-green-300'
                                : 'px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 border border-green-200'
                            } ${submitting === ConfirmationType.RECAP_ACCURATE ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <HandThumbUpIcon className="h-3.5 w-3.5" />
                            Yes, looks good
                          </button>
                          <button
                            onClick={() => openFeedbackModal('recap')}
                            disabled={submitting === ConfirmationType.RECAP_INACCURATE}
                            className={`inline-flex items-center gap-1.5 editorial-body text-xs font-medium transition-all ${
                              templateKey === 'MODERN'
                                ? 'px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                                : templateKey === 'CONSERVATIVE'
                                ? 'px-2.5 py-1 rounded bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-300'
                                : 'px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                            } ${submitting === ConfirmationType.RECAP_INACCURATE ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <HandThumbDownIcon className="h-3.5 w-3.5" />
                            Something's off
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => setExpandedPanel(expandedPanel === 'recap' ? null : 'recap')}
                    className={`expand-btn absolute bottom-3 right-3 p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                      templateKey === 'MODERN'
                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 shadow-md'
                        : templateKey === 'CONSERVATIVE'
                        ? 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                        : 'bg-purple-100 hover:bg-purple-200 shadow-sm'
                    }`}
                    title={expandedPanel === 'recap' ? 'Collapse' : 'Expand to read full content'}
                  >
                    {expandedPanel === 'recap' ? (
                      <ArrowsPointingInIcon className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                    ) : (
                      <ArrowsPointingOutIcon className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                    )}
                  </button>
                </article>
              )}

              {/* Value Proposition - Takes 45% of available height (or full height when expanded) */}
              {followup.valueProposition && (expandedPanel === null || expandedPanel === 'valueProp') && (
                <article
                  ref={valuePropSectionRef}
                  data-section-id="value-proposition"
                  className={`content-section fade-in-up delay-100 flex flex-col min-h-0 relative ${expandedPanel === 'valueProp' ? 'expanded' : ''}`}
                  style={{
                    flex: expandedPanel === 'valueProp' ? '1 1 100%' : '0.8 1 0',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <div className={`flex-shrink-0 ${
                    templateKey === 'MODERN' ? 'mb-2' :
                    templateKey === 'CONSERVATIVE' ? 'mb-1.5' : 'mb-2'
                  }`}>
                    <div className="decorative-line mb-1"></div>
                    <h2 className={`editorial-title section-header ${
                      templateKey === 'MODERN' ? 'text-sm' :
                      templateKey === 'CONSERVATIVE' ? 'text-xs' : 'text-sm'
                    }`} style={{ color: 'var(--color-secondary)' }}>
                      Value Proposition
                    </h2>
                  </div>
                  <div
                    ref={valuePropositionRef}
                    className={`editorial-prose flex-1 pr-3 min-h-0 ${expandedPanel === 'valueProp' ? '' : 'overflow-y-auto'}`}
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'var(--color-secondary) transparent',
                      overflowY: expandedPanel === 'valueProp' ? 'visible' : 'auto'
                    }}
                  >
                    <div dangerouslySetInnerHTML={{ __html: followup.valueProposition }} />
                  </div>
                  {/* Value Proposition Confirmation Buttons */}
                  <div className={`flex-shrink-0 pt-2 mt-auto border-t ${
                    templateKey === 'CONSERVATIVE' ? 'border-gray-200' : 'border-gray-100'
                  }`}>
                    {hasValuePropConfirmation() ? (
                      <div className="flex items-center gap-2 editorial-body text-sm" style={{ color: 'var(--color-secondary)' }}>
                        <CheckCircleSolidIcon className="h-5 w-5" />
                        <span>Thank you for your feedback!</span>
                      </div>
                    ) : feedback?.type === ConfirmationType.VALUE_PROP_CLEAR || feedback?.type === ConfirmationType.VALUE_PROP_UNCLEAR ? (
                      <div className="flex items-center gap-2 editorial-body text-sm animate-pulse" style={{ color: 'var(--color-secondary)' }}>
                        <CheckCircleSolidIcon className="h-5 w-5" />
                        <span>{feedback.message}</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="editorial-body text-xs font-medium" style={{ color: 'var(--color-text-light)' }}>
                          Does this resonate?
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => submitConfirmation(ConfirmationType.VALUE_PROP_CLEAR)}
                            disabled={submitting === ConfirmationType.VALUE_PROP_CLEAR}
                            className={`inline-flex items-center gap-1.5 editorial-body text-xs font-medium transition-all ${
                              templateKey === 'MODERN'
                                ? 'px-3 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                                : templateKey === 'CONSERVATIVE'
                                ? 'px-2.5 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300'
                                : 'px-3 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200'
                            } ${submitting === ConfirmationType.VALUE_PROP_CLEAR ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <SparklesIcon className="h-3.5 w-3.5" />
                            Yes!
                          </button>
                          <button
                            onClick={() => openFeedbackModal('valueProp')}
                            disabled={submitting === ConfirmationType.VALUE_PROP_UNCLEAR}
                            className={`inline-flex items-center gap-1.5 editorial-body text-xs font-medium transition-all ${
                              templateKey === 'MODERN'
                                ? 'px-3 py-1.5 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                                : templateKey === 'CONSERVATIVE'
                                ? 'px-2.5 py-1 rounded bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-300'
                                : 'px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                            } ${submitting === ConfirmationType.VALUE_PROP_UNCLEAR ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <ChatBubbleLeftRightIcon className="h-3.5 w-3.5" />
                            Tell me more
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => setExpandedPanel(expandedPanel === 'valueProp' ? null : 'valueProp')}
                    className={`expand-btn absolute bottom-3 right-3 p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                      templateKey === 'MODERN'
                        ? 'bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 shadow-md'
                        : templateKey === 'CONSERVATIVE'
                        ? 'bg-gray-100 hover:bg-gray-200 border border-gray-300'
                        : 'bg-purple-100 hover:bg-purple-200 shadow-sm'
                    }`}
                    title={expandedPanel === 'valueProp' ? 'Collapse' : 'Expand to read full content'}
                  >
                    {expandedPanel === 'valueProp' ? (
                      <ArrowsPointingInIcon className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                    ) : (
                      <ArrowsPointingOutIcon className="h-4 w-4" style={{ color: 'var(--color-primary)' }} />
                    )}
                  </button>
                </article>
              )}
            </div>
          </main>

          {/* Right Sidebar: Actions & Next Steps */}
          <aside className={`border-l overflow-y-auto sidebar-section flex-shrink-0 ${
            templateKey === 'MODERN' ? 'w-[400px]' :
            templateKey === 'CONSERVATIVE' ? 'w-72' : 'w-80'
          }`} style={{ borderColor: templateKey === 'CONSERVATIVE' ? '#e2e8f0' : 'var(--color-surface)' }}>
            <div className={`${
              templateKey === 'MODERN' ? 'p-8' :
              templateKey === 'CONSERVATIVE' ? 'p-4' : 'p-6'
            }`}>
              {/* Interested? Call to Action - Before Next Steps */}
              <div className={`fade-in-up delay-100 ${
                templateKey === 'MODERN' ? 'mb-8' :
                templateKey === 'CONSERVATIVE' ? 'mb-4' : 'mb-6'
              }`}>
                <div className={`p-4 rounded-lg ${
                  templateKey === 'MODERN'
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200'
                    : templateKey === 'CONSERVATIVE'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gradient-to-br from-cyan-50 to-emerald-50 border border-cyan-200'
                }`}>
                  {hasInterestConfirmation() ? (
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2" style={{ color: 'var(--color-accent)' }}>
                        <CheckCircleSolidIcon className="h-6 w-6" />
                        <span className="editorial-body font-semibold">Wonderful!</span>
                      </div>
                      <p className="editorial-body text-sm" style={{ color: 'var(--color-text)' }}>
                        We look forward to connecting with you soon.
                      </p>
                    </div>
                  ) : feedback?.type === ConfirmationType.INTERESTED || feedback?.type === ConfirmationType.SCHEDULE_CALL ? (
                    <div className="text-center animate-pulse">
                      <div className="flex items-center justify-center gap-2 mb-2" style={{ color: 'var(--color-accent)' }}>
                        <CheckCircleSolidIcon className="h-6 w-6" />
                        <span className="editorial-body font-semibold">{feedback.message}</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className={`editorial-body font-semibold mb-2 ${
                        templateKey === 'MODERN' ? 'text-base' :
                        templateKey === 'CONSERVATIVE' ? 'text-sm' : 'text-sm'
                      }`} style={{ color: 'var(--color-primary)' }}>
                        Interested in learning more?
                      </h3>
                      <p className="editorial-body text-xs mb-3" style={{ color: 'var(--color-text-light)' }}>
                        Let us know if you'd like to continue the conversation.
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => submitConfirmation(ConfirmationType.INTERESTED)}
                          disabled={submitting === ConfirmationType.INTERESTED}
                          className={`flex-1 inline-flex items-center justify-center gap-2 editorial-body text-sm font-semibold transition-all ${
                            templateKey === 'MODERN'
                              ? 'px-4 py-2.5 rounded-full'
                              : templateKey === 'CONSERVATIVE'
                              ? 'px-3 py-2 rounded'
                              : 'px-4 py-2 rounded-lg'
                          } ${submitting === ConfirmationType.INTERESTED ? 'opacity-50 cursor-not-allowed' : ''}`}
                          style={{
                            backgroundColor: 'var(--color-accent)',
                            color: 'white'
                          }}
                        >
                          <PhoneIcon className="h-4 w-4" />
                          Yes, I'm interested
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Next Steps */}
              {followup.nextSteps && followup.nextSteps.length > 0 && (
                <div
                  ref={nextStepsSectionRef}
                  data-section-id="next-steps"
                  className="fade-in-up delay-200"
                >
                  <div className={`${
                    templateKey === 'MODERN' ? 'mb-8' :
                    templateKey === 'CONSERVATIVE' ? 'mb-4' : 'mb-6'
                  }`}>
                    <div className="decorative-line mb-3"></div>
                    <div className="flex items-center justify-between mb-2">
                      <h2 className={`editorial-title section-header ${
                        templateKey === 'MODERN' ? 'text-base' :
                        templateKey === 'CONSERVATIVE' ? 'text-sm' : 'text-base'
                      }`} style={{ color: 'var(--color-primary)' }}>
                        Next Steps
                      </h2>
                      <span className={`editorial-body font-semibold ${
                        templateKey === 'MODERN' ? 'text-sm px-3 py-1 rounded-full' :
                        templateKey === 'CONSERVATIVE' ? 'text-[11px]' : 'text-xs'
                      }`} style={{
                        color: 'var(--color-text)',
                        backgroundColor: templateKey === 'MODERN' ? 'rgba(0,0,0,0.05)' : 'transparent'
                      }}>
                        {completedSteps}/{totalSteps} {templateKey === 'MODERN' ? 'completed' : ''}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className={`overflow-hidden ${
                      templateKey === 'MODERN' ? 'h-2 mb-8 rounded-full' :
                      templateKey === 'CONSERVATIVE' ? 'h-1 mb-4 rounded-none' : 'h-1.5 mb-6 rounded-full'
                    }`} style={{ backgroundColor: templateKey === 'CONSERVATIVE' ? '#e2e8f0' : 'rgba(0,0,0,0.08)' }}>
                      <div
                        className={`h-full transition-all duration-500 ${
                          templateKey === 'CONSERVATIVE' ? '' : 'rounded-full'
                        }`}
                        style={{
                          width: `${progressPercent}%`,
                          background: templateKey === 'MODERN'
                            ? 'linear-gradient(90deg, var(--color-secondary), var(--color-accent))'
                            : 'var(--color-secondary)'
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* What Receiver Needs to Do */}
                  {groupedNextSteps.receiverSteps.length > 0 && (
                    <div className="mb-6">
                      <h3 className="editorial-body text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-secondary)' }}>
                        What {followup.receiverCompany.name} Needs to Do
                      </h3>
                      <div className="space-y-3">
                        {groupedNextSteps.receiverSteps.map((step, index) => (
                          <div
                            key={`receiver-${index}`}
                            className="step-card group p-4 border-l-4 transition-all hover:shadow-lg"
                            style={{
                              borderLeftColor: step.completed ? 'var(--color-accent)' : 'var(--color-secondary)',
                              backgroundColor: 'var(--color-background)',
                              borderRight: '1px solid var(--color-surface)',
                              borderTop: '1px solid var(--color-surface)',
                              borderBottom: '1px solid var(--color-surface)'
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {step.completed ? (
                                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
                                    <CheckCircleIcon className="h-3.5 w-3.5 text-white" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: 'var(--color-secondary)' }}></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`editorial-body text-sm font-semibold mb-2 ${step.completed ? 'line-through opacity-60' : ''}`} style={{ color: 'var(--color-primary)' }}>
                                  {step.action}
                                </p>
                                <div className="flex flex-wrap gap-2 editorial-body text-xs" style={{ color: 'var(--color-text)' }}>
                                  {step.owner && (
                                    <div className="flex items-center gap-1">
                                      <UserIcon className="h-3 w-3" />
                                      <span>{step.owner}</span>
                                    </div>
                                  )}
                                  {step.deadline && (
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon className="h-3 w-3" />
                                      <time>
                                        {new Date(step.deadline).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                        })}
                                      </time>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* What Sender Needs to Do */}
                  {groupedNextSteps.senderSteps.length > 0 && (
                    <div>
                      <h3 className="editorial-body text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-accent)' }}>
                        What {followup.senderCompany.name} Needs to Do
                      </h3>
                      <div className="space-y-3">
                        {groupedNextSteps.senderSteps.map((step, index) => (
                          <div
                            key={`sender-${index}`}
                            className="step-card group p-4 border-l-4 transition-all hover:shadow-lg"
                            style={{
                              borderLeftColor: step.completed ? 'var(--color-accent)' : 'var(--color-secondary)',
                              backgroundColor: 'var(--color-background)',
                              borderRight: '1px solid var(--color-surface)',
                              borderTop: '1px solid var(--color-surface)',
                              borderBottom: '1px solid var(--color-surface)'
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {step.completed ? (
                                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-accent)' }}>
                                    <CheckCircleIcon className="h-3.5 w-3.5 text-white" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 rounded-full border-2" style={{ borderColor: 'var(--color-secondary)' }}></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`editorial-body text-sm font-semibold mb-2 ${step.completed ? 'line-through opacity-60' : ''}`} style={{ color: 'var(--color-primary)' }}>
                                  {step.action}
                                </p>
                                <div className="flex flex-wrap gap-2 editorial-body text-xs" style={{ color: 'var(--color-text)' }}>
                                  {step.owner && (
                                    <div className="flex items-center gap-1">
                                      <UserIcon className="h-3 w-3" />
                                      <span>{step.owner}</span>
                                    </div>
                                  )}
                                  {step.deadline && (
                                    <div className="flex items-center gap-1">
                                      <CalendarIcon className="h-3 w-3" />
                                      <time>
                                        {new Date(step.deadline).toLocaleDateString('en-US', {
                                          month: 'short',
                                          day: 'numeric',
                                          year: 'numeric',
                                        })}
                                      </time>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Print Button */}
              <div className="mt-8 pt-6 border-t" style={{ borderColor: 'var(--color-surface)' }}>
                <button
                  onClick={() => window.print()}
                  className="editorial-body w-full px-4 py-3 rounded-sm font-semibold text-sm transition-all hover:shadow-lg"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-background)'
                  }}
                >
                  Print Document
                </button>
                <p className="editorial-body text-xs text-center mt-3" style={{ color: 'var(--color-text)' }}>
                  Published {new Date(followup.publishedAt || followup.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Feedback Modal */}
      {feedbackModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeFeedbackModal}
          />

          {/* Modal */}
          <div
            className={`relative w-full max-w-md bg-white shadow-2xl ${
              templateKey === 'MODERN' ? 'rounded-3xl' :
              templateKey === 'CONSERVATIVE' ? 'rounded-lg' : 'rounded-2xl'
            }`}
            style={{ fontFamily: 'var(--font-body)' }}
          >
            <div className="p-6">
              <h3
                className="text-xl font-semibold mb-2"
                style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
              >
                {feedbackModal.type === 'recap' ? "What's off about the recap?" : 'What would you like to know more about?'}
              </h3>
              <p className="text-sm mb-5" style={{ color: 'var(--color-text-light)' }}>
                Your feedback helps us improve. This is optional but appreciated.
              </p>

              {/* Name field */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                  Your name <span style={{ color: 'var(--color-text-light)' }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={feedbackModal.name}
                  onChange={(e) => setFeedbackModal(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-2.5 border focus:outline-none focus:ring-2 transition-all ${
                    templateKey === 'MODERN'
                      ? 'rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-100'
                      : templateKey === 'CONSERVATIVE'
                      ? 'rounded border-gray-300 focus:border-blue-400 focus:ring-blue-100'
                      : 'rounded-lg border-gray-200 focus:border-violet-400 focus:ring-violet-100'
                  }`}
                  style={{ fontSize: '0.9375rem' }}
                />
              </div>

              {/* Comment field */}
              <div className="mb-5">
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }}>
                  {feedbackModal.type === 'recap' ? 'What needs to be corrected?' : 'What would you like more details on?'}
                </label>
                <textarea
                  value={feedbackModal.comment}
                  onChange={(e) => setFeedbackModal(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder={feedbackModal.type === 'recap'
                    ? "Please describe what's inaccurate or missing..."
                    : "What topics would you like us to elaborate on..."
                  }
                  rows={3}
                  className={`w-full px-4 py-2.5 border focus:outline-none focus:ring-2 transition-all resize-none ${
                    templateKey === 'MODERN'
                      ? 'rounded-xl border-gray-200 focus:border-purple-400 focus:ring-purple-100'
                      : templateKey === 'CONSERVATIVE'
                      ? 'rounded border-gray-300 focus:border-blue-400 focus:ring-blue-100'
                      : 'rounded-lg border-gray-200 focus:border-violet-400 focus:ring-violet-100'
                  }`}
                  style={{ fontSize: '0.9375rem' }}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeFeedbackModal}
                  className={`flex-1 px-4 py-2.5 font-medium transition-all ${
                    templateKey === 'MODERN'
                      ? 'rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : templateKey === 'CONSERVATIVE'
                      ? 'rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                      : 'rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  style={{ fontSize: '0.9375rem' }}
                >
                  Cancel
                </button>
                <button
                  onClick={submitFeedbackWithComment}
                  disabled={submitting !== null}
                  className={`flex-1 px-4 py-2.5 font-medium text-white transition-all ${
                    templateKey === 'MODERN'
                      ? 'rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                      : templateKey === 'CONSERVATIVE'
                      ? 'rounded bg-blue-600 hover:bg-blue-700'
                      : 'rounded-lg bg-violet-600 hover:bg-violet-700'
                  } ${submitting !== null ? 'opacity-50 cursor-not-allowed' : ''}`}
                  style={{ fontSize: '0.9375rem' }}
                >
                  {submitting !== null ? 'Sending...' : 'Send Feedback'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
