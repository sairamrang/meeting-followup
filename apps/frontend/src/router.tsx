import { createBrowserRouter, Navigate } from 'react-router-dom';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { MainLayout } from './components/layout/MainLayout';
import { ErrorBoundary } from './components/error/ErrorBoundary';
import { NotFoundPage } from './pages/NotFoundPage';

// Lazy load pages for code splitting
import { lazy } from 'react';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CompaniesListPage = lazy(() => import('./pages/companies/CompaniesListPage'));
const CompanyDetailPage = lazy(() => import('./pages/companies/CompanyDetailPage'));
const FollowupsListPage = lazy(() => import('./pages/followups/FollowupsListPage'));
const FollowupEditorPage = lazy(() => import('./pages/followups/FollowupEditorPage'));
const FollowupDetailPage = lazy(() => import('./pages/followups/FollowupDetailPage'));
const FollowupAnalyticsPage = lazy(() => import('./pages/followups/FollowupAnalyticsPage'));
const PublicViewerPage = lazy(() => import('./pages/public/PublicViewerPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Test mode components
import { TestLogin } from './components/auth/TestLogin';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ErrorBoundary />,
    children: [
      // Public routes
      {
        path: 'test-login',
        element: <TestLogin />,
      },
      {
        path: 'sign-in/*',
        element: (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <SignIn routing="path" path="/sign-in" />
          </div>
        ),
      },
      {
        path: 'sign-up/*',
        element: (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <SignUp routing="path" path="/sign-up" />
          </div>
        ),
      },
      {
        path: 'followup/:slug',
        element: <PublicViewerPage />,
      },

      // Protected routes
      {
        element: (
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        ),
        children: [
          {
            path: '/',
            element: <DashboardPage />,
          },
          {
            path: 'companies',
            element: <CompaniesListPage />,
          },
          {
            path: 'companies/:id',
            element: <CompanyDetailPage />,
          },
          {
            path: 'follow-ups',
            element: <FollowupsListPage />,
          },
          {
            path: 'follow-ups/new',
            element: <FollowupEditorPage />,
          },
          {
            path: 'follow-ups/:id',
            element: <FollowupDetailPage />,
          },
          {
            path: 'follow-ups/:id/analytics',
            element: <FollowupAnalyticsPage />,
          },
          {
            path: 'follow-ups/:id/edit',
            element: <FollowupEditorPage />,
          },
          {
            path: 'settings',
            element: <SettingsPage />,
          },
        ],
      },

      // 404
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);
