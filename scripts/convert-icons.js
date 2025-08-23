#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../public/icons');
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];

async function convertIcons() {
  console.log('🔄 Converting SVG icons to PNG...');
  
  // Convert main app icons
  for (const size of iconSizes) {
    try {
      const svgPath = path.join(iconsDir, `icon-${size}x${size}.svg`);
      const pngPath = path.join(iconsDir, `icon-${size}x${size}.png`);
      
      if (fs.existsSync(svgPath)) {
        await sharp(svgPath)
          .resize(size, size)
          .png()
          .toFile(pngPath);
        
        console.log(`✓ Converted icon-${size}x${size}.png`);
      }
    } catch (error) {
      console.error(`❌ Failed to convert icon-${size}x${size}.png:`, error.message);
    }
  }
  
  // Convert shortcut icons
  const shortcuts = ['sync', 'tasks', 'memories'];
  for (const shortcut of shortcuts) {
    try {
      const svgPath = path.join(iconsDir, `shortcut-${shortcut}.svg`);
      const pngPath = path.join(iconsDir, `shortcut-${shortcut}.png`);
      
      if (fs.existsSync(svgPath)) {
        await sharp(svgPath)
          .resize(96, 96)
          .png()
          .toFile(pngPath);
        
        console.log(`✓ Converted shortcut-${shortcut}.png`);
      }
    } catch (error) {
      console.error(`❌ Failed to convert shortcut-${shortcut}.png:`, error.message);
    }
  }
  
  console.log('\n✨ Icon conversion complete!');
  console.log('📁 Icons are ready in:', iconsDir);
}

convertIcons().catch(console.error);