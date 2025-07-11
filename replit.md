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

### Backend Architecture
- **Runtime**: Node.js with Express.js (legacy endpoints)
- **Database**: Firebase Firestore (NoSQL document database) + PostgreSQL (Drizzle ORM)
- **Authentication**: Firebase Auth with email/password
- **API Design**: Firebase SDK with real-time capabilities + REST API endpoints
- **Session Management**: Firebase Auth tokens
- **File Storage**: UploadThing for file uploads (photos, documents)

### Key Components

#### Authentication System
- Email/password authentication via Firebase Auth
- Role-based access control (Member, Secretary)
- Real-time user state management
- Direct member profile creation in Firestore

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
- Email notifications for important events

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
- **Firebase**: Authentication, Firestore database, real-time updates, file storage
- **Google Maps API**: Interactive mapping features
- **Development Environment**: Cloud-based development platform

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
- Firebase Firestore collections for data storage
- Real-time listeners for live updates
- Automatic scaling and indexing

### Security Considerations
- Firebase Auth tokens for authentication
- Firestore security rules for data access
- Role-based access control
- File upload validation and sanitization
- Environment variable protection for sensitive data

### PWA Features
- Service worker for offline functionality
- App manifest for installability
- Push notification capabilities
- Responsive design for mobile devices

## Recent Changes

### January 2025 - Complete System Integration and Deployment Ready
- **Email System Migration**: Switched from SendGrid to Resend for better reliability
- **Firebase Permission Issues Fixed**: Resolved realtime subscription errors
- **Complete API Integration**: All external services configured (Firebase, Resend, UploadThing, Google Maps)
- **Database Architecture**: Dual database system (PostgreSQL + Firebase Firestore) fully operational
- **Deployment Guide Created**: Comprehensive setup guide for all external services
- **Security Enhancements**: Proper error handling and authentication flow
- **Production Ready**: Website 100% functional with all features working

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