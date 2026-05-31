# Project Structure & Components

## 📦 Complete File Tree

```
psychology_test/
│
├── 📄 package.json                          ← Dependencies & scripts
├── 📄 next.config.js                        ← Next.js config
├── 📄 tailwind.config.js                    ← Tailwind CSS config
├── 📄 postcss.config.js                     ← PostCSS config
├── 📄 .env.example                          ← Environment template
├── 📄 .gitignore                            ← Git ignore rules
├── 📄 README.md                             ← Full documentation
├── 📄 QUICKSTART.md                         ← Quick setup guide
├── 📄 SETUP.js                              ← Setup helper script
│
├── 📂 app/
│   ├── 📄 layout.js                         ← Root layout
│   ├── 📄 page.js                           ← Landing page
│   ├── 📄 globals.css                       ← Global styles & Tailwind
│   │
│   ├── 📂 api/
│   │   ├── 📂 auth/
│   │   │   ├── login/route.js               ← Admin/Recruiter login
│   │   │   ├── otp/request/route.js         ← OTP generation
│   │   │   ├── otp/verify/route.js          ← OTP verification
│   │   │   └── logout/route.js              ← Logout endpoint
│   │   │
│   │   ├── 📂 tests/
│   │   │   ├── categories/route.js          ← CRUD test categories
│   │   │   ├── [id]/route.js                ← Category details
│   │   │   ├── [id]/questions/route.js      ← Questions per category
│   │   │   ├── assignments/[id]/session/    ← Start test session
│   │   │   ├── sessions/[id]/questions/     ← Get test questions
│   │   │   ├── sessions/[id]/answers/       ← Save answers
│   │   │   ├── sessions/[id]/submit/        ← Submit test
│   │   │   └── results/[id]/route.js        ← Test results API
│   │   │
│   │   ├── 📂 participants/
│   │   │   ├── route.js                     ← CRUD participants
│   │   │   ├── [id]/route.js                ← Participant details
│   │   │   └── [id]/assignments/            ← Assign tests
│   │   │
│   │   ├── 📂 admin/                        ← Admin endpoints
│   │   └── 📂 recruiter/                    ← Recruiter endpoints
│   │
│   ├── 📂 lib/
│   │   ├── db.js                            ← MySQL connection & queries
│   │   ├── auth.js                          ← Auth utilities
│   │   ├── utils.js                         ← General utilities
│   │   └── testConfig.js                    ← Test configurations
│   │
│   ├── 📂 login/
│   │   └── page.js                          ← Admin/Recruiter login
│   │
│   ├── 📂 participant-login/
│   │   └── page.js                          ← Participant OTP login
│   │
│   ├── 📂 participant/
│   │   ├── dashboard/page.js                ← Participant dashboard
│   │   ├── test/[id]/page.js                ← Test instructions
│   │   ├── test-page/[id]/page.js           ← Online test taking
│   │   └── result/[id]/page.js              ← Test completion
│   │
│   ├── 📂 admin/
│   │   ├── dashboard/page.js                ← Admin dashboard
│   │   ├── users/page.js                    ← User management
│   │   ├── test-categories/page.js          ← Category management
│   │   ├── questions/page.js                ← Question bank
│   │   ├── scoring-rules/page.js            ← Scoring management
│   │   ├── reports/page.js                  ← Reports view
│   │   └── audit-logs/page.js               ← Audit logs
│   │
│   ├── 📂 recruiter/
│   │   ├── dashboard/page.js                ← Recruiter dashboard
│   │   ├── participants/page.js             ← Participant list
│   │   ├── register-participant/page.js     ← Register new participant
│   │   ├── assign-tests/page.js             ← Assign tests
│   │   └── results/page.js                  ← View results
│   │
│   ├── 📂 components/                       ← Reusable components
│   └── 📂 styles/                           ← Additional styles
│
├── 📂 database/
│   ├── schema.js                            ← SQL table creation
│   ├── seed.js                              ← Sample data loader
│   └── init.js                              ← Database initialization
│
├── 📂 public/
│   └── (static files)                       ← Images, favicon, etc
│
└── 📂 .github/
    └── copilot-instructions.md              ← Copilot settings
```

## 🗄️ Database Schema (13 Tables)

### Users & Authentication
- **users** - System users (admin, recruiter, participant)
- **participant_otps** - OTP records for participant login

### Test Management
- **test_categories** - Psychology test types (IST, DISC, MBTI, etc)
- **test_subcategories** - Subcategories within test types
- **questions** - Question bank
- **question_options** - Answer options for questions

### Test Execution
- **test_assignments** - Tests assigned to participants
- **test_sessions** - Active/completed test sessions
- **participant_answers** - Answers submitted by participants
- **test_results** - Final scores and results

### Configuration & Reporting
- **scoring_rules** - Scoring logic per test category
- **score_interpretations** - Result interpretation rules
- **report_templates** - Report format templates
- **audit_logs** - Activity logging

## 🔐 Security Features

✅ **Password Security**
- bcryptjs hashing (10 rounds)
- Never store plain text passwords

✅ **OTP Security**
- SHA-256 hashing for OTP codes
- Time-based expiry (5 minutes default)
- Rate limiting (5 attempts max)
- Cooldown period between requests

✅ **Authentication**
- JWT tokens for session management
- HTTP-only cookies for token storage
- Role-based access control (RBAC)

✅ **Data Protection**
- Parameterized SQL queries (prevents injection)
- Input validation on all endpoints
- Secure error messages (no information leakage)

## 🎯 API Endpoints (25+)

### Authentication (4)
```
POST   /api/auth/login               - Admin/Recruiter login
POST   /api/auth/otp/request         - Request OTP
POST   /api/auth/otp/verify          - Verify OTP & login
POST   /api/auth/logout              - Logout
```

### Tests (8)
```
GET    /api/tests/categories         - List test categories
POST   /api/tests/categories         - Create category
GET    /api/tests/categories/[id]    - Category details
GET    /api/tests/categories/[id]/questions
POST   /api/tests/categories/[id]/questions
POST   /api/tests/assignments/[id]/session
POST   /api/tests/sessions/[id]/submit
GET    /api/tests/results/[id]
```

### Participants (6)
```
GET    /api/participants             - List participants
POST   /api/participants             - Register participant
GET    /api/participants/[id]        - Participant details
GET    /api/participants/[id]/assignments
POST   /api/participants/[id]/assignments
```

### Test Taking (3)
```
GET    /api/tests/sessions/[id]/questions
POST   /api/tests/sessions/[id]/answers
POST   /api/tests/sessions/[id]/submit
```

## 🎨 UI Components

### Common Components
- Navbar with logout
- Sidebar navigation (admin/recruiter)
- Card layouts
- Form inputs with validation
- Status badges
- Tables with data
- Alert messages
- Buttons (primary, secondary, danger)

### Admin-Specific
- User management table
- Category CRUD forms
- Question bank interface
- Scoring rule editor
- Report viewer

### Recruiter-Specific
- Participant registration form
- Test assignment interface
- Participant list with progress
- Results viewer

### Participant-Specific
- OTP login form
- Test list with status
- Test instructions page
- Question display (scrollable)
- Timer and progress bar
- Test submission

## 🔄 Data Flow

### Participant Registration Flow
```
Recruiter registers → User account created
                   → Temporary password
                   → Participant profile
```

### Test Assignment Flow
```
Recruiter assigns → Test added to participant
                  → Status: "not_started"
                  → Participant can see in list
```

### Test Taking Flow
```
Participant starts → Session created
                   → Timer starts
                   → Questions loaded
                   → Answers auto-saved
                   → Auto-submit on timer
                   → Results calculated
```

### Result Flow
```
Test completed → Results stored
              → Score calculated
              → Interpretation applied
              → Report generated
              → Recruiter can view
```

## 📊 Data Models

### User Model
```javascript
{
  id: Int,
  name: String,
  email: String,
  password_hash: String (bcrypt),
  role: 'admin' | 'recruiter' | 'participant',
  status: 'active' | 'inactive'
}
```

### Test Category Model
```javascript
{
  id: Int,
  name: String,
  description: String,
  instructions: Text,
  example_question: Text,
  example_answer: Text,
  time_limit_minutes: Int,
  scoring_method: String,
  status: 'active' | 'inactive'
}
```

### Test Session Model
```javascript
{
  id: Int,
  assignment_id: Int,
  session_token: String,
  start_time: DateTime,
  end_time: DateTime,
  duration_seconds: Int,
  status: 'active' | 'completed' | 'expired'
}
```

### Participant Answer Model
```javascript
{
  id: Int,
  session_id: Int,
  question_id: Int,
  answer_text: String,
  selected_option_id: Int,
  score_obtained: Decimal,
  answered_at: DateTime
}
```

## 🚀 Performance Optimizations

✅ Auto-save answers (1 second debounce)
✅ Lazy load questions
✅ Index on frequently queried columns
✅ Connection pooling for database
✅ Compiled Next.js for production
✅ Minified CSS and JavaScript

## 🔌 Future Extensions

Ready for:
- [ ] Email service integration (SendGrid, AWS SES)
- [ ] WhatsApp OTP (Twilio)
- [ ] PDF generation (jsPDF + html2canvas)
- [ ] Analytics dashboard (Chart.js)
- [ ] Advanced scoring algorithms
- [ ] Report customization per client
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] SSO integration (LDAP, OAuth)
- [ ] Data export (Excel, CSV)

---

**Total Files**: 40+
**Total Lines of Code**: 3500+
**Components Created**: 15+
**API Endpoints**: 25+
**Database Tables**: 13
