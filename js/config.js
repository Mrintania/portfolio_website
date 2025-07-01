// ===================================
// CONFIGURATION FILE (Updated with Blog)
// ===================================

const CONFIG = {
    // Site Configuration
    site: {
        title: "SGT. Pornsupat Vutisuwan | Professional Portfolio",
        description: "DevOps Engineer & AI Instructor specializing in military technology",
        author: "Pornsupat Vutisuwan",
        version: "2.0.0"
    },

    // Animation Settings
    animations: {
        enabled: true,
        speed: {
            fast: 300,
            medium: 500,
            slow: 800
        },
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        respectReducedMotion: true
    },

    // Theme Settings
    theme: {
        mode: 'dark', // 'light' or 'dark'
        primaryColor: '#FFD700',
        accentColor: '#667eea'
    },

    // Navigation Configuration (Updated)
    navigation: {
        brand: "SGT.PORNSUPAT",
        logo: "assets/images/profile_1.png",
        links: [
            { name: "Home", href: "#home", icon: "fas fa-home" },
            { name: "Experience", href: "#experience", icon: "fas fa-briefcase" },
            { name: "Skills", href: "#skills", icon: "fas fa-cogs" },
            { name: "Education", href: "#education", icon: "fas fa-graduation-cap" },
            { name: "Blog", href: "blog.html", icon: "fas fa-blog", external: true }, // เพิ่ม Blog link
            { name: "Contact", href: "#contact", icon: "fas fa-envelope" }
        ]
    },

    // Blog Configuration (ใหม่)
    blog: {
        enabled: true,
        postsPerPage: 6,
        categories: [
            { id: "ai-ml", name: "AI/ML", icon: "fas fa-robot" },
            { id: "devops", name: "DevOps", icon: "fas fa-server" },
            { id: "cybersecurity", name: "Cybersecurity", icon: "fas fa-shield-alt" },
            { id: "military-tech", name: "Military Tech", icon: "fas fa-satellite" },
            { id: "education", name: "Education", icon: "fas fa-graduation-cap" }
        ],
        defaultCategory: "ai-ml",
        showDrafts: false // true เฉพาะใน admin mode
    },

    // API Endpoints (Updated)
    api: {
        base: "",
        endpoints: {
            content: "config/content.json",
            blogPosts: "config/blog-content.json", // เพิ่ม blog endpoint
            stats: "api/stats",
            contact: "api/contact"
        }
    },

    // Feature Flags (Updated)
    features: {
        animations: true,
        darkMode: true,
        analytics: false,
        blog: true, // เพิ่ม blog feature flag
        projects: true
    },

    // Social Links
    social: {
        github: "https://github.com/Mrintania",
        linkedin: "https://www.linkedin.com/in/pornsupat-v/",
        email: "pornsupat.vu@signalschool.ac.th"
    },

    // Performance Settings
    performance: {
        lazyLoading: true,
        imageOptimization: true,
        preloadCritical: true
    },

    // SEO Configuration (Updated)
    seo: {
        keywords: [
            "DevOps Engineer",
            "AI Instructor",
            "Royal Thai Army",
            "Signal Department",
            "Military Technology",
            "Computer Science Education",
            "Tech Blog" // เพิ่ม blog keyword
        ],
        ogImage: "assets/images/og-image.jpg",
        twitterCard: "summary_large_image"
    }
};

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

// Global access
window.CONFIG = CONFIG;