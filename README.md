# ✈️ MERN Travel Story App

A full-stack travel journal app with AI enhancements, analytics, and Google OAuth.

## Features
- **Authentication**: Email/Password + Google OAuth
- **Stories**: Create, edit, delete with image upload
- **AI**: Story enhancement, title generation, travel assistant
- **Analytics**: Spending tracking and trip insights
- **Search**: Filter by title, location, date

## Tech Stack
**Frontend**: React 18, Vite, Tailwind CSS, Recharts  
**Backend**: Node.js, Express, MongoDB, JWT, Google AI

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB
- Google OAuth credentials

### Setup
```bash
# Clone
git clone <repo-url>
cd 045305_merntravelstoryapp16092024

# Backend
cd backend
npm install
npm start  # Port 8000

# Frontend
cd frontend/travel-story-app
npm install
npm run dev  # Port 5173
```

### Environment
**Backend (.env)**
```env
MONGODB_URI=your_mongodb_uri
ACCESS_TOKEN_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env.production)**
```env
VITE_SERVER_URL=your_backend_url
```

## API Endpoints
- `POST /login` - User login
- `POST /add-travel-story` - Create story
- `GET /get-all-stories` - Get user stories
- `POST /enhance-story` - AI enhancement
- `GET /analytics/*` - Analytics data
