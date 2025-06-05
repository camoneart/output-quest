import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import pluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	// Ignore auto‑generated code (e.g., Prisma client & runtime) so ESLint
	// doesn’t block builds with warnings we don’t control.
	{
		ignores: ['src/generated/**'],
	},
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	pluginPrettier.configs.recommended,
	eslintConfigPrettier,
];

export default eslintConfig;
