import { useState, useEffect, useCallback } from 'react';
import { confirmationsApi } from '@/services/api';
import type { ConfirmationType } from '@meeting-followup/shared';

// Storage key prefix for tracking confirmations
const STORAGE_KEY_PREFIX = 'followup_confirmations_';

interface ConfirmationState {
  [key: string]: boolean; // Keyed by ConfirmationType
}

/**
 * Hook to manage micro-commitment confirmations on the public viewer page.
 * Tracks which confirmations have been made and persists them in localStorage.
 */
export function useConfirmations(slug: string | undefined, sessionId: string | null) {
  const [confirmations, setConfirmations] = useState<ConfirmationState>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: ConfirmationType; message: string } | null>(null);

  // Load existing confirmations from localStorage
  useEffect(() => {
    if (!slug) return;

    // Include sessionId in storage key so each session can provide feedback independently
    const storageKey = sessionId
      ? `${STORAGE_KEY_PREFIX}${slug}_${sessionId}`
      : `${STORAGE_KEY_PREFIX}${slug}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setConfirmations(JSON.parse(stored));
      } catch {
        // Invalid stored data, ignore
      }
    }
  }, [slug, sessionId]);

  // Save confirmations to localStorage when they change
  const saveConfirmations = useCallback(
    (newState: ConfirmationState) => {
      if (!slug) return;
      // Include sessionId in storage key so each session can provide feedback independently
      const storageKey = sessionId
        ? `${STORAGE_KEY_PREFIX}${slug}_${sessionId}`
        : `${STORAGE_KEY_PREFIX}${slug}`;
      localStorage.setItem(storageKey, JSON.stringify(newState));
      setConfirmations(newState);
    },
    [slug, sessionId]
  );

  // Submit a confirmation
  const submitConfirmation = useCallback(
    async (type: ConfirmationType, comment?: string) => {
      if (!slug || confirmations[type]) return;

      setSubmitting(type);
      setFeedback(null);

      try {
        await confirmationsApi.create(slug, {
          type,
          sessionId: sessionId || undefined,
          comment,
        });

        // Mark as confirmed
        const newState = { ...confirmations, [type]: true };
        saveConfirmations(newState);

        // Show feedback message
        const messages: Record<ConfirmationType, string> = {
          RECAP_ACCURATE: 'Thanks for confirming!',
          RECAP_INACCURATE: "We'll review this. Thanks for the feedback!",
          VALUE_PROP_CLEAR: 'Great! Glad it resonates.',
          VALUE_PROP_UNCLEAR: "We'll follow up with more details.",
          INTERESTED: 'Wonderful! We look forward to connecting.',
          SCHEDULE_CALL: 'Taking you to schedule...',
        };

        setFeedback({ type, message: messages[type] || 'Thank you!' });

        // Clear feedback after 3 seconds
        setTimeout(() => setFeedback(null), 3000);
      } catch (error) {
        console.error('Failed to submit confirmation:', error);
        // Still mark as confirmed locally to prevent spam
        const newState = { ...confirmations, [type]: true };
        saveConfirmations(newState);
      } finally {
        setSubmitting(null);
      }
    },
    [slug, sessionId, confirmations, saveConfirmations]
  );

  // Check if a confirmation has been made
  const hasConfirmed = useCallback(
    (type: ConfirmationType) => confirmations[type] === true,
    [confirmations]
  );

  // Check if any recap confirmation has been made
  const hasRecapConfirmation = useCallback(() => {
    return confirmations['RECAP_ACCURATE'] || confirmations['RECAP_INACCURATE'];
  }, [confirmations]);

  // Check if any value prop confirmation has been made
  const hasValuePropConfirmation = useCallback(() => {
    return confirmations['VALUE_PROP_CLEAR'] || confirmations['VALUE_PROP_UNCLEAR'];
  }, [confirmations]);

  // Check if interest has been expressed
  const hasInterestConfirmation = useCallback(() => {
    return confirmations['INTERESTED'] || confirmations['SCHEDULE_CALL'];
  }, [confirmations]);

  return {
    submitConfirmation,
    hasConfirmed,
    hasRecapConfirmation,
    hasValuePropConfirmation,
    hasInterestConfirmation,
    submitting,
    feedback,
  };
}
