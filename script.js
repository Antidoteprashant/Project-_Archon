document.addEventListener("DOMContentLoaded", () => {
    // ── Safe-guard Auth Overlay ───────────────────────────────────
    const overlay = document.querySelector(".overlay");
    const authContainer = document.querySelector(".auth-container");

    if (overlay) {
        overlay.addEventListener("click", () => {
            overlay.classList.add("hidden");
            window.location.href = "index.html";
        });
    }

    if (authContainer) {
        authContainer.addEventListener("click", (event) => {
            event.stopPropagation();
        });
    }

    // ── Theme Management ──────────────────────────────────────────
    const getTheme = () => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) return savedTheme;
        
        // System preference fallback
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return systemPrefersDark ? "dark" : "light";
    };

    const applyTheme = (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    };

    // Initialize theme state immediately on DOM ready
    const currentTheme = getTheme();
    applyTheme(currentTheme);

    // ── Inject Theme Toggle Button ────────────────────────────────
    const createToggleBtn = (isDashboard = false, isAuth = false) => {
        const btn = document.createElement("button");
        btn.setAttribute("aria-label", "Toggle theme");
        
        if (isDashboard) {
            btn.className = "dash-topbar__icon-btn theme-toggle";
        } else if (isAuth) {
            btn.className = "theme-toggle";
            btn.style.position = "fixed";
            btn.style.top = "var(--space-6, 24px)";
            btn.style.right = "var(--space-6, 24px)";
            btn.style.zIndex = "999";
        } else {
            btn.className = "theme-toggle";
        }

        const initialTheme = document.documentElement.getAttribute("data-theme") || "dark";
        btn.innerHTML = initialTheme === "light" 
            ? '<i class="fa-solid fa-sun"></i>' 
            : '<i class="fa-solid fa-moon"></i>';

        btn.addEventListener("click", () => {
            if (btn.classList.contains("spinning")) return;
            
            const nextTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
            
            // Premium micro-interaction animation
            btn.classList.add("spinning");
            
            setTimeout(() => {
                applyTheme(nextTheme);
                // Synchronize all toggle buttons on the page (desktop, mobile menu, dashboard, etc.)
                document.querySelectorAll(".theme-toggle").forEach(t => {
                    const icon = t.querySelector("i");
                    if (icon) {
                        icon.className = nextTheme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
                    }
                });
            }, 150);

            setTimeout(() => {
                btn.classList.remove("spinning");
            }, 400);
        });

        return btn;
    };

    // Find mount points
    const navActions = document.querySelector(".nav__actions");
    const dashTopbarRight = document.querySelector(".dash-topbar__right");
    const isAuthPage = document.body.classList.contains("auth-page") || !!document.querySelector(".auth-container");

    if (navActions) {
        const toggle = createToggleBtn(false, false);
        // Prepend toggle to navigation actions (desktop & mobile menu toggle helper)
        navActions.insertBefore(toggle, navActions.firstChild);
    } else if (dashTopbarRight) {
        const toggle = createToggleBtn(true, false);
        dashTopbarRight.insertBefore(toggle, dashTopbarRight.firstChild);
    } else if (isAuthPage) {
        const toggle = createToggleBtn(false, true);
        document.body.appendChild(toggle);
    }
});