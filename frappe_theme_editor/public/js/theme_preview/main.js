import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

window.NCEThemePreview = {
	mount(selector) {
		return app.mount(selector);
	},
};
