const { execSync } = require('child_process');
const path = require('path');

function runPrismaPush() {
  try {
    console.log('Running `prisma generate` and `prisma db push` to sync schema...');
    execSync('npx prisma generate', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
    execSync('npx prisma db push', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
    console.log('\u2714 Prisma schema pushed to the development database');
  } catch (err) {
    console.error('Error running Prisma commands:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  runPrismaPush();
}

module.exports = { runPrismaPush };
