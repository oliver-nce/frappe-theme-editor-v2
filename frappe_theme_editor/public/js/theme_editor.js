$(document).on('page-change', function() {
	var route = frappe.get_route_str();
	if (route === 'Workspaces/Themes' || route === 'Workspaces/Theme Editor') {
		frappe.set_route('theme-editor');
	}
});
