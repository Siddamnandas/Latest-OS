import fg from 'fast-glob';
import path from 'path';
import fs from 'fs';
import { registry, generateOpenApiDocument } from '../src/lib/openapi';

async function main() {
  const files = await fg('src/app/api/**/route.ts');
  for (const file of files) {
    let rel = '/' + path.relative('src/app', file).replace(/\\/g, '/');
    let apiPath = rel.replace('/route.ts', '');
    apiPath = apiPath.replace(/\[\.\.\.(.*?)]/g, '{$1}');
    apiPath = apiPath.replace(/\[(.*?)]/g, '{$1}');
    const content = fs.readFileSync(file, 'utf8');
    const methods: string[] = [];
    const hasGet = /export\s+async\s+function\s+GET/.test(content) || /export\s*{[^}]*\bGET\b[^}]*}/.test(content);
    const hasPost = /export\s+async\s+function\s+POST/.test(content) || /export\s*{[^}]*\bPOST\b[^}]*}/.test(content);
    const hasPut = /export\s+async\s+function\s+PUT/.test(content) || /export\s*{[^}]*\bPUT\b[^}]*}/.test(content);
    const hasDelete = /export\s+async\s+function\s+DELETE/.test(content) || /export\s*{[^}]*\bDELETE\b[^}]*}/.test(content);
    if (hasGet) methods.push('get');
    if (hasPost) methods.push('post');
    if (hasPut) methods.push('put');
    if (hasDelete) methods.push('delete');
    methods.forEach(m => {
      registry.registerPath({ method: m, path: apiPath, responses: { 200: { description: 'Success' } } });
    });
  }
  const doc = generateOpenApiDocument();
  const outDir = path.resolve('public/api-docs');
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'openapi.json'), JSON.stringify(doc, null, 2));
}

main();