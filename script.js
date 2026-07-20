document.addEventListener('DOMContentLoaded', () => {
    const portfolioWindow = document.getElementById('portfolio-window');
    const titleBar = document.getElementById('window-titlebar');
    const titleText = document.getElementById('window-title-text');
    const desktopBg = document.querySelector('.desktop');
    
    // Window Controls
    const closeBtn = document.getElementById('window-close');
    const minimizeBtn = document.getElementById('window-minimize');
    const maximizeBtn = document.getElementById('window-maximize');
    
    // Theme Switcher
    const headerThemeToggle = document.getElementById('header-theme-toggle');
    
    // Tabs
    const sidebarItems = document.querySelectorAll('.sidebar-item[data-tab]');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    // Internal Bio
    const bioProjectsLink = document.getElementById('link-to-projects');
    const dialogOverlay = document.getElementById('dialog-overlay');
    const dialogTitle = document.getElementById('dialog-title');
    const dialogMessage = document.getElementById('dialog-message');
    const dialogPrimaryBtn = document.getElementById('dialog-primary-btn');
    const dialogSecondaryBtn = document.getElementById('dialog-secondary-btn');
    let isDragging = false;
    let startX, startY;

    function centerWindow() {
        if (window.innerWidth > 768 && !portfolioWindow.classList.contains('maximized')) {
            const rect = portfolioWindow.getBoundingClientRect();
            const left = (window.innerWidth - rect.width) / 2;
            const top = (window.innerHeight - rect.height) / 2;
            portfolioWindow.style.left = `${left}px`;
            portfolioWindow.style.top = `${top}px`;
            portfolioWindow.style.transform = 'none';
            portfolioWindow.style.margin = '0';
        }
    }
    
    setTimeout(() => {
        centerWindow();
        switchTab('about');
    }, 100);
    window.addEventListener('resize', centerWindow);

    titleBar.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    titleBar.addEventListener('touchstart', dragStart, { passive: true });
    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', dragEnd);

    function dragStart(e) {
        if (portfolioWindow.classList.contains('maximized')) return;
        
        portfolioWindow.classList.add('active');
        
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        
        isDragging = true;
        
        const styleLeft = parseInt(portfolioWindow.style.left) || 0;
        const styleTop = parseInt(portfolioWindow.style.top) || 0;
        
        startX = clientX - styleLeft;
        startY = clientY - styleTop;
    }

    function drag(e) {
        if (!isDragging) return;
        
        if (e.type === 'touchmove') {
            e.preventDefault();
        }
        
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        
        let newX = clientX - startX;
        let newY = clientY - startY;
        
        // Boundaries contrast
        const minVisible = 100;
        const maxLeft = window.innerWidth - minVisible;
        const minLeft = -portfolioWindow.offsetWidth + minVisible;
        const maxTop = window.innerHeight - 50;
        const minTop = 0;
        
        if (newX < minLeft) newX = minLeft;
        if (newX > maxLeft) newX = maxLeft;
        if (newY < minTop) newY = minTop;
        if (newY > maxTop) newY = maxTop;
        
        portfolioWindow.style.left = `${newX}px`;
        portfolioWindow.style.top = `${newY}px`;
    }

    function dragEnd() {
        isDragging = false;
    }

    portfolioWindow.addEventListener('click', (e) => {
        e.stopPropagation();
        portfolioWindow.classList.add('active');
    });

    desktopBg.addEventListener('click', (e) => {
        if (e.target === desktopBg || e.target.classList.contains('blob') || e.target.closest('#touch-grass-view')) {
            if (portfolioWindow.classList.contains('minimized') || !portfolioWindow.classList.contains('active')) {
                portfolioWindow.classList.remove('minimized');
                portfolioWindow.classList.add('active');
                
                const touchGrassView = document.getElementById('touch-grass-view');
                if (touchGrassView) {
                    touchGrassView.classList.remove('visible');
                }
                
                setTimeout(centerWindow, 50);
            } else {
                portfolioWindow.classList.remove('active');
            }
        }
    });

    // Sidebar
    const tabTitles = {
        about: '@whooslizi',
        projects: '@whooslizi',
        socials: '@whooslizi'
    };

    function switchTab(tabId) {
        sidebarItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        tabPanes.forEach(pane => {
            if (pane.id === `tab-${tabId}`) {
                pane.classList.add('active');
            } else {
                pane.classList.remove('active');
            }
        });

        titleText.textContent = tabTitles[tabId] || 'Portfolio';
        
        portfolioWindow.classList.remove('minimized');
        portfolioWindow.classList.add('active');

        const touchGrassView = document.getElementById('touch-grass-view');
        if (touchGrassView) {
            touchGrassView.classList.remove('visible');
        }
    }

    sidebarItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    if (bioProjectsLink) {
        bioProjectsLink.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            switchTab('projects');
        });
    }
    
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showJokeDialog();
    });

    minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        portfolioWindow.classList.add('minimized');
        portfolioWindow.classList.remove('active');
        
        const touchGrassView = document.getElementById('touch-grass-view');
        if (touchGrassView) {
            touchGrassView.classList.add('visible');
        }
    });

    maximizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        portfolioWindow.classList.toggle('maximized');
        portfolioWindow.classList.add('active');
        if (!portfolioWindow.classList.contains('maximized')) {
            centerWindow();
        }
    });

    function showJokeDialog() {
        dialogTitle.textContent = 'Portal Lock Error';
        dialogMessage.textContent = "You can't close it for now. The weeb division of our tech department has locked this portal. Please seek help (or touch grass).";
        dialogPrimaryBtn.textContent = 'Touch Grass';
        dialogSecondaryBtn.textContent = 'Cancel';
        dialogOverlay.classList.add('open');
    }

    dialogPrimaryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dialogOverlay.classList.remove('open');
        window.open('https://www.google.com/search?q=how+to+touch+grass&tbm=isch', '_blank');
    });

    dialogSecondaryBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dialogOverlay.classList.remove('open');
    });

    dialogOverlay.addEventListener('click', (e) => {
        if (e.target === dialogOverlay) {
            dialogOverlay.classList.remove('open');
        }
    });

    function toggleTheme() {
        if (document.body.classList.contains('light-theme')) {
            // Dark toggle
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            headerThemeToggle.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon-svg">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
            `;
        } else {
            // Light toggle
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            headerThemeToggle.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="theme-icon-svg">
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
            `;
        }
    }

    headerThemeToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleTheme();
    });
});
