// app.js
document.addEventListener('DOMContentLoaded', () => {
    
    // --- Dark Mode Toggle ---
    const darkModeBtn = document.getElementById('dark-mode-toggle');
    const body = document.body;
    const icon = darkModeBtn.querySelector('i');
    
    const isDark = localStorage.getItem('theme') === 'dark';
    if (isDark) {
        body.classList.replace('light', 'dark');
        icon.classList.replace('ph-moon', 'ph-sun');
    }

    darkModeBtn.addEventListener('click', () => {
        if (body.classList.contains('light')) {
            body.classList.replace('light', 'dark');
            icon.classList.replace('ph-moon', 'ph-sun');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.replace('dark', 'light');
            icon.classList.replace('ph-sun', 'ph-moon');
            localStorage.setItem('theme', 'light');
        }
    });

    // --- Navigation (Landing vs Dashboard) ---
    const appContainer = document.getElementById('app-container');
    const landingPage = document.getElementById('landing-page');
    const dashboardPage = document.getElementById('dashboard-page');
    
    const btnNavCreate = document.getElementById('btn-nav-create');
    const btnHeroCreate = document.getElementById('btn-hero-create');
    const logo = document.querySelector('.logo');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navAts = document.getElementById('nav-ats');
    const atsPage = document.getElementById('ats-page');

    function closeMobileMenu() {
        if (!navbar || !mobileMenuToggle) return;
        navbar.classList.remove('mobile-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }

    if (mobileMenuToggle && navbar) {
        mobileMenuToggle.addEventListener('click', () => {
            const willOpen = !navbar.classList.contains('mobile-open');
            navbar.classList.toggle('mobile-open', willOpen);
            mobileMenuToggle.setAttribute('aria-expanded', String(willOpen));
        });
    }

    function resetAtsPage() {
        const btnRemove = document.getElementById('btn-remove-file');
        if (btnRemove) btnRemove.click();
        const jdInput = document.getElementById('ats-jd-input');
        if (jdInput) jdInput.value = '';
    }

    function navigateToDashboard() {
        closeMobileMenu();
        landingPage.classList.remove('view-active');
        landingPage.classList.add('view-hidden');
        if(atsPage && atsPage.classList.contains('view-active')) {
            atsPage.classList.remove('view-active');
            atsPage.classList.add('view-hidden');
            resetAtsPage();
        } else if (atsPage) {
            atsPage.classList.remove('view-active');
            atsPage.classList.add('view-hidden');
        }
        dashboardPage.classList.remove('view-hidden');
        dashboardPage.classList.add('view-active');
        
        // Hide some nav links in dashboard mode
        const linksToHide = Array.from(navLinks.querySelectorAll('a'));
        linksToHide.forEach(link => link.style.display = 'none');
        btnNavCreate.style.display = 'none';
        
        // Trigger initial render of dashboard
        if(window.renderPreview) {
            window.renderPreview();
        }
        window.scrollTo(0,0);
    }

    function navigateToLanding() {
        closeMobileMenu();
        dashboardPage.classList.remove('view-active');
        dashboardPage.classList.add('view-hidden');
        if(atsPage && atsPage.classList.contains('view-active')) {
            atsPage.classList.remove('view-active');
            atsPage.classList.add('view-hidden');
            resetAtsPage();
        } else if (atsPage) {
            atsPage.classList.remove('view-active');
            atsPage.classList.add('view-hidden');
        }
        landingPage.classList.remove('view-hidden');
        landingPage.classList.add('view-active');
        
        // Restore nav links
        const linksToHide = Array.from(navLinks.querySelectorAll('a'));
        linksToHide.forEach(link => link.style.display = 'inline-block');
        btnNavCreate.style.display = 'inline-flex';
        
        window.scrollTo(0,0);
    }

    function navigateToAts(e) {
        closeMobileMenu();
        if(e) e.preventDefault();
        landingPage.classList.remove('view-active');
        landingPage.classList.add('view-hidden');
        dashboardPage.classList.remove('view-active');
        dashboardPage.classList.add('view-hidden');
        
        if(atsPage) {
            atsPage.classList.remove('view-hidden');
            atsPage.classList.add('view-active');
        }
        
        // Hide some nav links
        const linksToHide = Array.from(navLinks.querySelectorAll('a'));
        linksToHide.forEach(link => link.style.display = 'none');
        btnNavCreate.style.display = 'inline-flex'; // Keep create button to exit
        
        window.scrollTo(0, 0);
    }

    btnNavCreate.addEventListener('click', navigateToDashboard);
    btnHeroCreate.addEventListener('click', navigateToDashboard);
    if(navAts) navAts.addEventListener('click', navigateToAts);
    logo.addEventListener('click', navigateToLanding);

    // Smooth scroll for nav links
    document.getElementById('nav-templates').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('section-templates').scrollIntoView({ behavior: 'smooth' });
        closeMobileMenu();
    });
    
    document.getElementById('nav-features').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('section-features').scrollIntoView({ behavior: 'smooth' });
        closeMobileMenu();
    });
    
    document.getElementById('btn-hero-templates').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('section-templates').scrollIntoView({ behavior: 'smooth' });
        closeMobileMenu();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
            // Close the mobile overlay if user resizes to desktop
            if (previewOverlay && previewOverlay.classList.contains('overlay-active')) {
                _closeOverlay();
            }
        }
    });

    // ─────────────────────────────────────────
    //  MOBILE PREVIEW OVERLAY
    // ─────────────────────────────────────────
    const previewOverlay   = document.getElementById('preview-overlay');
    const tabEdit          = document.getElementById('tab-edit');
    const tabPreview       = document.getElementById('tab-preview');
    const btnCloseOverlay  = document.getElementById('btn-close-overlay');
    const btnFitToggle     = document.getElementById('btn-fit-toggle');
    const btnOverlayDL     = document.getElementById('btn-overlay-download');
    const overlayBody      = document.getElementById('overlay-body');

    // Compute + apply the scale so the A4 resume fills the overlay body width
    function _applyOverlayScale() {
        const wrapper   = document.getElementById('resume-wrapper-overlay');
        const container = document.getElementById('resume-scale-container');
        if (!wrapper || !container || !overlayBody) return;

        const A4_W = 794;   // 210 mm @ 96 dpi
        const A4_H = 2246;  // 2 × 297 mm @ 96 dpi (front + back of one sheet)

        // Available width inside overlay body (subtract padding)
        const avail = overlayBody.clientWidth - 32;
        const scale = Math.min(1, avail / A4_W);

        wrapper.style.transform       = `scale(${scale})`;
        wrapper.style.transformOrigin = 'top left';

        // Shrink the container so it doesn't leave blank space below scaled content
        container.style.width  = Math.round(A4_W * scale) + 'px';
        container.style.height = Math.round(A4_H * scale) + 'px';
        container.style.overflow = 'hidden';
    }

    function _openOverlay() {
        if (!previewOverlay) return;
        // Refresh content before showing
        if (window.renderPreview) window.renderPreview();
        previewOverlay.classList.add('overlay-active');
        document.body.style.overflow = 'hidden';
        if (tabPreview) tabPreview.classList.add('active');
        if (tabEdit)    tabEdit.classList.remove('active');
        // Apply scale after the overlay is visible so clientWidth is available
        requestAnimationFrame(_applyOverlayScale);
    }

    function _closeOverlay() {
        if (!previewOverlay) return;
        previewOverlay.classList.remove('overlay-active');
        document.body.style.overflow = '';
        if (tabEdit)    tabEdit.classList.add('active');
        if (tabPreview) tabPreview.classList.remove('active');
        // Reset fit mode
        if (overlayBody) overlayBody.classList.remove('fit-width');
        _fitActive = false;
        if (btnFitToggle) {
            btnFitToggle.classList.remove('active');
            btnFitToggle.innerHTML = '<i class="ph ph-arrows-horizontal"></i> Fit';
        }
    }

    if (tabEdit)   tabEdit.addEventListener('click',  _closeOverlay);
    if (tabPreview) tabPreview.addEventListener('click', _openOverlay);
    if (btnCloseOverlay) btnCloseOverlay.addEventListener('click', _closeOverlay);

    // Recompute scale on window resize while overlay is open
    window.addEventListener('resize', () => {
        if (previewOverlay && previewOverlay.classList.contains('overlay-active') && !_fitActive) {
            _applyOverlayScale();
        }
    });

    // ─────────────────────────────────────────
    //  FIT-TO-WIDTH TOGGLE
    // ─────────────────────────────────────────
    let _fitActive = false;

    if (btnFitToggle && overlayBody) {
        btnFitToggle.addEventListener('click', () => {
            _fitActive = !_fitActive;
            overlayBody.classList.toggle('fit-width', _fitActive);
            btnFitToggle.classList.toggle('active', _fitActive);
            btnFitToggle.innerHTML = _fitActive
                ? '<i class="ph ph-arrows-in-simple"></i> Zoom'
                : '<i class="ph ph-arrows-horizontal"></i> Fit';

            if (!_fitActive) {
                // restore scale-based view
                const wrapper   = document.getElementById('resume-wrapper-overlay');
                const container = document.getElementById('resume-scale-container');
                if (wrapper)   { wrapper.style.transform = ''; wrapper.style.width = ''; }
                if (container) { container.style.width = ''; container.style.height = ''; container.style.overflow = ''; }
                _applyOverlayScale();
            }
        });
    }

    // ─────────────────────────────────────────
    //  OVERLAY PDF BUTTON — reuse main export
    // ─────────────────────────────────────────
    if (btnOverlayDL) {
        btnOverlayDL.addEventListener('click', () => {
            const mainExport = document.getElementById('btn-export-pdf');
            if (mainExport) mainExport.click();
        });
    }

    // ─────────────────────────────────────────
    //  DESKTOP EDIT / PREVIEW MODE TOGGLE
    // ─────────────────────────────────────────
    const previewModeToggle  = document.getElementById('preview-mode-toggle');
    const dashboardPageEl    = document.getElementById('dashboard-page');

    if (previewModeToggle && dashboardPageEl) {
        previewModeToggle.addEventListener('change', (e) => {
            dashboardPageEl.classList.toggle('preview-mode', e.target.checked);
            // Refresh preview when entering full preview mode
            if (e.target.checked && window.renderPreview) {
                window.renderPreview();
            }
        });
    }

    // ─────────────────────────────────────────
    //  LIVE ATS SCORE CHECKER (Bypass PDF)
    // ─────────────────────────────────────────
    const btnCheckATS = document.getElementById('btn-check-ats');
    const tabATS = document.getElementById('tab-ats');
    const btnOverlayATS = document.getElementById('btn-overlay-ats');

    function triggerLiveATSCheck() {
        if (!window.getResumeText || !window.analyzeTextForATS) {
            alert("ATS checker is currently unavailable.");
            return;
        }
        
        // Navigate to the ATS page
        if (typeof navigateToAts === 'function') {
            navigateToAts();
        }
        
        // Close overlay if open
        _closeOverlay();

        // Get plain text and run analysis
        const plainText = window.getResumeText();
        window.analyzeTextForATS(plainText);
    }

    if (btnCheckATS) btnCheckATS.addEventListener('click', triggerLiveATSCheck);
    if (tabATS) tabATS.addEventListener('click', triggerLiveATSCheck);
    if (btnOverlayATS) btnOverlayATS.addEventListener('click', triggerLiveATSCheck);

});
