frappe.pages['theme-editor'].on_page_load = function(wrapper) {
    var page = frappe.ui.make_app_page({
        parent: wrapper,
        title: 'Theme Editor',
        single_column: true
    });
    
    // Load the theme editor in an iframe for CSS isolation
    // Theme editor will access frappe via window.parent.frappe
    const iframe = document.createElement('iframe');
    iframe.src = '/assets/frappe_theme_editor/theme-editor.html';
    iframe.style.width = '100%';
    iframe.style.height = 'calc(100vh - 60px)';
    iframe.style.border = 'none';
    iframe.style.display = 'block';
    
    page.main.html('').append(iframe);
};
