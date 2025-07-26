/**
 * Enhanced Blog Manager for GitHub Pages
 * จัดการ Blog UI และ UX ที่ทำงานกับ GitHub Pages Blog API
 */

class EnhancedBlogManager {
    constructor() {
        this.api = window.blogAPI || new GitHubPagesBlogAPI();
        this.blogPosts = [];
        this.currentFilter = 'all';
        this.isAdminLoggedIn = false;
        this.elements = {};
        this.autoSaveInterval = null;
        this.currentEditingPost = null;

        this.init();
    }

    /**
     * เริ่มต้นระบบ Blog Manager
     */
    async init() {
        try {
            this.cacheElements();
            this.setupEventListeners();
            await this.checkAuthStatus();
            await this.loadBlogPosts();
            this.setupAutoSave();
            this.updateSystemStatus();

            console.log('Enhanced Blog Manager initialized successfully');
        } catch (error) {
            console.error('Blog Manager initialization failed:', error);
            this.showMessage('เกิดข้อผิดพลาดในการออกจากระบบ', 'error');
        }
    }

    /**
     * จัดการการส่งฟอร์มบทความ
     */
    async handleBlogSubmit(e) {
        e.preventDefault();

        if (!this.isAdminLoggedIn) {
            this.showMessage('ไม่มีสิทธิ์ในการบันทึกบทความ', 'error');
            return;
        }

        if (!this.validateForm()) {
            this.showMessage('กรุณากรอกข้อมูลให้ครบถ้วน', 'warning');
            return;
        }

        try {
            this.showLoading(true);

            const postData = {
                title: this.elements.postTitle?.value || '',
                category: this.elements.postCategory?.value || '',
                categoryName: this.elements.postCategory?.selectedOptions[0]?.text || '',
                excerpt: this.elements.postExcerpt?.value || '',
                content: this.elements.postContent?.value || '',
                tags: this.elements.postTags?.value
                    .split(',')
                    .map(tag => tag.trim())
                    .filter(tag => tag),
                status: this.elements.postStatus?.value || 'draft',
                featured: false
            };

            let result;
            if (this.currentEditingPost) {
                // Update existing post
                result = await this.api.updatePost(this.currentEditingPost.id, postData);
            } else {
                // Create new post
                result = await this.api.createPost(postData);
            }

            if (result.success) {
                this.showMessage(
                    this.currentEditingPost ? 'อัปเดตบทความเรียบร้อยแล้ว!' : 'บันทึกบทความเรียบร้อยแล้ว!',
                    'success'
                );

                this.clearBlogForm();
                await this.loadBlogPosts();

                if (postData.status === 'published') {
                    this.showBlogSection('all');
                }
            } else {
                this.showMessage(result.error || 'เกิดข้อผิดพลาดในการบันทึก', 'error');
            }
        } catch (error) {
            console.error('Save error:', error);
            this.showMessage('เกิดข้อผิดพลาดในการบันทึกบทความ', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * แก้ไขบทความ
     */
    async editPost(postId) {
        try {
            const post = this.blogPosts.find(p => p.id === postId);
            if (!post) {
                this.showMessage('ไม่พบบทความที่ต้องการแก้ไข', 'error');
                return;
            }

            this.currentEditingPost = post;

            // Fill form with post data
            if (this.elements.postTitle) this.elements.postTitle.value = post.title;
            if (this.elements.postCategory) this.elements.postCategory.value = post.category;
            if (this.elements.postExcerpt) this.elements.postExcerpt.value = post.excerpt;
            if (this.elements.postContent) this.elements.postContent.value = post.content;
            if (this.elements.postTags) this.elements.postTags.value = post.tags.join(', ');
            if (this.elements.postStatus) this.elements.postStatus.value = post.status;

            // Update form button text
            if (this.elements.savePostBtn) {
                this.elements.savePostBtn.innerHTML = '<i class="fas fa-save"></i> อัปเดตบทความ';
            }

            // Switch to admin panel
            this.showBlogSection('admin');

            // Scroll to form
            if (this.elements.blogForm) {
                this.elements.blogForm.scrollIntoView({ behavior: 'smooth' });
            }

            this.showMessage('โหลดข้อมูลบทความสำหรับแก้ไขเรียบร้อยแล้ว', 'info');
        } catch (error) {
            console.error('Edit post error:', error);
            this.showMessage('เกิดข้อผิดพลาดในการโหลดบทความ', 'error');
        }
    }

    /**
     * ลบบทความ
     */
    async deletePost(postId) {
        try {
            const post = this.blogPosts.find(p => p.id === postId);
            if (!post) {
                this.showMessage('ไม่พบบทความที่ต้องการลบ', 'error');
                return;
            }

            if (!confirm(`คุณแน่ใจหรือไม่ที่จะลบบทความ "${post.title}"?`)) {
                return;
            }

            this.showLoading(true);
            const result = await this.api.deletePost(postId);

            if (result.success) {
                this.showMessage('ลบบทความเรียบร้อยแล้ว!', 'success');
                await this.loadBlogPosts();
            } else {
                this.showMessage(result.error || 'เกิดข้อผิดพลาดในการลบ', 'error');
            }
        } catch (error) {
            console.error('Delete post error:', error);
            this.showMessage('เกิดข้อผิดพลาดในการลบบทความ', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * ล้างฟอร์มบทความ
     */
    clearBlogForm() {
        if (!this.elements.blogForm) return;

        this.elements.blogForm.reset();
        this.currentEditingPost = null;

        // Reset button text
        if (this.elements.savePostBtn) {
            this.elements.savePostBtn.innerHTML = '<i class="fas fa-save"></i> บันทึกบทความ';
        }

        this.clearAutoSaveData();
        this.showMessage('ล้างฟอร์มเรียบร้อยแล้ว', 'info');
    }

    /**
     * ตรวจสอบความถูกต้องของฟอร์ม
     */
    validateForm() {
        const requiredFields = [
            { element: this.elements.postTitle, name: 'หัวข้อ' },
            { element: this.elements.postCategory, name: 'หมวดหมู่' },
            { element: this.elements.postExcerpt, name: 'สรุป' },
            { element: this.elements.postContent, name: 'เนื้อหา' }
        ];

        for (const field of requiredFields) {
            if (!field.element?.value?.trim()) {
                this.showMessage(`กรุณากรอก${field.name}`, 'warning');
                field.element?.focus();
                return false;
            }
        }

        return true;
    }

    /**
     * ตั้งค่า Auto Save
     */
    setupAutoSave() {
        if (!this.isAdminLoggedIn) return;

        // Clear existing interval
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        // Auto-save every 30 seconds
        this.autoSaveInterval = setInterval(() => {
            this.autoSave();
        }, 30000);
    }

    /**
     * Auto Save ร่าง
     */
    autoSave() {
        if (!this.isAdminLoggedIn || !this.hasFormData()) return;

        try {
            const formData = {
                title: this.elements.postTitle?.value || '',
                category: this.elements.postCategory?.value || '',
                excerpt: this.elements.postExcerpt?.value || '',
                content: this.elements.postContent?.value || '',
                tags: this.elements.postTags?.value || ''
            };

            localStorage.setItem('blog_auto_save', JSON.stringify({
                ...formData,
                savedAt: new Date().toISOString(),
                postId: this.currentEditingPost?.id || null
            }));

            this.showMessage('บันทึกร่างอัตโนมัติแล้ว', 'info', 2000);
        } catch (error) {
            console.error('Auto-save error:', error);
        }
    }

    /**
     * โหลดข้อมูล Auto Save
     */
    loadAutoSaveData() {
        try {
            const autoSaveData = localStorage.getItem('blog_auto_save');
            if (!autoSaveData) return false;

            const data = JSON.parse(autoSaveData);
            const timeDiff = new Date() - new Date(data.savedAt);

            // ใช้ข้อมูลที่บันทึกไว้ภายใน 24 ชั่วโมง
            if (timeDiff > 24 * 60 * 60 * 1000) {
                this.clearAutoSaveData();
                return false;
            }

            if (confirm('พบข้อมูลร่างที่บันทึกไว้ ต้องการโหลดหรือไม่?')) {
                if (this.elements.postTitle) this.elements.postTitle.value = data.title || '';
                if (this.elements.postCategory) this.elements.postCategory.value = data.category || '';
                if (this.elements.postExcerpt) this.elements.postExcerpt.value = data.excerpt || '';
                if (this.elements.postContent) this.elements.postContent.value = data.content || '';
                if (this.elements.postTags) this.elements.postTags.value = data.tags || '';

                this.showMessage('โหลดข้อมูลร่างเรียบร้อยแล้ว', 'success');
                return true;
            }
        } catch (error) {
            console.error('Load auto-save error:', error);
        }
        return false;
    }

    /**
     * ล้างข้อมูล Auto Save
     */
    clearAutoSaveData() {
        try {
            localStorage.removeItem('blog_auto_save');
        } catch (error) {
            console.error('Clear auto-save error:', error);
        }
    }

    /**
     * ตรวจสอบว่ามีข้อมูลในฟอร์มหรือไม่
     */
    hasFormData() {
        return [
            this.elements.postTitle?.value,
            this.elements.postContent?.value,
            this.elements.postExcerpt?.value
        ].some(value => value && value.trim());
    }

    /**
     * Trigger Auto Save
     */
    triggerAutoSave() {
        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }

        this.autoSaveTimeout = setTimeout(() => {
            this.autoSave();
        }, 5000); // Save after 5 seconds of inactivity
    }

    /**
     * โหลดร่างลงใน Select
     */
    loadDraftsIntoSelect() {
        // This can be implemented to show saved drafts in a dropdown
        // for easy access in the admin panel
    }

    /**
     * อัปเดตสถานะระบบ
     */
    async updateSystemStatus() {
        try {
            const status = this.api.getSystemStatus();

            // Create or update system status display
            if (!document.querySelector('.system-status')) {
                const statusElement = document.createElement('div');
                statusElement.className = 'system-status';
                statusElement.innerHTML = `
                    <div class="status-header">
                        <h4><i class="fas fa-info-circle"></i> สถานะระบบ</h4>
                    </div>
                    <div class="status-content">
                        <div class="status-item">
                            <span class="status-label">บทความทั้งหมด:</span>
                            <span class="status-value">${status.totalPosts || 0}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">บทความที่เผยแพร่:</span>
                            <span class="status-value">${status.publishedPosts || 0}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">บทความร่าง:</span>
                            <span class="status-value">${status.draftPosts || 0}</span>
                        </div>
                        <div class="status-item">
                            <span class="status-label">การใช้ Storage:</span>
                            <span class="status-value">${status.storageUsed?.usedMB || 0} MB</span>
                        </div>
                    </div>
                `;

                // Insert before admin form
                const adminPanel = this.elements.adminPanelSection;
                if (adminPanel) {
                    adminPanel.insertBefore(statusElement, adminPanel.firstChild);
                }
            }
        } catch (error) {
            console.error('Error updating system status:', error);
        }
    }

    /**
     * จัดการ Keyboard Shortcuts
     */
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S = Save post (in admin mode)
        if ((e.ctrlKey || e.metaKey) && e.key === 's' && this.isAdminLoggedIn) {
            e.preventDefault();
            if (this.elements.adminPanelSection?.style.display !== 'none') {
                this.elements.blogForm?.dispatchEvent(new Event('submit'));
            }
        }

        // Escape = Close modals
        if (e.key === 'Escape') {
            this.closeBlogModal();
            this.closeLoginModal();
        }

        // Ctrl/Cmd + Shift + N = New post (in admin mode)
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'N' && this.isAdminLoggedIn) {
            e.preventDefault();
            this.clearBlogForm();
            this.showBlogSection('admin');
        }
    }

    /**
     * แสดง Loading State
     */
    showLoading(isLoading) {
        const loadingElements = document.querySelectorAll('.loading-target');
        loadingElements.forEach(el => {
            if (isLoading) {
                el.classList.add('loading');
            } else {
                el.classList.remove('loading');
            }
        });

        // Disable/enable form during loading
        if (this.elements.blogForm) {
            const formElements = this.elements.blogForm.querySelectorAll('input, textarea, select, button');
            formElements.forEach(el => {
                el.disabled = isLoading;
            });
        }
    }

    /**
     * แสดงข้อผิดพลาดการเข้าสู่ระบบ
     */
    showLoginError(message) {
        if (this.elements.loginError) {
            this.elements.loginError.textContent = message;
            this.elements.loginError.style.display = 'block';
        }
    }

    /**
     * แสดงข้อความแจ้งเตือน
     */
    showMessage(message, type = 'info', duration = 5000) {
        // Remove existing messages
        document.querySelectorAll('.toast-message').forEach(el => el.remove());

        const messageEl = document.createElement('div');
        messageEl.className = `toast-message toast-${type}`;
        messageEl.innerHTML = `
            <div class="toast-content">
                <i class="fas fa-${this.getMessageIcon(type)}"></i>
                <span>${this.escapeHtml(message)}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Apply styles
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            max-width: 400px;
            z-index: 10000;
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(messageEl);

        // Auto remove after duration
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => messageEl.remove(), 300);
            }
        }, duration);
    }

    /**
     * รับไอคอนตามประเภทข้อความ
     */
    getMessageIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    /**
     * แปลงวันที่เป็นรูปแบบไทย
     */
    formatThaiDate(dateString) {
        try {
            const options = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            return new Date(dateString).toLocaleDateString('th-TH', options);
        } catch (error) {
            return dateString;
        }
    }

    /**
     * จัดรูปแบบเนื้อหา
     */
    formatContent(content) {
        if (!content) return '';

        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    }

    /**
     * Escape HTML
     */
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
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
            this.showLoading(true);
            const results = await this.api.searchPosts(query);
            this.blogPosts = results;
            this.renderBlogPosts();
        } catch (error) {
            console.error('Search failed:', error);
            this.showMessage('การค้นหาล้มเหลว', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * Export ข้อมูล Blog
     */
    async exportBlogData() {
        if (!this.isAdminLoggedIn) {
            this.showMessage('จำเป็นต้องเข้าสู่ระบบก่อน', 'warning');
            return;
        }

        try {
            const result = this.api.exportBlogData();
            if (result.success) {
                this.showMessage('Export ข้อมูลเรียบร้อยแล้ว', 'success');
            } else {
                this.showMessage(result.error || 'Export ล้มเหลว', 'error');
            }
        } catch (error) {
            console.error('Export error:', error);
            this.showMessage('เกิดข้อผิดพลาดในการ Export', 'error');
        }
    }

    /**
     * Destroy Blog Manager
     */
    destroy() {
        // Clear intervals
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        if (this.autoSaveTimeout) {
            clearTimeout(this.autoSaveTimeout);
        }

        // Remove event listeners
        document.removeEventListener('keydown', this.handleKeyboardShortcuts);

        // Clear references
        this.elements = {};
        this.blogPosts = [];

        console.log('Blog Manager destroyed');
    }
}

// CSS Animations สำหรับ Toast Messages
const createToastStyles = () => {
    if (document.getElementById('toast-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'toast-styles';
    styles.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }

        .toast-message {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        .toast-content {
            display: flex;
            align-items: center;
            gap: 12px;
            color: var(--text-light, #ffffff);
        }

        .toast-close {
            background: none;
            border: none;
            color: var(--text-muted, #cccccc);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.2s ease;
        }

        .toast-close:hover {
            background: rgba(255,255,255,0.1);
            color: var(--text-light, #ffffff);
        }

        .toast-success {
            border-left: 4px solid #28a745;
        }

        .toast-error {
            border-left: 4px solid #dc3545;
        }

        .toast-warning {
            border-left: 4px solid #ffc107;
        }

        .toast-info {
            border-left: 4px solid #17a2b8;
        }

        .system-status {
            background: var(--glass-bg);
            backdrop-filter: blur(20px);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .status-header h4 {
            margin: 0;
            color: var(--text-light);
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .status-content {
            margin-top: 15px;
        }

        .status-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid var(--glass-border);
        }

        .status-item:last-child {
            border-bottom: none;
        }

        .status-label {
            color: var(--text-muted);
        }

        .status-value {
            color: var(--text-accent);
            font-weight: 600;
        }

        .admin-actions {
            margin-top: 15px;
            display: flex;
            gap: 8px;
        }

        .btn-edit, .btn-delete {
            padding: 6px 12px;
            border: none;
            border-radius: 6px;
            font-size: 0.8rem;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .btn-edit {
            background: #007bff;
            color: white;
        }

        .btn-edit:hover {
            background: #0056b3;
        }

        .btn-delete {
            background: #dc3545;
            color: white;
        }

        .btn-delete:hover {
            background: #c82333;
        }

        .blog-stats {
            display: flex;
            gap: 15px;
            margin: 10px 0;
            font-size: 0.9rem;
            color: var(--text-muted);
        }

        .blog-stats span {
            display: flex;
            align-items: center;
            gap: 5px;
        }
    `;

    document.head.appendChild(styles);
};

// Initialize เมื่อ DOM พร้อม
document.addEventListener('DOMContentLoaded', () => {
    createToastStyles();

    // เช็คว่ามี GitHubPagesBlogAPI อยู่หรือไม่
    if (typeof window.blogAPI === 'undefined') {
        console.error('GitHubPagesBlogAPI not found. Please include the API script first.');
        return;
    }

    window.blogManager = new EnhancedBlogManager();

    // Global access for debugging
    window.EnhancedBlogManager = EnhancedBlogManager;
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedBlogManager;
}ดพลาดในการเริ่มต้นระบบ', 'error');
        }
    }

/**
 * แคช DOM Elements
 */
cacheElements() {
    this.elements = {
        // Main containers
        blogPostsContainer: document.getElementById('blog-posts-container'),
        blogContentSection: document.getElementById('blog-content'),
        adminPanelSection: document.getElementById('admin-panel'),

        // Modals
        blogModal: document.getElementById('blog-modal'),
        loginModal: document.getElementById('login-modal'),

        // Navigation buttons
        adminBtn: document.getElementById('admin-btn'),
        loginBtn: document.getElementById('login-btn'),
        logoutBtn: document.getElementById('logout-btn'),
        adminNavItem: document.getElementById('admin-nav-item'),

        // Forms
        loginForm: document.getElementById('login-form'),
        blogForm: document.getElementById('blog-form'),

        // Form fields
        postTitle: document.getElementById('post-title'),
        postCategory: document.getElementById('post-category'),
        postExcerpt: document.getElementById('post-excerpt'),
        postContent: document.getElementById('post-content'),
        postTags: document.getElementById('post-tags'),
        postStatus: document.getElementById('post-status'),

        // Buttons
        clearFormBtn: document.getElementById('clear-form-btn'),
        savePostBtn: document.querySelector('#blog-form button[type="submit"]'),

        // Modal elements
        modalTitle: document.getElementById('modal-title'),
        modalMeta: document.getElementById('modal-meta'),
        modalContent: document.getElementById('modal-content'),

        // Close buttons
        closeBlogModal: document.getElementById('close-blog-modal'),
        closeLoginModal: document.getElementById('close-login-modal'),

        // Login elements
        usernameInput: document.getElementById('username'),
        passwordInput: document.getElementById('password'),
        loginError: document.getElementById('login-error'),

        // System status
        systemStatus: document.createElement('div')
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
    this.elements.loginBtn?.addEventListener('click', () => this.showLoginModal());
    this.elements.logoutBtn?.addEventListener('click', () => this.logout());

    // Modal close buttons
    this.elements.closeBlogModal?.addEventListener('click', () => this.closeBlogModal());
    this.elements.closeLoginModal?.addEventListener('click', () => this.closeLoginModal());

    // Form submissions
    this.elements.loginForm?.addEventListener('submit', (e) => this.handleLogin(e));
    this.elements.blogForm?.addEventListener('submit', (e) => this.handleBlogSubmit(e));

    // Form buttons
    this.elements.clearFormBtn?.addEventListener('click', () => this.clearBlogForm());

    // Modal background clicks
    this.elements.blogModal?.addEventListener('click', (e) => {
        if (e.target === this.elements.blogModal) this.closeBlogModal();
    });
    this.elements.loginModal?.addEventListener('click', (e) => {
        if (e.target === this.elements.loginModal) this.closeLoginModal();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));

    // Auto-save triggers
    ['input', 'change'].forEach(eventType => {
        [this.elements.postTitle, this.elements.postContent, this.elements.postExcerpt].forEach(element => {
            element?.addEventListener(eventType, () => this.triggerAutoSave());
        });
    });

    // Form validation
    this.elements.blogForm?.addEventListener('input', () => this.validateForm());
}

    /**
     * ตรวจสอบสถานะการเข้าสู่ระบบ
     */
    async checkAuthStatus() {
    try {
        this.isAdminLoggedIn = this.api.checkAuthStatus();
        this.updateAdminUI();

        if (this.isAdminLoggedIn) {
            this.showMessage('ยินดีต้อนรับกลับสู่ระบบจัดการ Blog', 'info');
        }
    } catch (error) {
        console.error('Auth status check failed:', error);
        this.isAdminLoggedIn = false;
        this.updateAdminUI();
    }
}

/**
 * อัปเดต UI สำหรับ Admin
 */
updateAdminUI() {
    const isLoggedIn = this.isAdminLoggedIn;

    // Show/hide admin elements
    if (this.elements.adminBtn) this.elements.adminBtn.style.display = isLoggedIn ? 'block' : 'none';
    if (this.elements.loginBtn) this.elements.loginBtn.style.display = isLoggedIn ? 'none' : 'block';
    if (this.elements.logoutBtn) this.elements.logoutBtn.style.display = isLoggedIn ? 'block' : 'none';
    if (this.elements.adminNavItem) this.elements.adminNavItem.style.display = isLoggedIn ? 'block' : 'none';

    // Hide admin panel if not logged in
    if (!isLoggedIn && this.elements.adminPanelSection) {
        this.elements.adminPanelSection.style.display = 'none';
        if (this.elements.blogContentSection) {
            this.elements.blogContentSection.style.display = 'block';
        }
    }

    // Update admin form accessibility
    const formElements = [
        this.elements.postTitle, this.elements.postCategory, this.elements.postExcerpt,
        this.elements.postContent, this.elements.postTags, this.elements.postStatus,
        this.elements.clearFormBtn, this.elements.savePostBtn
    ];

    formElements.forEach(element => {
        if (element) {
            element.disabled = !isLoggedIn;
            if (isLoggedIn) {
                element.removeAttribute('disabled');
            } else {
                element.setAttribute('disabled', 'true');
            }
        }
    });
}

/**
 * แสดงส่วนต่างๆ ของ Blog
 */
showBlogSection(section) {
    // Update navigation active state
    document.querySelectorAll('.blog-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const activeBtn = document.querySelector(`[data-section="${section}"]`);
    if (activeBtn) activeBtn.classList.add('active');

    // Handle section display
    if (section === 'admin') {
        if (!this.isAdminLoggedIn) {
            this.showMessage('กรุณาเข้าสู่ระบบก่อนเข้าใช้งานส่วนจัดการ', 'warning');
            this.showLoginModal();
            return;
        }
        this.showAdminPanel();
    } else {
        this.showBlogContent(section);
    }
}

/**
 * แสดงส่วน Admin Panel
 */
showAdminPanel() {
    if (this.elements.blogContentSection) this.elements.blogContentSection.style.display = 'none';
    if (this.elements.adminPanelSection) this.elements.adminPanelSection.style.display = 'block';

    this.loadDraftsIntoSelect();
    this.updateSystemStatus();
}

/**
 * แสดงส่วน Blog Content
 */
showBlogContent(section) {
    if (this.elements.blogContentSection) this.elements.blogContentSection.style.display = 'block';
    if (this.elements.adminPanelSection) this.elements.adminPanelSection.style.display = 'none';

    this.currentFilter = section;
    this.renderBlogPosts();
}

    /**
     * โหลดบทความจาก API
     */
    async loadBlogPosts() {
    try {
        this.showLoading(true);
        this.blogPosts = await this.api.loadPosts();
        this.renderBlogPosts();
        console.log(`Loaded ${this.blogPosts.length} blog posts`);
    } catch (error) {
        console.error('Failed to load posts:', error);
        this.showMessage('ไม่สามารถโหลดบทความได้', 'error');
        this.showEmptyState('เกิดข้อผิดพลาดในการโหลดบทความ');
    } finally {
        this.showLoading(false);
    }
}

/**
 * แสดงบทความ
 */
renderBlogPosts() {
    if (!this.elements.blogPostsContainer) return;

    let filteredPosts = this.blogPosts.filter(post => post.status === 'published');

    // Apply category filter
    if (this.currentFilter !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === this.currentFilter);
    }

    // Sort by date (newest first)
    filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filteredPosts.length === 0) {
        this.showEmptyState('ไม่พบบทความในหมวดหมู่นี้');
        return;
    }

    this.elements.blogPostsContainer.innerHTML = filteredPosts.map(post => `
            <div class="blog-card animate-fade-in-up" onclick="blogManager.openBlogModal(${post.id})" style="cursor: pointer;">
                <div class="blog-meta">
                    <span class="blog-category">${this.escapeHtml(post.categoryName)}</span>
                    <span class="blog-date">${this.formatThaiDate(post.date)}</span>
                </div>
                <h3 class="blog-title">${this.escapeHtml(post.title)}</h3>
                <p class="blog-excerpt">${this.escapeHtml(post.excerpt)}</p>
                <div class="blog-tags">
                    ${post.tags.map(tag => `<span class="blog-tag">${this.escapeHtml(tag)}</span>`).join('')}
                </div>
                <div class="blog-stats">
                    <span><i class="fas fa-clock"></i> ${post.readTime} นาที</span>
                    <span><i class="fas fa-eye"></i> ${post.views || 0} ครั้ง</span>
                </div>
                <a href="#" class="blog-read-more" onclick="event.stopPropagation(); blogManager.openBlogModal(${post.id})">
                    อ่านต่อ <i class="fas fa-arrow-right"></i>
                </a>
                ${this.isAdminLoggedIn ? `
                    <div class="admin-actions">
                        <button onclick="event.stopPropagation(); blogManager.editPost(${post.id})" class="btn-edit">
                            <i class="fas fa-edit"></i> แก้ไข
                        </button>
                        <button onclick="event.stopPropagation(); blogManager.deletePost(${post.id})" class="btn-delete">
                            <i class="fas fa-trash"></i> ลบ
                        </button>
                    </div>
                ` : ''}
            </div>
        `).join('');
}

/**
 * แสดงสถานะว่าง
 */
showEmptyState(message) {
    if (!this.elements.blogPostsContainer) return;

    this.elements.blogPostsContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-alt"></i>
                <h3>${this.escapeHtml(message)}</h3>
                <p>ลองเปลี่ยนหมวดหมู่หรือกลับมาใหม่ภายหลัง</p>
                ${this.isAdminLoggedIn ? `
                    <button onclick="blogManager.showBlogSection('admin')" class="btn btn-primary">
                        <i class="fas fa-plus"></i> เขียนบทความใหม่
                    </button>
                ` : ''}
            </div>
        `;
}

    /**
     * เปิด Modal บทความ
     */
    async openBlogModal(postId) {
    try {
        const post = this.blogPosts.find(p => p.id === postId);
        if (!post) {
            this.showMessage('ไม่พบบทความที่ต้องการ', 'error');
            return;
        }

        // Update view count
        await this.api.updatePostViews(postId);
        post.views = (post.views || 0) + 1;

        // Update modal content
        if (this.elements.modalTitle) {
            this.elements.modalTitle.textContent = post.title;
        }

        if (this.elements.modalMeta) {
            this.elements.modalMeta.innerHTML = `
                    <div class="modal-meta-header">
                        <div class="author-info">
                            <span class="blog-category">${this.escapeHtml(post.categoryName)}</span>
                            <span class="author-name">โดย ${this.escapeHtml(post.author)}</span>
                            <span class="author-title">${this.escapeHtml(post.authorTitle)}</span>
                        </div>
                        <div class="post-info">
                            <span class="post-date">${this.formatThaiDate(post.date)}</span>
                            <span class="read-time"><i class="fas fa-clock"></i> ${post.readTime} นาที</span>
                            <span class="view-count"><i class="fas fa-eye"></i> ${post.views} ครั้ง</span>
                        </div>
                    </div>
                    <div class="blog-tags">
                        ${post.tags.map(tag => `<span class="blog-tag">${this.escapeHtml(tag)}</span>`).join('')}
                    </div>
                `;
        }

        if (this.elements.modalContent) {
            this.elements.modalContent.innerHTML = this.formatContent(post.content);
        }

        if (this.elements.blogModal) {
            this.elements.blogModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    } catch (error) {
        console.error('Error opening blog modal:', error);
        this.showMessage('เกิดข้อผิดพลาดในการแสดงบทความ', 'error');
    }
}

/**
 * ปิด Modal บทความ
 */
closeBlogModal() {
    if (this.elements.blogModal) {
        this.elements.blogModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * แสดง Modal เข้าสู่ระบบ
 */
showLoginModal() {
    if (this.elements.loginModal) {
        this.elements.loginModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    if (this.elements.loginError) {
        this.elements.loginError.style.display = 'none';
    }

    if (this.elements.loginForm) {
        this.elements.loginForm.reset();
    }

    if (this.elements.usernameInput) {
        this.elements.usernameInput.focus();
    }
}

/**
 * ปิด Modal เข้าสู่ระบบ
 */
closeLoginModal() {
    if (this.elements.loginModal) {
        this.elements.loginModal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

    /**
     * จัดการการเข้าสู่ระบบ
     */
    async handleLogin(e) {
    e.preventDefault();

    const username = this.elements.usernameInput?.value || '';
    const password = this.elements.passwordInput?.value || '';

    if (!username || !password) {
        this.showLoginError('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน');
        return;
    }

    try {
        this.showLoading(true);
        const result = await this.api.login(username, password);

        if (result.success) {
            this.isAdminLoggedIn = true;
            this.updateAdminUI();
            this.closeLoginModal();
            this.showMessage('เข้าสู่ระบบสำเร็จ!', 'success');

            // Auto-switch to admin panel
            setTimeout(() => {
                this.showBlogSection('admin');
            }, 1000);
        } else {
            this.showLoginError('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
    } catch (error) {
        console.error('Login error:', error);
        this.showLoginError('เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
    } finally {
        this.showLoading(false);
    }
}

    /**
     * ออกจากระบบ
     */
    async logout() {
    try {
        await this.api.logout();
        this.isAdminLoggedIn = false;
        this.updateAdminUI();
        this.clearBlogForm();

        // Reset navigation to "ทั้งหมด"
        document.querySelectorAll('.blog-nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        const allBtn = document.querySelector('[data-section="all"]');
        if (allBtn) allBtn.classList.add('active');

        this.currentFilter = 'all';
        this.renderBlogPosts();

        this.showMessage('ออกจากระบบเรียบร้อยแล้ว', 'info');
    } catch (error) {
        console.error('Logout error:', error);
        this.showMessage('เกิดข้อผิดพลาดในการออกจากระบบ', 'error');
    }
}