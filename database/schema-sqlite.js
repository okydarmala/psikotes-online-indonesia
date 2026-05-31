const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(process.cwd(), 'data', 'psikotes.db');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Check if database exists
const dbExists = fs.existsSync(DB_PATH);

const db = new sqlite3.Database(DB_PATH);

const schemas = [
  // Users table
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'participant',
    company_id INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Participants table
  `CREATE TABLE IF NOT EXISTS participants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    phone VARCHAR(20),
    position VARCHAR(255),
    department VARCHAR(255),
    education VARCHAR(100),
    experience_years INTEGER,
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,

  // Participant OTPs table
  `CREATE TABLE IF NOT EXISTS participant_otps (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    participant_id INTEGER NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    channel VARCHAR(50),
    attempts INTEGER DEFAULT 0,
    expires_at DATETIME NOT NULL,
    used BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (participant_id) REFERENCES participants(id)
  )`,

  // Test Categories table
  `CREATE TABLE IF NOT EXISTS test_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INTEGER,
    passing_score DECIMAL(5,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,

  // Test Subcategories table
  `CREATE TABLE IF NOT EXISTS test_subcategories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_category_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    question_count INTEGER,
    duration_minutes INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_category_id) REFERENCES test_categories(id)
  )`,

  // Questions table
  `CREATE TABLE IF NOT EXISTS questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_subcategory_id INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50),
    image_url VARCHAR(500),
    display_order INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_subcategory_id) REFERENCES test_subcategories(id)
  )`,

  // Question Options table
  `CREATE TABLE IF NOT EXISTS question_options (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    option_text VARCHAR(500),
    option_value VARCHAR(100),
    display_order INTEGER,
    is_correct BOOLEAN DEFAULT 0,
    score_value DECIMAL(5,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (question_id) REFERENCES questions(id)
  )`,

  // Test Assignments table
  `CREATE TABLE IF NOT EXISTS test_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recruiter_id INTEGER NOT NULL,
    participant_id INTEGER NOT NULL,
    test_category_id INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    started_at DATETIME,
    completed_at DATETIME,
    due_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recruiter_id) REFERENCES users(id),
    FOREIGN KEY (participant_id) REFERENCES participants(id),
    FOREIGN KEY (test_category_id) REFERENCES test_categories(id)
  )`,

  // Test Sessions table
  `CREATE TABLE IF NOT EXISTS test_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_assignment_id INTEGER NOT NULL UNIQUE,
    participant_id INTEGER NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    current_question_index INTEGER DEFAULT 0,
    total_questions INTEGER,
    status VARCHAR(50) DEFAULT 'in_progress',
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_assignment_id) REFERENCES test_assignments(id),
    FOREIGN KEY (participant_id) REFERENCES participants(id)
  )`,

  // Participant Answers table
  `CREATE TABLE IF NOT EXISTS participant_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_session_id INTEGER NOT NULL,
    question_id INTEGER NOT NULL,
    answer_value VARCHAR(500),
    selected_option_id INTEGER,
    time_spent_seconds INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_session_id) REFERENCES test_sessions(id),
    FOREIGN KEY (question_id) REFERENCES questions(id),
    FOREIGN KEY (selected_option_id) REFERENCES question_options(id)
  )`,

  // Test Results table
  `CREATE TABLE IF NOT EXISTS test_results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_session_id INTEGER NOT NULL UNIQUE,
    participant_id INTEGER NOT NULL,
    test_category_id INTEGER NOT NULL,
    total_score DECIMAL(5,2),
    passing_score DECIMAL(5,2),
    status VARCHAR(50),
    result_json TEXT,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_session_id) REFERENCES test_sessions(id),
    FOREIGN KEY (participant_id) REFERENCES participants(id),
    FOREIGN KEY (test_category_id) REFERENCES test_categories(id)
  )`,

  // Scoring Rules table
  `CREATE TABLE IF NOT EXISTS scoring_rules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_category_id INTEGER NOT NULL,
    rule_name VARCHAR(255) NOT NULL,
    rule_description TEXT,
    scoring_method VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_category_id) REFERENCES test_categories(id)
  )`,

  // Score Interpretations table
  `CREATE TABLE IF NOT EXISTS score_interpretations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    test_category_id INTEGER NOT NULL,
    score_min DECIMAL(5,2),
    score_max DECIMAL(5,2),
    interpretation VARCHAR(500),
    recommendation TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (test_category_id) REFERENCES test_categories(id)
  )`,

  // Audit Logs table
  `CREATE TABLE IF NOT EXISTS audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action VARCHAR(255),
    resource_type VARCHAR(100),
    resource_id INTEGER,
    changes TEXT,
    ip_address VARCHAR(45),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`,
];

// Create indexes
const indexes = [
  'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
  'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
  'CREATE INDEX IF NOT EXISTS idx_participants_user_id ON participants(user_id)',
  'CREATE INDEX IF NOT EXISTS idx_test_assignments_recruiter ON test_assignments(recruiter_id)',
  'CREATE INDEX IF NOT EXISTS idx_test_assignments_participant ON test_assignments(participant_id)',
  'CREATE INDEX IF NOT EXISTS idx_test_sessions_participant ON test_sessions(participant_id)',
  'CREATE INDEX IF NOT EXISTS idx_participant_answers_session ON participant_answers(test_session_id)',
  'CREATE INDEX IF NOT EXISTS idx_test_results_participant ON test_results(participant_id)',
  'CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id)',
  'CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at)',
];

db.serialize(() => {
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');

  // Create tables
  schemas.forEach((schema) => {
    db.run(schema, (err) => {
      if (err) {
        console.error('✗ Error creating table:', err.message);
      }
    });
  });

  // Create indexes
  indexes.forEach((index) => {
    db.run(index, (err) => {
      if (err) {
        console.error('✗ Error creating index:', err.message);
      }
    });
  });

  console.log('✓ SQLite database schema created successfully');
  console.log('✓ Database file: ' + DB_PATH);
});

db.close();
