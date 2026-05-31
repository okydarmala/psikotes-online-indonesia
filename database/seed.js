const { execSync } = require('child_process');
const path = require('path');

function runPrismaSeed() {
  try {
    console.log('Running Prisma seed...');
    execSync('node prisma/seed.js', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
    console.log('\u2714 Prisma seed completed');
  } catch (err) {
    console.error('Error running Prisma seed:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  runPrismaSeed();
}

module.exports = { runPrismaSeed };
