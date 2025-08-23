#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Icon sizes needed for PWA
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

// Create a simple SVG icon template based on Latest-OS branding
const createSVGIcon = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="#0a0a0a" rx="${size * 0.2}"/>
  
  <!-- Heart shape for relationship theme -->
  <g transform="translate(${size * 0.5}, ${size * 0.5})">
    <path d="M0,${size * 0.1} C0,${size * -0.05} ${size * 0.1},${size * -0.15} ${size * 0.2},${size * -0.15} 
             C${size * 0.3},${size * -0.15} ${size * 0.4},${size * -0.05} ${size * 0.4},${size * 0.1}
             C${size * 0.4},${size * 0.2} 0,${size * 0.4} 0,${size * 0.4}
             C0,${size * 0.4} ${size * -0.4},${size * 0.2} ${size * -0.4},${size * 0.1}
             C${size * -0.4},${size * -0.05} ${size * -0.3},${size * -0.15} ${size * -0.2},${size * -0.15}
             C${size * -0.1},${size * -0.15} 0,${size * -0.05} 0,${size * 0.1} Z" 
          fill="url(#grad)" 
          stroke="#ffffff" 
          stroke-width="${size * 0.01}"/>
  </g>
  
  <!-- Connection symbol -->
  <circle cx="${size * 0.3}" cy="${size * 0.7}" r="${size * 0.05}" fill="#ffffff" opacity="0.8"/>
  <circle cx="${size * 0.7}" cy="${size * 0.7}" r="${size * 0.05}" fill="#ffffff" opacity="0.8"/>
  <line x1="${size * 0.3}" y1="${size * 0.7}" x2="${size * 0.7}" y2="${size * 0.7}" 
        stroke="#ffffff" stroke-width="${size * 0.02}" opacity="0.6"/>
</svg>`;

// Create shortcut icons
const createShortcutIcon = (type, size) => {
  const icons = {
    sync: `<circle cx="${size/2}" cy="${size/2}" r="${size * 0.3}" fill="none" stroke="#8b5cf6" stroke-width="${size * 0.08}"/>
           <path d="M${size * 0.3},${size * 0.2} L${size * 0.7},${size * 0.5} L${size * 0.3},${size * 0.8}" 
                 fill="none" stroke="#8b5cf6" stroke-width="${size * 0.06}" stroke-linecap="round"/>`,
    tasks: `<rect x="${size * 0.2}" y="${size * 0.25}" width="${size * 0.6}" height="${size * 0.5}" 
                  fill="none" stroke="#8b5cf6" stroke-width="${size * 0.06}" rx="${size * 0.05}"/>
            <line x1="${size * 0.3}" y1="${size * 0.4}" x2="${size * 0.7}" y2="${size * 0.4}" stroke="#8b5cf6" stroke-width="${size * 0.04}"/>
            <line x1="${size * 0.3}" y1="${size * 0.5}" x2="${size * 0.7}" y2="${size * 0.5}" stroke="#8b5cf6" stroke-width="${size * 0.04}"/>
            <line x1="${size * 0.3}" y1="${size * 0.6}" x2="${size * 0.7}" y2="${size * 0.6}" stroke="#8b5cf6" stroke-width="${size * 0.04}"/>`,
    memories: `<circle cx="${size/2}" cy="${size * 0.4}" r="${size * 0.2}" fill="none" stroke="#8b5cf6" stroke-width="${size * 0.06}"/>
               <rect x="${size * 0.15}" y="${size * 0.6}" width="${size * 0.7}" height="${size * 0.25}" 
                     fill="none" stroke="#8b5cf6" stroke-width="${size * 0.06}" rx="${size * 0.03}"/>
               <line x1="${size * 0.4}" y1="${size * 0.6}" x2="${size * 0.4}" y2="${size * 0.55}" stroke="#8b5cf6" stroke-width="${size * 0.04}"/>
               <line x1="${size * 0.6}" y1="${size * 0.6}" x2="${size * 0.6}" y2="${size * 0.55}" stroke="#8b5cf6" stroke-width="${size * 0.04}"/>`
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#ffffff" rx="${size * 0.2}"/>
  ${icons[type]}
</svg>`;
};

console.log('🎨 Generating PWA icons...');

// Generate main app icons
iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const outputPath = path.join(__dirname, '../public/icons', `icon-${size}x${size}.png`);
  const svgPath = path.join(__dirname, '../public/icons', `icon-${size}x${size}.svg`);
  
  // Save SVG first
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✓ Created ${path.basename(svgPath)}`);
});

// Generate shortcut icons
const shortcuts = ['sync', 'tasks', 'memories'];
shortcuts.forEach(shortcut => {
  const svgContent = createShortcutIcon(shortcut, 96);
  const svgPath = path.join(__dirname, '../public/icons', `shortcut-${shortcut}.svg`);
  
  fs.writeFileSync(svgPath, svgContent);
  console.log(`✓ Created ${path.basename(svgPath)}`);
});

console.log('\n📝 Note: SVG icons created. For production, consider converting to PNG using:');
console.log('   npm install -g svg2png-cli');
console.log('   svg2png public/icons/*.svg');
console.log('\n✨ PWA icons generation complete!');