import { UserButton } from '@clerk/clerk-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';
import { Menu } from '@headlessui/react';
import { UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const isTestMode = import.meta.env.VITE_TEST_MODE === 'true';

export function Header() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    useAuthStore.getState().setAuth(null, null, true, false);
    navigate('/test-login');
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
              Meeting Follow-Up
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
              {user.email || `${user.firstName} ${user.lastName}`}
            </span>
          )}

          {isTestMode ? (
            // Custom user menu for test mode
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">
                {user?.firstName?.charAt(0) || 'T'}
              </Menu.Button>
              <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={`px-4 py-2 text-sm ${
                        active ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-gray-500 text-xs">{user?.email}</div>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 ${
                        active ? 'bg-gray-100' : ''
                      }`}
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </Menu.Items>
            </Menu>
          ) : (
            // Clerk UserButton for production
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-10 h-10',
                },
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
}
