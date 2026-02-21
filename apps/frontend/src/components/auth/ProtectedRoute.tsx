import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuthStore } from '@/store/auth-store';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoaded: storeLoaded, isSignedIn: storeSignedIn } = useAuthStore();

  // In test mode, only use Zustand store for authentication
  if (!storeLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!storeSignedIn) {
    return <Navigate to="/test-login" replace />;
  }

  return <>{children}</>;
}
