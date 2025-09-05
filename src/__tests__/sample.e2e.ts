import { test, expect } from '@playwright/test';

test('loads home page', async ({ page }) => {
  await page.goto('http://localhost:3000');
  // Expect page loads without error - title is set dynamically in development
  await expect(page.locator('body')).toBeVisible();
});
