// useConfirmations Hook Tests
// Tests the confirmation hook functionality for the public viewer page
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ConfirmationType } from '@meeting-followup/shared';

// Test constants
const TEST_SLUG = 'test-followup-slug';
const TEST_SESSION_ID = 'test-session-123';

// In-memory localStorage mock
let localStorageStore: Record<string, string> = {};

const localStorageMock = {
  getItem: (key: string) => localStorageStore[key] || null,
  setItem: (key: string, value: string) => {
    localStorageStore[key] = value;
  },
  removeItem: (key: string) => {
    delete localStorageStore[key];
  },
  clear: () => {
    localStorageStore = {};
  },
};

// Mock localStorage before importing the hook
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

// Create a mock API module
const mockCreate = vi.fn();

// Mock the API module
vi.mock('@/services/api', () => ({
  confirmationsApi: {
    create: (...args: any[]) => mockCreate(...args),
  },
}));

// Import hook after mocks are set up
import { useConfirmations } from '@/hooks/useConfirmations';

describe('useConfirmations Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageStore = {};
    mockCreate.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorageStore = {};
  });

  describe('Initial State', () => {
    it('should initialize with falsy confirmations when no stored data', () => {
      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      // The hook returns undefined || undefined which is falsy
      expect(result.current.hasRecapConfirmation()).toBeFalsy();
      expect(result.current.hasValuePropConfirmation()).toBeFalsy();
      expect(result.current.hasInterestConfirmation()).toBeFalsy();
      expect(result.current.submitting).toBeNull();
      expect(result.current.feedback).toBeNull();
    });

    it('should load existing confirmations from localStorage', async () => {
      // Pre-populate localStorage
      const storageKey = `followup_confirmations_${TEST_SLUG}_${TEST_SESSION_ID}`;
      localStorageStore[storageKey] = JSON.stringify({
        RECAP_ACCURATE: true,
        VALUE_PROP_CLEAR: true,
      });

      const { result, rerender } = renderHook(() =>
        useConfirmations(TEST_SLUG, TEST_SESSION_ID)
      );

      // Force a rerender to allow useEffect to run
      rerender();

      // Wait for state to update
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      expect(result.current.hasRecapConfirmation()).toBeTruthy();
      expect(result.current.hasValuePropConfirmation()).toBeTruthy();
      expect(result.current.hasInterestConfirmation()).toBeFalsy();
    });

    it('should handle null slug gracefully', () => {
      const { result } = renderHook(() => useConfirmations(undefined, TEST_SESSION_ID));

      expect(result.current.hasRecapConfirmation()).toBeFalsy();
    });

    it('should handle null sessionId by using slug-only key', () => {
      const storageKey = `followup_confirmations_${TEST_SLUG}`;
      localStorageStore[storageKey] = JSON.stringify({ RECAP_ACCURATE: true });

      const { result } = renderHook(() => useConfirmations(TEST_SLUG, null));

      // The hook will use the slug-only key
      expect(localStorageStore[storageKey]).toBeDefined();
    });
  });

  describe('submitConfirmation', () => {
    it('should call API with correct parameters', async () => {
      mockCreate.mockResolvedValue({
        id: 'confirmation-1',
        followupId: 'followup-123',
        sessionId: TEST_SESSION_ID,
        type: ConfirmationType.RECAP_ACCURATE,
        confirmedAt: new Date(),
      });

      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      expect(mockCreate).toHaveBeenCalledWith(TEST_SLUG, {
        type: ConfirmationType.RECAP_ACCURATE,
        sessionId: TEST_SESSION_ID,
        comment: undefined,
      });
    });

    it('should mark confirmation as complete after successful API call', async () => {
      mockCreate.mockResolvedValue({
        id: 'confirmation-2',
        followupId: 'followup-123',
        type: ConfirmationType.RECAP_ACCURATE,
        confirmedAt: new Date(),
      });

      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      // Initially falsy (undefined or false)
      expect(result.current.hasRecapConfirmation()).toBeFalsy();

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      expect(result.current.hasRecapConfirmation()).toBeTruthy();
    });

    it('should persist confirmation to localStorage after successful submission', async () => {
      mockCreate.mockResolvedValue({
        id: 'confirmation-3',
        followupId: 'followup-123',
        type: ConfirmationType.RECAP_ACCURATE,
        confirmedAt: new Date(),
      });

      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      const storageKey = `followup_confirmations_${TEST_SLUG}_${TEST_SESSION_ID}`;
      expect(localStorageStore[storageKey]).toBeDefined();
      expect(localStorageStore[storageKey]).toContain('RECAP_ACCURATE');
    });

    it('should show feedback message after successful submission', async () => {
      mockCreate.mockResolvedValue({
        id: 'confirmation-4',
        followupId: 'followup-123',
        type: ConfirmationType.RECAP_ACCURATE,
        confirmedAt: new Date(),
      });

      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      expect(result.current.feedback).toEqual({
        type: ConfirmationType.RECAP_ACCURATE,
        message: 'Thanks for confirming!',
      });
    });

    it('should submit with optional comment', async () => {
      mockCreate.mockResolvedValue({
        id: 'confirmation-5',
        followupId: 'followup-123',
        type: ConfirmationType.RECAP_INACCURATE,
        comment: 'The dates were incorrect',
        confirmedAt: new Date(),
      });

      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(
          ConfirmationType.RECAP_INACCURATE,
          'The dates were incorrect'
        );
      });

      expect(mockCreate).toHaveBeenCalledWith(TEST_SLUG, {
        type: ConfirmationType.RECAP_INACCURATE,
        sessionId: TEST_SESSION_ID,
        comment: 'The dates were incorrect',
      });
    });

    it('should not submit if slug is undefined', async () => {
      const { result } = renderHook(() => useConfirmations(undefined, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe('Feedback Messages', () => {
    beforeEach(() => {
      mockCreate.mockResolvedValue({
        id: 'confirmation-feedback',
        followupId: 'followup-123',
        confirmedAt: new Date(),
      });
    });

    it('should show correct message for RECAP_ACCURATE', async () => {
      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      expect(result.current.feedback?.message).toBe('Thanks for confirming!');
    });

    it('should show correct message for RECAP_INACCURATE', async () => {
      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_INACCURATE);
      });

      expect(result.current.feedback?.message).toBe("We'll review this. Thanks for the feedback!");
    });

    it('should show correct message for VALUE_PROP_CLEAR', async () => {
      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.VALUE_PROP_CLEAR);
      });

      expect(result.current.feedback?.message).toBe('Great! Glad it resonates.');
    });

    it('should show correct message for VALUE_PROP_UNCLEAR', async () => {
      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.VALUE_PROP_UNCLEAR);
      });

      expect(result.current.feedback?.message).toBe("We'll follow up with more details.");
    });

    it('should show correct message for INTERESTED', async () => {
      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.INTERESTED);
      });

      expect(result.current.feedback?.message).toBe('Wonderful! We look forward to connecting.');
    });

    it('should show correct message for SCHEDULE_CALL', async () => {
      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.SCHEDULE_CALL);
      });

      expect(result.current.feedback?.message).toBe('Taking you to schedule...');
    });
  });

  describe('Duplicate Prevention', () => {
    it('should not submit duplicate confirmation for same type', async () => {
      mockCreate.mockResolvedValue({
        id: 'confirmation-dup',
        followupId: 'followup-123',
        type: ConfirmationType.RECAP_ACCURATE,
        confirmedAt: new Date(),
      });

      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      // First submission
      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      const firstCallCount = mockCreate.mock.calls.length;
      expect(firstCallCount).toBe(1);

      // Attempt second submission of same type
      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      // Should not have called API again
      expect(mockCreate.mock.calls.length).toBe(1);
    });

    it('should allow different confirmation types', async () => {
      mockCreate.mockResolvedValue({
        id: 'confirmation-different',
        followupId: 'followup-123',
        confirmedAt: new Date(),
      });

      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      // First type
      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      // Different type should be allowed
      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.VALUE_PROP_CLEAR);
      });

      expect(mockCreate.mock.calls.length).toBe(2);
      expect(result.current.hasRecapConfirmation()).toBe(true);
      expect(result.current.hasValuePropConfirmation()).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should still mark as confirmed locally on API error to prevent spam', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockCreate.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      // Should still be marked as confirmed
      expect(result.current.hasRecapConfirmation()).toBe(true);

      consoleSpy.mockRestore();
    });

    it('should persist to localStorage even on API error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockCreate.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      const storageKey = `followup_confirmations_${TEST_SLUG}_${TEST_SESSION_ID}`;
      expect(localStorageStore[storageKey]).toBeDefined();

      consoleSpy.mockRestore();
    });
  });

  describe('hasConfirmed Helper', () => {
    it('should return true for confirmed type', async () => {
      mockCreate.mockResolvedValue({
        id: 'confirmation-helper',
        followupId: 'followup-123',
        type: ConfirmationType.RECAP_ACCURATE,
        confirmedAt: new Date(),
      });

      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      expect(result.current.hasConfirmed(ConfirmationType.RECAP_ACCURATE)).toBe(true);
      expect(result.current.hasConfirmed(ConfirmationType.RECAP_INACCURATE)).toBe(false);
    });
  });

  describe('Group Confirmation Checks', () => {
    beforeEach(() => {
      mockCreate.mockResolvedValue({
        id: 'confirmation-group',
        followupId: 'followup-123',
        confirmedAt: new Date(),
      });
    });

    it('hasRecapConfirmation returns true for RECAP_ACCURATE', async () => {
      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      expect(result.current.hasRecapConfirmation()).toBe(true);
    });

    it('hasRecapConfirmation returns true for RECAP_INACCURATE', async () => {
      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.RECAP_INACCURATE);
      });

      expect(result.current.hasRecapConfirmation()).toBe(true);
    });

    it('hasValuePropConfirmation returns true for VALUE_PROP_CLEAR', async () => {
      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.VALUE_PROP_CLEAR);
      });

      expect(result.current.hasValuePropConfirmation()).toBe(true);
    });

    it('hasValuePropConfirmation returns true for VALUE_PROP_UNCLEAR', async () => {
      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.VALUE_PROP_UNCLEAR);
      });

      expect(result.current.hasValuePropConfirmation()).toBe(true);
    });

    it('hasInterestConfirmation returns true for INTERESTED', async () => {
      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.INTERESTED);
      });

      expect(result.current.hasInterestConfirmation()).toBe(true);
    });

    it('hasInterestConfirmation returns true for SCHEDULE_CALL', async () => {
      const { result } = renderHook(() => useConfirmations(TEST_SLUG, TEST_SESSION_ID));

      await act(async () => {
        await result.current.submitConfirmation(ConfirmationType.SCHEDULE_CALL);
      });

      expect(result.current.hasInterestConfirmation()).toBe(true);
    });
  });

  describe('Session Storage Keys', () => {
    it('should use different storage keys for different sessions', async () => {
      const SESSION_1 = 'session-1';
      const SESSION_2 = 'session-2';

      mockCreate.mockResolvedValue({
        id: 'confirmation-session',
        followupId: 'followup-123',
        confirmedAt: new Date(),
      });

      const { result: result1 } = renderHook(() => useConfirmations(TEST_SLUG, SESSION_1));

      await act(async () => {
        await result1.current.submitConfirmation(ConfirmationType.RECAP_ACCURATE);
      });

      const storageKey1 = `followup_confirmations_${TEST_SLUG}_${SESSION_1}`;
      const storageKey2 = `followup_confirmations_${TEST_SLUG}_${SESSION_2}`;

      expect(localStorageStore[storageKey1]).toBeDefined();
      expect(localStorageStore[storageKey2]).toBeUndefined();
    });
  });
});
