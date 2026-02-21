import { Outlet } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useCompaniesStore } from '@/store/companies-store';

export function MainLayout() {
  const { fetchCompanies } = useCompaniesStore();

  useEffect(() => {
    // Load companies when the layout mounts
    fetchCompanies();
  }, [fetchCompanies]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 lg:pl-72">
          <Suspense fallback={<LoadingSpinner />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
