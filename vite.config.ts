import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@module/use-virtual-list': resolve(__dirname, './src/use-virtual-list'),
			'@module/use-perfect-layout': resolve(
				__dirname,
				'./src/use-perfect-layout'
			),
			'@module/infinite-grid': resolve(__dirname, './src/infinite-grid'),
		},
	},
	plugins: [react()],
});
