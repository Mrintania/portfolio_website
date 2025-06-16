/**
 * Theme Manager สำหรับ Portfolio Website
 * รองรับ Dark/Light Mode Toggle พร้อม Military Theme
 */

class ThemeManager {
    constructor() {
        this.themes = {
            light: {
                'primary-dark': '#2c3e50',
                'primary-light': '#34495e',
                'bg-primary': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                'text-primary': '#2c3e50',
                'text-secondary': '#6c757d',
                'bg-card': 'rgba(255, 255, 255, 0.95)',
                'bg-section': 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
            },
            dark: {
                'primary-dark': '#1a202c',
                'primary-light': '#2d3748',
                'bg-primary': 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
                'text-primary': '#f7fafc',
                'text-secondary': '#cbd5e0',
                'bg-card': 'rgba(26, 32, 44, 0.95)',
                'bg-section': 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)'
            }
        };

        this.currentTheme = this.getStoredTheme() || this.getSystemTheme();
        this.init();
    }

    init() {
        this.applyTheme(this.currentTheme);
        this.createThemeToggle();
        this.setupSystemThemeListener();
        console.log(`Theme Manager initialized with ${this.currentTheme} mode`);
    }

    getStoredTheme() {
        return localStorage.getItem('portfolio-theme');
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setStoredTheme(theme) {
        localStorage.setItem('portfolio-theme', theme);
    }

    applyTheme(themeName) {
        const root = document.documentElement;
        const theme = this.themes[themeName];

        // Update CSS custom properties
        Object.entries(theme).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });

        // Update body class
        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);

        // Update meta theme color for mobile browsers
        this.updateMetaThemeColor(themeName);

        this.currentTheme = themeName;
        this.setStoredTheme(themeName);
    }

    updateMetaThemeColor(theme) {
        let metaTheme = document.querySelector('meta[name="theme-color"]');
        if (!metaTheme) {
            metaTheme = document.createElement('meta');
            metaTheme.name = 'theme-color';
            document.head.appendChild(metaTheme);
        }

        metaTheme.content = theme === 'dark' ? '#1a202c' : '#2c3e50';
    }

    createThemeToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark/light mode');
        toggle.innerHTML = this.getToggleIcon();

        // Add styles
        toggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: var(--bg-card);
            border: 2px solid var(--primary-dark);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
        `;

        // Add hover effects
        toggle.addEventListener('mouseenter', () => {
            toggle.style.transform = 'scale(1.1)';
            toggle.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)';
        });

        toggle.addEventListener('mouseleave', () => {
            toggle.style.transform = 'scale(1)';
            toggle.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });

        toggle.addEventListener('click', () => this.toggleTheme());

        document.body.appendChild(toggle);
        this.toggleButton = toggle;
    }

    getToggleIcon() {
        return this.currentTheme === 'light' ? '🌙' : '☀️';
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';

        // Add animation class
        document.body.classList.add('theme-transitioning');

        // Apply new theme
        this.applyTheme(newTheme);

        // Update toggle button
        if (this.toggleButton) {
            this.toggleButton.innerHTML = this.getToggleIcon();
        }

        // Remove animation class after transition
        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);

        // Add ripple effect
        this.createRippleEffect();

        console.log(`Theme switched to ${newTheme} mode`);
    }

    createRippleEffect() {
        if (!this.toggleButton) return;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: var(--accent-gradient-start);
            opacity: 0.6;
            pointer-events: none;
            transform: scale(0);
            animation: ripple-expand 0.6s ease-out;
            width: 100px;
            height: 100px;
            top: -25px;
            left: -25px;
        `;

        this.toggleButton.style.position = 'relative';
        this.toggleButton.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            // Only auto-switch if user hasn't manually set a preference
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
                if (this.toggleButton) {
                    this.toggleButton.innerHTML = this.getToggleIcon();
                }
            }
        });
    }

    // Method for keyboard accessibility
    setupKeyboardShortcut() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + Shift + T to toggle theme
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    // Method to programmatically set theme
    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.applyTheme(themeName);
            if (this.toggleButton) {
                this.toggleButton.innerHTML = this.getToggleIcon();
            }
        }
    }

    // Get current theme
    getCurrentTheme() {
        return this.currentTheme;
    }
}

// CSS Animations สำหรับ Theme Transition
const themeStyles = document.createElement('style');
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
            transform: scale(1);
            opacity: 0;
        }
    }

    /* Dark theme specific styles */
    .theme-dark .expertise-card {
        background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
        color: #f7fafc;
        border-left-color: #667eea;
    }

    .theme-dark .expertise-card h3 {
        color: #f7fafc;
    }

    .theme-dark .expertise-card p {
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

    /* Responsive theme toggle */
    @media (max-width: 768px) {
        .theme-toggle {
            top: 15px !important;
            right: 15px !important;
            width: 45px !important;
            height: 45px !important;
            font-size: 18px !important;
        }
    }
`;

document.head.appendChild(themeStyles);

// Initialize Theme Manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.themeManager = new ThemeManager();
    // Enable keyboard shortcut
    window.themeManager.setupKeyboardShortcut();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeManager;
}