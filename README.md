# Frappe Theme Editor

A visual theme editor for Frappe/ERPNext applications. Create and customize color themes with real-time preview, then export as JSON or inject directly into your Frappe site.

## Installation

```bash
# From your bench directory
bench get-app https://github.com/oliver-nce/frappe-theme-editor.git
bench --site your-site install-app frappe_theme_editor
```

## Features

- **Hue-based color system** - Select primary and neutral hues, get a complete shade scale (50-900)
- **Semantic colors** - Success, error, warning with automatic text contrast
- **Frappe-specific settings** - Lists, forms, navigation, indicators, print styles
- **AI agent guidance** - Embedded design principles for consistent theming
- **JSON export** - W3C Design Tokens format with Frappe CSS variable mappings

## Usage

### As Web Page

After installation, access the theme editor at:
```
https://your-site.frappe.cloud/theme-editor
```

### Standalone

Open `frappe_theme_editor/www/theme-editor.html` directly in a browser for standalone use.

## JSON Structure

The exported JSON includes:

- **Core Theme** - Primary/neutral palettes (50-900), semantic colors, window controls
- **Frappe CSS** - Ready-to-use CSS custom properties (`--primary`, `--bg-color`, etc.)
- **Agent Guidance** - Design principles for AI-assisted development

## File Structure

```
frappe_theme_editor/
├── __init__.py
├── hooks.py                    # Frappe app configuration
├── modules.txt
├── patches.txt
├── public/
│   ├── css/                    # Generated theme CSS
│   └── js/                     # Theme editor scripts
├── themes/
│   └── default-theme.json      # Default theme configuration
└── www/
    └── theme-editor.html       # Theme editor web page
```

## Planned Features

- DocType for saving multiple themes
- "Inject into Site" button to push CSS directly
- Theme switching for comparison
- Per-user theme preferences

## License

MIT
