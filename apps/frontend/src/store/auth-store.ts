import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react';
import { setAuthToken } from '@/lib/api-client';
import { useEffect } from 'react';

interface AuthState {
  userId: string | null;
  user: any | null;
  isLoaded: boolean;
  isSignedIn: boolean;
  setAuth: (userId: string | null, user: any | null, isLoaded: boolean, isSignedIn: boolean) => void;
  setToken: (token: string | null) => void;
}

const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      userId: null,
      user: null,
      // In test mode, start as loaded (no Clerk to wait for)
      isLoaded: isTestMode,
      isSignedIn: false,
      setAuth: (userId, user, isLoaded, isSignedIn) =>
        set({ userId, user, isLoaded, isSignedIn }),
      setToken: (token) => {
        setAuthToken(token);
      },
    }),
    { name: 'auth-store' }
  )
);

// Hook to sync Clerk auth with store
export function useInitAuth() {
  const { userId, isLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user } = useClerkUser();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    setAuth(userId || null, user, isLoaded, isSignedIn || false);

    if (isSignedIn && userId) {
      // Get token and set in API client
      getToken().then((token) => {
        if (token) {
          setToken(token);
        }
      });
    } else {
      setToken(null);
    }
  }, [userId, user, isLoaded, isSignedIn, setAuth, setToken, getToken]);
}
