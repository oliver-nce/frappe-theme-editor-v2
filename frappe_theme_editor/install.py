# Copyright (c) 2024, NCE and contributors
# For license information, please see license.txt


def after_install():
	"""Sync desktop icons so Theme Editor appears in sidebar."""
	import frappe
	from frappe.desk.doctype.desktop_icon.desktop_icon import sync_desktop_icons

	sync_desktop_icons()
	frappe.db.commit()
