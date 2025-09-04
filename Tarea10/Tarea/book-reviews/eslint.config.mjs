import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

// ✅ Definimos el array en una constante (evita import/no-anonymous-default-export)
const eslintConfig = [
  // Base Next + TS
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Ignorados globales
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'next-env.d.ts',
      // opcional: evita que se lintee este mismo archivo
      'eslint.config.mjs',
    ],
  },

  // Override SOLO para tests (desactiva no-explicit-any)
  {
    files: ['**/__tests__/**/*.{ts,tsx}', '**/*.test.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];

export default eslintConfig;
