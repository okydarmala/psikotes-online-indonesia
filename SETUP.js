const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'psikotes_indonesia';

console.log('Database Configuration:');
console.log('=======================');
console.log(\`Host: \${DB_HOST}\`);
console.log(\`User: \${DB_USER}\`);
console.log(\`Database: \${DB_NAME}\`);
console.log(\`Port: 3306\`);
console.log('');
console.log('To initialize the database:');
console.log('1. node database/schema.js');
console.log('2. node database/seed.js');
console.log('');
console.log('To start the app:');
console.log('npm run dev');
