const fs = require('fs');
const path = require('path');

const seedFile = path.join(__dirname, '..', 'prisma', 'seed.ts');

// Read the seed file
let content = fs.readFileSync(seedFile, 'utf8');

// Replace all .jpg references with .svg
content = content.replace(/\.jpg/g, '.svg');

// Write back to file
fs.writeFileSync(seedFile, content);

console.log('Updated all image references from .jpg to .svg');
