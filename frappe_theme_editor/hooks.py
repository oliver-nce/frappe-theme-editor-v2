"""
Frappe Theme Editor - Hooks Configuration

Visual theme editor for Frappe/ERPNext applications.
"""

app_name = "frappe_theme_editor"
app_title = "Frappe Theme Editor"
app_publisher = "NCE"
app_description = "Visual theme editor for Frappe/ERPNext applications"
app_email = "dev@ncesoccer.com"
app_license = "MIT"
# app_logo_url = "/assets/frappe_theme_editor/logo.png"

# Required apps (dependencies)
# required_apps = []

# Includes in <head>
# ------------------
# Include CSS files in header of desk.html
app_include_css = [
	"/assets/frappe_theme_editor/css/nce_theme.css",
]

# Include JS files in header of desk.html
app_include_js = [
	"/assets/frappe_theme_editor/js/theme_editor.js",
	"/assets/frappe_theme_editor/js/nce_theme_boot.js",
]

# Include CSS in website pages
# web_include_css = "/assets/frappe_theme_editor/css/nce_theme.css"

# Include JS in website pages
# web_include_js = "/assets/frappe_theme_editor/js/theme_editor.js"

# Home Pages
# ----------
# home_page = "theme-editor"

# Desktop Icons / App Tiles
# -------------------------
add_to_apps_screen = [
	{
		"name": "frappe_theme_editor",
		"logo": "/assets/frappe_theme_editor/logo.png",
		"title": "Theme Editor",
		"route": "/app/themes",
	}
]

# Website route rules
# website_route_rules = [
#     {"from_route": "/theme-editor", "to_route": "theme-editor"},
# ]

# DocType Class Overrides
# -----------------------
# override_doctype_class = {}

# Document Events
# ---------------
# doc_events = {}

# Scheduled Tasks
# ---------------
# scheduler_events = {}

# Fixtures
# --------
fixtures = [
	{
		"doctype": "Page",
		"filters": [
			["name", "in", ["theme-editor"]]
		]
	}
]

# Boot Info
# ---------
extend_bootinfo = "frappe_theme_editor.boot.boot_session"

# After Migrate
# -------------
after_migrate = [
	"frappe_theme_editor.boot.reapply_theme_after_migrate"
]

# Website Context (portal CSS — theme injected via boot_session + JS)
# -------------------------------------------------------------------

# After Install (sync desktop icons so Theme Editor appears in sidebar)
# -------------------------------------------------------------------
after_install = "frappe_theme_editor.install.after_install"
