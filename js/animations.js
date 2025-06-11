/**
 * Portfolio Website Animation System
 * Handles advanced animations and visual effects
 */

class AnimationController {
    constructor() {
        this.animationQueue = [];
        this.isReducedMotion = this.checkReducedMotion();
        this.scrollPosition = 0;
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.initializeParallax();
        this.setupTypewriterEffect();
        this.initializeCounterAnimations();
        this.setupHoverEffects();
        
        console.log('Animation system initialized');
    }

    checkReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    setupScrollAnimations() {
        if (this.isReducedMotion) return;

        const scrollElements = document.querySelectorAll('.scroll-animate');
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -100px 0px'
        };

        const scrollObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerScrollAnimation(entry.target);
                }
            });
        }, observerOptions);

        // Add scroll-animate class to elements that should animate on scroll
        const elementsToAnimate = [
            '.expertise-card',
            '.tech-category',
            '.stat-item',
            '.section-title'
        ];

        elementsToAnimate.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                el.classList.add('scroll-animate');
                scrollObserver.observe(el);
            });
        });
    }

    triggerScrollAnimation(element) {
        if (this.isReducedMotion) return;

        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        // Use requestAnimationFrame for smooth animation
        requestAnimationFrame(() => {
            element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        });
    }

    initializeParallax() {
        if (this.isReducedMotion) return;

        const parallaxElements = document.querySelectorAll('.header-section::before');
        
        window.addEventListener('scroll', this.debounce(() => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${parallax}px)`;
            });
        }, 10));
    }

    setupTypewriterEffect() {
        const typewriterElements = document.querySelectorAll('.typewriter');
        
        typewriterElements.forEach(element => {
            this.createTypewriterEffect(element);
        });
    }

    createTypewriterEffect(element) {
        if (this.isReducedMotion) return;

        const text = element.textContent;
        const speed = element.dataset.speed || 50;
        
        element.textContent = '';
        element.style.borderRight = '2px solid #fff';
        element.style.animation = 'blink 1s infinite';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, speed);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    element.style.borderRight = 'none';
                    element.style.animation = 'none';
                }, 1000);
            }
        };
        
        // Start typing effect after a delay
        setTimeout(typeWriter, 1000);
    }

    initializeCounterAnimations() {
        const counterElements = document.querySelectorAll('.stat-number');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counterElements.forEach(el => {
            counterObserver.observe(el);
        });
    }

    animateCounter(element) {
        if (this.isReducedMotion) {
            return;
        }

        const text = element.textContent;
        const hasPlus = text.includes('+');
        const hasPercent = text.includes('%');
        const targetNumber = parseInt(text.replace(/[^\d]/g, ''));
        
        if (isNaN(targetNumber)) return;

        let currentNumber = 0;
        const increment = targetNumber / 60; // 60 frames for smooth animation
        const duration = 2000; // 2 seconds
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

    setupHoverEffects() {
        if (this.isReducedMotion) return;

        // Enhanced card hover effects
        const cards = document.querySelectorAll('.expertise-card, .tech-category');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.createRippleEffect(e);
                this.addGlowEffect(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.removeGlowEffect(card);
            });
        });

        // Tech tag hover effects
        const techTags = document.querySelectorAll('.tech-tag');
        techTags.forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                this.addPulseEffect(tag);
            });
            
            tag.addEventListener('mouseleave', () => {
                this.removePulseEffect(tag);
            });
        });
    }

    createRippleEffect(event) {
        const card = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = card.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    addGlowEffect(element) {
        element.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.2), 0 0 20px rgba(102, 126, 234, 0.1)';
        element.style.transition = 'all 0.3s ease';
    }

    removeGlowEffect(element) {
        element.style.boxShadow = '';
    }

    addPulseEffect(element) {
        element.style.animation = 'pulse 1.5s infinite';
    }

    removePulseEffect(element) {
        element.style.animation = '';
    }

    // Loading animation for the entire page
    initializePageLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="military-spinner"></div>
                <p>Loading Professional Portfolio...</p>
            </div>
        `;
        
        document.body.appendChild(loader);
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                loader.style.transition = 'opacity 0.5s ease';
                setTimeout(() => loader.remove(), 500);
            }, 1000);
        });
    }

    // Smooth reveal animation for sections
    revealSection(sectionElement, delay = 0) {
        if (this.isReducedMotion) return;

        setTimeout(() => {
            sectionElement.style.opacity = '0';
            sectionElement.style.transform = 'translateY(50px)';
            
            requestAnimationFrame(() => {
                sectionElement.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
                sectionElement.style.opacity = '1';
                sectionElement.style.transform = 'translateY(0)';
            });
        }, delay);
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

    // Add floating particles background effect
    createFloatingParticles() {
        if (this.isReducedMotion) return;

        const particleContainer = document.createElement('div');
        particleContainer.className = 'floating-particles';
        particleContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                animation: float ${5 + Math.random() * 10}s infinite ease-in-out;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 5}s;
            `;
            particleContainer.appendChild(particle);
        }

        document.body.appendChild(particleContainer);
    }
}

// CSS Animation Keyframes (to be added to CSS)
const animationStyles = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes blink {
    0%, 50% { border-color: transparent; }
    51%, 100% { border-color: #fff; }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0px) rotate(0deg);
        opacity: 0.3;
    }
    50% {
        transform: translateY(-20px) rotate(180deg);
        opacity: 0.6;
    }
}

.page-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    color: white;
}

.loader-content {
    text-align: center;
}

.military-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid rgba(212, 175, 55, 0.3);
    border-top: 3px solid #d4af37;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;

// Inject animation styles
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Initialize animation controller when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.animationController = new AnimationController();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationController;
}