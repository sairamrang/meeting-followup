# Error Handling - Implementation Fixes

Quick reference for fixing the critical error handling issues.

---

## Fix 1: FollowupEditorPage - Add Error Display (CRITICAL)

**File:** `/apps/frontend/src/pages/followups/FollowupEditorPage.tsx`

**Step 1: Add error state (after other useState declarations)**
```typescript
const [saveError, setSaveError] = useState<string | null>(null);
```

**Step 2: Update onSubmit catch block (around line 195)**
```typescript
catch (error: any) {
  console.error('❌ Failed to save follow-up:', error);

  // Extract user-friendly error message
  const message = error?.response?.data?.error?.message ||
                 error?.message ||
                 'Failed to save follow-up. Please try again.';

  setSaveError(message);
  setIsSaving(false);
}
```

**Step 3: Add error UI before form (after Header, before Form)**
```typescript
{/* Error Message */}
{saveError && (
  <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
    <div className="flex">
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-red-800" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {saveError}
        </p>
      </div>
      <div className="ml-auto pl-3">
        <button
          type="button"
          onClick={() => setSaveError(null)}
          className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none transition-colors"
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  </div>
)}
```

**Step 4: Import XMarkIcon (check if already imported)**
```typescript
import { ArrowLeftIcon, DocumentTextIcon, XMarkIcon } from '@heroicons/react/24/outline';
```

**Time to implement:** 30 minutes

---

## Fix 2: Use Toast System (ALTERNATIVE to Fix 1)

**File:** `/apps/frontend/src/pages/followups/FollowupEditorPage.tsx`

**Step 1: Import useToast**
```typescript
import { useToast } from '@/hooks/useToast';
```

**Step 2: Add hook call**
```typescript
const { showError, showSuccess } = useToast();
```

**Step 3: Replace catch block**
```typescript
catch (error: any) {
  const message = error?.response?.data?.error?.message ||
                 error?.message ||
                 'Failed to save follow-up. Please try again.';
  showError(message);
  setIsSaving(false);
}
```

**Step 4: Add success notification**
```typescript
// After setShowSuccess(true):
showSuccess('Follow-up saved successfully!');
setShowSuccess(true);
```

**Benefit:** Reuses existing system, consistent with rest of app

---

## Fix 3: PublishModal - Add Success Toast (HIGH)

**File:** `/apps/frontend/src/components/followups/PublishModal.tsx`

**Step 1: Import useToast**
```typescript
import { useToast } from '@/hooks/useToast';
```

**Step 2: Add hook call**
```typescript
const { showSuccess, showError } = useToast();
```

**Step 3: Update handlePublish success**
```typescript
try {
  console.log('🚀 Publishing follow-up with slug:', slug, 'template:', selectedTemplate);
  await onPublish(slug, selectedTemplate);
  console.log('✅ Publish successful');

  // Add success toast
  showSuccess(`Follow-up published! Share: ${publicUrl}`);

  // Small delay before closing
  setTimeout(() => {
    onClose();
  }, 500);
} catch (err: any) {
  // ... error handling ...
}
```

---

## Fix 4: Client-Side Slug Validation (MEDIUM)

**File:** `/apps/frontend/src/components/followups/PublishModal.tsx`

**Step 1: Add state**
```typescript
const [slugAvailable, setSlugAvailable] = useState(true);
const [checkingSlug, setCheckingSlug] = useState(false);
```

**Step 2: Update slug change handler**
```typescript
const handleSlugChange = (value: string) => {
  const sanitized = value
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-');
  setSlug(sanitized);
  setError(null);

  // Check availability
  if (sanitized.length >= 3) {
    setCheckingSlug(true);

    setTimeout(async () => {
      try {
        const response = await apiClient.get(`/api/followups/public/${sanitized}`);
        setSlugAvailable(false);
      } catch (err) {
        if (err.response?.status === 404) {
          setSlugAvailable(true);
        } else {
          setSlugAvailable(true);
        }
      } finally {
        setCheckingSlug(false);
      }
    }, 500);
  }
};
```

**Step 3: Add visual indicator in slug input**
```typescript
{slug.length >= 3 && !checkingSlug && (
  <p className={`mt-1 text-xs ${slugAvailable ? 'text-green-600' : 'text-red-600'}`}>
    {slugAvailable ? '✓ Slug available' : '✗ Slug already taken'}
  </p>
)}
```

**Step 4: Update publish button**
```typescript
disabled={isPublishing || !slug || slug.length < 3 || !slugAvailable || checkingSlug}
```

---

## Fix 5: Error Utility Functions (MEDIUM)

**New File:** `/apps/frontend/src/utils/error-utils.ts`

```typescript
export function extractErrorMessage(error: any): string {
  if (error?.response?.data?.error?.message) {
    return error.response.data.error.message;
  }

  if (error?.message) {
    return error.message;
  }

  const status = error?.response?.status;
  switch (status) {
    case 400:
      return 'Invalid data. Please check your input.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'This item already exists. Please try a different name.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
}

export function isRetryableError(error: any): boolean {
  const status = error?.response?.status;
  return status >= 500 || status === 408 || !error?.response;
}
```

**Usage:**
```typescript
import { extractErrorMessage } from '@/utils/error-utils';

catch (error: any) {
  const message = extractErrorMessage(error);
  showError(message);
}
```

---

## Implementation Priority

| Fix | Priority | Effort | Impact | Est. Time |
|-----|----------|--------|--------|-----------|
| Fix 1 or 2 | CRITICAL | Low | HIGH | 30 min |
| Fix 3 | HIGH | Very Low | MEDIUM | 10 min |
| Fix 4 | MEDIUM | Medium | MEDIUM | 1 hour |
| Fix 5 | MEDIUM | Low | MEDIUM | 20 min |

---

## Testing After Fixes

### Test 1: Follow-up Save Failure
1. Open follow-up editor
2. In DevTools, enable offline mode
3. Click "Save Draft"
4. Verify: Error message displays with user-friendly text
5. Verify: Dismiss button works
6. Verify: Form remains editable
7. Disable offline mode
8. Click "Save Draft" again
9. Verify: Success

### Test 2: Duplicate Slug
1. Open PublishModal
2. Enter existing slug
3. Verify: Red indicator appears
4. Verify: Publish button disabled
5. Change slug
6. Verify: Green indicator appears
7. Verify: Publish button enabled

---

## Rollout Plan

**Day 1 (CRITICAL):**
- Implement Fix 1 (30 min)
- Test thoroughly
- Deploy

**Day 2 (HIGH):**
- Implement Fix 3 (10 min)
- Implement Fix 5 (20 min)
- Test
- Deploy

**Day 3 (MEDIUM):**
- Implement Fix 4 (1 hour)
- User testing
- Deploy

