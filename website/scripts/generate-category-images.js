const fs = require('fs');
const path = require('path');

function generateCategoryImages() {
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  const categoriesDir = path.join(imagesDir, 'categories');
  
  // Ensure directories exist
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  if (!fs.existsSync(categoriesDir)) {
    fs.mkdirSync(categoriesDir, { recursive: true });
  }

  console.log('Generating category images...');
  
  // Define category images with specific designs
  const categoryImages = [
    {
      name: 'laptops.jpg',
      title: 'Laptops',
      icon: '💻',
      color: '#3B82F6',
      description: 'High-performance laptops'
    },
    {
      name: 'smartphones.jpg', 
      title: 'Smartphones',
      icon: '📱',
      color: '#10B981',
      description: 'Latest mobile devices'
    },
    {
      name: 'accessories.jpg',
      title: 'Accessories', 
      icon: '🔌',
      color: '#F59E0B',
      description: 'Tech accessories'
    }
  ];

  // Generate placeholder image
  const placeholderSvg = generatePlaceholderSVG();
  const placeholderPath = path.join(imagesDir, 'placeholder.jpg');
  
  if (!fs.existsSync(placeholderPath)) {
    fs.writeFileSync(placeholderPath, placeholderSvg);
    console.log('✓ Generated: placeholder.jpg');
  } else {
    console.log('✓ Exists: placeholder.jpg');
  }

  // Generate category images
  categoryImages.forEach(category => {
    const svgContent = generateCategorySVG(category);
    const filePath = path.join(categoriesDir, category.name);
    
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, svgContent);
      console.log(`✓ Generated: categories/${category.name}`);
    } else {
      console.log(`✓ Exists: categories/${category.name}`);
    }
  });

  console.log('\nCategory image generation complete!');
}

function generateCategorySVG(category) {
  return `<svg width="600" height="400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${category.name.replace('.jpg', '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${category.color};stop-opacity:0.1" />
      <stop offset="50%" style="stop-color:${category.color};stop-opacity:0.2" />
      <stop offset="100%" style="stop-color:${category.color};stop-opacity:0.3" />
    </linearGradient>
    <filter id="shadow-${category.name.replace('.jpg', '')}" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="${category.color}" flood-opacity="0.4"/>
    </filter>
    <filter id="glow-${category.name.replace('.jpg', '')}" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
      <feMerge> 
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="600" height="400" fill="url(#bg-${category.name.replace('.jpg', '')})" rx="20"/>
  
  <!-- Border -->
  <rect width="600" height="400" fill="none" stroke="${category.color}" stroke-width="3" rx="20"/>
  
  <!-- Large Icon -->
  <text x="300" y="180" font-family="system-ui, -apple-system, sans-serif" font-size="120" text-anchor="middle" filter="url(#shadow-${category.name.replace('.jpg', '')})">${category.icon}</text>
  
  <!-- Category Title -->
  <text x="300" y="230" font-family="system-ui, -apple-system, sans-serif" font-size="36" font-weight="700" text-anchor="middle" fill="${category.color}" filter="url(#glow-${category.name.replace('.jpg', '')})">
    ${category.title}
  </text>
  
  <!-- Description -->
  <text x="300" y="260" font-family="system-ui, -apple-system, sans-serif" font-size="18" text-anchor="middle" fill="${category.color}" opacity="0.8">
    ${category.description}
  </text>
  
  <!-- Decorative elements -->
  <circle cx="100" cy="100" r="8" fill="${category.color}" opacity="0.3"/>
  <circle cx="500" cy="300" r="12" fill="${category.color}" opacity="0.2"/>
  <circle cx="550" cy="80" r="6" fill="${category.color}" opacity="0.4"/>
  <circle cx="80" cy="320" r="10" fill="${category.color}" opacity="0.3"/>
  <circle cx="480" cy="120" r="4" fill="${category.color}" opacity="0.5"/>
  <circle cx="120" cy="350" r="7" fill="${category.color}" opacity="0.3"/>
  
  <!-- Subtle pattern overlay -->
  <defs>
    <pattern id="dots-${category.name.replace('.jpg', '')}" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="1" fill="${category.color}" opacity="0.1"/>
    </pattern>
  </defs>
  <rect width="600" height="400" fill="url(#dots-${category.name.replace('.jpg', '')})" rx="20"/>
</svg>`;
}

function generatePlaceholderSVG() {
  return `<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="placeholder-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E5E7EB;stop-opacity:0.3" />
      <stop offset="100%" style="stop-color:#E5E7EB;stop-opacity:0.6" />
    </linearGradient>
    <filter id="placeholder-shadow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#9CA3AF" flood-opacity="0.3"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="300" fill="url(#placeholder-bg)" rx="12"/>
  
  <!-- Border -->
  <rect width="400" height="300" fill="none" stroke="#D1D5DB" stroke-width="2" rx="12"/>
  
  <!-- Icon -->
  <text x="200" y="140" font-family="system-ui, -apple-system, sans-serif" font-size="64" text-anchor="middle" fill="#9CA3AF" filter="url(#placeholder-shadow)">📦</text>
  
  <!-- Text -->
  <text x="200" y="180" font-family="system-ui, -apple-system, sans-serif" font-size="18" font-weight="600" text-anchor="middle" fill="#6B7280">
    No Image Available
  </text>
  
  <!-- Decorative elements -->
  <circle cx="80" cy="80" r="4" fill="#9CA3AF" opacity="0.2"/>
  <circle cx="320" cy="220" r="6" fill="#9CA3AF" opacity="0.15"/>
  <circle cx="340" cy="60" r="3" fill="#9CA3AF" opacity="0.25"/>
  <circle cx="60" cy="240" r="5" fill="#9CA3AF" opacity="0.2"/>
</svg>`;
}

generateCategoryImages();
