import { test, expect } from '@playwright/test';

test('loads blank page', async ({ page }) => {
  await page.goto('about:blank');
  await expect(page).toHaveTitle('');
});
