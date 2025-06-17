// ===================================
// COMPONENTS MANAGER
// ===================================

class ComponentManager {
    constructor() {
        this.components = new Map();
        this.contentData = null;
        this.init();
    }

    async init() {
        await this.loadContent();
        this.registerComponents();
        this.renderAllComponents();
        this.setupEventListeners();
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

    getFallbackContent() {
        return {
            personal: {
                name: "Pornsupat Vutisuwan",
                title: "DevOps Engineer | AI Instructor",
                subtitle: "Royal Thai Army Signal Department",
                description: "DevOps Engineer & AI Instructor specializing in military technology solutions and advanced educational methodologies.",
                image: "assets/images/profile_1.png"
            },
            stats: [
                { number: "6+", label: "Years Experience" },
                { number: "500+", label: "Students Taught" },
                { number: "50+", label: "Projects Completed" },
                { number: "100%", label: "Mission Success" }
            ],
            experience: [
                {
                    date: "2019 - Present",
                    title: "Signal School Clerk & Teaching Assistant",
                    company: "Signal School, Signal Department - Bangkok",
                    description: "Leading educational initiatives in AI and computer science while managing administrative operations.",
                    skills: ["AI/ML Teaching", "DevOps", "Administration", "Leadership"]
                },
                {
                    date: "2017 - 2018",
                    title: "Radio Relay Operator",
                    company: "Signal Battalion 12 - Bangkok",
                    description: "Operated and maintained critical communication systems for military operations.",
                    skills: ["Radio Operations", "Communications", "Network Systems", "Equipment Maintenance"]
                }
            ],
            skills: [
                {
                    icon: "fas fa-robot",
                    title: "Artificial Intelligence",
                    description: "Leading instruction in AI and machine learning technologies for military applications."
                },
                {
                    icon: "fas fa-server",
                    title: "DevOps Engineering",
                    description: "Expert in developing robust infrastructure solutions for defense operations."
                },
                {
                    icon: "fas fa-laptop-code",
                    title: "Full-Stack Development",
                    description: "Comprehensive expertise in modern web technologies for educational and operational needs."
                },
                {
                    icon: "fas fa-graduation-cap",
                    title: "Technology Leadership",
                    description: "Fostering next generation military technologists through innovative teaching methodologies."
                }
            ],
            contact: {
                title: "Professional Network",
                description: "Committed to leveraging cutting-edge technology in service of national defense and education",
                links: [
                    { icon: "fab fa-github", label: "GitHub", url: CONFIG.social.github },
                    { icon: "fab fa-linkedin", label: "LinkedIn", url: CONFIG.social.linkedin },
                    { icon: "fas fa-envelope", label: "Email", url: `mailto:${CONFIG.social.email}` }
                ]
            }
        };
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

// Navbar Component
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
                        ${links.map(link => `
                            <li><a href="${link.href}" class="nav-link">${link.name}</a></li>
                        `).join('')}
                    </ul>
                    <button class="nav-toggle" style="display: none;">
                        <i class="fas fa-bars"></i>
                    </button>
                </div>
            </div>
        `;
    }

    bindEvents() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick);
        });
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
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

// Education Component (placeholder)
class EducationComponent extends Component {
    render(data) {
        return `
            <div class="section" id="education">
                <div class="section-header">
                    <h2 class="section-title">Education</h2>
                    <p class="section-subtitle">Academic foundation and continuous learning</p>
                </div>
                <!-- Education content will be added -->
            </div>
        `;
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

// Export
window.ComponentManager = ComponentManager;