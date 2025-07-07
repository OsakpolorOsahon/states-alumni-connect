# SMMOWCUB Platform - Developer Manual

## Overview
The Senior Members of the Man O' War Club University of Benin (SMMOWCUB) platform is a comprehensive web application built with React, TypeScript, and Supabase that serves as a central hub for alumni networking, mentorship, job opportunities, and community engagement.

## Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL + Real-time + Authentication + Storage)
- **Styling**: Tailwind CSS + Shadcn/ui components
- **State Management**: React Query + Context API
- **Routing**: React Router

## Database Schema
### Core Tables
- `members`: User profiles and membership data
- `notifications`: System notifications
- `job_posts`: Job opportunities 
- `job_applications`: Job applications
- `news`: News articles and announcements
- `events`: Community events
- `forum_threads`: Discussion threads
- `forum_replies`: Thread replies
- `mentorship_requests`: Mentorship connections
- `badges`: Member achievements
- `hall_of_fame`: Distinguished members

## User Roles & Permissions
1. **Public Users**: Can view directory and basic information
2. **Members**: Full access to member features (jobs, forums, mentorship)
3. **Secretary**: Administrative access to manage members, content, and operations

## Key Features

### Authentication & Registration
- Email/password authentication via Supabase Auth
- Email verification required
- Document upload (photo + dues proof)
- Secretary approval process

### Member Directory (Public)
- Hierarchical ordering: Council Position → Year → MOWCUB Position
- Public member profiles with photos
- Real-time member count statistics

### Member Dashboard
- Personalized dashboard with quick access
- Real-time notifications
- Statistics and insights

### Job Board
- Members can post job opportunities
- Secretary approval system
- Job applications tracking
- Real-time updates

### Discussion Forums
- Create and participate in discussions
- Thread management (pinned, locked)
- Reply system with real-time updates

### Mentorship Program
- Connect mentees with experienced mentors
- Request and response system
- Status tracking (pending, active, completed)

### Secretary Dashboard
- Member management (approve/reject)
- Content moderation
- Badge management
- Secretary handover functionality

## Test Credentials

### First Secretary Setup
To create the first secretary, run this SQL in Supabase:
```sql
-- Replace 'USER_ID' with actual user ID from auth.users
UPDATE members SET role = 'secretary' WHERE user_id = 'USER_ID';
```

### Test Accounts
Create test accounts through the signup flow:
1. **Secretary Test**: secretary@test.com / password123
2. **Member Test**: member@test.com / password123
3. **Pending Test**: pending@test.com / password123

## Real-time Features
All major data is synchronized in real-time:
- Member statistics
- Job postings
- Forum discussions
- Mentorship requests
- Notifications

## File Structure
```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, etc.)
├── hooks/              # Custom React hooks
├── integrations/       # Supabase integration  
├── lib/                # Utilities and configurations
├── pages/              # Route components
└── types/              # TypeScript type definitions
```

## Environment Setup
1. Clone repository
2. Install dependencies: `npm install`
3. Configure Supabase credentials in integration files
4. Run development server: `npm run dev`

## Deployment
The application is configured for deployment on Lovable platform with automatic builds and deployments.

## Security Features
- Row Level Security (RLS) on all database tables
- Authentication-based access control
- File upload restrictions and validation
- Secure secretary handover process

## Performance Optimizations
- Lazy loading of route components
- Real-time subscriptions with cleanup
- Optimized database queries
- Image optimization and caching

## Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Progressive Web App (PWA) features

## Maintenance
- Regular database backups via Supabase
- Monitor real-time subscription performance
- Update dependencies regularly
- Review and optimize database queries

## Support
For technical issues or questions about the platform, contact the development team or refer to the Supabase documentation for backend-related queries.