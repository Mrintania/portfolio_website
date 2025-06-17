// ===================================
// MAIN APPLICATION
// ===================================

class PortfolioApp {
    constructor() {
        this.componentManager = null;
        this.animationController = null;
        this.scrollController = null;
        this.isInitialized = false;

        this.init();
    }

    async init() {
        try {
            await this.initializeComponents();
            this.setupScrollEffects();
            this.setupNavigation();
            this.setupAnimations();
            this.setupTheme();
            this.setupPerformance();

            this.isInitialized = true;
            console.log('Portfolio app initialized successfully');
        } catch (error) {
            console.error('Error initializing portfolio:', error);
            this.handleInitError(error);
        }
    }

    async initializeComponents() {
        this.componentManager = new ComponentManager();
        await this.componentManager.init();
    }

    setupScrollEffects() {
        this.scrollController = new ScrollController();
        this.scrollController.init();
    }

    setupNavigation() {
        // Smooth scrolling for navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const targetId = e.target.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            }
        });

        // Update active nav on scroll
        window.addEventListener('scroll', this.updateActiveNav.bind(this));

        // Mobile navigation toggle
        this.setupMobileNav();
    }

    setupMobileNav() {
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            // Close mobile nav when clicking outside
            document.addEventListener('click', (e) => {
                if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        }
    }

    setupAnimations() {
        if (!CONFIG.animations.enabled) return;

        // Use existing AnimationController from animations.js
        if (window.animationController) {
            // AnimationController already exists, just initialize counters
            animateCounters();
        } else {
            // Fallback animation setup
            animateCounters();
        }
    }

    setupTheme() {
        // Theme detection and setup
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-theme', prefersDark);

        // Listen for theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            document.body.classList.toggle('dark-theme', e.matches);
        });
    }

    setupPerformance() {
        // Lazy loading images
        if ('IntersectionObserver' in window && CONFIG.performance.lazyLoading) {
            this.setupLazyLoading();
        }

        // Preload critical resources
        if (CONFIG.performance.preloadCritical) {
            this.preloadCriticalResources();
        }
    }

    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    preloadCriticalResources() {
        const criticalAssets = [
            'assets/images/profile_1.png',
            'css/main.css',
            'css/components.css'
        ];

        criticalAssets.forEach(asset => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = asset;
            link.as = asset.endsWith('.css') ? 'style' : 'image';
            document.head.appendChild(link);
        });
    }

    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    handleInitError(error) {
        console.error('Portfolio initialization failed:', error);

        // Show fallback content
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; min-height: 100vh; color: white; text-align: center;">
                <div>
                    <h1>Portfolio Loading Error</h1>
                    <p>Please refresh the page or check your connection.</p>
                </div>
            </div>
        `;
    }

    // Public API methods
    getComponent(name) {
        return this.componentManager?.components.get(name);
    }

    updateContent(newContent) {
        if (this.componentManager) {
            this.componentManager.contentData = newContent;
            this.componentManager.renderAllComponents();
        }
    }

    toggleAnimations(enabled) {
        CONFIG.animations.enabled = enabled;
        document.body.classList.toggle('animations-disabled', !enabled);
    }
}

// Scroll Controller
class ScrollController {
    constructor() {
        this.ticking = false;
        this.scrollY = 0;
    }

    init() {
        window.addEventListener('scroll', this.onScroll.bind(this));
        this.setupScrollAnimations();
        this.setupNavbarScroll();
    }

    onScroll() {
        if (!this.ticking) {
            requestAnimationFrame(() => {
                this.scrollY = window.pageYOffset;
                this.updateScrollEffects();
                this.ticking = false;
            });
            this.ticking = true;
        }
    }

    updateScrollEffects() {
        // Update navbar background on scroll
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (this.scrollY > 100) {
                navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.08)';
            }
        }

        // Parallax effect for hero section
        const hero = document.querySelector('.hero');
        if (hero && this.scrollY < window.innerHeight) {
            const parallaxSpeed = 0.5;
            hero.style.transform = `translateY(${this.scrollY * parallaxSpeed}px)`;
        }
    }

    setupScrollAnimations() {
        if (!CONFIG.animations.enabled) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-slide-up');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.timeline-item, .card, .stat-item').forEach(el => {
            observer.observe(el);
        });
    }

    setupNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = 0;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.pageYOffset;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide navbar
                navbar.style.transform = 'translateY(-100%)';
            } else {
                // Scrolling up - show navbar
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
        });
    }
}

// Use existing AnimationController from animations.js
// Counter animation utility
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const text = element.textContent;
    const hasPlus = text.includes('+');
    const hasPercent = text.includes('%');
    const targetNumber = parseInt(text.replace(/[^\d]/g, ''));

    if (isNaN(targetNumber)) return;

    let currentNumber = 0;
    const increment = targetNumber / 60;
    const duration = 2000;
    const stepTime = duration / 60;

    const updateCounter = () => {
        currentNumber += increment;

        if (currentNumber >= targetNumber) {
            currentNumber = targetNumber;
            let finalText = currentNumber.toString();
            if (hasPlus) finalText += '+';
            if (hasPercent) finalText += '%';
            element.textContent = finalText;
        } else {
            let displayText = Math.floor(currentNumber).toString();
            if (hasPlus) displayText += '+';
            if (hasPercent) displayText += '%';
            element.textContent = displayText;
            setTimeout(updateCounter, stepTime);
        }
    };

    element.textContent = '0';
    updateCounter();
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

// Export for external use
window.PortfolioApp = PortfolioApp;