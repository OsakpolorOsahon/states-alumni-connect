# SMMOWCUB - Senior Members Man O' War Club University of Benin

## Overview

SMMOWCUB is a full-stack web application designed as an exclusive portal for alumni of the Man O' War Club at the University of Benin. The application serves as a comprehensive platform for networking, member management, and community engagement among "Statesmen" (alumni members).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Context API for authentication, TanStack Query for server state
- **Routing**: React Router DOM for client-side navigation
- **Build Tool**: Vite for fast development and optimized builds
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture (Full-Stack)
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Authentication**: Express sessions with bcrypt password hashing
- **API Design**: Express REST API with proper route handlers
- **Session Management**: Express-session with secure cookie configuration
- **File Storage**: UploadThing for file uploads (photos, documents)
- **Email Service**: Resend for transactional emails

### Key Components

#### Authentication System
- Email/password authentication via Supabase Auth
- Role-based access control (Member, Secretary)
- Real-time user state management
- Direct member profile creation in PostgreSQL

#### Member Management
- Comprehensive member profiles with photos and professional details
- Stateship year tracking (1976-2026)
- MOWCUB position hierarchy system
- Current council office tracking
- Member status management (Pending, Active, Inactive)

#### Geographic Features
- Interactive Google Maps integration for member location tracking
- Real-time member location updates
- Map-based member discovery

#### Content Management
- News and announcements system
- Forum discussions with threaded conversations
- Hall of Fame recognition system
- Badge and achievement system

#### Communication Features
- Push notifications system
- Real-time updates using Supabase subscriptions
- Email notifications via Resend for important events

## Data Flow

### Registration Flow
1. User creates account with basic information
2. Email verification required
3. Document upload (photo, dues proof)
4. Secretary approval process
5. Account activation

### Member Directory Access
1. Authentication verification
2. Active member status check
3. Real-time member data fetching
4. Geographic location integration

### Content Publishing
1. Secretary role verification for news/announcements
2. Content creation and editing
3. Real-time distribution to members
4. Notification system activation

## External Dependencies

### Third-Party Services
- **Supabase**: Authentication, PostgreSQL database, real-time updates
- **UploadThing**: File storage for photos and documents
- **Resend**: Email service for notifications
- **Google Maps API**: Interactive mapping features
- **Replit**: Cloud-based development and deployment platform

### NPM Packages
- **UI/Styling**: @radix-ui components, tailwindcss, lucide-react icons
- **Form Handling**: react-hook-form, @hookform/resolvers
- **Data Fetching**: @tanstack/react-query
- **Database**: drizzle-orm, @neondatabase/serverless
- **Utilities**: date-fns, clsx, class-variance-authority

## Deployment Strategy

### Development Environment
- Vite development server for frontend
- Express server with hot reload via tsx
- Environment variables for database and API keys
- Replit integration for cloud development

### Production Build
- Vite build process for frontend optimization
- esbuild for server-side compilation
- Static file serving through Express
- Environment-specific configuration

### Database Management
- Supabase PostgreSQL for structured data storage
- Real-time listeners for live updates
- Automatic scaling and Row Level Security (RLS)
- SQL-based queries with auto-generated APIs

### Security Considerations
- Supabase Auth tokens for authentication
- Row Level Security (RLS) policies for data access
- Role-based access control
- File upload validation and sanitization
- Environment variable protection for sensitive data

### PWA Features
- Service worker for offline functionality
- App manifest for installability
- Push notification capabilities
- Responsive design for mobile devices

## Recent Changes

### January 2025 - Replit Environment Migration COMPLETE
- **Backend Migration**: ✅ Migrated from Supabase to Express/Node.js server with PostgreSQL
- **Database Migration**: ✅ Migrated from Supabase PostgreSQL to Neon PostgreSQL via Drizzle ORM
- **Authentication System**: ✅ Replaced Supabase Auth with server-side Express sessions and bcrypt
- **API Migration**: ✅ Converted Supabase Edge Functions to Express API routes
- **Security Implementation**: ✅ Server-side authentication with session management
- **Email System**: ✅ Integrated Resend for transactional emails
- **File Storage**: ✅ UploadThing integration for photo/document uploads
- **Environment Security**: ✅ Added proper API key management with Replit Secrets
- **Development Environment**: ✅ Optimized for Replit cloud development
- **Production Ready**: ✅ Full-stack architecture with proper client/server separation
- **Component Fixes**: ✅ Fixed all React component errors and undefined variables
- **UI Updates**: ✅ Updated footer with black background and logo icon
- **Documentation**: ✅ Created comprehensive COMPLETE_SETUP_GUIDE.md for deployment

### Migration Status: COMPLETE
- All technical migration tasks completed
- Application running successfully on Replit
- Ready for production deployment following the setup guide

## Key Features

### Member Portal
- Personal dashboard with activity feed
- Directory search and filtering
- Profile management and updates
- Document management system

### Administrative Features
- Secretary dashboard for member approval
- Badge and recognition management
- Content moderation tools
- Analytics and reporting

### Community Features
- Forum discussions and threads
- Mentorship program matching
- Job board for career opportunities
- Event management and RSVPs

### Technical Features
- Real-time data synchronization
- Offline capability through PWA
- Responsive design for all devices
- SEO optimization for public pages