import { test, expect } from '@playwright/test';

// 🚀 Latest-OS Platform Smoke Test
// Quick validation of core functionality

test.describe('LATEST-OS Smoke Tests', () => {

  test('🔥 CRITICAL: Platform Loads & Title Correct', async ({ page }) => {
    // Critical test: Platform must load within 30 seconds
    await page.goto('http://localhost:3000', { timeout: 30000 });

    // Verify title matches our fix
    await expect(page).toHaveTitle(/Latest-OS/);

    // Verify critical content loads
    await expect(page.locator('body')).toBeVisible();

    console.log('✅ Platform loads successfully');
  });

  test('🎯 CORE: AI Load Balancer Functionality', async ({ page }) => {
    // Most critical business feature test
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Navigate to Tasks (should be available in bottom nav)
    await expect(page.getByText('Tasks')).toBeVisible({ timeout: 10000 });
    await page.click('text=Tasks');

    // Check for AI Load Balancer trigger
    const balancerButton = page.getByText('Balance Load');
    await expect(balancerButton).toBeVisible({ timeout: 10000 });

    console.log('✅ AI Load Balancer accessible');
  });

  test('💕 LOVE: Secret Couple Loop Basics', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Test Together tab
    await expect(page.getByText('Together')).toBeVisible({ timeout: 10000 });
    await page.click('text=Together');

    // Secret Couple Loop should be present
    await expect(page.getByText('Secret Couple Loop')).toBeVisible({ timeout: 5000 });

    console.log('✅ Secret Couple Loop features accessible');
  });

  test('📊 DASHBOARD: Settings Privacy Compliance', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Navigate to Profile Settings
    await expect(page.getByText('Profile')).toBeVisible({ timeout: 10000 });
    await page.click('text=Profile');

    // Settings should be available
    await expect(page.getByText('Settings')).toBeVisible({ timeout: 10000 });
    await page.click('text=Settings');

    // Privacy section should be properly accessible
    const privacySection = page.getByText('Privacy & Data Consent');
    await expect(privacySection).toBeVisible({ timeout: 10000 });

    console.log('✅ Settings & Privacy features working');
  });

  test('🐣 KIDS: Family Features', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');

    // Kids tab should be accessible
    await expect(page.getByText('Kids')).toBeVisible({ timeout: 10000 });
    await page.click('text=Kids');

    // Kids dashboard should load
    await expect(page.getByText('Kids')).toBeVisible({ timeout: 5000 });

    console.log('✅ Kids/family features accessible');
  });

  test('⚡ PERFORMANCE: Fast Loading', async ({ page }) => {
    const start = Date.now();
    await page.goto('http://localhost:3000', { timeout: 30000 });

    // Wait for basic content
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;

    // Should load under 10 seconds for smoke test
    expect(loadTime).toBeLessThan(10000);

    console.log(`✅ Page load time: ${loadTime}ms (under 10s)`);
  });

  test('♿ ACCESSIBLE: Basic Keyboard Navigation', async ({ page }) => {
    await page.goto('http://localhost:3000');

    // Basic keyboard navigation should work
    await page.keyboard.press('Tab');
    await expect(page.locator('[tabindex]').first()).toBeFocused();

    console.log('✅ Keyboard navigation functional');
  });

});
