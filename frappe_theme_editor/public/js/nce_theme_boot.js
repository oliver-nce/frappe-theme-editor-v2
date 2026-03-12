(function () {
    "use strict";

    function applyTheme() {
        if (!frappe.boot || !frappe.boot.theme_data) return;

        var theme;
        try {
            theme = JSON.parse(frappe.boot.theme_data);
        } catch (e) {
            console.warn("NCE Theme: failed to parse theme_data", e);
            return;
        }

        var mode = document.documentElement.getAttribute("data-theme") || "light";
        var themeSet = mode === "dark" ? theme.darkTheme : theme.lightTheme;
        if (!themeSet || !themeSet.cssVariables) return;

        var root = document.documentElement;
        Object.keys(themeSet.cssVariables).forEach(function (key) {
            root.style.setProperty(key, themeSet.cssVariables[key], "important");
        });
    }

    function clearThemeProperties() {
        if (!frappe.boot || !frappe.boot.theme_data) return;

        var theme;
        try {
            theme = JSON.parse(frappe.boot.theme_data);
        } catch (e) {
            return;
        }

        var root = document.documentElement;
        ["lightTheme", "darkTheme"].forEach(function (key) {
            if (theme[key] && theme[key].cssVariables) {
                Object.keys(theme[key].cssVariables).forEach(function (prop) {
                    root.style.removeProperty(prop);
                });
            }
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        applyTheme();

        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.attributeName === "data-theme") {
                    clearThemeProperties();
                    applyTheme();
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"]
        });
    });
})();
