/**
 * Back to Top Button Manager
 * จัดการปุ่มกลับไปด้านบนที่ทันสมัยและสวยงาม
 */

class BackToTopManager {
    constructor() {
        this.button = null;
        this.isVisible = false;
        this.scrollProgress = 0;
        this.showThreshold = 300;
        this.isReducedMotion = this.checkReducedMotion();

        this.init();
    }

    init() {
        this.createButton();
        this.bindEvents();
        this.updateScrollProgress();
        console.log('Back to Top Manager initialized');
    }

    checkReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    createButton() {
        // ตรวจสอบว่ามี button อยู่แล้วหรือไม่
        const existingButton = document.querySelector('.back-to-top');
        if (existingButton) {
            existingButton.remove();
        }

        // สร้าง button element
        this.button = document.createElement('button');
        this.button.className = 'back-to-top';
        this.button.innerHTML = `
            <i class="fas fa-chevron-up" aria-hidden="true"></i>
        `;

        // เพิ่ม accessibility attributes
        this.button.setAttribute('aria-label', 'กลับไปด้านบน');
        this.button.setAttribute('title', 'กลับไปด้านบน');
        this.button.setAttribute('type', 'button');

        // ตั้งค่า CSS variables หาก root ไม่มี
        this.setDefaultCSSVariables();

        // เพิ่ม button เข้าไปใน DOM
        document.body.appendChild(this.button);

        console.log('Back to Top button created successfully');
    }

    setDefaultCSSVariables() {
        const root = document.documentElement;

        // ตั้งค่า default values หาก variables ไม่มี
        if (!getComputedStyle(root).getPropertyValue('--glass-bg')) {
            root.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.08)');
        }
        if (!getComputedStyle(root).getPropertyValue('--glass-border')) {
            root.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.18)');
        }
        if (!getComputedStyle(root).getPropertyValue('--text-light')) {
            root.style.setProperty('--text-light', '#f8f9fa');
        }
        if (!getComputedStyle(root).getPropertyValue('--text-accent')) {
            root.style.setProperty('--text-accent', '#ffd700');
        }
        if (!getComputedStyle(root).getPropertyValue('--gold-gradient')) {
            root.style.setProperty('--gold-gradient', 'linear-gradient(135deg, #ffd700 0%, #ffa500 100%)');
        }
    }

    bindEvents() {
        // Click event
        this.button.addEventListener('click', () => {
            this.scrollToTop();
        });

        // Scroll event with throttling
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Keyboard support
        this.button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.scrollToTop();
            }
        });

        // Theme change event
        window.addEventListener('themechange', () => {
            this.updateTheme();
        });

        // Resize event
        window.addEventListener('resize', this.debounce(() => {
            this.updatePosition();
        }, 100));
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // คำนวณ scroll progress
        this.scrollProgress = Math.min((scrollTop / (documentHeight - windowHeight)) * 100, 100);
        this.updateScrollProgress();

        // Debug information
        console.log(`Scroll: ${scrollTop}, Threshold: ${this.showThreshold}, Visible: ${this.isVisible}`);

        // แสดง/ซ่อน button
        if (scrollTop > this.showThreshold && !this.isVisible) {
            console.log('Showing button');
            this.showButton();
        } else if (scrollTop <= this.showThreshold && this.isVisible) {
            console.log('Hiding button');
            this.hideButton();
        }
    }

    updateScrollProgress() {
        if (this.button) {
            this.button.style.setProperty('--scroll-progress', `${this.scrollProgress}%`);
        }
    }

    showButton() {
        if (this.isVisible) return;

        this.isVisible = true;
        this.button.classList.add('visible');

        // เพิ่ม ripple effect
        if (!this.isReducedMotion) {
            this.addRippleEffect();
        }
    }

    hideButton() {
        if (!this.isVisible) return;

        this.isVisible = false;
        this.button.classList.remove('visible');
    }

    scrollToTop() {
        // เพิ่ม loading state
        this.button.style.pointerEvents = 'none';
        this.button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

        const scrollDuration = this.isReducedMotion ? 0 : 800;
        const startTime = performance.now();
        const startScrollTop = window.pageYOffset;

        const animateScroll = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / scrollDuration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            window.scrollTo(0, startScrollTop * (1 - easeOut));

            if (progress < 1) {
                requestAnimationFrame(animateScroll);
            } else {
                this.onScrollComplete();
            }
        };

        if (scrollDuration > 0) {
            requestAnimationFrame(animateScroll);
        } else {
            window.scrollTo(0, 0);
            this.onScrollComplete();
        }
    }

    onScrollComplete() {
        // รีเซ็ต button state
        this.button.style.pointerEvents = '';
        this.button.innerHTML = '<i class="fas fa-chevron-up"></i>';

        // เพิ่ม success animation
        if (!this.isReducedMotion) {
            this.addSuccessAnimation();
        }
    }

    addRippleEffect() {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 215, 0, 0.3);
            pointer-events: none;
            transform: scale(0);
            animation: ripple-expand 0.6s ease-out;
            width: 100px;
            height: 100px;
            top: -20px;
            left: -20px;
        `;

        this.button.appendChild(ripple);

        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);
    }

    addSuccessAnimation() {
        this.button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            this.button.style.transform = '';
        }, 150);
    }

    updateTheme() {
        // อัปเดต theme-specific styles
        const isDarkTheme = document.body.classList.contains('theme-dark');

        if (isDarkTheme) {
            this.button.style.setProperty('--glass-bg', 'rgba(45, 55, 72, 0.9)');
            this.button.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.2)');
        } else {
            this.button.style.setProperty('--glass-bg', 'rgba(255, 255, 255, 0.08)');
            this.button.style.setProperty('--glass-border', 'rgba(255, 255, 255, 0.18)');
        }
    }

    updatePosition() {
        // อัปเดตตำแหน่งสำหรับ responsive
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            this.button.style.bottom = '20px';
            this.button.style.right = '20px';
            this.button.style.width = '50px';
            this.button.style.height = '50px';
        } else {
            this.button.style.bottom = '30px';
            this.button.style.right = '30px';
            this.button.style.width = '60px';
            this.button.style.height = '60px';
        }
    }

    // Utility function
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

    // Public methods
    show() {
        this.showButton();
    }

    hide() {
        this.hideButton();
    }

    destroy() {
        if (this.button && this.button.parentNode) {
            this.button.parentNode.removeChild(this.button);
        }
    }

    // Enable/disable based on page context
    setEnabled(enabled) {
        if (enabled) {
            this.button.style.display = 'flex';
        } else {
            this.button.style.display = 'none';
        }
    }
}

// CSS Animation สำหรับ ripple effect
const backToTopStyles = document.createElement('style');
backToTopStyles.textContent = `
    @keyframes ripple-expand {
        to {
            transform: scale(1);
            opacity: 0;
        }
    }
    
    .back-to-top {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(backToTopStyles);

// Initialize เมื่อ DOM พร้อม
document.addEventListener('DOMContentLoaded', () => {
    // รอให้ theme manager โหลดก่อน
    setTimeout(() => {
        window.backToTopManager = new BackToTopManager();
    }, 100);
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BackToTopManager;
}