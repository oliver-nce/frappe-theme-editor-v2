# Copyright (c) 2026, NCE and contributors
# For license information, please see license.txt

import frappe


def boot_session(bootinfo):
    """
    Called on every page load via extend_bootinfo.
    Reads the active theme's JSON from the Theme Selector singleton
    and injects it into bootinfo so nce_theme_boot.js can apply it
    via setProperty().
    """
    try:
        if not frappe.db.exists("DocType", "Theme Selector"):
            return

        selector = frappe.get_single("Theme Selector")
        if not selector.active_theme:
            return

        theme_doc = frappe.get_doc("Theme", selector.active_theme)
        if theme_doc.json_data:
            bootinfo.theme_data = theme_doc.json_data
    except Exception:
        pass


def reapply_theme_after_migrate():
    """
    Called after bench migrate. Clears cache so the boot hook
    re-reads the active theme on the next page load.
    """
    try:
        if not frappe.db.exists("DocType", "Theme Selector"):
            return

        selector = frappe.get_single("Theme Selector")
        if selector.active_theme:
            frappe.clear_cache()
            frappe.logger().info(
                f"NCE Theme cache cleared after migrate (active: {selector.active_theme})"
            )
    except Exception as e:
        frappe.logger().error(f"NCE Theme post-migrate cache clear failed: {e}")
