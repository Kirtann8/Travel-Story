# Google OAuth Setup Instructions

## 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:8000/auth/google/callback`
   - Add authorized JavaScript origins:
     - `http://localhost:8000`
     - `http://localhost:5173`

## 2. Update Environment Variables

Update your `.env` file in the backend folder with your Google OAuth credentials:

```env
GOOGLE_CLIENT_ID=your_actual_google_client_id_here
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret_here
SESSION_SECRET=your_random_session_secret_here
```

## 3. Generate Session Secret

You can generate a random session secret using Node.js:

```javascript
require('crypto').randomBytes(64).toString('hex')
```

## 4. Test the Implementation

1. Start the backend server: `cd backend && npm start`
2. Start the frontend server: `cd frontend/travel-story-app && npm run dev`
3. Navigate to the login page
4. Click "Continue with Google"
5. Complete the OAuth flow

## Features Implemented

✅ Google OAuth 2.0 authentication
✅ User creation with Google profile data
✅ Account linking for existing users
✅ Automatic email verification for Google users
✅ Profile picture from Google account
✅ Seamless login/signup flow
✅ JWT token generation for authenticated sessions

## Security Notes

- Passwords are not required for Google OAuth users
- Email verification is automatically set to true for Google users
- Existing users can link their Google account
- Session secrets should be kept secure and random