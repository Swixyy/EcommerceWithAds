const fs = require('fs');
const path = require('path');

// Product images to create
const productImages = [
  'macbook-pro-16.jpg',
  'dell-xps-13.jpg',
  'hp-spectre-x360.jpg',
  'asus-rog-strix.jpg',
  'iphone-15-pro.jpg',
  'samsung-galaxy-s24.jpg',
  'google-pixel-8.jpg',
  'oneplus-12.jpg',
  'ipad-pro-12-9.jpg',
  'samsung-tab-s9.jpg',
  'airpods-pro.jpg',
  'sony-wh-1000xm5.jpg',
  'bose-quietcomfort-45.jpg',
  'ps5-console.jpg',
  'xbox-series-x.jpg',
  'nintendo-switch-oled.jpg',
  'magic-mouse.jpg',
  'logitech-mx-master-3.jpg',
  'apple-watch-series-9.jpg'
];

// Advertisement images to create
const adImages = [
  'laptop-sale.jpg',
  'gaming-laptops.jpg',
  'smartphone-deal.jpg',
  'iphone-15-pro.jpg',
  'tablets.jpg',
  'headphones.jpg',
  'gaming-consoles.jpg',
  'accessories.jpg',
  'apple-watch.jpg',
  'black-friday.jpg',
  'free-shipping.jpg',
  'tech-bundle.jpg'
];

// Create a simple placeholder image (SVG)
function createPlaceholderSVG(width, height, text, bgColor = '#f3f4f6', textColor = '#6b7280') {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${bgColor}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="14" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${text}</text>
  </svg>`;
}

// Create product placeholder images
const productDir = path.join(__dirname, '..', 'public', 'images');
if (!fs.existsSync(productDir)) {
  fs.mkdirSync(productDir, { recursive: true });
}

productImages.forEach(imageName => {
  const productName = imageName.replace('.jpg', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const svg = createPlaceholderSVG(400, 400, productName, '#e5e7eb', '#374151');
  const filePath = path.join(productDir, imageName.replace('.jpg', '.svg'));
  fs.writeFileSync(filePath, svg);
  console.log(`Created placeholder for: ${imageName}`);
});

// Create advertisement placeholder images
const adDir = path.join(__dirname, '..', 'public', 'images', 'ads');
if (!fs.existsSync(adDir)) {
  fs.mkdirSync(adDir, { recursive: true });
}

adImages.forEach(imageName => {
  const adName = imageName.replace('.jpg', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const svg = createPlaceholderSVG(600, 300, adName, '#3b82f6', '#ffffff');
  const filePath = path.join(adDir, imageName.replace('.jpg', '.svg'));
  fs.writeFileSync(filePath, svg);
  console.log(`Created placeholder for: ${imageName}`);
});

console.log('All placeholder images created successfully!');
