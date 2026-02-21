import { useState } from 'react';
import { XMarkIcon, SparklesIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { aiApi } from '@/services/api';

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (content: string) => void;
  generationType: 'recap' | 'valueProposition' | 'actionItems';
  context?: {
    meetingType?: string;
    companyName?: string;
    productName?: string;
  };
}

const GENERATION_LABELS = {
  recap: 'Meeting Recap',
  valueProposition: 'Value Proposition',
  actionItems: 'Action Items',
};

const PLACEHOLDERS = {
  recap: 'Paste your meeting notes or enter a URL to transcript/notes...',
  valueProposition: 'Paste meeting context or notes to generate value proposition...',
  actionItems: 'Paste meeting notes to extract action items...',
};

export function AIGenerationModal({
  isOpen,
  onClose,
  onApply,
  generationType,
  context,
}: AIGenerationModalProps) {
  const [sourceContent, setSourceContent] = useState('');
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!sourceContent.trim()) {
      setError('Please enter some content or a URL');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const result = await aiApi.generateContent({
        type: generationType,
        sourceContent: sourceContent.trim(),
        context,
      });

      setGeneratedContent(result.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to generate content. Please try again.';
      setError(errorMessage);
      console.error('AI generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (generatedContent) {
      if (generationType === 'actionItems' && Array.isArray(generatedContent)) {
        // Format action items as HTML list
        const formattedContent = `<ul>${generatedContent
          .map(
            (item: any) =>
              `<li><strong>${item.action}</strong>${item.owner ? ` - ${item.owner}` : ''}${
                item.deadline ? ` (Due: ${item.deadline})` : ''
              }</li>`
          )
          .join('')}</ul>`;
        onApply(formattedContent);
      } else {
        onApply(generatedContent as string);
      }
      handleClose();
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleClose = () => {
    setSourceContent('');
    setGeneratedContent(null);
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={handleClose} />

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SparklesIcon className="h-6 w-6 text-white" />
              <h2 className="text-xl font-semibold text-white">
                Generate {GENERATION_LABELS[generationType]} with AI
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {/* Input Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Source Content or URL
              </label>
              <textarea
                value={sourceContent}
                onChange={(e) => setSourceContent(e.target.value)}
                placeholder={PLACEHOLDERS[generationType]}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[150px] font-mono text-sm"
                disabled={isGenerating}
              />
            </div>

            {/* Generate Button */}
            {!generatedContent && (
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !sourceContent.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="h-5 w-5" />
                    Generate with AI
                  </>
                )}
              </button>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Preview Section */}
            {generatedContent && (
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Generated Content Preview
                  </label>
                  <button
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    <ArrowPathIcon className="h-4 w-4" />
                    Regenerate
                  </button>
                </div>
                <div className="border-2 border-green-300 bg-green-50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
                  {generationType === 'actionItems' && Array.isArray(generatedContent) ? (
                    <ul className="space-y-2">
                      {generatedContent.map((item: any, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-green-600 font-bold">•</span>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.action}</p>
                            {(item.owner || item.deadline) && (
                              <p className="text-sm text-gray-600 mt-1">
                                {item.owner && <span>Owner: {item.owner}</span>}
                                {item.owner && item.deadline && <span> | </span>}
                                {item.deadline && <span>Due: {item.deadline}</span>}
                              </p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: generatedContent as string }}
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {generatedContent && (
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t">
              <button
                onClick={handleClose}
                className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center gap-2"
              >
                <SparklesIcon className="h-5 w-5" />
                Apply to Editor
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
