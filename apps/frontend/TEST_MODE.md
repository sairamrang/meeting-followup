# Test Mode Setup

## Quick Testing Without Clerk

To enable fast testing without going through Clerk authentication:

### 1. Enable Test Mode
In your `.env.local` file, set:
```bash
VITE_TEST_MODE=true
```

### 2. Access Test Login
Navigate to: http://localhost:5173/test-login

### 3. Test Credentials
```
Email: test@example.com
Password: password123
```

## Features
- ✅ Bypasses Clerk completely
- ✅ Instant login for rapid testing
- ✅ Mocked user data (Test User)
- ✅ Works with all protected routes
- ✅ Can switch back to Clerk anytime

## Switch Between Modes

### Test Mode → Clerk
1. Click "Switch to Clerk" on test login page
2. OR navigate to `/sign-in`
3. OR set `VITE_TEST_MODE=false` in `.env.local`

### Clerk → Test Mode
1. Navigate to `/test-login`
2. OR set `VITE_TEST_MODE=true` in `.env.local`

## Production
Test mode is automatically disabled in production builds.

## Mock User Data
```javascript
{
  id: 'test-user-123',
  firstName: 'Test',
  lastName: 'User',
  username: 'testuser',
  email: 'test@example.com'
}
```

This user can:
- Create companies and contacts
- Create and publish follow-ups
- Access all protected routes
- Test the full application flow
