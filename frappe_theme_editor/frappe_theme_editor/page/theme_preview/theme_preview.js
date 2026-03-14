frappe.pages['theme-preview'].on_page_load = function(wrapper) {
	var page = frappe.ui.make_app_page({
		parent: wrapper,
		title: 'Theme Preview',
		single_column: true
	});

	frappe.require('theme_preview.bundle.js', () => {
		if (frappe.theme_preview && frappe.theme_preview.mount) {
			frappe.theme_preview.mount(page);
		}
	});
};
