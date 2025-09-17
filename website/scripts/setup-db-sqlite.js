const fs = require('fs');
const path = require('path');

// Create a simple SQLite database setup for development
const envContent = `# Database (SQLite for development)
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-this-in-production"

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""
`;

// Write .env.local file
fs.writeFileSync('.env.local', envContent);

console.log('Created .env.local file with SQLite configuration');
console.log('You can now run: npm run db:push && npm run db:seed');
