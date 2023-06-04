import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	// For including Buffer
	resolve: {
		alias: {
		  buffer: 'buffer/',
		}
	},
	server: {
		port: 3000
	}

});
