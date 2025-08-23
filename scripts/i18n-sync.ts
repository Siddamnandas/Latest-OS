import { promises as fs } from 'fs';
import path from 'path';

const messagesDir = path.join(process.cwd(), 'src', 'messages');
const baseLocale = 'en';

interface MergeResult {
  merged: any;
  missing: string[];
}

function mergeTranslations(base: any, target: any, prefix = ''): MergeResult {
  const result: any = Array.isArray(base) ? [] : {};
  let missing: string[] = [];

  for (const key of Object.keys(base)) {
    const currentKey = prefix ? `${prefix}.${key}` : key;
    if (typeof base[key] === 'object' && base[key] !== null) {
      const targetValue = target[key] ?? {};
      const { merged, missing: childMissing } = mergeTranslations(
        base[key],
        targetValue,
        currentKey
      );
      result[key] = merged;
      missing = missing.concat(childMissing);
    } else {
      if (target[key] === undefined || target[key] === '') {
        result[key] = '';
        missing.push(currentKey);
      } else {
        result[key] = target[key];
      }
    }
  }

  return { merged: result, missing };
}

async function main() {
  const files = await fs.readdir(messagesDir);
  const basePath = path.join(messagesDir, `${baseLocale}.json`);
  const base = JSON.parse(await fs.readFile(basePath, 'utf8'));

  let hasMissing = false;

  for (const file of files) {
    if (!file.endsWith('.json') || file === `${baseLocale}.json`) continue;
    const locale = path.basename(file, '.json');
    const filePath = path.join(messagesDir, file);
    const raw = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const { merged, missing } = mergeTranslations(base, raw);
    if (missing.length > 0) {
      hasMissing = true;
      console.warn(`Missing translations for locale \"${locale}\":`);
      missing.forEach((key) => console.warn(`  - ${key}`));
    }
    await fs.writeFile(filePath, JSON.stringify(merged, null, 2) + '\n');
  }

  if (hasMissing) {
    console.error('Translation check failed. Missing translations found.');
    process.exitCode = 1;
  } else {
    console.log('All translations are complete!');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
