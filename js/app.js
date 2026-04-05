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
    const navAts = document.getElementById('nav-ats');
    const atsPage = document.getElementById('ats-page');

    function resetAtsPage() {
        const btnRemove = document.getElementById('btn-remove-file');
        if (btnRemove) btnRemove.click();
        const jdInput = document.getElementById('ats-jd-input');
        if (jdInput) jdInput.value = '';
    }

    function navigateToDashboard() {
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
    });
    
    document.getElementById('nav-features').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('section-features').scrollIntoView({ behavior: 'smooth' });
    });
    
    document.getElementById('btn-hero-templates').addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('section-templates').scrollIntoView({ behavior: 'smooth' });
    });


    // Share link trigger
    if(document.getElementById('btn-share')) {
        document.getElementById('btn-share').addEventListener('click', () => {
            alert('Shareable link generated! (Mocked)');
        });
    }
});
