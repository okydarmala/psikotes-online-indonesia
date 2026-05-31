# Quick Start Guide - Psikotes Online Indonesia

## Prerequisites
- Node.js 18+
- MySQL 8.0+
- npm

## 5-Minute Setup

### 1. Configure Database
```bash
# Create .env file from template
cp .env.example .env

# Edit .env with your MySQL credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=psikotes_indonesia
```

### 2. Install & Initialize
```bash
# Install dependencies
npm install

# Create database and tables
node database/schema.js

# Load sample data
node database/seed.js
```

### 3. Start Development Server
```bash
npm run dev
```

Open browser to `http://localhost:3000`

## Test the Platform

### Landing Page
- Visit: http://localhost:3000
- See overview and quick links

### Admin Login
- URL: http://localhost:3000/login
- Email: admin@psikotes.id
- Password: admin123

### Recruiter Login
- URL: http://localhost:3000/login
- Email: recruiter1@company.id
- Password: recruiter123

### Participant Test
- URL: http://localhost:3000/participant-login
- Enter email from seed data or create new participant
- Use OTP from console log (in development)

## Key Features

### ✅ Admin Features
```
Dashboard → Kelola Pengguna → Buat Kategori Tes
                          → Bank Soal
                          → Scoring Rules
                          → Laporan & Audit
```

### ✅ Recruiter Features
```
Dashboard → Register Peserta → Assign Tests
         → Monitor Progress → View Results
```

### ✅ Participant Features
```
Login OTP → Select Test → Read Instructions
         → Take Test (auto-save + timer)
         → View Results
```

## Database Schema Overview

```sql
-- Core Tables
users                -- All users (admin, recruiter, participant)
participants         -- Participant details
test_categories      -- Test types (IST, DISC, MBTI, etc)
test_subcategories   -- Test subtypes
questions            -- Question bank
question_options     -- Answer options

-- Test Flow
test_assignments     -- Tests assigned to participants
test_sessions        -- Active test sessions
participant_answers  -- Answers submitted by participant
test_results         -- Final scores and results

-- Configuration
scoring_rules        -- Scoring logic per category
score_interpretations -- Result interpretation rules
report_templates     -- Report formats

-- Audit
audit_logs           -- Activity logging
```

## API Endpoints Summary

### Authentication
- `POST /api/auth/login` - Admin/Recruiter login
- `POST /api/auth/otp/request` - Request OTP for participant
- `POST /api/auth/otp/verify` - Verify OTP and login
- `POST /api/auth/logout` - Logout

### Test Management
- `GET /api/tests/categories` - List all test categories
- `POST /api/tests/categories` - Create new category
- `GET /api/tests/categories/[id]` - Get category details
- `GET /api/tests/categories/[id]/questions` - Get questions
- `POST /api/tests/categories/[id]/questions` - Add question

### Participant & Assignment
- `GET /api/participants` - List participants
- `POST /api/participants` - Register new participant
- `GET /api/participants/[id]/assignments` - Get participant's tests
- `POST /api/participants/[id]/assignments` - Assign test

### Test Taking
- `POST /api/tests/assignments/[id]/session` - Start test
- `GET /api/tests/sessions/[id]/questions` - Get questions for test
- `POST /api/tests/sessions/[id]/answers` - Save answer (auto-called)
- `POST /api/tests/sessions/[id]/submit` - Submit and finish test

## Common Tasks

### Add New Test Category
1. Login as Admin
2. Dashboard → Kategori Tes
3. Click "Buat Kategori"
4. Fill in details and save

### Register Participant
1. Login as Recruiter
2. Dashboard → Daftar Peserta Baru
3. Enter participant details
4. System creates account and OTP login

### Assign Test to Participant
1. Login as Recruiter
2. Dashboard → Tetapkan Tes
3. Select participant and test category
4. Confirm assignment

### Participant Takes Test
1. Visit `/participant-login`
2. Enter email/phone
3. Enter OTP (check console in dev)
4. Select assigned test
5. Read instructions
6. Click "Saya Mengerti dan Mulai Tes"
7. Answer all questions
8. Auto-submit on timer or manual submit

## Development Tips

### Debug OTP
In development, OTP is logged to console:
```
OTP untuk email@example.com: 123456
```
Copy this and paste in the OTP field.

### Reset Admin Password
```javascript
// In database console:
UPDATE users SET password_hash = 'bcrypt_hash_here' 
WHERE email = 'admin@psikotes.id';
```

### Clear Test Data
```bash
# Backup and reset
mysql> DROP TABLE test_results;
mysql> DROP TABLE participant_answers;
mysql> DROP TABLE test_sessions;
```

### View API Logs
Check console output in terminal running `npm run dev`

## File Organization

```
app/
├── api/              # API routes (endpoints)
├── admin/            # Admin dashboard & pages
├── recruiter/        # Recruiter dashboard & pages
├── participant/      # Participant pages
├── login/            # Login pages
├── lib/              # Utility functions
└── components/       # Reusable components

database/
├── schema.js         # SQL table creation
├── seed.js          # Sample data
└── init.js          # Initialization

public/              # Static files (images, etc)
```

## Next Steps

1. ✅ Setup complete
2. Test all user roles
3. Create custom test categories
4. Register test participants
5. Assign tests and run trials
6. Customize scoring rules
7. Generate test reports
8. Deploy to production

## Support

- Check console for error messages
- All tables have auto_increment IDs
- Use prepared statements for SQL (already done)
- Email integration needed for production OTP

---
**Happy Testing! 🎉**
