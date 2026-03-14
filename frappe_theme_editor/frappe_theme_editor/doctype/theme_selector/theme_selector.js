// Copyright (c) 2026, NCE and contributors
// For license information, please see license.txt

frappe.ui.form.on("Theme Selector", {
    refresh(frm) {
        frm.fields_dict.apply_theme.$input
            && frm.fields_dict.apply_theme.$input.addClass("btn-primary");
        frm.fields_dict.revert_to_default.$input
            && frm.fields_dict.revert_to_default.$input.addClass("btn-danger");
    },

    apply_theme(frm) {
        if (!frm.doc.active_theme) {
            frappe.msgprint("Please select a theme first.", "No Theme Selected");
            return;
        }

        frappe.confirm(
            `Apply theme <strong>${frm.doc.active_theme}</strong> to this site?`,
            () => {
                frappe.call({
                    method: "frappe_theme_editor.frappe_theme_editor.doctype.theme_selector.theme_selector.apply_theme",
                    args: { theme_name: frm.doc.active_theme },
                    freeze: true,
                    freeze_message: "Applying theme...",
                    callback(r) {
                        if (r.message && r.message.status === "ok") {
                            frm.reload_doc();
                        }
                    }
                });
            }
        );
    },

    revert_to_default(frm) {
        frappe.confirm(
            "Revert to the default Frappe theme?",
            () => {
                frappe.call({
                    method: "frappe_theme_editor.frappe_theme_editor.doctype.theme_selector.theme_selector.revert_to_default",
                    freeze: true,
                    freeze_message: "Reverting to default...",
                    callback(r) {
                        if (r.message && r.message.status === "ok") {
                            frm.reload_doc();
                        }
                    }
                });
            }
        );
    }
});
