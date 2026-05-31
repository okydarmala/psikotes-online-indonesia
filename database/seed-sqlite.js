const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(process.cwd(), 'data', 'psikotes.db');

// Password hashing with bcrypt
function hashPasswordSync(password) {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

const db = new sqlite3.Database(DB_PATH);

const seedData = {
  users: [
    {
      email: 'admin@psikotes.id',
      password: hashPasswordSync('admin123'),
      name: 'Administrator',
      role: 'admin',
      status: 'active',
    },
    {
      email: 'recruiter1@company.id',
      password: hashPasswordSync('recruiter123'),
      name: 'HR Manager 1',
      role: 'recruiter',
      company_id: 1,
      status: 'active',
    },
    {
      email: 'recruiter2@company.id',
      password: hashPasswordSync('recruiter123'),
      name: 'HR Manager 2',
      role: 'recruiter',
      company_id: 1,
      status: 'active',
    },
    {
      email: 'participant1@candidate.id',
      password: hashPasswordSync('participant123'),
      name: 'Budi Santoso',
      role: 'participant',
      status: 'active',
    },
    {
      email: 'participant2@candidate.id',
      password: hashPasswordSync('participant123'),
      name: 'Siti Nurhaliza',
      role: 'participant',
      status: 'active',
    },
  ],
  test_categories: [
    {
      name: 'IST (Tes Kemampuan Umum)',
      description: 'Test for measuring general ability and intelligence',
      duration_minutes: 30,
      passing_score: 70,
    },
    {
      name: 'DISC Personality',
      description: 'Behavioral assessment and workplace personality profile',
      duration_minutes: 20,
      passing_score: 60,
    },
    {
      name: 'MBTI (Myers-Briggs Type Indicator)',
      description: 'Personality type identification test',
      duration_minutes: 25,
      passing_score: 50,
    },
    {
      name: 'EPPS (Edwards Personal Preference Schedule)',
      description: 'Assessment of personal needs and motivations',
      duration_minutes: 30,
      passing_score: 60,
    },
    {
      name: 'PAPI (Potential and Performance Inventory)',
      description: 'Comprehensive personality and potential assessment',
      duration_minutes: 40,
      passing_score: 65,
    },
    {
      name: 'Wartegg Drawing Test',
      description: 'Projective personality assessment through drawing',
      duration_minutes: 20,
      passing_score: 55,
    },
    {
      name: 'Kraepelin Test',
      description: 'Mathematical speed and accuracy test',
      duration_minutes: 15,
      passing_score: 70,
    },
  ],
};

db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  // Insert users
  const insertUserStmt = db.prepare(
    `INSERT OR IGNORE INTO users (email, password, name, role, company_id, status) 
     VALUES (?, ?, ?, ?, ?, ?)`
  );

  seedData.users.forEach((user) => {
    insertUserStmt.run(
      user.email,
      user.password,
      user.name,
      user.role,
      user.company_id || null,
      user.status
    );
  });

  insertUserStmt.finalize();

  // Insert test categories
  const insertCategoryStmt = db.prepare(
    `INSERT OR IGNORE INTO test_categories (name, description, duration_minutes, passing_score) 
     VALUES (?, ?, ?, ?)`
  );

  seedData.test_categories.forEach((category) => {
    insertCategoryStmt.run(
      category.name,
      category.description,
      category.duration_minutes,
      category.passing_score
    );
  });

  insertCategoryStmt.finalize();

  // Add sample participants
  db.all('SELECT id FROM users WHERE role = ?', ['participant'], (err, users) => {
    if (users && users.length > 0) {
      const insertParticipantStmt = db.prepare(
        `INSERT OR IGNORE INTO participants (user_id, phone, position, department, education, experience_years, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      );

      insertParticipantStmt.run(
        users[0].id,
        '081234567890',
        'Software Engineer',
        'Engineering',
        'S1 Computer Science',
        3,
        'active'
      );

      insertParticipantStmt.run(
        users[1].id,
        '082345678901',
        'Marketing Manager',
        'Marketing',
        'S1 Business Administration',
        5,
        'active'
      );

      insertParticipantStmt.finalize();
    }
  });

  db.run('PRAGMA foreign_keys = OFF');
});

db.close((err) => {
  if (err) {
    console.error('✗ Error:', err.message);
  } else {
    console.log('✓ SQLite database seeded successfully');
    console.log('');
    console.log('Demo Credentials:');
    console.log('================');
    console.log('Admin:');
    console.log('  Email: admin@psikotes.id');
    console.log('  Password: admin123');
    console.log('');
    console.log('Recruiter:');
    console.log('  Email: recruiter1@company.id');
    console.log('  Password: recruiter123');
    console.log('');
    console.log('Participant:');
    console.log('  Email: participant1@candidate.id');
    console.log('  Password: participant123');
  }
});
