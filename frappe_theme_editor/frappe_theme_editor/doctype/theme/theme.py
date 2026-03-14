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

        ds = data.get("designSystem", {})
        primary = ds.get("primary", {})
        alternate = ds.get("alternate", {})

        if not primary.get("shades"):
            frappe.throw("Theme must have designSystem.primary.shades")
        if not alternate.get("shades"):
            frappe.throw("Theme must have designSystem.alternate.shades")

        for field in ("w3c_tokens", "vue_tokens"):
            value = getattr(self, field, None)
            if value:
                try:
                    json.loads(value)
                except json.JSONDecodeError:
                    frappe.throw(f"Invalid JSON in {field}")

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
            alternate = ds.get("alternate", {})
            primary_shades = primary.get("shades", {})
            alternate_shades = alternate.get("shades", {})
            theme["primary_color"] = primary_shades.get("600", "#7C7C7C")
            theme["alternate_color"] = alternate_shades.get("600", "#007BE0")
        except Exception:
            theme["primary_color"] = "#7C7C7C"
            theme["alternate_color"] = "#007BE0"

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
    """Get a specific theme's full data including token formats."""
    theme = frappe.get_doc("Theme", name)
    return {
        "name": theme.name,
        "theme_name": theme.theme_name,
        "description": theme.description,
        "is_default": theme.is_default,
        "json_data": theme.json_data,
        "w3c_tokens": theme.w3c_tokens or "",
        "vue_tokens": theme.vue_tokens or ""
    }


@frappe.whitelist()
def save_theme(theme_name, description, json_data, w3c_tokens=None, vue_tokens=None):
    """Create a new theme."""
    theme = frappe.get_doc({
        "doctype": "Theme",
        "theme_name": theme_name,
        "description": description,
        "json_data": json_data,
        "w3c_tokens": w3c_tokens or "",
        "vue_tokens": vue_tokens or ""
    })
    theme.insert()
    return theme.name


@frappe.whitelist()
def update_theme(name, description, json_data, w3c_tokens=None, vue_tokens=None):
    """Update an existing theme."""
    theme = frappe.get_doc("Theme", name)
    theme.description = description
    theme.json_data = json_data
    theme.w3c_tokens = w3c_tokens or ""
    theme.vue_tokens = vue_tokens or ""
    theme.save()
    return theme.name


@frappe.whitelist()
def delete_theme(name):
    """Delete a theme."""
    frappe.delete_doc("Theme", name)
    return {"success": True}
