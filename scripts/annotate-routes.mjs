import fs from 'fs';
import fg from 'fast-glob';
import path from 'path';

const files = await fg('src/app/api/**/route.ts');

for (const file of files) {
  const rel = '/' + path.relative('src/app', file).replace(/\\/g, '/');
  const apiPath = rel.replace('/route.ts', '');
  let content = fs.readFileSync(file, 'utf8');
  if (content.includes('registry.registerPath')) continue;

  const methods = [];
  if (/export\s+async\s+function\s+GET/.test(content)) methods.push('get');
  if (/export\s+async\s+function\s+POST/.test(content)) methods.push('post');
  if (/export\s+async\s+function\s+PUT/.test(content)) methods.push('put');
  if (/export\s+async\s+function\s+DELETE/.test(content)) methods.push('delete');

  const registrations = methods.map(m =>
    `registry.registerPath({ method: "${m}", path: "${apiPath}", responses: { 200: { description: "Success" } } });`
  ).join('\n');

  const importLine = `import { registry } from "@/lib/openapi";`;
  const newContent = `${importLine}\n${registrations}\n\n${content}`;
  fs.writeFileSync(file, newContent);
}
