# Copyright (c) 2026, NCE and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document
import json


class Theme(Document):
    def validate(self):
        if not self.json_data:
            frappe.throw("Theme must have json_data")

        try:
            data = json.loads(self.json_data)
        except json.JSONDecodeError:
            frappe.throw("Invalid JSON in json_data")

        version = data.get("$version", "")
        if version.startswith("2."):
            if "lightTheme" not in data or "cssVariables" not in data.get("lightTheme", {}):
                frappe.throw("V2 theme must have lightTheme.cssVariables")
            if "darkTheme" not in data or "cssVariables" not in data.get("darkTheme", {}):
                frappe.throw("V2 theme must have darkTheme.cssVariables")

        if self.is_default:
            frappe.db.sql(
                """UPDATE `tabTheme` SET is_default = 0 WHERE name != %s""",
                self.name
            )


@frappe.whitelist()
def get_all_themes():
    """Get all themes with basic info and color previews."""
    themes = frappe.get_all(
        "Theme",
        fields=["name", "theme_name", "description", "is_default", "modified"],
        order_by="modified desc"
    )

    for theme in themes:
        theme_doc = frappe.get_doc("Theme", theme.name)
        try:
            data = json.loads(theme_doc.json_data)
            ds = data.get("designSystem", {})
            primary = ds.get("primary", {})
            neutral = ds.get("neutral", {})
            theme["primary_color"] = primary.get("anchor", "#4299F0")
            shades = neutral.get("shades", {})
            theme["neutral_color"] = shades.get("600", "#666666")
        except Exception:
            theme["primary_color"] = "#4299F0"
            theme["neutral_color"] = "#666666"

    return themes


@frappe.whitelist()
def get_default_theme():
    """Get the default theme if one is set."""
    default = frappe.get_all(
        "Theme",
        filters={"is_default": 1},
        fields=["name", "theme_name", "description", "is_default"],
        limit=1
    )
    if default:
        theme = frappe.get_doc("Theme", default[0].name)
        return {
            "name": theme.name,
            "theme_name": theme.theme_name,
            "description": theme.description,
            "is_default": theme.is_default,
            "json_data": theme.json_data
        }
    return None


@frappe.whitelist()
def set_default_theme(name):
    """Set a theme as the default, or clear default if name is empty."""
    frappe.db.sql("""UPDATE `tabTheme` SET is_default = 0""")

    if name:
        theme = frappe.get_doc("Theme", name)
        theme.is_default = 1
        theme.save()

    frappe.db.commit()
    return {"success": True}


@frappe.whitelist()
def get_theme(name):
    """Get a specific theme's full data."""
    theme = frappe.get_doc("Theme", name)
    return {
        "name": theme.name,
        "theme_name": theme.theme_name,
        "description": theme.description,
        "is_default": theme.is_default,
        "json_data": theme.json_data
    }


@frappe.whitelist()
def save_theme(theme_name, description, json_data):
    """Create a new theme."""
    theme = frappe.get_doc({
        "doctype": "Theme",
        "theme_name": theme_name,
        "description": description,
        "json_data": json_data
    })
    theme.insert()
    return theme.name


@frappe.whitelist()
def update_theme(name, description, json_data):
    """Update an existing theme."""
    theme = frappe.get_doc("Theme", name)
    theme.description = description
    theme.json_data = json_data
    theme.save()
    return theme.name


@frappe.whitelist()
def delete_theme(name):
    """Delete a theme."""
    frappe.delete_doc("Theme", name)
    return {"success": True}
