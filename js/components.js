// ===================================
// ENHANCED COMPONENTS MANAGER - WITH MOBILE NAVIGATION
// ===================================

class ComponentManager {
    constructor() {
        this.components = new Map();
        this.contentData = null;
        this.mobileNav = null; // เพิ่ม mobile navigation instance
        this.init();
    }

    async init() {
        await this.loadContent();
        this.registerComponents();
        this.renderAllComponents();
        this.setupEventListeners();
        this.initializeMobileNavigation(); // เพิ่มการ initialize mobile nav
    }

    async loadContent() {
        try {
            const response = await fetch(CONFIG.api.endpoints.content);
            this.contentData = await response.json();
        } catch (error) {
            console.warn('Using fallback content');
            this.contentData = this.getFallbackContent();
        }
    }

    registerComponents() {
        this.components.set('navbar', new NavbarComponent());
        this.components.set('hero', new HeroComponent());
        this.components.set('experience', new ExperienceComponent());
        this.components.set('skills', new SkillsComponent());
        this.components.set('education', new EducationComponent());
        this.components.set('contact', new ContactComponent());
    }

    renderAllComponents() {
        this.components.forEach((component, name) => {
            const container = document.getElementById(`${name}-component`);
            if (container) {
                container.innerHTML = component.render(this.contentData);
            }
        });
    }

    setupEventListeners() {
        this.components.forEach(component => {
            if (component.bindEvents) {
                component.bindEvents();
            }
        });
    }

    // เพิ่มฟังก์ชัน initialize mobile navigation
    initializeMobileNavigation() {
        this.mobileNav = new MobileNavigationManager();
    }

    getFallbackContent() {
        return {
            personal: {
                name: "Pornsupat Vutisuwan",
                title: "DevOps Engineer | AI Instructor",
                subtitle: "Royal Thai Army Signal Department",
                description: "DevOps Engineer & AI Instructor specializing in military technology solutions.",
                image: "assets/images/profile_1.png"
            },
            stats: [
                { number: "6+", label: "Years Experience" },
                { number: "500+", label: "Students Taught" },
                { number: "50+", label: "Projects Completed" },
                { number: "100%", label: "Mission Success" }
            ],
            // ... other fallback data
        };
    }
}

// เพิ่ม Mobile Navigation Manager Class
class MobileNavigationManager {
    constructor() {
        this.navbar = document.querySelector('.navbar');
        this.navToggle = document.querySelector('.nav-toggle');
        this.navLinks = document.querySelector('.nav-links');
        this.navLinksItems = document.querySelectorAll('.nav-link');

        this.isOpen = false;
        this.scrollPosition = 0;
        this.lastScrollY = 0;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupSmoothScrolling();
        console.log('Mobile Navigation initialized');
    }

    setupEventListeners() {
        // Toggle mobile menu
        if (this.navToggle) {
            this.navToggle.addEventListener('click', () => this.toggleMenu());
        }

        // Close menu when clicking nav links
        this.navLinksItems.forEach(link => {
            link.addEventListener('click', (e) => {
                if (this.isMobile()) {
                    this.closeMenu();
                }
                this.setActiveLink(e.target);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen && this.navbar && !this.navbar.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (!this.isMobile() && this.isOpen) {
                this.closeMenu();
            }
        });
    }

    setupScrollEffects() {
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;

            // Add scrolled class for styling
            if (currentScrollY > 100) {
                this.navbar?.classList.add('scrolled');
            } else {
                this.navbar?.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll (mobile only)
            if (this.isMobile()) {
                if (currentScrollY > this.lastScrollY && currentScrollY > 100) {
                    // Scrolling down - hide navbar
                    if (this.navbar) {
                        this.navbar.style.transform = 'translateY(-100%)';
                    }
                } else {
                    // Scrolling up - show navbar
                    if (this.navbar) {
                        this.navbar.style.transform = 'translateY(0)';
                    }
                }
            }

            this.lastScrollY = currentScrollY;
            this.updateActiveNavOnScroll();
        });
    }

    setupSmoothScrolling() {
        this.navLinksItems.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');

                // Skip external links
                if (href && (href.includes('.html') || href.startsWith('http'))) {
                    return;
                }

                e.preventDefault();
                const targetId = href?.substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const headerOffset = this.isMobile() ? 70 : 80;
                    const elementPosition = targetElement.offsetTop;
                    const offsetPosition = elementPosition - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    toggleMenu() {
        if (this.isOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isOpen = true;
        this.navToggle?.classList.add('active');
        this.navLinks?.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling

        // Add stagger animation to links
        this.navLinksItems.forEach((link, index) => {
            link.style.animationDelay = `${index * 0.1}s`;
            link.style.animation = 'slideInRight 0.5s ease forwards';
        });
    }

    closeMenu() {
        this.isOpen = false;
        this.navToggle?.classList.remove('active');
        this.navLinks?.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling

        // Reset animations
        this.navLinksItems.forEach(link => {
            link.style.animation = '';
            link.style.animationDelay = '';
        });
    }

    setActiveLink(clickedLink) {
        this.navLinksItems.forEach(link => {
            link.classList.remove('active');
        });
        clickedLink.classList.add('active');
    }

    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinksItems.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    isMobile() {
        return window.innerWidth <= 768;
    }
}

// Component Base Class
class Component {
    constructor() {
        this.element = null;
    }

    render(data) {
        throw new Error('Render method must be implemented');
    }

    bindEvents() {
        // Override in subclasses if needed
    }
}

// Enhanced Navbar Component
class NavbarComponent extends Component {
    render(data) {
        const { brand, logo, links } = CONFIG.navigation;

        return `
            <div class="navbar">
                <div class="nav-container">
                    <div class="nav-brand">
                        <img src="${logo}" alt="Profile" class="nav-avatar">
                        <span>${brand}</span>
                    </div>
                    <ul class="nav-links">
                        ${links.map(link => {
            const isExternal = link.external || link.href.endsWith('.html');
            const href = isExternal ? link.href : link.href;
            const target = isExternal && !link.href.startsWith('#') ? '_self' : '';

            return `
                                <li>
                                    <a href="${href}" 
                                       class="nav-link" 
                                       ${target ? `target="${target}"` : ''}
                                       ${!isExternal ? `onclick="handleNavClick(event)"` : ''}>
                                        <i class="${link.icon}"></i> ${link.name}
                                    </a>
                                </li>
                            `;
        }).join('')}
                    </ul>

                    <button class="nav-toggle" aria-label="Toggle navigation">
                        <div class="hamburger">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Events will be handled by MobileNavigationManager
    }
}

// Hero Component
class HeroComponent extends Component {
    render(data) {
        const { personal, stats } = data;

        return `
            <div class="hero" id="home">
                <div class="hero-container">
                    <div class="hero-content">
                        <div class="hero-subtitle">${personal.subtitle}</div>
                        <h1 class="hero-title">${personal.name}</h1>
                        <p class="hero-description">${personal.description}</p>
                        
                        <div class="hero-stats">
                            ${stats.map(stat => `
                                <div class="stat-item">
                                    <span class="stat-number">${stat.number}</span>
                                    <span class="stat-label">${stat.label}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>

                    <div class="hero-image">
                        <div class="profile-container">
                            <img src="${personal.image}" alt="${personal.name}" class="profile-image">
                            <div class="floating-elements">
                                <div class="floating-element">
                                    <i class="fas fa-code"></i>
                                    <div>DevOps</div>
                                </div>
                                <div class="floating-element">
                                    <i class="fas fa-brain"></i>
                                    <div>AI/ML</div>
                                </div>
                                <div class="floating-element">
                                    <i class="fas fa-shield-alt"></i>
                                    <div>Security</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Experience Component
class ExperienceComponent extends Component {
    render(data) {
        const { experience } = data;

        return `
            <div class="section" id="experience">
                <div class="section-header">
                    <h2 class="section-title">Professional Experience</h2>
                    <p class="section-subtitle">Journey of service and technical excellence in military technology</p>
                </div>
                
                <div class="timeline">
                    ${experience.map(exp => `
                        <div class="timeline-item">
                            <div class="timeline-marker"></div>
                            <div class="timeline-content">
                                <div class="timeline-date">${exp.date}</div>
                                <h3 class="timeline-title">${exp.title}</h3>
                                <p class="timeline-description">${exp.description}</p>
                                <div class="skills-container">
                                    ${exp.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Skills Component
class SkillsComponent extends Component {
    render(data) {
        const { skills } = data;

        return `
            <div class="section" id="skills">
                <div class="section-header">
                    <h2 class="section-title">Technical Expertise</h2>
                    <p class="section-subtitle">Comprehensive skills in modern technology and military applications</p>
                </div>

                <div class="cards-grid">
                    ${skills.map(skill => `
                        <div class="card">
                            <div class="card-icon">
                                <i class="${skill.icon}"></i>
                            </div>
                            <h3 class="card-title">${skill.title}</h3>
                            <p class="card-description">${skill.description}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
}

// Enhanced Education Component
class EducationComponent extends Component {
    render(data) {
        const { education, militaryEducation } = data;

        return `
            <div class="section" id="education">
                <div class="section-header">
                    <h2 class="section-title">Education & Training</h2>
                    <p class="section-subtitle">Academic excellence and specialized military training</p>
                </div>

                <!-- Academic Education -->
                <div class="education-category">
                    <div class="category-header">
                        <div class="category-icon">
                            <i class="fas fa-graduation-cap"></i>
                        </div>
                        <h3 class="category-title">Academic Education</h3>
                    </div>
                    
                    <div class="education-timeline">
                        ${education.map((edu, index) => `
                            <div class="education-item ${edu.status === 'current' ? 'current' : ''}" data-delay="${index * 0.2}">
                                <div class="education-marker ${edu.status === 'current' ? 'current-marker' : ''}">
                                    <div class="marker-dot"></div>
                                </div>
                                <div class="education-content">
                                    <div class="education-header">
                                        <div class="degree-info">
                                            <h4 class="degree-title">${edu.degree}</h4>
                                            <div class="institution">${edu.institution}</div>
                                            <div class="period ${edu.status === 'current' ? 'current-period' : ''}">${edu.period}</div>
                                        </div>
                                        ${edu.gpa ? `<div class="gpa-badge">GPA: ${edu.gpa}</div>` : ''}
                                    </div>
                                    
                                    <p class="education-description">${edu.description}</p>
                                    
                                    ${edu.achievements ? `
                                        <div class="achievements">
                                            <h5><i class="fas fa-trophy"></i> Achievements</h5>
                                            <ul class="achievement-list">
                                                ${edu.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                                            </ul>
                                        </div>
                                    ` : ''}
                                    
                                    ${edu.researchFocus ? `
                                        <div class="research-focus">
                                            <h5><i class="fas fa-microscope"></i> Research Focus</h5>
                                            <p>${edu.researchFocus}</p>
                                        </div>
                                    ` : ''}
                                    
                                    <div class="skills-learned">
                                        ${edu.skills.map(skill => `<span class="skill-pill academic">${skill}</span>`).join('')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Military Education -->
                <div class="education-category military">
                    <div class="category-header">
                        <div class="category-icon military-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h3 class="category-title">Military Education</h3>
                    </div>
                    
                    <div class="military-education-grid">
                        ${militaryEducation.map((course, index) => `
                            <div class="military-course-card ${course.category}" data-delay="${index * 0.15}">
                                <div class="course-header">
                                    <div class="course-icon ${course.category}">
                                        ${this.getCategoryIcon(course.category)}
                                    </div>
                                    <div class="course-year">${course.year}</div>
                                </div>
                                
                                <div class="course-content">
                                    <h4 class="course-title">${course.title}</h4>
                                    <div class="course-institution">${course.institution}</div>
                                    <p class="course-description">${course.description}</p>
                                    
                                    <div class="course-subjects">
                                        <h5>Key Training Areas:</h5>
                                        <ul class="subjects-list">
                                            ${course.subjects.slice(0, 3).map(subject => `<li>${subject}</li>`).join('')}
                                        </ul>
                                    </div>
                                    
                                    <div class="military-skills">
                                        ${course.skills.map(skill => `<span class="skill-pill military ${course.category}">${skill}</span>`).join('')}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    getCategoryIcon(category) {
        const icons = {
            cybersecurity: '<i class="fas fa-lock"></i>',
            electronics: '<i class="fas fa-microchip"></i>',
            communications: '<i class="fas fa-broadcast-tower"></i>'
        };
        return icons[category] || '<i class="fas fa-certificate"></i>';
    }
}

// Contact Component
class ContactComponent extends Component {
    render(data) {
        const { contact } = data;

        return `
            <div class="section" id="contact">
                <div class="contact-section">
                    <h2 class="section-title">${contact.title}</h2>
                    <p class="section-subtitle">${contact.description}</p>
                    
                    <div class="contact-links">
                        ${contact.links.map(link => `
                            <a href="${link.url}" class="contact-link" target="_blank">
                                <i class="${link.icon}"></i>
                                <span>${link.label}</span>
                            </a>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
}

// Global function for nav click handling
function handleNavClick(e) {
    if (e.target.href && (e.target.href.endsWith('.html') || e.target.href.includes('http'))) {
        return;
    }

    e.preventDefault();
    const targetId = e.target.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
        const headerOffset = window.innerWidth <= 768 ? 70 : 80;
        const elementPosition = targetElement.offsetTop;
        const offsetPosition = elementPosition - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    e.target.classList.add('active');
}


// Export
window.ComponentManager = ComponentManager;
window.MobileNavigationManager = MobileNavigationManager;