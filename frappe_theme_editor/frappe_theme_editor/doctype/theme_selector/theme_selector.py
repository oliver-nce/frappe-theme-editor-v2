# Copyright (c) 2026, NCE and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document


class ThemeSelector(Document):
    pass


@frappe.whitelist()
def apply_theme(theme_name):
    """
    Set the active theme. The boot hook reads this on every page load
    and injects the theme JSON for client-side setProperty() application.
    """
    frappe.only_for("System Manager")

    if not theme_name:
        frappe.throw("Please select a theme first.")

    if not frappe.db.exists("Theme", theme_name):
        frappe.throw(f"Theme '{theme_name}' does not exist.")

    selector = frappe.get_single("Theme Selector")
    selector.active_theme = theme_name
    selector.theme_status = f"Active: {theme_name}"
    selector.save(ignore_permissions=True)

    frappe.clear_cache()

    frappe.msgprint(
        f"Theme '{theme_name}' applied. Reload the page to see changes.",
        title="Theme Applied",
        indicator="green"
    )

    return {"status": "ok", "theme": theme_name}


@frappe.whitelist()
def revert_to_default():
    """Clear the active theme and restore default Frappe styling."""
    frappe.only_for("System Manager")

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
    """Return the theme's JSON data for client-side preview."""
    frappe.only_for("System Manager")

    if not theme_name:
        return {"json_data": ""}

    theme_doc = frappe.get_doc("Theme", theme_name)
    return {"json_data": theme_doc.json_data or ""}
