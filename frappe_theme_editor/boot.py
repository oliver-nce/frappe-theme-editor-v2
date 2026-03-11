# Copyright (c) 2026, NCE and contributors
# For license information, please see license.txt

import json
import os
import frappe


def boot_session(bootinfo):
    """
    Called on every page load via the boot_session hook.
    Injects the active theme CSS into the boot response so it's
    available immediately, even before static files load.
    """
    try:
        css = _read_theme_css()
        if css:
            bootinfo.theme_css = css
    except Exception:
        pass


def reapply_theme_after_migrate():
    """
    Called after bench migrate. If a theme was active, re-write
    the CSS file in case it was lost during migration.
    """
    try:
        if not frappe.db.exists("DocType", "Theme Selector"):
            return

        selector = frappe.get_single("Theme Selector")
        if not selector.active_theme:
            return

        theme_doc = frappe.get_doc("Theme", selector.active_theme)
        if not theme_doc.json_data:
            return

        theme_data = json.loads(theme_doc.json_data)
        css_content = theme_data.get("frappeStylesheet", "")

        if not css_content:
            frappe_css = theme_data.get("frappeCSS", {})
            if frappe_css:
                css_content = _build_css_from_variables(frappe_css)

        if css_content:
            css_content = _upgrade_selector(css_content)
            _write_theme_css(css_content)
            frappe.logger().info(
                f"NCE Theme re-applied after migrate: {selector.active_theme}"
            )

    except Exception as e:
        frappe.logger().error(f"NCE Theme post-migrate reapply failed: {e}")


def _read_theme_css():
    """Read the theme CSS file if it exists."""
    css_path = _get_theme_css_path()
    if os.path.exists(css_path):
        with open(css_path, "r") as f:
            return f.read()
    return ""


def _write_theme_css(css_content):
    """Write theme CSS to the site's public files directory."""
    css_path = _get_theme_css_path()
    os.makedirs(os.path.dirname(css_path), exist_ok=True)
    with open(css_path, "w") as f:
        f.write(css_content)


def _get_theme_css_path():
    """Path to the persisted CSS file in the site's public files."""
    return frappe.get_site_path("public", "files", "nce_theme_override.css")


def _upgrade_selector(css_content):
    """Replace bare :root { with compound selector matching Frappe's specificity."""
    import re
    return re.sub(
        r':root\s*\{',
        ':root,\n[data-theme="light"],\n[data-theme="dark"] {',
        css_content
    )


def _build_css_from_variables(frappe_css):
    """Build CSS from frappeCSS key-value pairs with correct specificity."""
    lines = [
        "/* NCE Theme - Auto-generated */",
        ":root,",
        '[data-theme="light"],',
        '[data-theme="dark"] {'
    ]
    for key, value in frappe_css.items():
        if key.startswith("$"):
            continue
        if key.startswith("--"):
            lines.append(f"  {key}: {value};")
    lines.append("}")
    return "\n".join(lines)
