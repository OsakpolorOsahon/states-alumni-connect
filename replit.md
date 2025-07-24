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
- **Database**: Supabase PostgreSQL with Drizzle ORM
- **Authentication**: Supabase Auth with JWT tokens
- **API Design**: Express REST API with proper route handlers
- **Session Management**: JWT-based authentication via Supabase
- **File Storage**: UploadThing for file uploads (photos, documents)
- **Email Service**: Resend for transactional emails

### Key Components

#### Authentication System
- Email/password authentication via Supabase Auth
- JWT token-based session management
- Role-based access control (Member, Secretary)
- Real-time user state management
- Supabase user management with custom member profiles

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
- **Vercel**: Frontend and API deployment platform

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
- Drizzle ORM for type-safe database operations
- Real-time listeners for live updates
- Automatic scaling and Row Level Security (RLS)
- Direct database access with Supabase client

### Security Considerations
- Supabase Auth JWT tokens for authentication
- Row Level Security (RLS) policies for data access
- Role-based access control via member profiles
- File upload validation and sanitization
- Environment variable protection for sensitive data
- Server-side API key validation

### PWA Features
- Service worker for offline functionality
- App manifest for installability
- Push notification capabilities
- Responsive design for mobile devices

## Recent Changes

### January 2025 - Replit Environment Migration & Bug Fixes COMPLETE ✅
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
- **Login System**: ✅ Fixed authentication error handling and imports
- **Footer Mobile**: ✅ Fixed logo shape distortion and removed red overlay on mobile
- **Vercel Routing**: ✅ Fixed 404 errors with proper SPA routing configuration
- **Dashboard Access**: ✅ Fixed missing imports in MemberDashboard component
- **Login Flow**: ✅ Fixed AuthGuard missing hooks and improved navigation flow
- **Authentication Debug**: ✅ Added comprehensive logging for login troubleshooting

### January 2025 - Supabase + Vercel Migration COMPLETE
- **Backend Migration**: ✅ Migrated to Supabase PostgreSQL with Drizzle ORM
- **Authentication Migration**: ✅ Replaced Express sessions with Supabase Auth
- **Database Migration**: ✅ Full Supabase PostgreSQL integration
- **API Updates**: ✅ Updated all routes for Supabase Auth integration
- **Storage Implementation**: ✅ Supabase-compatible storage layer
- **Deployment Guide**: ✅ Complete Vercel + Supabase deployment documentation
- **Environment Setup**: ✅ Environment variables for Supabase services
- **Security Implementation**: ✅ JWT-based authentication with proper middleware

### January 2025 - Full Supabase Backend Migration COMPLETE
- **Express Removal**: ✅ Removed all Express API routes and authentication middleware
- **Frontend Auth**: ✅ Updated AuthContext to use Supabase Auth directly
- **Database Hooks**: ✅ Updated all React hooks to use Supabase database operations
- **Server Simplification**: ✅ Simplified Express server to only serve static files and Vite
- **Environment Configuration**: ✅ Created proper environment variables template
- **Vercel Configuration**: ✅ Created vercel.json for frontend-only deployment
- **Client-Side Architecture**: ✅ Full client-side application with Supabase backend

### Migration Status: PRODUCTION READY ✅
- All Supabase integration completed and tested
- Application architecture optimized for Vercel deployment
- Backend completely handled by Supabase services
- Comprehensive deployment guide created (FINAL_DEPLOYMENT_GUIDE.md)
- **Complete SQL schema with full application coverage, indexes, and security policies**
- **All application features implemented and functional**
- **Real-time statistics and comprehensive member directory**
- **All pages working: Directory, Jobs, Forum, News, Mentorship**
- Ready for immediate production deployment on Vercel + Supabase

### January 2025 - Complete Feature Implementation ✅
- **Directory Page**: ✅ Public hierarchical member directory with search/filters
- **Job Board**: ✅ Full job posting and application system
- **Community Forum**: ✅ Threaded discussions with replies
- **News System**: ✅ Secretary-managed news publishing
- **Mentorship Program**: ✅ Request and matching system
- **Real-time Features**: ✅ Live statistics and updates
- **Authentication**: ✅ Complete Supabase Auth integration
- **Mobile Responsive**: ✅ PWA-ready design
- **Performance Optimized**: ✅ Lazy loading, caching, indexes

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