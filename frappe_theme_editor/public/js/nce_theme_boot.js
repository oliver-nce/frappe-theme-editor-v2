document.addEventListener("DOMContentLoaded", function () {
    if (frappe.boot && frappe.boot.theme_css) {
        const existing = document.getElementById("nce-theme-override");
        if (existing) {
            existing.textContent = frappe.boot.theme_css;
        } else {
            const style = document.createElement("style");
            style.id = "nce-theme-override";
            style.textContent = frappe.boot.theme_css;
            document.head.appendChild(style);
        }
    }
});
