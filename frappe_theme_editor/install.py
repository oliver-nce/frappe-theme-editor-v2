# Copyright (c) 2026, NCE and contributors
# For license information, please see license.txt

import json
import os
import frappe


def after_install():
    """Load the default V2 theme and sync desktop icons."""
    _load_default_theme()
    _sync_icons()


def _load_default_theme():
    """Create the default theme from default-theme.json if no themes exist."""
    if frappe.db.count("Theme") > 0:
        return

    theme_path = os.path.join(
        frappe.get_app_path("frappe_theme_editor"),
        "themes",
        "default-theme.json"
    )

    if not os.path.exists(theme_path):
        return

    with open(theme_path, "r") as f:
        theme_data = json.load(f)

    theme = frappe.get_doc({
        "doctype": "Theme",
        "theme_name": theme_data.get("$name", "NCE Default"),
        "description": theme_data.get("$description", "Default NCE theme"),
        "is_default": 1,
        "json_data": json.dumps(theme_data)
    })
    theme.insert(ignore_permissions=True)
    frappe.db.commit()

    frappe.logger().info("NCE Theme: loaded default V2 theme")


def _sync_icons():
    """Sync desktop icons so Theme Editor appears in sidebar."""
    try:
        from frappe.desk.doctype.desktop_icon.desktop_icon import sync_desktop_icons
        sync_desktop_icons()
        frappe.db.commit()
    except Exception:
        pass
