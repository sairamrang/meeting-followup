import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth-store';

const TEST_USER = {
  email: 'test@example.com',
  password: 'password123',
  userData: {
    id: 'test-user-001',
    firstName: 'Test',
    lastName: 'User (Sender)',
    username: 'testuser',
    email: 'test@example.com',
    emailAddresses: [{ emailAddress: 'test@example.com' }],
  },
};

export function TestLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setToken = useAuthStore((state) => state.setToken);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (email === TEST_USER.email && password === TEST_USER.password) {
      // Mock successful login
      setAuth(TEST_USER.userData.id, TEST_USER.userData, true, true);
      setToken('test-token-123');
      navigate('/');
    } else {
      setError('Invalid credentials. Use test@example.com / password123');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 animate-pulse">
            <svg
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Test Mode</h2>
          <p className="text-purple-300 text-sm">
            Quick login for development testing
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-purple-100 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="test@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-purple-100 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="password123"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-105 transition-all duration-200"
            >
              Sign In (Test Mode)
            </button>
          </form>

          {/* Test Credentials */}
          <div className="mt-6 p-4 bg-black/20 rounded-lg border border-white/10">
            <p className="text-xs font-mono text-purple-200 mb-2">Test Credentials:</p>
            <p className="text-xs font-mono text-white">test@example.com</p>
            <p className="text-xs font-mono text-white">password123</p>
          </div>
        </div>

        {/* Switch to Clerk */}
        <div className="text-center">
          <p className="text-purple-300 text-sm">
            Want to use Clerk authentication?{' '}
            <button
              onClick={() => navigate('/sign-in')}
              className="text-purple-400 hover:text-purple-300 underline font-medium"
            >
              Switch to Clerk
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
