# Test Credentials for SMMOWCUB

## Login Credentials

For testing purposes, you can use the following credentials:

### Member Account
- **Email:** `member@test.com`
- **Password:** `password123`
- **Role:** Member
- **Status:** Active

### Secretary Account  
- **Email:** `secretary@test.com`
- **Password:** `password123`
- **Role:** Secretary
- **Status:** Active

### Pending Member Account
- **Email:** `pending@test.com`
- **Password:** `password123`
- **Role:** Member
- **Status:** Pending

## How to Create Test Accounts

1. Go to `/signup` on the website
2. Create a new account with any email
3. The system will automatically create a member profile
4. Secretary can approve pending members from the Secretary Dashboard

## Database Test Data

The database has been populated with sample members:
- John Doe (Active Member)
- Jane Smith (Secretary)
- Michael Johnson (Active Member)
- Sarah Wilson (Active Member)
- David Brown (Pending Member)

## Features to Test

### Public Features
- Homepage with hero section
- About page
- History page
- Contact page
- Hall of Fame (public view)
- Member Directory (public view)

### Member Features
- Member Dashboard
- Private member profiles
- News feed
- Interactive map
- Forum discussions
- Job board
- Mentorship program

### Secretary Features
- Secretary Dashboard
- Member management
- Approve/reject pending members
- News and event management
- Badge management
- Hall of Fame management

## Production Deployment

This application is now production-ready with:
- ✅ Supabase authentication
- ✅ PostgreSQL database
- ✅ Secure API endpoints
- ✅ Role-based access control
- ✅ Responsive design
- ✅ PWA capabilities
- ✅ Real-time updates
- ✅ File upload functionality