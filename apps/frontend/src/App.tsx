import { RouterProvider } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import { router } from './router';
import { useInitAuth } from './store/auth-store';
import { ToastProvider } from './hooks/useToast';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';

// Only require Clerk key if not in test mode
if (!isTestMode && !clerkPubKey) {
  throw new Error('Missing Clerk Publishable Key');
}

function AuthSync() {
  useInitAuth();
  return null;
}

function App() {
  // In test mode, skip ClerkProvider and AuthSync entirely
  // Test mode auth is handled by TestLogin component
  if (isTestMode) {
    return (
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    );
  }

  // Production mode with Clerk
  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <AuthSync />
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </ClerkProvider>
  );
}

export default App;
