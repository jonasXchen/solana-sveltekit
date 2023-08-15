import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

import { nodePolyfills } from "vite-plugin-node-polyfills";


export default defineConfig({
	plugins: [
		sveltekit(), 
		nodePolyfills()
	],

	// For including Buffer
	resolve: {
		alias: {
		  buffer: 'buffer/'
		}
	},
	server: {
		port: 3000
	}

});
