// Seed all data for CureBay application
const { spawn } = require('child_process');
const path = require('path');

const seedScripts = [
  { name: 'Users', file: 'seedUsers.js' },
  { name: 'Categories', file: 'seedCategories.js' },
  { name: 'Medicines', file: 'seedMedicines.js' },
  { name: 'Banners', file: 'seedBanners.js' },
  { name: 'Hero Slides', file: 'seedHero.js' },
  { name: 'Reviews', file: 'seedReviews.js' }
];

let currentScriptIndex = 0;

function runNextScript() {
  if (currentScriptIndex >= seedScripts.length) {
    console.log('\n✅ All seeding completed successfully!');
    process.exit(0);
    return;
  }

  const script = seedScripts[currentScriptIndex];
  console.log(`\n🌱 Seeding ${script.name}...`);

  const child = spawn('node', [script.file], {
    cwd: __dirname,
    stdio: 'inherit'
  });

  child.on('close', (code) => {
    if (code !== 0) {
      console.error(`\n❌ Failed to seed ${script.name}`);
      process.exit(1);
    }
    
    console.log(`✅ ${script.name} seeded successfully!`);
    currentScriptIndex++;
    runNextScript();
  });
}

console.log('🚀 Starting to seed all data...\n');
runNextScript();