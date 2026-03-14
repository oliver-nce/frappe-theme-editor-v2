frappe.pages["theme-preview"].on_page_show = function (wrapper) {
	if (!wrapper._page_obj) {
		wrapper._page_obj = frappe.ui.make_app_page({
			parent: wrapper,
			title: "Theme Preview",
			single_column: true,
		});
	}

	if (wrapper._vue_app) return;

	frappe.require(
		[
			"/assets/frappe_theme_editor/js/theme_preview_dist/theme_preview.js",
			"/assets/frappe_theme_editor/js/theme_preview_dist/style.css",
		],
		function () {
			const mount_el = document.createElement("div");
			mount_el.id = "theme-preview-app";
			mount_el.style.cssText = "height:100%;width:100%;";
			wrapper._page_obj.main.append(mount_el);
			if (window.NCEThemePreview && window.NCEThemePreview.mount) {
				wrapper._vue_app = window.NCEThemePreview.mount("#theme-preview-app");
			}
		}
	);
};
