/**
 * Enhanced Theme Manager สำหรับ Military Portfolio Website
 * รองรับ Dark/Light Mode Toggle พร้อม Military Theme
 * แก้ไขปัญหาปุ่มหายและเด้งตำแหน่ง
 */

class ThemeManager {
    constructor() {
        // Theme configurations
        this.themes = {
            light: {
                'primary-dark': '#2c3e50',
                'primary-light': '#34495e',
                'text-primary': '#2c3e50',
                'text-secondary': '#6c757d',
                'text-light': '#2c3e50',
                'text-muted': '#6c757d',
                'bg-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'bg-card': 'rgba(255, 255, 255, 0.95)',
                'bg-section': 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
                'glass-bg': 'rgba(255, 255, 255, 0.15)',
                'glass-border': 'rgba(255, 255, 255, 0.25)',
                'shadow-soft': '0 8px 32px rgba(0, 0, 0, 0.12)',
                'shadow-medium': '0 12px 48px rgba(0, 0, 0, 0.18)',
                'shadow-strong': '0 20px 60px rgba(0, 0, 0, 0.25)'
            },
            dark: {
                'primary-dark': '#1a202c',
                'primary-light': '#2d3748',
                'text-primary': '#f7fafc',
                'text-secondary': '#cbd5e0',
                'text-light': '#f7fafc',
                'text-muted': 'rgba(255, 255, 255, 0.7)',
                'bg-primary': 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
                'bg-card': 'rgba(26, 32, 44, 0.95)',
                'bg-section': 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
                'glass-bg': 'rgba(255, 255, 255, 0.05)',
                'glass-border': 'rgba(255, 255, 255, 0.1)',
                'shadow-soft': '0 8px 32px rgba(0, 0, 0, 0.3)',
                'shadow-medium': '0 12px 48px rgba(0, 0, 0, 0.4)',
                'shadow-strong': '0 20px 60px rgba(0, 0, 0, 0.5)'
            }
        };

        // State management
        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.toggleButton = null;
        this.isInitialized = false;
        this.callbacks = new Set();
        this.buttonPosition = this.calculateButtonPosition();

        // Binding methods to preserve context
        this.handleSystemThemeChange = this.handleSystemThemeChange.bind(this);
        this.handleKeyboardShortcut = this.handleKeyboardShortcut.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.init();
    }

    /**
     * Calculate safe button position to avoid conflicts
     */
    calculateButtonPosition() {
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            return {
                top: '15px',
                right: '15px',
                width: '45px',
                height: '45px',
                fontSize: '18px',
                zIndex: '10001' // Higher than back-to-top (9999)
            };
        } else {
            return {
                top: '20px',
                right: '20px',
                width: '50px',
                height: '50px',
                fontSize: '20px',
                zIndex: '10001' // Higher than back-to-top (9999)
            };
        }
    }

    /**
     * Initialize Theme Manager
     */
    init() {
        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeTheme());
            } else {
                this.initializeTheme();
            }
        } catch (error) {
            console.error('Theme Manager initialization failed:', error);
            this.handleInitError(error);
        }
    }

    /**
     * Initialize theme after DOM is ready
     */
    initializeTheme() {
        try {
            this.setDefaultCSSVariables();
            this.applyTheme(this.currentTheme);

            // Delay button creation to ensure proper positioning
            setTimeout(() => {
                this.createThemeToggle();
            }, 100);

            this.setupSystemThemeListener();
            this.setupKeyboardShortcut();
            this.setupResizeListener();
            this.isInitialized = true;

            console.log(`Theme Manager initialized successfully with ${this.currentTheme} mode`);

            // Notify callbacks
            this.notifyCallbacks('initialized', this.currentTheme);
        } catch (error) {
            console.error('Theme initialization error:', error);
            this.handleInitError(error);
        }
    }

    /**
     * Set default CSS variables if they don't exist
     */
    setDefaultCSSVariables() {
        const root = document.documentElement;

        // Essential theme-independent variables
        const defaults = {
            '--text-accent': '#ffd700',
            '--military-gold': '#d4af37',
            '--bright-gold': '#ffd700',
            '--accent-gradient-start': '#667eea',
            '--accent-gradient-end': '#764ba2',
            '--gold-gradient': 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)',
            '--border-radius-sm': '12px',
            '--border-radius-md': '20px',
            '--border-radius-lg': '30px',
            '--space-xs': '0.5rem',
            '--space-sm': '1rem',
            '--space-md': '1.5rem',
            '--space-lg': '2rem',
            '--space-xl': '3rem',
            '--transition-fast': '0.2s ease',
            '--transition-medium': '0.3s ease',
            '--transition-slow': '0.5s ease'
        };

        Object.entries(defaults).forEach(([property, value]) => {
            if (!getComputedStyle(root).getPropertyValue(property)) {
                root.style.setProperty(property, value);
            }
        });
    }

    /**
     * Get stored theme from localStorage
     */
    getStoredTheme() {
        try {
            return localStorage.getItem('portfolio-theme');
        } catch (error) {
            console.warn('Cannot access localStorage:', error);
            return null;
        }
    }

    /**
     * Get system preferred theme
     */
    getSystemTheme() {
        try {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        } catch (error) {
            console.warn('Cannot detect system theme:', error);
            return 'light'; // Default fallback
        }
    }

    /**
     * Store theme preference
     */
    setStoredTheme(theme) {
        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch (error) {
            console.warn('Cannot save theme preference:', error);
        }
    }

    /**
     * Apply theme to the document
     */
    applyTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme '${themeName}' not found, falling back to light`);
            themeName = 'light';
        }

        const root = document.documentElement;
        const theme = this.themes[themeName];

        try {
            // Update CSS custom properties
            Object.entries(theme).forEach(([property, value]) => {
                root.style.setProperty(`--${property}`, value);
            });

            // Update body class
            document.body.className = document.body.className.replace(/theme-\w+/g, '');
            document.body.classList.add(`theme-${themeName}`);

            // Update meta theme color for mobile browsers
            this.updateMetaThemeColor(themeName);

            // Update current theme
            this.currentTheme = themeName;
            this.setStoredTheme(themeName);

            // Update toggle button if it exists
            if (this.toggleButton) {
                this.updateToggleButton();
            }

            // Notify callbacks
            this.notifyCallbacks('themeChanged', themeName);

        } catch (error) {
            console.error('Error applying theme:', error);
        }
    }

    /**
     * Update meta theme color for mobile browsers
     */
    updateMetaThemeColor(theme) {
        try {
            let metaTheme = document.querySelector('meta[name="theme-color"]');
            if (!metaTheme) {
                metaTheme = document.createElement('meta');
                metaTheme.name = 'theme-color';
                document.head.appendChild(metaTheme);
            }

            metaTheme.content = theme === 'dark' ? '#1a202c' : '#2c3e50';
        } catch (error) {
            console.warn('Cannot update meta theme color:', error);
        }
    }

    /**
     * Create theme toggle button with fixed positioning
     */
    createThemeToggle() {
        try {
            // Remove existing button if present
            const existingButton = document.querySelector('.theme-toggle');
            if (existingButton) {
                existingButton.remove();
            }

            // Update position for current screen size
            this.buttonPosition = this.calculateButtonPosition();

            // Create new toggle button
            this.toggleButton = document.createElement('button');
            this.toggleButton.className = 'theme-toggle';
            this.toggleButton.setAttribute('aria-label', 'Toggle dark/light mode');
            this.toggleButton.setAttribute('type', 'button');
            this.toggleButton.innerHTML = this.getToggleIcon();

            // Apply styles with explicit positioning
            this.applyToggleStyles();

            // Add event listeners
            this.toggleButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });

            this.toggleButton.addEventListener('mouseenter', this.handleToggleHover.bind(this));
            this.toggleButton.addEventListener('mouseleave', this.handleToggleLeave.bind(this));

            // Prevent any unwanted interactions
            this.toggleButton.addEventListener('touchstart', (e) => e.stopPropagation());
            this.toggleButton.addEventListener('touchend', (e) => e.stopPropagation());

            // Append to body with delay to ensure proper positioning
            document.body.appendChild(this.toggleButton);

            // Force reflow to ensure position is applied
            this.toggleButton.offsetHeight;

            console.log('Theme toggle button created successfully');
        } catch (error) {
            console.error('Error creating theme toggle:', error);
        }
    }

    /**
     * Apply styles to toggle button with strict positioning
     */
    applyToggleStyles() {
        if (!this.toggleButton) return;

        const pos = this.buttonPosition;

        // Apply styles with !important to prevent conflicts
        const styles = {
            position: 'fixed',
            top: pos.top,
            right: pos.right,
            left: 'auto', // Explicitly set left to auto
            bottom: 'auto', // Explicitly set bottom to auto
            width: pos.width,
            height: pos.height,
            zIndex: pos.zIndex,
            background: 'var(--glass-bg, rgba(255, 255, 255, 0.1))',
            border: '2px solid var(--glass-border, rgba(255, 255, 255, 0.2))',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: pos.fontSize,
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
            color: 'var(--text-light, #ffffff)',
            outline: 'none',
            userSelect: 'none',
            webkitUserSelect: 'none',
            msUserSelect: 'none',
            mozUserSelect: 'none'
        };

        // Apply all styles
        Object.entries(styles).forEach(([property, value]) => {
            this.toggleButton.style.setProperty(property, value, 'important');
        });

        // Add CSS class for additional styling
        this.toggleButton.style.cssText = `
            position: fixed !important;
            top: ${pos.top} !important;
            right: ${pos.right} !important;
            left: auto !important;
            bottom: auto !important;
            width: ${pos.width} !important;
            height: ${pos.height} !important;
            z-index: ${pos.zIndex} !important;
            background: var(--glass-bg, rgba(255, 255, 255, 0.1)) !important;
            border: 2px solid var(--glass-border, rgba(255, 255, 255, 0.2)) !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            font-size: ${pos.fontSize} !important;
            cursor: pointer !important;
            transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important;
            backdrop-filter: blur(10px) !important;
            color: var(--text-light, #ffffff) !important;
            outline: none !important;
            user-select: none !important;
            -webkit-user-select: none !important;
            -ms-user-select: none !important;
            -moz-user-select: none !important;
            transform: translate3d(0, 0, 0) !important;
        `;
    }

    /**
     * Handle toggle button hover
     */
    handleToggleHover() {
        if (this.toggleButton) {
            this.toggleButton.style.setProperty('transform', 'translate3d(0, 0, 0) scale(1.1)', 'important');
            this.toggleButton.style.setProperty('box-shadow', '0 6px 20px rgba(0,0,0,0.2)', 'important');
        }
    }

    /**
     * Handle toggle button leave
     */
    handleToggleLeave() {
        if (this.toggleButton) {
            this.toggleButton.style.setProperty('transform', 'translate3d(0, 0, 0) scale(1)', 'important');
            this.toggleButton.style.setProperty('box-shadow', '0 4px 15px rgba(0,0,0,0.1)', 'important');
        }
    }

    /**
     * Setup resize listener to maintain button position
     */
    setupResizeListener() {
        try {
            window.addEventListener('resize', this.handleResize);
            window.addEventListener('orientationchange', this.handleResize);
        } catch (error) {
            console.warn('Cannot setup resize listener:', error);
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            if (this.toggleButton) {
                this.buttonPosition = this.calculateButtonPosition();
                this.applyToggleStyles();
            }
        }, 100);
    }

    /**
     * Get appropriate icon for current theme
     */
    getToggleIcon() {
        return this.currentTheme === 'light' ? '🌙' : '☀️';
    }

    /**
     * Update toggle button appearance
     */
    updateToggleButton() {
        if (this.toggleButton) {
            this.toggleButton.innerHTML = this.getToggleIcon();
            this.toggleButton.setAttribute('aria-label',
                `Switch to ${this.currentTheme === 'light' ? 'dark' : 'light'} mode`
            );
        }
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        try {
            const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';

            // Add transition class
            document.body.classList.add('theme-transitioning');

            // Apply new theme
            this.applyTheme(newTheme);

            // Create ripple effect
            this.createRippleEffect();

            // Remove transition class after animation
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 300);

            console.log(`Theme switched to ${newTheme} mode`);

        } catch (error) {
            console.error('Error toggling theme:', error);
        }
    }

    /**
     * Create ripple effect on toggle
     */
    createRippleEffect() {
        if (!this.toggleButton) return;

        try {
            const ripple = document.createElement('div');
            ripple.className = 'theme-ripple-effect';
            ripple.style.cssText = `
                position: absolute !important;
                border-radius: 50% !important;
                background: var(--text-accent, #ffd700) !important;
                opacity: 0.6 !important;
                pointer-events: none !important;
                transform: scale(0) !important;
                animation: ripple-expand 0.6s ease-out !important;
                width: 100px !important;
                height: 100px !important;
                top: -25px !important;
                left: -25px !important;
                z-index: -1 !important;
            `;

            this.toggleButton.style.setProperty('position', 'fixed', 'important');
            this.toggleButton.style.setProperty('overflow', 'hidden', 'important');
            this.toggleButton.appendChild(ripple);

            setTimeout(() => {
                if (ripple && ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        } catch (error) {
            console.warn('Could not create ripple effect:', error);
        }
    }

    /**
     * Setup system theme change listener
     */
    setupSystemThemeListener() {
        try {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', this.handleSystemThemeChange);
        } catch (error) {
            console.warn('Cannot setup system theme listener:', error);
        }
    }

    /**
     * Handle system theme change
     */
    handleSystemThemeChange(e) {
        // Only auto-switch if user hasn't manually set a preference
        if (!this.getStoredTheme()) {
            const newTheme = e.matches ? 'dark' : 'light';
            this.applyTheme(newTheme);
        }
    }

    /**
     * Setup keyboard shortcut (Ctrl/Cmd + Shift + T)
     */
    setupKeyboardShortcut() {
        try {
            document.addEventListener('keydown', this.handleKeyboardShortcut);
        } catch (error) {
            console.warn('Cannot setup keyboard shortcut:', error);
        }
    }

    /**
     * Handle keyboard shortcut
     */
    handleKeyboardShortcut(e) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            this.toggleTheme();
        }
    }

    /**
     * Handle initialization errors
     */
    handleInitError(error) {
        console.error('Theme Manager failed to initialize:', error);

        // Apply fallback theme
        try {
            document.body.classList.add('theme-light');
            document.documentElement.style.setProperty('--text-light', '#ffffff');
            document.documentElement.style.setProperty('--text-accent', '#ffd700');
        } catch (fallbackError) {
            console.error('Even fallback theme failed:', fallbackError);
        }
    }

    /**
     * Add callback for theme changes
     */
    onThemeChange(callback) {
        if (typeof callback === 'function') {
            this.callbacks.add(callback);
        }
    }

    /**
     * Remove callback
     */
    offThemeChange(callback) {
        this.callbacks.delete(callback);
    }

    /**
     * Notify all callbacks
     */
    notifyCallbacks(event, theme) {
        this.callbacks.forEach(callback => {
            try {
                callback(event, theme);
            } catch (error) {
                console.warn('Theme callback error:', error);
            }
        });
    }

    // Public API methods

    /**
     * Programmatically set theme
     */
    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.applyTheme(themeName);
        } else {
            console.warn(`Invalid theme: ${themeName}`);
        }
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Check if theme manager is initialized
     */
    isReady() {
        return this.isInitialized;
    }

    /**
     * Force reposition button (useful for debugging)
     */
    repositionButton() {
        if (this.toggleButton) {
            this.buttonPosition = this.calculateButtonPosition();
            this.applyToggleStyles();
        }
    }

    /**
     * Destroy theme manager
     */
    destroy() {
        try {
            // Clear resize timeout
            clearTimeout(this.resizeTimeout);

            // Remove toggle button
            if (this.toggleButton && this.toggleButton.parentNode) {
                this.toggleButton.parentNode.removeChild(this.toggleButton);
            }

            // Remove event listeners
            document.removeEventListener('keydown', this.handleKeyboardShortcut);
            window.removeEventListener('resize', this.handleResize);
            window.removeEventListener('orientationchange', this.handleResize);

            // Clear callbacks
            this.callbacks.clear();

            console.log('Theme Manager destroyed');
        } catch (error) {
            console.error('Error destroying Theme Manager:', error);
        }
    }
}

// CSS animations for theme transitions
const createThemeStyles = () => {
    const styleId = 'theme-manager-styles';

    // Remove existing styles
    const existingStyles = document.getElementById(styleId);
    if (existingStyles) {
        existingStyles.remove();
    }

    const themeStyles = document.createElement('style');
    themeStyles.id = styleId;
    themeStyles.textContent = `
        /* Theme transition animation */
        .theme-transitioning * {
            transition: background-color 0.3s ease, 
                       color 0.3s ease, 
                       border-color 0.3s ease,
                       box-shadow 0.3s ease !important;
        }

        /* Ripple animation */
        @keyframes ripple-expand {
            to {
                transform: scale(1) !important;
                opacity: 0 !important;
            }
        }

        /* Force theme toggle positioning */
        .theme-toggle {
            position: fixed !important;
            z-index: 10001 !important;
        }

        /* Prevent theme toggle from being affected by other styles */
        .theme-toggle * {
            pointer-events: none !important;
        }

        /* Dark theme specific styles */
        .theme-dark .expertise-card,
        .theme-dark .card {
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
            color: #f7fafc;
            border-color: #4a5568;
        }

        .theme-dark .expertise-card h3,
        .theme-dark .card-title {
            color: #f7fafc;
        }

        .theme-dark .expertise-card p,
        .theme-dark .card-description {
            color: #cbd5e0;
        }

        .theme-dark .tech-category {
            background: #2d3748;
            border-color: #4a5568;
            color: #f7fafc;
        }

        .theme-dark .tech-category h4 {
            color: #f7fafc;
            border-bottom-color: #4a5568;
        }

        .theme-dark .stat-item {
            background: rgba(255,255,255,0.05);
            border-color: rgba(255,255,255,0.1);
        }

        .theme-dark .stat-item:hover {
            background: rgba(255,255,255,0.1);
            border-color: rgba(255,255,255,0.2);
        }

        /* Enhanced military theme for dark mode */
        .theme-dark .military-badge {
            background: linear-gradient(135deg, #d4af37, #ffd700);
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4);
        }

        /* Ensure back-to-top button stays in its position */
        .back-to-top {
            z-index: 9999 !important;
        }

        /* Accessibility improvements */
        .theme-toggle:focus {
            outline: 2px solid var(--text-accent, #ffd700) !important;
            outline-offset: 2px !important;
        }

        @media (prefers-reduced-motion: reduce) {
            .theme-transitioning * {
                transition: none !important;
            }
            
            .theme-ripple-effect {
                animation: none !important;
            }
        }

        /* Mobile specific positioning */
        @media (max-width: 768px) {
            .theme-toggle {
                top: 15px !important;
                right: 15px !important;
                width: 45px !important;
                height: 45px !important;
                font-size: 18px !important;
            }
        }

        @media (min-width: 769px) {
            .theme-toggle {
                top: 20px !important;
                right: 20px !important;
                width: 50px !important;
                height: 50px !important;
                font-size: 20px !important;
            }
        }
    `;

    document.head.appendChild(themeStyles);
};

// Initialize Theme Manager when DOM is ready
const initializeThemeManager = () => {
    try {
        createThemeStyles();
        window.themeManager = new ThemeManager();

        // Global access for debugging
        if (typeof window !== 'undefined') {
            window.ThemeManager = ThemeManager;

            // Debug function to reposition button
            window.debugThemeButton = () => {
                if (window.themeManager) {
                    window.themeManager.repositionButton();
                    console.log('Theme button repositioned');
                }
            };
        }
    } catch (error) {
        console.error('Failed to initialize Theme Manager:', error);
    }
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeThemeManager);
} else {
    initializeThemeManager();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}