import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
	plugins: [vue()],
	define: {
		"process.env.NODE_ENV": JSON.stringify("production"),
	},
	build: {
		outDir: path.resolve(__dirname, "../theme_preview_dist"),
		emptyOutDir: true,
		lib: {
			entry: path.resolve(__dirname, "main.js"),
			name: "NCEThemePreview",
			fileName: () => "theme_preview.js",
			formats: ["iife"],
		},
		rollupOptions: {
			external: [],
		},
	},
});
