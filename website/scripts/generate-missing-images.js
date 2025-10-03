const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function generateMissingImages() {
  const prisma = new PrismaClient();
  
  try {
    const products = await prisma.product.findMany({
      select: {
        name: true,
        slug: true,
        image: true,
        category: {
          select: {
            name: true
          }
        }
      }
    });

    const imagesDir = path.join(__dirname, '..', 'public', 'images');
    
    // Ensure images directory exists
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    console.log(`Found ${products.length} products to process...`);
    
    let generatedCount = 0;
    let skippedCount = 0;

    for (const product of products) {
      if (!product.image) continue;
      
      // Extract filename from image path
      const imagePath = product.image.replace('/images/', '');
      const fullPath = path.join(imagesDir, imagePath);
      
      // Check if image already exists
      if (fs.existsSync(fullPath)) {
        console.log(`✓ Image exists: ${imagePath}`);
        skippedCount++;
        continue;
      }

      // Determine icon based on category
      let icon = '📱'; // default
      const categoryName = product.category?.name?.toLowerCase() || '';
      
      if (categoryName.includes('phone') || categoryName.includes('smartphone')) {
        icon = '📱';
      } else if (categoryName.includes('laptop') || categoryName.includes('computer')) {
        icon = '💻';
      } else if (categoryName.includes('tablet')) {
        icon = '📱';
      } else if (categoryName.includes('headphone') || categoryName.includes('audio')) {
        icon = '🎧';
      } else if (categoryName.includes('gaming') || categoryName.includes('console')) {
        icon = '🎮';
      } else if (categoryName.includes('accessory') || categoryName.includes('hub') || categoryName.includes('charger')) {
        icon = '🔌';
      } else if (categoryName.includes('storage') || categoryName.includes('ssd')) {
        icon = '💾';
      } else if (categoryName.includes('mouse') || categoryName.includes('keyboard')) {
        icon = '🖱️';
      }

      // Generate SVG content
      const svgContent = generateSVG(product.name, icon, categoryName);
      
      try {
        // Ensure directory exists
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, svgContent);
        console.log(`✓ Generated: ${imagePath}`);
        generatedCount++;
      } catch (error) {
        console.error(`✗ Failed to generate ${imagePath}:`, error.message);
      }
    }

    console.log(`\nSummary:`);
    console.log(`- Generated: ${generatedCount} images`);
    console.log(`- Skipped: ${skippedCount} images (already exist)`);
    console.log(`- Total processed: ${generatedCount + skippedCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

function generateSVG(productName, icon, categoryName) {
  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#8B5CF6', // Purple
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
  ];
  
  const color = colors[Math.floor(Math.random() * colors.length)];
  
  return `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:${color};stop-opacity:0.3" />
    </linearGradient>
    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="${color}" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="300" fill="url(#bg)" rx="12"/>
  
  <!-- Border -->
  <rect width="400" height="300" fill="none" stroke="${color}" stroke-width="2" rx="12"/>
  
  <!-- Icon -->
  <text x="200" y="130" font-family="system-ui, -apple-system, sans-serif" font-size="64" text-anchor="middle" filter="url(#shadow)">${icon}</text>
  
  <!-- Product Name -->
  <text x="200" y="170" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" text-anchor="middle" fill="${color}">
    <tspan x="200" dy="0">${truncateText(productName, 25)}</tspan>
  </text>
  
  <!-- Category -->
  <text x="200" y="190" font-family="system-ui, -apple-system, sans-serif" font-size="14" text-anchor="middle" fill="${color}" opacity="0.7">
    <tspan x="200" dy="0">${categoryName}</tspan>
  </text>
  
  <!-- Decorative elements -->
  <circle cx="80" cy="80" r="4" fill="${color}" opacity="0.3"/>
  <circle cx="320" cy="220" r="6" fill="${color}" opacity="0.2"/>
  <circle cx="340" cy="60" r="3" fill="${color}" opacity="0.4"/>
  <circle cx="60" cy="240" r="5" fill="${color}" opacity="0.3"/>
</svg>`;
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

generateMissingImages();
