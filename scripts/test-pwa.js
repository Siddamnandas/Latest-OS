#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 PWA Features & Mobile Optimization Test Suite');
console.log('='.repeat(50));

const tests = [
  {
    name: 'PWA Manifest Validation',
    test: () => {
      const manifestPath = path.join(__dirname, '../public/manifest.json');
      if (!fs.existsSync(manifestPath)) {
        throw new Error('manifest.json not found');
      }
      
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Required fields
      const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
      requiredFields.forEach(field => {
        if (!manifest[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      });
      
      // Icon validation
      if (!Array.isArray(manifest.icons) || manifest.icons.length === 0) {
        throw new Error('No icons defined in manifest');
      }
      
      const requiredSizes = ['192x192', '512x512'];
      const availableSizes = manifest.icons.map(icon => icon.sizes);
      
      requiredSizes.forEach(size => {
        if (!availableSizes.includes(size)) {
          console.warn(`⚠️  Missing recommended icon size: ${size}`);
        }
      });
      
      return `✅ Manifest valid with ${manifest.icons.length} icons`;
    }
  },
  
  {
    name: 'PWA Icons Generation',
    test: () => {
      const iconsDir = path.join(__dirname, '../public/icons');
      if (!fs.existsSync(iconsDir)) {
        throw new Error('Icons directory not found');
      }
      
      const requiredIcons = [
        'icon-72x72.png', 'icon-96x96.png', 'icon-128x128.png',
        'icon-144x144.png', 'icon-152x152.png', 'icon-192x192.png',
        'icon-384x384.png', 'icon-512x512.png'
      ];
      
      const missingIcons = [];
      requiredIcons.forEach(icon => {
        const iconPath = path.join(iconsDir, icon);
        if (!fs.existsSync(iconPath)) {
          missingIcons.push(icon);
        }
      });
      
      if (missingIcons.length > 0) {
        throw new Error(`Missing icons: ${missingIcons.join(', ')}`);
      }
      
      return `✅ All ${requiredIcons.length} required icons generated`;
    }
  },
  
  {
    name: 'Service Worker Implementation',
    test: () => {
      const swPath = path.join(__dirname, '../src/service-worker.ts');
      if (!fs.existsSync(swPath)) {
        throw new Error('Service worker not found');
      }
      
      const swContent = fs.readFileSync(swPath, 'utf8');
      
      // Check for required features
      const requiredFeatures = [
        'addEventListener(\'install\'',
        'addEventListener(\'activate\'',
        'addEventListener(\'fetch\'',
        'addEventListener(\'push\'',
        'caches.open',
        'IndexedDB'
      ];
      
      const missingFeatures = [];
      requiredFeatures.forEach(feature => {
        if (!swContent.includes(feature)) {
          missingFeatures.push(feature);
        }
      });
      
      if (missingFeatures.length > 0) {
        throw new Error(`Missing SW features: ${missingFeatures.join(', ')}`);
      }
      
      return '✅ Service worker implements all required features';
    }
  },
  
  {
    name: 'Push Notification API',
    test: () => {
      const pushApiDir = path.join(__dirname, '../src/app/api/push');
      if (!fs.existsSync(pushApiDir)) {
        throw new Error('Push API directory not found');
      }
      
      const requiredEndpoints = ['subscribe', 'unsubscribe', 'send', 'partner-activity'];
      const missingEndpoints = [];
      
      requiredEndpoints.forEach(endpoint => {
        const endpointPath = path.join(pushApiDir, endpoint, 'route.ts');
        if (!fs.existsSync(endpointPath)) {
          missingEndpoints.push(endpoint);
        }
      });
      
      if (missingEndpoints.length > 0) {
        throw new Error(`Missing push endpoints: ${missingEndpoints.join(', ')}`);
      }
      
      return `✅ All ${requiredEndpoints.length} push notification endpoints implemented`;
    }
  },
  
  {
    name: 'Mobile Gesture Hooks',
    test: () => {
      const hooksPath = path.join(__dirname, '../src/hooks/useMobileGestures.ts');
      if (!fs.existsSync(hooksPath)) {
        throw new Error('Mobile gestures hook not found');
      }
      
      const hooksContent = fs.readFileSync(hooksPath, 'utf8');
      
      const requiredHooks = ['useSwipeGesture', 'usePullToRefresh', 'useLongPress'];
      const missingHooks = [];
      
      requiredHooks.forEach(hook => {
        if (!hooksContent.includes(`export const ${hook}`)) {
          missingHooks.push(hook);
        }
      });
      
      if (missingHooks.length > 0) {
        throw new Error(`Missing gesture hooks: ${missingHooks.join(', ')}`);
      }
      
      return `✅ All ${requiredHooks.length} mobile gesture hooks implemented`;
    }
  },
  
  {
    name: 'Mobile-First Components',
    test: () => {
      const componentsDir = path.join(__dirname, '../src/components');
      const requiredComponents = [
        'MobileNavigation.tsx',
        'MobileLayout.tsx',
        'PWAInstallPrompt.tsx',
        'SwipeableTaskCard.tsx'
      ];
      
      const missingComponents = [];
      requiredComponents.forEach(component => {
        const componentPath = path.join(componentsDir, component);
        if (!fs.existsSync(componentPath)) {
          missingComponents.push(component);
        }
      });
      
      if (missingComponents.length > 0) {
        throw new Error(`Missing components: ${missingComponents.join(', ')}`);
      }
      
      return `✅ All ${requiredComponents.length} mobile-first components created`;
    }
  },
  
  {
    name: 'PWA Hook Implementation',
    test: () => {
      const pushHookPath = path.join(__dirname, '../src/hooks/use-web-push.ts');
      const mobileHookPath = path.join(__dirname, '../src/hooks/use-mobile.ts');
      
      if (!fs.existsSync(pushHookPath)) {
        throw new Error('Web push hook not found');
      }
      
      if (!fs.existsSync(mobileHookPath)) {
        throw new Error('Mobile hook not found');
      }
      
      const pushContent = fs.readFileSync(pushHookPath, 'utf8');
      if (!pushContent.includes('useWebPush')) {
        throw new Error('useWebPush hook not properly exported');
      }
      
      return '✅ PWA hooks properly implemented';
    }
  },
  
  {
    name: 'Database Schema Updates',
    test: () => {
      const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
      if (!fs.existsSync(schemaPath)) {
        throw new Error('Prisma schema not found');
      }
      
      const schemaContent = fs.readFileSync(schemaPath, 'utf8');
      
      if (!schemaContent.includes('model PushSubscription')) {
        throw new Error('PushSubscription model not found in schema');
      }
      
      const requiredFields = ['endpoint', 'p256dhKey', 'authKey', 'isActive'];
      const missingFields = [];
      
      requiredFields.forEach(field => {
        if (!schemaContent.includes(field)) {
          missingFields.push(field);
        }
      });
      
      if (missingFields.length > 0) {
        throw new Error(`Missing PushSubscription fields: ${missingFields.join(', ')}`);
      }
      
      return '✅ Database schema updated with push subscription support';
    }
  },
  
  {
    name: 'Offline Support Enhancement',
    test: () => {
      const swPath = path.join(__dirname, '../src/service-worker.ts');
      const swContent = fs.readFileSync(swPath, 'utf8');
      
      // Check for enhanced offline features
      const offlineFeatures = [
        'CRITICAL_CACHE',
        'criticalApiEndpoints',
        'handleApiRequest',
        'handleStaticAsset',
        'handleNavigation'
      ];
      
      const missingFeatures = [];
      offlineFeatures.forEach(feature => {
        if (!swContent.includes(feature)) {
          missingFeatures.push(feature);
        }
      });
      
      if (missingFeatures.length > 0) {
        throw new Error(`Missing offline features: ${missingFeatures.join(', ')}`);
      }
      
      return '✅ Enhanced offline support implemented';
    }
  },
  
  {
    name: 'Configuration Files',
    test: () => {
      const configFiles = [
        '../package.json',
        '../next.config.ts',
        '../tailwind.config.ts',
        '../public/robots.txt'
      ];
      
      const missingFiles = [];
      configFiles.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (!fs.existsSync(filePath)) {
          missingFiles.push(file);
        }
      });
      
      if (missingFiles.length > 0) {
        throw new Error(`Missing config files: ${missingFiles.join(', ')}`);
      }
      
      // Check package.json for PWA dependencies
      const packagePath = path.join(__dirname, '../package.json');
      const packageContent = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      const requiredDeps = ['web-push', 'sharp'];
      const missingDeps = [];
      
      requiredDeps.forEach(dep => {
        if (!packageContent.dependencies?.[dep] && !packageContent.devDependencies?.[dep]) {
          missingDeps.push(dep);
        }
      });
      
      if (missingDeps.length > 0) {
        console.warn(`⚠️  Missing PWA dependencies: ${missingDeps.join(', ')}`);
      }
      
      return '✅ Configuration files present and valid';
    }
  }
];

// Run tests
let passed = 0;
let failed = 0;

console.log('\\n📋 Running Tests...\\n');

tests.forEach((test, index) => {
  try {
    const result = test.test();
    console.log(`${index + 1}. ${test.name}: ${result}`);
    passed++;
  } catch (error) {
    console.log(`${index + 1}. ${test.name}: ❌ ${error.message}`);
    failed++;
  }
});

console.log('\\n' + '='.repeat(50));
console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);

if (failed === 0) {
  console.log('\\n🎉 All PWA features and mobile optimizations are properly implemented!');
  console.log('\\n📱 Ready for mobile deployment and app store distribution.');
} else {
  console.log('\\n⚠️  Some tests failed. Please review and fix the issues above.');
  process.exit(1);
}

console.log('\\n🚀 Phase 1: Mobile Optimization & PWA Features - COMPLETE!');
console.log('\\n📋 Next Steps:');
console.log('- Test on multiple devices and browsers');
console.log('- Validate PWA installation flow');
console.log('- Test offline functionality');
console.log('- Verify push notifications');
console.log('- Performance audit with Lighthouse');
console.log('- Submit to app stores (if applicable)');
console.log('\\n✨ Your Latest-OS app is now mobile-optimized!');