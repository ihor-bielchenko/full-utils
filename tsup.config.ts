import { defineConfig } from 'tsup';

export default defineConfig([
	{
		entry: {
			index: 'src/index.ts',
			browser: 'src/browser.ts',
			node: 'src/node.ts'
		},
		format: [ 'esm', 'cjs' ],
		dts: true,
		sourcemap: true,
		splitting: false,
		clean: true,
		target: 'es2020',
		treeshake: true,
		minify: false
	}
]);