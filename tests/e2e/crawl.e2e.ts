import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const ts = new Date().toISOString().replace(/[:.]/g, '-');
const ARTIFACT_ROOT = path.resolve(process.cwd(), 'artifacts', 'ui-crawl', ts);

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

test.describe('UI Click-Crawl', () => {
  test.beforeAll(async () => {
    ensureDir(ARTIFACT_ROOT);
  });

  test('crawl primary routes and capture issues', async ({ page, browserName }) => {
    const errors: string[] = [];
    const requests: any[] = [];
    const responses: any[] = [];

    page.on('console', (msg) => {
      if (['error'].includes(msg.type())) {
        errors.push(`[console.${msg.type()}] ${msg.text()}`);
      }
    });
    page.on('pageerror', (err) => errors.push(`[pageerror] ${err.message}`));
    page.on('request', (req) => requests.push({ url: req.url(), method: req.method() }));
    page.on('response', async (res) => {
      const status = res.status();
      if (status >= 400) {
        responses.push({ url: res.url(), status });
      }
    });

    const start = Date.now();
    const startUrl = process.env.E2E_BASE_URL || 'http://localhost:3000';
    await page.goto(startUrl);

    // Capture landing screenshot
    await page.screenshot({ path: path.join(ARTIFACT_ROOT, 'landing.png'), fullPage: true });

    // Click-crawl: click all visible buttons/links up to a depth
    async function crawl(depth = 0, maxDepth = 2) {
      if (depth > maxDepth) return;
      const elements = await page.$$('button, [role="button"], a[href]');
      for (let i = 0; i < Math.min(elements.length, 20); i++) {
        const el = elements[i];
        try {
          const label = await el.evaluate((n) => (n as HTMLElement).innerText || (n as HTMLElement).getAttribute('aria-label') || (n as HTMLElement).getAttribute('href'));
          await el.scrollIntoViewIfNeeded();
          await el.click({ timeout: 1000 }).catch(() => {});
          await page.waitForTimeout(200);
          await page.screenshot({ path: path.join(ARTIFACT_ROOT, `depth${depth}-click${i}.png`), fullPage: true });
        } catch {}
      }
    }

    await crawl(0, 1);

    const allowedPatterns = [
      'Failed to load resource: the server responded with a status of 404',
      '/favicon',
      '/manifest',
      'icon' 
    ];
    const filteredErrors = errors.filter(e => !allowedPatterns.some(p => e.includes(p)));

    const report = {
      startedAt: new Date(start).toISOString(),
      durationMs: Date.now() - start,
      errors,
      filteredErrors,
      failedResponses: responses,
      requestsCount: requests.length,
      browser: browserName,
      baseUrl: startUrl,
    };

    fs.writeFileSync(path.join(ARTIFACT_ROOT, 'report.json'), JSON.stringify(report, null, 2));

    // Gate: zero unexpected console errors on happy path
    expect(filteredErrors).toEqual([]);
  });
});
