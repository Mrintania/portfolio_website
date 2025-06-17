/**
 * Portfolio Website Main JavaScript
 * Handles dynamic content loading and user interactions
 */

class PortfolioManager {
    constructor() {
        this.contentData = null;
        this.isLoaded = false;
        this.init();
        this.initBackToTop();
    }

    async init() {
        try {
            await this.loadContent();
            this.renderContent();
            this.setupEventListeners();
            this.initializeAnimations();
            this.isLoaded = true;
            console.log('Portfolio website initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio:', error);
            this.handleLoadError();
        }
    }

    async loadContent() {
        try {
            const response = await fetch('config/content.json');
            if (!response.ok) {
                throw new Error('Failed to load content configuration');
            }
            this.contentData = await response.json();
        } catch (error) {
            console.warn('Could not load content.json, using fallback data');
            this.contentData = this.getFallbackContent();
        }
    }

    getFallbackContent() {
        return {
            personalInfo: {
                name: "Pornsupat V.",
                title: "DevOps Engineer | AI Instructor | Computer Science Educator",
                organization: "Royal Thai Army Signal Department",
                quote: "Technology serves those who serve their nation",
                statement: "Committed to leveraging cutting-edge technology in service of national defense and education. Every line of code written with the purpose of advancing our nation's technological capabilities."
            },
            expertise: [
                {
                    icon: "🛡️",
                    title: "Military Technology Specialist",
                    description: "DevOps engineer specializing in secure, scalable systems for military applications. Expert in developing robust infrastructure solutions that meet the demanding requirements of defense operations."
                },
                {
                    icon: "🤖",
                    title: "Artificial Intelligence Educator",
                    description: "Leading instructor in AI and machine learning technologies, developing comprehensive curricula that prepare military personnel for the future of digital warfare and intelligence operations."
                },
                {
                    icon: "💻",
                    title: "Full-Stack Development",
                    description: "Comprehensive expertise in modern web technologies, creating sophisticated applications that serve both educational and operational needs within the military framework."
                },
                {
                    icon: "📚",
                    title: "Technology Leadership",
                    description: "Committed to fostering the next generation of military technologists through innovative teaching methodologies and hands-on practical training programs."
                }
            ],
            technicalStack: [
                {
                    category: "Programming Languages",
                    technologies: ["Python", "JavaScript", "TypeScript", "C", "C#", "PHP"]
                },
                {
                    category: "Frameworks & Technologies",
                    technologies: ["React", "Node.js", "Docker", "MySQL", "Git"]
                },
                {
                    category: "Systems & Platforms",
                    technologies: ["Linux", "Ubuntu", "Debian", "Raspberry Pi", "Arduino"]
                },
                {
                    category: "Specializations",
                    technologies: ["DevOps", "Machine Learning", "IoT Systems", "Signal Intelligence"]
                }
            ],
            initiatives: [
                {
                    icon: "🎯",
                    title: "AI-Powered Military Training",
                    description: "Developing cutting-edge educational platforms that utilize artificial intelligence to enhance military training effectiveness and create adaptive learning experiences."
                },
                {
                    icon: "🔐",
                    title: "Signal Intelligence Solutions",
                    description: "Creating innovative technological solutions for signal intelligence applications that strengthen national defense capabilities and communication security."
                },
                {
                    icon: "👥",
                    title: "Next-Generation Engineers",
                    description: "Mentoring and developing the next generation of military software engineers through comprehensive training programs and practical project implementation."
                },
                {
                    icon: "🌐",
                    title: "Open Source Contribution",
                    description: "Contributing to open-source projects that benefit the defense community while maintaining the highest standards of security and operational excellence."
                }
            ],
            contactLinks: [
                {
                    label: "GitHub Portfolio",
                    url: "https://github.com/Mrintania",
                    icon: "🔗",
                    external: true
                },
                {
                    label: "LinkedIn Profile",
                    url: "https://www.linkedin.com/in/pornsupat-v/",
                    icon: "💼",
                    external: true
                },
                {
                    label: "Professional Contact",
                    url: "mailto:contact@example.com",
                    icon: "📧",
                    external: false
                }
            ]
        };
    }

    renderContent() {
        this.renderExpertiseSection();
        this.renderTechnicalStack();
        this.renderInitiatives();
        this.renderContactLinks();
        this.updatePersonalInfo();
    }

    renderExpertiseSection() {
        const expertiseGrid = document.getElementById('expertiseGrid');
        if (!expertiseGrid || !this.contentData.expertise) return;

        expertiseGrid.innerHTML = this.contentData.expertise.map(item => `
            <div class="expertise-card">
                <h3>${item.icon} ${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `).join('');
    }

    renderTechnicalStack() {
        const techStack = document.getElementById('techStack');
        if (!techStack || !this.contentData.technicalStack) return;

        techStack.innerHTML = this.contentData.technicalStack.map(category => `
            <div class="tech-category">
                <h4>${category.category}</h4>
                <div class="tech-tags">
                    ${category.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
            </div>
        `).join('');
    }

    renderInitiatives() {
        const initiativesGrid = document.getElementById('initiativesGrid');
        if (!initiativesGrid || !this.contentData.initiatives) return;

        initiativesGrid.innerHTML = this.contentData.initiatives.map(item => `
            <div class="expertise-card">
                <h3>${item.icon} ${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `).join('');
    }

    renderContactLinks() {
        const contactLinks = document.getElementById('contactLinks');
        if (!contactLinks || !this.contentData.contactLinks) return;

        contactLinks.innerHTML = this.contentData.contactLinks.map(link => `
            <a href="${link.url}" class="contact-btn" target="${link.external ? '_blank' : '_self'}">
                ${link.icon} ${link.label}
            </a>
        `).join('');
    }

    updatePersonalInfo() {
        const updates = {
            'fullName': this.contentData.personalInfo?.name,
            'jobTitle': this.contentData.personalInfo?.title,
            'organization': this.contentData.personalInfo?.organization,
            'professionalQuote': this.contentData.personalInfo?.quote,
            'professionalStatement': this.contentData.personalInfo?.statement
        };

        Object.entries(updates).forEach(([id, content]) => {
            const element = document.getElementById(id);
            if (element && content) {
                element.textContent = content;
            }
        });
    }

    setupEventListeners() {
        // Profile image placeholder click handler
        const profileImage = document.getElementById('profileImage');
        if (profileImage) {
            profileImage.addEventListener('click', this.handleProfileImageClick.bind(this));
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll);
        });

        // Contact button analytics
        document.querySelectorAll('.contact-btn').forEach(btn => {
            btn.addEventListener('click', this.handleContactClick);
        });

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));

        // Theme detection
        this.detectColorScheme();

        // Window resize handler
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
    }

    handleProfileImageClick() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.addEventListener('change', this.handleImageUpload.bind(this));
        input.click();
    }

    handleImageUpload(event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const profileImage = document.getElementById('profileImage');
                if (profileImage) {
                    profileImage.innerHTML = `<img src="${e.target.result}" alt="Profile" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    handleContactClick(e) {
        const linkText = e.target.textContent.trim();
        console.log(`Contact link clicked: ${linkText}`);

        // Add visual feedback
        e.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            e.target.style.transform = '';
        }, 150);
    }

    handleKeyboardNavigation(e) {
        // Add keyboard accessibility features
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }

        if (e.key === 'Escape') {
            document.activeElement.blur();
        }
    }

    initializeAnimations() {
        // Intersection Observer for scroll-triggered animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        document.querySelectorAll('.expertise-card, .tech-category, .stat-item').forEach(el => {
            observer.observe(el);
        });
    }

    detectColorScheme() {
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        if (darkModeQuery.matches) {
            document.body.classList.add('dark-mode');
        }

        darkModeQuery.addEventListener('change', (e) => {
            document.body.classList.toggle('dark-mode', e.matches);
        });
    }

    handleResize() {
        // Handle window resize events
        console.log('Window resized');
    }

    handleLoadError() {
        console.error('Failed to load portfolio content');
        // Show error message or fallback content
        const expertiseGrid = document.getElementById('expertiseGrid');
        if (expertiseGrid) {
            expertiseGrid.innerHTML = '<p>Content loading error. Please check your configuration.</p>';
        }
    }

    // Utility function for debouncing
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    initBackToTop() {
        this.backToTopButton = document.querySelector('.back-to-top');
        if (!this.backToTopButton) return;

        window.addEventListener('scroll', this.debounce(() => {
            const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;

            if (scrollPercent > 20) {
                this.backToTopButton.classList.add('visible');
            } else {
                this.backToTopButton.classList.remove('visible');
            }

            // Update progress ring
            const progressRing = this.backToTopButton.querySelector('.progress-ring');
            if (progressRing) {
                progressRing.style.background = `conic-gradient(var(--military-gold) ${(scrollPercent / 100) * 360}deg, transparent 0deg)`;
            }
        }, 16));
    }


}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing portfolio...');
    window.portfolioManager = new PortfolioManager();
});

// Also initialize if DOM is already loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing portfolio...');
        window.portfolioManager = new PortfolioManager();
    });
} else {
    console.log('DOM already loaded, initializing portfolio...');
    window.portfolioManager = new PortfolioManager();
}

// เพิ่มโค้ดนี้ต่อท้ายไฟล์ main.js หลัง class PortfolioManager

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
        this.addThemeStyles();
    }

    getStoredTheme() {
        try {
            return localStorage.getItem('portfolio-theme');
        } catch (e) {
            return null;
        }
    }

    getSystemTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    setStoredTheme(theme) {
        try {
            localStorage.setItem('portfolio-theme', theme);
        } catch (e) {
            console.warn('Cannot save theme preference');
        }
    }

    applyTheme(themeName) {
        const root = document.documentElement;
        const theme = this.themes[themeName];

        Object.entries(theme).forEach(([property, value]) => {
            root.style.setProperty(`--${property}`, value);
        });

        document.body.className = document.body.className.replace(/theme-\w+/g, '');
        document.body.classList.add(`theme-${themeName}`);

        this.currentTheme = themeName;
        this.setStoredTheme(themeName);
    }

    createThemeToggle() {
        // Remove existing toggle if any
        const existing = document.querySelector('.theme-toggle');
        if (existing) existing.remove();

        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle dark/light mode');
        toggle.innerHTML = this.getToggleIcon();

        // Add styles directly
        toggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: var(--bg-card);
            border: 2px solid var(--text-primary);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            backdrop-filter: blur(10px);
            color: var(--text-primary);
        `;

        toggle.addEventListener('mouseenter', () => {
            toggle.style.transform = 'scale(1.1)';
            toggle.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });

        toggle.addEventListener('mouseleave', () => {
            toggle.style.transform = 'scale(1)';
            toggle.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
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

        document.body.classList.add('theme-transitioning');
        this.applyTheme(newTheme);

        if (this.toggleButton) {
            this.toggleButton.innerHTML = this.getToggleIcon();
        }

        setTimeout(() => {
            document.body.classList.remove('theme-transitioning');
        }, 300);
    }

    setupSystemThemeListener() {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
                if (this.toggleButton) {
                    this.toggleButton.innerHTML = this.getToggleIcon();
                }
            }
        });
    }

    addThemeStyles() {
        const styleId = 'theme-styles';
        if (document.getElementById(styleId)) return;

        const styles = document.createElement('style');
        styles.id = styleId;
        styles.textContent = `
            .theme-transitioning * {
                transition: background-color 0.3s ease, 
                           color 0.3s ease, 
                           border-color 0.3s ease,
                           box-shadow 0.3s ease !important;
            }

            .theme-dark .expertise-card {
                background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
                color: #f7fafc;
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
        document.head.appendChild(styles);
    }
}

// เพิ่มการ initialize ThemeManager ใน portfolio manager
document.addEventListener('DOMContentLoaded', () => {
    if (!window.portfolioManager) {
        window.portfolioManager = new PortfolioManager();
    }
    // Initialize theme manager
    window.themeManager = new ThemeManager();
});

window.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
};