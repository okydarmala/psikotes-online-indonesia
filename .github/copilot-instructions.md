# GitHub Copilot Instructions for Psikotes Online Indonesia

## Project Overview
Complete full-stack psychology test platform for recruitment and assessment in Indonesia.

## Technology Stack
- Frontend: Next.js 14, React 18, Tailwind CSS
- Backend: Next.js API Routes
- Database: MySQL 8.0+
- Authentication: JWT + OTP (Email/WhatsApp)

## Key Features Implemented
✅ Admin Dashboard with user management
✅ Recruiter Dashboard with participant management
✅ Participant login with OTP authentication
✅ Test assignment system
✅ Online test taking with auto-save and timer
✅ Database schema with 13+ tables
✅ API routes for all core features
✅ Role-based access control
✅ Responsive UI with Tailwind CSS

## Folder Structure
- `/app` - Next.js app directory
  - `/api` - API routes
  - `/admin` - Admin pages
  - `/recruiter` - Recruiter pages
  - `/participant` - Participant pages
  - `/login` - Authentication pages
  - `/lib` - Utilities and helpers
  - `/components` - Reusable React components
- `/database` - Database schema and seed data
- `/public` - Static assets

## Setup Instructions
1. `npm install` - Install dependencies
2. Copy `.env.example` to `.env` and configure database
3. `node database/schema.js` - Initialize database
4. `node database/seed.js` - Load sample data
5. `npm run dev` - Start development server

## Demo Credentials
- Admin: admin@psikotes.id / admin123
- Recruiter: recruiter1@company.id / recruiter123

## Code Quality Standards
- Use Indonesian labels for UI
- Implement proper error handling
- Use async/await for API calls
- Validate all inputs
- Use parameterized queries for database
- Implement CORS and security headers

## Next Steps for Enhancement
1. Integrate email/WhatsApp service for OTP
2. Add PDF report generation
3. Implement advanced scoring algorithms
4. Add analytics dashboard
5. Setup comprehensive testing
