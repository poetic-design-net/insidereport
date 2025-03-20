import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	// Make sure environment variables are properly exposed
	define: {
		// Expose all environment variables prefixed with PUBLIC_
		'import.meta.env.PUBLIC_SANITY_PREVIEW_SECRET': JSON.stringify(process.env.PUBLIC_SANITY_PREVIEW_SECRET),
	}
});
