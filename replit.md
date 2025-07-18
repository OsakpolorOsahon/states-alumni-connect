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

### January 2025 - Supabase + Vercel Migration COMPLETE
- **Backend Migration**: ✅ Migrated to Supabase PostgreSQL with Drizzle ORM
- **Authentication Migration**: ✅ Replaced Express sessions with Supabase Auth
- **Database Migration**: ✅ Full Supabase PostgreSQL integration
- **API Updates**: ✅ Updated all routes for Supabase Auth integration
- **Storage Implementation**: ✅ Supabase-compatible storage layer
- **Deployment Guide**: ✅ Complete Vercel + Supabase deployment documentation
- **Environment Setup**: ✅ Environment variables for Supabase services
- **Security Implementation**: ✅ JWT-based authentication with proper middleware

### Migration Status: READY FOR VERCEL DEPLOYMENT
- All Supabase integration completed
- Application architecture updated for Vercel deployment
- Comprehensive deployment guide created (VERCEL_SUPABASE_DEPLOYMENT.md)
- **Complete detailed deployment guide created (COMPLETE_DEPLOYMENT_GUIDE.md)**
- **Enhanced SQL schema with full application coverage, indexes, and security policies**
- **Verified all application features are supported in database schema**
- Ready for production deployment on Vercel + Supabase

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