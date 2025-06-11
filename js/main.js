/**
 * Portfolio Website Main JavaScript
 * Handles dynamic content loading and user interactions
 */

class PortfolioManager {
    constructor() {
        this.contentData = null;
        this.isLoaded = false;
        this.init();
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
            document.body.classList.toggle('dark-mode