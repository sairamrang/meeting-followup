import { useState } from 'react';
import {
  XMarkIcon,
  SparklesIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ClipboardDocumentListIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { aiApi } from '@/services/api';

interface UnifiedAIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (content: {
    recap: string;
    valueProposition: string;
    actionItems: Array<{ action: string; owner?: string; deadline?: string }>;
  }) => void;
  existingContent?: {
    recap?: string;
    valueProposition?: string;
    actionItems?: Array<{ action: string; owner?: string; deadline?: string }>;
  };
  context?: {
    meetingType?: string;
    companyName?: string;
    productName?: string;
  };
}

interface GeneratedContent {
  recap: string | null;
  valueProposition: string | null;
  actionItems: Array<{ action: string; owner?: string; deadline?: string }> | null;
}

export function UnifiedAIGenerationModal({
  isOpen,
  onClose,
  onApply,
  existingContent,
  context,
}: UnifiedAIGenerationModalProps) {
  const [sourceContent, setSourceContent] = useState('');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent>({
    recap: null,
    valueProposition: null,
    actionItems: null,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    recap: true,
    valueProposition: true,
    actionItems: true,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  const hasExistingContent =
    existingContent?.recap ||
    existingContent?.valueProposition ||
    (existingContent?.actionItems && existingContent.actionItems.length > 0);

  const hasGeneratedContent =
    generatedContent.recap || generatedContent.valueProposition || generatedContent.actionItems;

  const handleGenerate = async () => {
    if (!sourceContent.trim()) {
      setError('Please enter meeting notes, a URL, or a prompt');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Generate all three sections in parallel
      setGeneratingStep('Generating meeting recap...');
      const [recapResult, valuePropResult, actionItemsResult] = await Promise.all([
        aiApi.generateContent({
          type: 'recap',
          sourceContent: sourceContent.trim(),
          context,
        }),
        aiApi.generateContent({
          type: 'valueProposition',
          sourceContent: sourceContent.trim(),
          context,
        }),
        aiApi.generateContent({
          type: 'actionItems',
          sourceContent: sourceContent.trim(),
          context,
        }),
      ]);

      // Strip markdown code blocks from AI responses (```html...```)
      const stripCodeBlocks = (text: string): string => {
        if (!text || typeof text !== 'string') return text;
        return text
          .replace(/^```html\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/\s*```$/i, '')
          .trim();
      };

      // Note: axios interceptor already extracts .data from {success, data} wrapper
      const cleanedRecap = stripCodeBlocks(recapResult);
      const cleanedValueProp = stripCodeBlocks(valuePropResult);

      setGeneratedContent({
        recap: cleanedRecap,
        valueProposition: cleanedValueProp,
        actionItems: actionItemsResult,
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.error?.message ||
        err.message ||
        'Failed to generate content. Please try again.';
      setError(errorMessage);
      console.error('AI generation error:', err);
    } finally {
      setIsGenerating(false);
      setGeneratingStep('');
    }
  };

  const handleApplyClick = () => {
    if (hasExistingContent) {
      setShowConfirmation(true);
    } else {
      handleApply();
    }
  };

  const handleApply = () => {
    if (hasGeneratedContent) {
      onApply({
        recap: generatedContent.recap || '',
        valueProposition: generatedContent.valueProposition || '',
        actionItems: generatedContent.actionItems || [],
      });
      handleClose();
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleClose = () => {
    setSourceContent('');
    setGeneratedContent({ recap: null, valueProposition: null, actionItems: null });
    setError(null);
    setShowConfirmation(false);
    onClose();
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-slate-900/80 via-purple-900/50 to-slate-900/80 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] overflow-hidden border border-purple-100">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <SparklesIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2
                    className="text-2xl font-bold text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    AI Content Generator
                  </h2>
                  <p className="text-purple-100 text-sm mt-0.5">
                    Generate meeting recap, value proposition & action items
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl p-2 transition-all"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[calc(92vh-200px)]">
            {/* Input Section */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">1</span>
                </div>
                <label
                  className="text-lg font-semibold text-slate-800"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Paste your meeting notes, URL, or describe what happened
                </label>
              </div>
              <div className="relative">
                <textarea
                  value={sourceContent}
                  onChange={(e) => setSourceContent(e.target.value)}
                  placeholder="Example: We met with Acme Corp today to discuss their data integration needs. John (CEO) mentioned they're spending 40+ hours weekly on manual data entry. Sarah (CTO) is interested in our API capabilities. Budget approved for Q2..."
                  className="w-full px-5 py-4 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 transition-all min-h-[180px] text-base resize-none"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  disabled={isGenerating}
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                  {sourceContent.length} characters
                </div>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                Tip: Include attendee names, discussion points, decisions, and any commitments made.
              </p>
            </div>

            {/* Generate Button */}
            {!hasGeneratedContent && (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !sourceContent.trim()}
                className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-violet-700 hover:via-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-[0.98]"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {isGenerating ? (
                  <>
                    <ArrowPathIcon className="h-6 w-6 animate-spin" />
                    <span>{generatingStep || 'Generating all sections...'}</span>
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-6 w-6" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-start gap-3">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Generated Content Sections */}
            {hasGeneratedContent && (
              <div className="space-y-6 mt-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <CheckIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <h3
                      className="text-lg font-semibold text-slate-800"
                      style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      Generated Content Preview
                    </h3>
                  </div>
                  <button
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="inline-flex items-center gap-2 px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    <ArrowPathIcon className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                    Regenerate All
                  </button>
                </div>

                {/* Meeting Recap Section */}
                <div className="border-2 border-blue-200 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-white">
                  <button
                    onClick={() => toggleSection('recap')}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-blue-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                        <DocumentTextIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h4
                          className="font-semibold text-slate-800"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          Meeting Recap
                        </h4>
                        <p className="text-sm text-slate-500">Summary of discussion points</p>
                      </div>
                    </div>
                    {expandedSections.recap ? (
                      <ChevronUpIcon className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                  {expandedSections.recap && generatedContent.recap && (
                    <div className="px-5 pb-5">
                      <div className="text-xs text-blue-600 mb-2 font-medium">Click to edit the content below:</div>
                      <div
                        className="prose prose-sm max-w-none bg-white rounded-lg border-2 border-blue-200 p-4 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 min-h-[150px] cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          setGeneratedContent(prev => ({
                            ...prev,
                            recap: e.currentTarget.innerHTML
                          }));
                        }}
                        dangerouslySetInnerHTML={{ __html: generatedContent.recap }}
                      />
                    </div>
                  )}
                </div>

                {/* Value Proposition Section */}
                <div className="border-2 border-emerald-200 rounded-xl overflow-hidden bg-gradient-to-br from-emerald-50 to-white">
                  <button
                    onClick={() => toggleSection('valueProposition')}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500 flex items-center justify-center">
                        <LightBulbIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h4
                          className="font-semibold text-slate-800"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          Value Proposition
                        </h4>
                        <p className="text-sm text-slate-500">Compelling benefits for prospect</p>
                      </div>
                    </div>
                    {expandedSections.valueProposition ? (
                      <ChevronUpIcon className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                  {expandedSections.valueProposition && generatedContent.valueProposition && (
                    <div className="px-5 pb-5">
                      <div className="text-xs text-emerald-600 mb-2 font-medium">Click to edit the content below:</div>
                      <div
                        className="prose prose-sm max-w-none bg-white rounded-lg border-2 border-emerald-200 p-4 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 min-h-[150px] cursor-text"
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                          setGeneratedContent(prev => ({
                            ...prev,
                            valueProposition: e.currentTarget.innerHTML
                          }));
                        }}
                        dangerouslySetInnerHTML={{ __html: generatedContent.valueProposition }}
                      />
                    </div>
                  )}
                </div>

                {/* Action Items Section */}
                <div className="border-2 border-purple-200 rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-white">
                  <button
                    onClick={() => toggleSection('actionItems')}
                    className="w-full px-5 py-4 flex items-center justify-between hover:bg-purple-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                        <ClipboardDocumentListIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="text-left">
                        <h4
                          className="font-semibold text-slate-800"
                          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                        >
                          Action Items
                        </h4>
                        <p className="text-sm text-slate-500">
                          {generatedContent.actionItems?.length || 0} items extracted
                        </p>
                      </div>
                    </div>
                    {expandedSections.actionItems ? (
                      <ChevronUpIcon className="h-5 w-5 text-slate-400" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-slate-400" />
                    )}
                  </button>
                  {expandedSections.actionItems && generatedContent.actionItems && (
                    <div className="px-5 pb-5">
                      <div className="text-xs text-purple-600 mb-2 font-medium">Click fields to edit:</div>
                      <div className="bg-white rounded-lg border border-purple-100 divide-y divide-purple-100">
                        {generatedContent.actionItems.map((item, index) => (
                          <div key={index} className="p-4 flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-xs font-bold text-purple-600">{index + 1}</span>
                            </div>
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                value={item.action}
                                onChange={(e) => {
                                  const newItems = [...generatedContent.actionItems!];
                                  newItems[index] = { ...newItems[index], action: e.target.value };
                                  setGeneratedContent(prev => ({ ...prev, actionItems: newItems }));
                                }}
                                className="w-full font-medium text-slate-800 bg-transparent border-b-2 border-transparent hover:border-purple-200 focus:border-purple-400 focus:outline-none px-1 py-0.5 transition-colors"
                                placeholder="Action item..."
                              />
                              <div className="flex flex-wrap gap-3">
                                <div className="inline-flex items-center gap-1">
                                  <span className="text-xs text-slate-500">Owner:</span>
                                  <input
                                    type="text"
                                    value={item.owner || ''}
                                    onChange={(e) => {
                                      const newItems = [...generatedContent.actionItems!];
                                      newItems[index] = { ...newItems[index], owner: e.target.value || undefined };
                                      setGeneratedContent(prev => ({ ...prev, actionItems: newItems }));
                                    }}
                                    className="px-2 py-0.5 rounded-md bg-slate-100 text-xs font-medium text-slate-600 border border-transparent hover:border-slate-300 focus:border-purple-400 focus:outline-none w-24"
                                    placeholder="Unassigned"
                                  />
                                </div>
                                <div className="inline-flex items-center gap-1">
                                  <span className="text-xs text-slate-500">Due:</span>
                                  <input
                                    type="text"
                                    value={item.deadline || ''}
                                    onChange={(e) => {
                                      const newItems = [...generatedContent.actionItems!];
                                      newItems[index] = { ...newItems[index], deadline: e.target.value || undefined };
                                      setGeneratedContent(prev => ({ ...prev, actionItems: newItems }));
                                    }}
                                    className="px-2 py-0.5 rounded-md bg-amber-100 text-xs font-medium text-amber-700 border border-transparent hover:border-amber-300 focus:border-purple-400 focus:outline-none w-24"
                                    placeholder="No date"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {hasGeneratedContent && (
            <div className="bg-slate-50 px-8 py-5 flex items-center justify-between border-t border-slate-200">
              <p className="text-sm text-slate-500">
                Review the generated content above before applying
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition-colors"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyClick}
                  className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  <CheckIcon className="h-5 w-5" />
                  Apply All to Editor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowConfirmation(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <h3
                  className="text-lg font-semibold text-slate-900"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Replace Existing Content?
                </h3>
                <p className="text-sm text-slate-500">This will overwrite your current entries</p>
              </div>
            </div>
            <p className="text-slate-600 mb-6">
              You have existing content in some sections. Applying the AI-generated content will
              replace what you currently have. This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-5 py-2.5 border-2 border-slate-300 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                Keep Existing
              </button>
              <button
                onClick={handleApply}
                className="px-5 py-2.5 bg-amber-500 text-white rounded-xl font-medium hover:bg-amber-600 transition-colors"
              >
                Replace Content
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
