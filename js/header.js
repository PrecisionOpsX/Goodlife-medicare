(function() {
    const headerWrapper = document.querySelector('.header-wrapper');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navContainer = document.querySelector('.nav-container');
    const navLinks = document.querySelectorAll('.nav-link-item');
    const topLevelDropdowns = document.querySelectorAll('.nav-links > .nav-item-dropdown');
    const dropdownItems = document.querySelectorAll('.dropdown-item-has-children');

    // Create overlay for mobile
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }

    // Mobile menu toggle
    function toggleMobileMenu() {
        navContainer.classList.toggle('is-open');
        overlay.classList.toggle('is-visible');
        document.body.style.overflow = navContainer.classList.contains('is-open') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        navContainer.classList.remove('is-open');
        overlay.classList.remove('is-visible');
        document.body.style.overflow = '';
        topLevelDropdowns.forEach(d => d.classList.remove('is-open'));
        dropdownItems.forEach(item => item.classList.remove('is-open'));
    }

    mobileMenuBtn?.addEventListener('click', toggleMobileMenu);
    overlay.addEventListener('click', closeMobileMenu);

    // Close button in mobile menu
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    mobileMenuClose?.addEventListener('click', closeMobileMenu);

    // Close other top-level dropdowns (Conditions vs Services) and all sub-items except one
    function closeOtherDropdowns(exceptTopLevel, exceptSubItem) {
        topLevelDropdowns.forEach(d => {
            if (d !== exceptTopLevel) d.classList.remove('is-open');
        });
        dropdownItems.forEach(item => {
            if (item !== exceptSubItem) item.classList.remove('is-open');
        });
    }

    // Top-level dropdown toggle (Conditions & Services) on mobile – only one open at a time
    topLevelDropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector(':scope > a.nav-link-with-arrow');
        if (!trigger) return;
        trigger.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const wasOpen = dropdown.classList.contains('is-open');
                closeOtherDropdowns(null, null);
                if (!wasOpen) dropdown.classList.add('is-open');
            }
        });
    });

    // Sub-dropdown toggle on mobile (accordion: one service sub open at a time, and don’t close parent)
    dropdownItems.forEach(item => {
        if (!item.querySelector(':scope > .dropdown-submenu')) return;
        const link = item.querySelector(':scope > a');
        if (!link) return;
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                const parentDropdown = item.closest('.nav-item-dropdown');
                if (!parentDropdown) return;
                e.preventDefault();
                const wasOpen = item.classList.contains('is-open');
                closeOtherDropdowns(parentDropdown, item);
                if (!wasOpen) item.classList.add('is-open');
                else item.classList.remove('is-open');
            }
        });
    });

    // Close menu when clicking a regular nav link (not dropdown)
    navLinks.forEach(link => {
        if (!link.classList.contains('nav-link-with-arrow')) {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    closeMobileMenu();
                }
            });
        }
    });

    // Close menu on resize if switching to desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Sticky header: shadow only when scrolled away from top
    function updateHeaderScrollShadow() {
        if (!headerWrapper) return;
        headerWrapper.classList.toggle(
            'header-wrapper--scrolled',
            window.scrollY > 0
        );
    }
    window.addEventListener('scroll', updateHeaderScrollShadow, { passive: true });
    updateHeaderScrollShadow();

    // Services mega-menu tabs (desktop only — mobile uses original nested menu)
    document.querySelectorAll('.nav-item-dropdown--services').forEach((servicesDropdown) => {
        const tabs = servicesDropdown.querySelectorAll('[data-services-tab]');
        const panels = servicesDropdown.querySelectorAll('[data-services-panel]');
        if (!tabs.length || !panels.length) return;

        function activateServicesTab(tabId) {
            tabs.forEach((tab) => {
                const isActive = tab.dataset.servicesTab === tabId;
                tab.classList.toggle('is-active', isActive);
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });

            panels.forEach((panel) => {
                const isActive = panel.dataset.servicesPanel === tabId;
                panel.classList.toggle('is-active', isActive);
                panel.hidden = !isActive;
            });
        }

        tabs.forEach((tab) => {
            tab.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) return;
                e.preventDefault();
                e.stopPropagation();
                activateServicesTab(tab.dataset.servicesTab);
            });
        });
    });
})();
