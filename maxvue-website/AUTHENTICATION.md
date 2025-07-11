# Authentication Setup for MaxVue Website

This document describes the authentication system implemented for the MaxVue website.

## Overview

The authentication system uses:
- **NextAuth.js** for authentication management
- **Prisma** with SQLite for database
- **bcrypt** for password hashing
- **JWT** tokens for session management

## Features

- User registration with email/password
- User login/logout
- Protected routes (dashboard)
- Session management
- Role-based access control

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

### 3. Initialize Database

```bash
npx prisma db push
npx prisma generate
```

### 4. Run Development Server

```bash
npm run dev
```

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       ├── [...nextauth]/route.ts  # NextAuth API route
│   │       └── register/route.ts        # Registration endpoint
│   ├── auth/
│   │   ├── login/page.tsx              # Login page
│   │   └── register/page.tsx           # Registration page
│   └── dashboard/page.tsx              # Protected dashboard
├── components/
│   └── auth/
│       ├── SessionProvider.tsx         # NextAuth session provider
│       └── AuthNav.tsx                 # Navigation with auth status
├── hooks/
│   └── useAuth.ts                      # Custom auth hook
├── lib/
│   └── auth.ts                         # NextAuth configuration
└── middleware.ts                       # Route protection middleware
```

## Usage

### Register a New User

1. Navigate to `/auth/register`
2. Fill in name, email, and password
3. Submit the form

### Login

1. Navigate to `/auth/login`
2. Enter email and password
3. Submit the form

### Protected Routes

- `/dashboard` - Requires authentication
- `/admin/*` - Requires admin role

### Using Authentication in Components

```tsx
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session, status } = useSession();
  
  if (status === "loading") return <p>Loading...</p>;
  if (!session) return <p>Not logged in</p>;
  
  return <p>Welcome, {session.user.email}!</p>;
}
```

### Using the Custom Hook

```tsx
import { useAuth } from "@/hooks/useAuth";

function ProtectedComponent() {
  const { user, isLoading, isAuthenticated } = useAuth();
  
  if (isLoading) return <p>Loading...</p>;
  if (!isAuthenticated) return null; // Will redirect
  
  return <p>Welcome, {user.email}!</p>;
}
```

## API Endpoints

### Registration
- **POST** `/api/auth/register`
- Body: `{ email, password, name }`

### Login
- **POST** `/api/auth/signin` (via NextAuth)
- Body: `{ email, password }`

### Logout
- **POST** `/api/auth/signout` (via NextAuth)

## Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  password      String
  name          String?
  image         String?
  role          String    @default("user")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## Security Considerations

1. Passwords are hashed using bcrypt with 12 rounds
2. JWT tokens expire after 30 days
3. HTTPS should be used in production
4. Environment variables must be kept secret
5. Database file should not be committed to version control

## Deployment

### Netlify

The project is configured for Netlify deployment with server-side rendering enabled. The `netlify.toml` file includes the necessary configuration.

### Environment Variables for Production

Set these in your Netlify dashboard:
- `DATABASE_URL` - Production database URL
- `NEXTAUTH_URL` - Your production URL
- `NEXTAUTH_SECRET` - A secure random string

## Testing

Run the test script to verify authentication:

```bash
node test-auth.js
```

This will test user registration and login functionality.