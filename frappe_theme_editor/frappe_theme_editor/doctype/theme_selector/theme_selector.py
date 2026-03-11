# Copyright (c) 2026, NCE and contributors
# For license information, please see license.txt

import json
import os
import frappe
from frappe.model.document import Document


class ThemeSelector(Document):
    pass


@frappe.whitelist()
def apply_theme(theme_name):
    """
    Read the selected Theme's json_data, extract the frappeStylesheet,
    write it to the site's custom CSS file, and update the singleton.
    """
    frappe.only_for("System Manager")

    if not theme_name:
        frappe.throw("Please select a theme first.")

    # Get the Theme document
    theme_doc = frappe.get_doc("Theme", theme_name)
    if not theme_doc.json_data:
        frappe.throw(f"Theme '{theme_name}' has no json_data.")

    # Parse the JSON and extract the stylesheet
    try:
        theme_data = json.loads(theme_doc.json_data)
    except json.JSONDecodeError:
        frappe.throw(f"Theme '{theme_name}' has invalid JSON in json_data.")

    css_content = theme_data.get("frappeStylesheet", "")
    if not css_content:
        # Fallback: build CSS from frappeCSS object
        frappe_css = theme_data.get("frappeCSS", {})
        if frappe_css:
            css_content = _build_css_from_variables(frappe_css)
        else:
            frappe.throw(f"Theme '{theme_name}' has no CSS data (no frappeStylesheet or frappeCSS).")

    css_content = _boost_selector_specificity(css_content)

    # Write the CSS file to the site's public directory
    _write_theme_css(css_content)

    # Update the singleton
    selector = frappe.get_single("Theme Selector")
    selector.active_theme = theme_name
    selector.theme_status = f"Active: {theme_name}"
    selector.css_preview = css_content
    selector.save(ignore_permissions=True)

    # Clear cache so the new CSS takes effect
    frappe.clear_cache()

    frappe.msgprint(
        f"Theme '{theme_name}' applied successfully. Reload the page to see changes.",
        title="Theme Applied",
        indicator="green"
    )

    return {"status": "ok", "theme": theme_name}


@frappe.whitelist()
def revert_to_default():
    """
    Remove the custom theme CSS and restore default Frappe styling.
    """
    frappe.only_for("System Manager")

    _remove_theme_css()

    # Update the singleton
    selector = frappe.get_single("Theme Selector")
    selector.active_theme = None
    selector.theme_status = "Default Frappe Theme"
    selector.css_preview = ""
    selector.save(ignore_permissions=True)

    frappe.clear_cache()

    frappe.msgprint(
        "Reverted to default Frappe theme. Reload the page to see changes.",
        title="Theme Reverted",
        indicator="blue"
    )

    return {"status": "ok"}


@frappe.whitelist()
def preview_theme(theme_name):
    """
    Return the CSS that would be applied, without actually applying it.
    """
    frappe.only_for("System Manager")

    if not theme_name:
        return {"css": ""}

    theme_doc = frappe.get_doc("Theme", theme_name)
    if not theme_doc.json_data:
        return {"css": ""}

    try:
        theme_data = json.loads(theme_doc.json_data)
    except json.JSONDecodeError:
        return {"css": ""}

    css_content = theme_data.get("frappeStylesheet", "")
    if not css_content:
        frappe_css = theme_data.get("frappeCSS", {})
        if frappe_css:
            css_content = _build_css_from_variables(frappe_css)

    return {"css": css_content}


def _boost_selector_specificity(css_content):
    """
    Replace bare :root { with compound selector that matches Frappe's
    own :root, [data-theme="light"] specificity so load order wins.
    """
    import re
    return re.sub(
        r':root\s*\{',
        ':root,\n[data-theme="light"],\n[data-theme="dark"] {',
        css_content
    )


def _build_css_from_variables(frappe_css):
    """Build CSS from frappeCSS key-value pairs with correct specificity."""
    lines = [
        "/* NCE Theme - Auto-generated from frappeCSS variables */",
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


def _get_theme_css_path():
    """
    Return the path where the theme CSS file is written.
    This goes into the site's public files so it persists across restarts.
    """
    site_path = frappe.get_site_path("public", "files")
    return os.path.join(site_path, "nce_theme_override.css")


def _write_theme_css(css_content):
    """Write the theme CSS to the site's public files directory."""
    css_path = _get_theme_css_path()
    os.makedirs(os.path.dirname(css_path), exist_ok=True)

    with open(css_path, "w") as f:
        f.write(css_content)

    frappe.logger().info(f"NCE Theme CSS written to {css_path}")


def _remove_theme_css():
    """Remove the theme CSS file."""
    css_path = _get_theme_css_path()
    if os.path.exists(css_path):
        os.remove(css_path)
        frappe.logger().info(f"NCE Theme CSS removed from {css_path}")


def get_theme_css():
    """
    Called by hooks (boot/website_context) to get the current theme CSS.
    Returns the CSS string if a theme is active, empty string otherwise.
    """
    css_path = _get_theme_css_path()
    if os.path.exists(css_path):
        with open(css_path, "r") as f:
            return f.read()
    return ""
