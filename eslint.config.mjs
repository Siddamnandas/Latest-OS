import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      // Build and vendor outputs
      ".next/**",
      "node_modules/**",
      "coverage/**",
      "playwright-report/**",
      "artifacts/**",
      "test-results/**",
      // Mobile app sandbox (not linted here)
      "mobile-app/**",
      // Ad-hoc ignores
      "testsprite_tests/tmp/**",
      "next-env.d.ts",
      "jest.setup.js",
      "jest.setup.ts",
      "public/workers/**",
      "public/*.js",
      "scripts/**",
      "simple-test.js",
      "src/__tests__/sample.test.js",
      "src/app/layout.tsx",
      "src/lib/config.ts",
      "src/lib/storage.ts",
      "src/service-worker.ts",
    ],
  },
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:jsx-a11y/recommended',
  ),
  {
    rules: {
      // TypeScript 相关规则
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'warn', // Changed from error to warn
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/prefer-as-const': 'off',
      '@typescript-eslint/no-require-imports': 'error',
      '@typescript-eslint/no-empty-object-type': 'error',

      // React 相关规则
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'error',
      'react/no-unescaped-entities': 'off',
      'react/display-name': 'off',
      'react/prop-types': 'off',

      // Next.js 相关规则
      '@next/next/no-img-element': 'off',
      '@next/next/no-html-link-for-pages': 'off',

      // 一般JavaScript规则
      'prefer-const': 'warn', // Changed from error to warn
      'no-unused-vars': 'warn', // Changed from error to warn
      'no-console': 'off',
      'no-debugger': 'off',
      'no-empty': 'off',
      'no-irregular-whitespace': 'off',
      'no-case-declarations': 'off',
      'no-fallthrough': 'off',
      'no-mixed-spaces-and-tabs': 'off',
      'no-redeclare': 'off',
      'no-undef': 'off',
      'no-unreachable': 'off',
      'no-useless-escape': 'off',
      // Accessibility warnings
      'jsx-a11y/label-has-associated-control': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/no-noninteractive-element-interactions': 'warn',
      'jsx-a11y/no-autofocus': 'error',
      'jsx-a11y/media-has-caption': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
    },
  },
  {
    files: ["**/*.stories.@(ts|tsx)", "simple-test.js"],
    ignores: ["**/*.stories.@(ts|tsx)", "simple-test.js"],
  },
];

export default eslintConfig;
