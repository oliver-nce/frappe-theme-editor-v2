# Copyright (c) 2026, NCE and contributors
# For license information, please see license.txt

import frappe


def reapply_theme_after_migrate():
    """
    Called after bench migrate. Clears cache so any future
    theme application hooks pick up the latest state.
    """
    try:
        if not frappe.db.exists("DocType", "Theme Selector"):
            return

        selector = frappe.get_single("Theme Selector")
        if selector.active_theme:
            frappe.clear_cache()
    except Exception:
        pass
