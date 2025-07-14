/**
 * Blog Main Application
 * จัดการ UI และ User Interactions
 */

class BlogApp {
    constructor() {
        this.api = new BlogAPI();
        this.blogPosts = [];
        this.currentFilter = 'all';
        this.isAdminLoggedIn = false;
        this.elements = {};

        this.init();
    }

    /**
     * เริ่มต้นแอป
     */
    async init() {
        this.cacheElements();
        this.setupEventListeners();
        await this.checkAuthStatus();
        await this.loadBlogPosts();
    }

    /**
     * แคช DOM Elements
     */
    cacheElements() {
        this.elements = {
            blogPostsContainer: document.getElementById('blog-posts-container'),
            blogContentSection: document.getElementById('blog-content'),
            adminPanelSection: document.getElementById('admin-panel'),
            blogModal: document.getElementById('blog-modal'),
            loginModal: document.getElementById('login-modal'),

            // Buttons
            adminBtn: document.getElementById('admin-btn'),
            loginBtn: document.getElementById('login-btn'),
            logoutBtn: document.getElementById('logout-btn'),
            adminNavItem: document.getElementById('admin-nav-item'),

            // Form elements
            loginForm: document.getElementById('login-form'),
            blogForm: document.getElementById('blog-form'),
            clearFormBtn: document.getElementById('clear-form-btn'),

            // Modal close buttons
            closeBlogModal: document.getElementById('close-blog-modal'),
            closeLoginModal: document.getElementById('close-login-modal'),

            // Login error
            loginError: document.getElementById('login-error')
        };
    }

    /**
     * ตั้งค่า Event Listeners
     */
    setupEventListeners() {
        // Navigation buttons
        document.querySelectorAll('.blog-nav-btn[data-section]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.blog-nav-btn').getAttribute('data-section');
                this.showBlogSection(section);
            });
        });

        // Auth buttons
        this.elements.loginBtn.addEventListener('click', () => this.showLoginModal());
        this.elements.logoutBtn.addEventListener('click', () => this.logout());

        // Modal close buttons
        this.elements.closeBlogModal.addEventListener('click', () => this.closeBlogModal());
        this.elements.closeLoginModal.addEventListener('click', () => this.closeLoginModal());

        // Form submissions
        this.elements.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.elements.blogForm.addEventListener('submit', (e) => this.handleBlogSubmit(e));
        this.elements.clearFormBtn.addEventListener('click', () => this.clearBlogForm());

        // Modal background clicks
        this.elements.blogModal.addEventListener('click', (e) => {
            if (e.target === this.elements.blogModal) this.closeBlogModal();
        });
        this.elements.loginModal.addEventListener('click', (e) => {
            if (e.target === this.elements.loginModal) this.closeLoginModal();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeBlogModal();
                this.closeLoginModal();
            }
        });
    }

    /**
     * ตรวจสอบสถานะการเข้าสู่ระบบ
     */
    async checkAuthStatus() {
        this.isAdminLoggedIn = this.api.checkAuthStatus();
        this.updateAdminUI();
    }

    /**
     * อัปเดต UI สำหรับ Admin
     */
    updateAdminUI() {
        if (this.isAdminLoggedIn) {
            this.elements.adminBtn.style.display = 'block';
            this.elements.loginBtn.style.display = 'none';
            this.elements.logoutBtn.style.display = 'block';
            this.elements.adminNavItem.style.display = 'block';
        } else {
            this.elements.adminBtn.style.display = 'none';
            this.elements.loginBtn.style.display = 'block';
            this.elements.logoutBtn.style.display = 'none';
            this.elements.adminNavItem.style.display = 'none';
            this.elements.adminPanelSection.style.display = 'none';
            this.elements.blogContentSection.style.display = 'block';
        }
    }

    /**
     * แสดงส่วนต่างๆ ของ Blog
     */
    showBlogSection(section) {
        // อัปเดต navigation
        document.querySelectorAll('.blog-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        if (section === 'admin') {
            if (!this.isAdminLoggedIn) {
                alert('กรุณาเข้าสู่ระบบก่อนเข้าใช้งานส่วนจัดการ');
                this.showLoginModal();
                return;
            }
            this.elements.blogContentSection.style.display = 'none';
            this.elements.adminPanelSection.style.display = 'block';
        } else {
            this.elements.blogContentSection.style.display = 'block';
            this.elements.adminPanelSection.style.display = 'none';
            this.currentFilter = section;
            this.renderBlogPosts();
        }
    }

    /**
     * โหลดบทความจาก API
     */
    async loadBlogPosts() {
        try {
            this.blogPosts = await this.api.loadPosts();
            this.renderBlogPosts();
        } catch (error) {
            console.error('Failed to load posts:', error);
            this.showEmptyState('ไม่สามารถโหลดบทความได้');
        }
    }

    /**
     * แสดงบทความ
     */
    renderBlogPosts() {
        let filteredPosts = this.blogPosts.filter(post => post.status === 'published');

        if (this.currentFilter !== 'all') {
            filteredPosts = filteredPosts.filter(post => post.category === this.currentFilter);
        }

        if (filteredPosts.length === 0) {
            this.showEmptyState('ไม่พบบทความในหมวดหมู่นี้');
            return;
        }

        this.elements.blogPostsContainer.innerHTML = filteredPosts.map(post => `
            <div class="blog-card" onclick="blogApp.openBlogModal(${post.id})">
                <div class="blog-meta">
                    <span class="blog-category">${post.categoryName}</span>
                    <span>${this.formatThaiDate(post.date)}</span>
                </div>
                <h3 class="blog-title">${post.title}</h3>
                <p class="blog-excerpt">${post.excerpt}</p>
                <div class="blog-tags">
                    ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
                <a href="#" class="blog-read-more" onclick="event.stopPropagation(); blogApp.openBlogModal(${post.id})">
                    อ่านต่อ <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `).join('');
    }

    /**
     * แสดงสถานะว่าง
     */
    showEmptyState(message) {
        this.elements.blogPostsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>${message}</h3>
                <p>ลองเปลี่ยนหมวดหมู่หรือกลับมาใหม่ภายหลัง</p>
            </div>
        `;
    }

    /**
     * แปลงวันที่เป็นรูปแบบไทย
     */
    formatThaiDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('th-TH', options);
    }

    /**
     * เปิด Modal บทความ
     */
    openBlogModal(postId) {
        const post = this.blogPosts.find(p => p.id === postId);
        if (!post) return;

        document.getElementById('modal-title').textContent = post.title;
        document.getElementById('modal-meta').innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <div>
                    <span class="blog-category">${post.categoryName}</span>
                    <span style="margin-left: 1rem;">โดย ${post.author}</span>
                </div>
                <span>${this.formatThaiDate(post.date)}</span>
            </div>
            <div class="blog-tags">
                ${post.tags.map(tag => `<span class="blog-tag">${tag}</span>`).join('')}
            </div>
        `;

        // แปลง markdown เป็น HTML
        let content = post.content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        document.getElementById('modal-content').innerHTML = '<p>' + content + '</p>';
        this.elements.blogModal.style.display = 'flex';

        // อัปเดตจำนวนการดู (ถ้าต้องการ)
        this.updatePostViews(postId);
    }

    /**
     * ปิด Modal บทความ
     */
    closeBlogModal() {
        this.elements.blogModal.style.display = 'none';
    }

    /**
     * แสดง Modal เข้าสู่ระบบ
     */
    showLoginModal() {
        this.elements.loginModal.style.display = 'flex';
        this.elements.loginError.style.display = 'none';
        this.elements.loginForm.reset();
        document.getElementById('username').focus();
    }

    /**
     * ปิด Modal เข้าสู่ระบบ
     */
    closeLoginModal() {
        this.elements.loginModal.style.display = 'none';
    }

    /**
     * จัดการการเข้าสู่ระบบ
     */
    async handleLogin(e) {
        e.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const success = await this.api.login(username, password);

            if (success) {
                this.isAdminLoggedIn = true;
                this.updateAdminUI();
                this.closeLoginModal();
            } else {
                this.elements.loginError.style.display = 'block';
            }
        } catch (error) {
            this.elements.loginError.style.display = 'block';
            console.error('Login error:', error);
        }
    }

    /**
     * ออกจากระบบ
     */
    logout() {
        this.api.logout();
        this.isAdminLoggedIn = false;
        this.updateAdminUI();

        // รีเซ็ต navigation กลับไปที่ "ทั้งหมด"
        document.querySelectorAll('.blog-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('[data-section="all"]').classList.add('active');
        this.currentFilter = 'all';
        this.renderBlogPosts();
    }

    /**
     * จัดการการส่งฟอร์มบทความ
     */
    async handleBlogSubmit(e) {
        e.preventDefault();

        if (!this.isAdminLoggedIn) {
            alert('ไม่มีสิทธิ์ในการบันทึกบทความ');
            return;
        }

        const postData = {
            title: document.getElementById('post-title').value,
            category: document.getElementById('post-category').value,
            categoryName: document.getElementById('post-category').selectedOptions[0].text,
            excerpt: document.getElementById('post-excerpt').value,
            content: document.getElementById('post-content').value,
            tags: document.getElementById('post-tags').value
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag),
            status: document.getElementById('post-status').value,
        };

        try {
            await this.api.createPost(postData);
            this.clearBlogForm();
            await this.loadBlogPosts(); // โหลดบทความใหม่

            if (postData.status === 'published') {
                this.showBlogSection('all');
            }
        } catch (error) {
            console.error('Save error:', error);
        }
    }

    /**
     * ล้างฟอร์มบทความ
     */
    clearBlogForm() {
        if (!this.isAdminLoggedIn) {
            alert('ไม่มีสิทธิ์ในการใช้งานฟอร์มนี้');
            return;
        }
        this.elements.blogForm.reset();
    }

    /**
     * บันทึกร่างอัตโนมัติ
     */
    autoSaveDraft() {
        if (!this.isAdminLoggedIn) return;

        const formData = new FormData(this.elements.blogForm);
        const draftData = Object.fromEntries(formData);

        if (draftData.title || draftData.content) {
            this.api.saveDraft(draftData);
        }
    }

    /**
     * อัปเดตจำนวนการดู
     */
    async updatePostViews(postId) {
        // อัปเดต local
        const post = this.blogPosts.find(p => p.id === postId);
        if (post) {
            post.views = (post.views || 0) + 1;
        }

        // อาจส่งไป API ถ้าต้องการ
        // await this.api.updatePostViews(postId);
    }

    /**
     * ค้นหาบทความ
     */
    async searchPosts(query) {
        if (!query.trim()) {
            this.renderBlogPosts();
            return;
        }

        try {
            const results = await this.api.searchPosts(query);
            this.blogPosts = results;
            this.renderBlogPosts();
        } catch (error) {
            console.error('Search failed:', error);
        }
    }
}

// เริ่มต้นแอปเมื่อ DOM พร้อม
document.addEventListener('DOMContentLoaded', () => {
    window.blogApp = new BlogApp();

    // Auto-save draft ทุก 30 วินาที
    setInterval(() => {
        if (window.blogApp.isAdminLoggedIn) {
            window.blogApp.autoSaveDraft();
        }
    }, 30000);
});