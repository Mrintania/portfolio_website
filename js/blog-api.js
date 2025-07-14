/**
 * Blog API Functions
 * จัดการการเชื่อมต่อกับ API และการจัดการข้อมูล
 */

class BlogAPI {
    constructor() {
        this.baseURL = 'blog-api.php';
        this.authToken = null;
        this.isLoading = false;
    }

    /**
     * ทำ API Request
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}?action=${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (this.authToken) {
            config.headers['Authorization'] = `Bearer ${this.authToken}`;
        }

        try {
            this.setLoading(true);
            const response = await fetch(url, config);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            this.setLoading(false);
            return data;
        } catch (error) {
            this.setLoading(false);
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * จัดการสถานะ Loading
     */
    setLoading(isLoading) {
        this.isLoading = isLoading;

        // อัปเดต UI loading state
        const elements = document.querySelectorAll('.loading-target');
        elements.forEach(el => {
            if (isLoading) {
                el.classList.add('loading');
            } else {
                el.classList.remove('loading');
            }
        });
    }

    /**
     * โหลดบทความทั้งหมด
     */
    async loadPosts() {
        try {
            const posts = await this.request('posts');
            return posts || [];
        } catch (error) {
            console.error('Failed to load posts:', error);
            this.showMessage('ไม่สามารถโหลดบทความได้', 'error');
            return [];
        }
    }

    /**
     * บันทึกบทความใหม่
     */
    async createPost(postData) {
        try {
            const response = await this.request('posts', {
                method: 'POST',
                body: JSON.stringify(postData)
            });

            if (response.success) {
                this.showMessage('บันทึกบทความเรียบร้อยแล้ว!', 'success');
                return response.post;
            } else {
                throw new Error('Failed to save post');
            }
        } catch (error) {
            console.error('Failed to save post:', error);
            this.showMessage('เกิดข้อผิดพลาดในการบันทึกบทความ', 'error');
            throw error;
        }
    }

    /**
     * อัปเดตบทความ
     */
    async updatePost(postId, postData) {
        try {
            const response = await this.request(`posts&id=${postId}`, {
                method: 'PUT',
                body: JSON.stringify(postData)
            });

            if (response.success) {
                this.showMessage('อัปเดตบทความเรียบร้อยแล้ว!', 'success');
                return response.post;
            } else {
                throw new Error('Failed to update post');
            }
        } catch (error) {
            console.error('Failed to update post:', error);
            this.showMessage('เกิดข้อผิดพลาดในการอัปเดตบทความ', 'error');
            throw error;
        }
    }

    /**
     * ลบบทความ
     */
    async deletePost(postId) {
        try {
            if (!confirm('คุณแน่ใจหรือไม่ที่จะลบบทความนี้?')) {
                return false;
            }

            const response = await this.request(`posts&id=${postId}`, {
                method: 'DELETE'
            });

            if (response.success) {
                this.showMessage('ลบบทความเรียบร้อยแล้ว!', 'success');
                return true;
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Failed to delete post:', error);
            this.showMessage('เกิดข้อผิดพลาดในการลบบทความ', 'error');
            return false;
        }
    }

    /**
     * เข้าสู่ระบบ
     */
    async login(username, password) {
        try {
            const response = await this.request('login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });

            if (response.success) {
                this.authToken = response.token;
                this.saveAuthToken(response.token);
                this.showMessage('เข้าสู่ระบบสำเร็จ!', 'success');
                return true;
            } else {
                this.showMessage('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'error');
                return false;
            }
        } catch (error) {
            console.error('Login failed:', error);
            this.showMessage('เกิดข้อผิดพลาดในการเข้าสู่ระบบ', 'error');
            return false;
        }
    }

    /**
     * ออกจากระบบ
     */
    logout() {
        this.authToken = null;
        this.clearAuthToken();
        this.showMessage('ออกจากระบบเรียบร้อยแล้ว', 'info');
    }

    /**
     * บันทึก Auth Token
     */
    saveAuthToken(token) {
        localStorage.setItem('blog_auth_token', token);
        localStorage.setItem('blog_admin_login', 'true');
        localStorage.setItem('blog_admin_login_time', Date.now().toString());
    }

    /**
     * ลบ Auth Token
     */
    clearAuthToken() {
        localStorage.removeItem('blog_auth_token');
        localStorage.removeItem('blog_admin_login');
        localStorage.removeItem('blog_admin_login_time');
    }

    /**
     * ตรวจสอบสถานะการเข้าสู่ระบบ
     */
    checkAuthStatus() {
        const loginStatus = localStorage.getItem('blog_admin_login');
        const loginTime = localStorage.getItem('blog_admin_login_time');
        const token = localStorage.getItem('blog_auth_token');

        // Session timeout (24 hours)
        const sessionTimeout = 24 * 60 * 60 * 1000;
        const isValidSession = loginStatus === 'true' &&
            loginTime &&
            token &&
            (Date.now() - parseInt(loginTime)) < sessionTimeout;

        if (isValidSession) {
            this.authToken = token;
            return true;
        } else {
            this.clearAuthToken();
            return false;
        }
    }

    /**
     * แสดงข้อความแจ้งเตือน
     */
    showMessage(message, type = 'info') {
        // สร้าง message element
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.innerHTML = `
            <i class="fas fa-${this.getMessageIcon(type)}"></i>
            <span>${message}</span>
        `;

        // เพิ่ม message ลงในหน้า
        const container = document.querySelector('.container') || document.body;
        container.insertBefore(messageEl, container.firstChild);

        // ลบ message หลัง 5 วินาที
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.parentNode.removeChild(messageEl);
            }
        }, 5000);
    }

    /**
     * ไอคอนสำหรับข้อความแจ้งเตือน
     */
    getMessageIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }

    /**
     * ตรวจสอบการเชื่อมต่อ API
     */
    async testConnection() {
        try {
            await this.request('metadata');
            return true;
        } catch (error) {
            console.error('API connection failed:', error);
            return false;
        }
    }

    /**
     * โหลดหมวดหมู่
     */
    async loadCategories() {
        try {
            const categories = await this.request('categories');
            return categories || [];
        } catch (error) {
            console.error('Failed to load categories:', error);
            return [];
        }
    }

    /**
     * โหลด metadata
     */
    async loadMetadata() {
        try {
            const metadata = await this.request('metadata');
            return metadata || {};
        } catch (error) {
            console.error('Failed to load metadata:', error);
            return {};
        }
    }

    /**
     * ค้นหาบทความ
     */
    async searchPosts(query) {
        try {
            const posts = await this.loadPosts();
            const filteredPosts = posts.filter(post => {
                const searchableText = `${post.title} ${post.excerpt} ${post.content} ${post.tags.join(' ')}`.toLowerCase();
                return searchableText.includes(query.toLowerCase());
            });
            return filteredPosts;
        } catch (error) {
            console.error('Search failed:', error);
            return [];
        }
    }

    /**
     * บันทึกร่างบทความ (Local Storage)
     */
    saveDraft(postData) {
        const drafts = this.getDrafts();
        const draftId = `draft_${Date.now()}`;
        drafts[draftId] = {
            ...postData,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem('blog_drafts', JSON.stringify(drafts));
        this.showMessage('บันทึกร่างเรียบร้อยแล้ว', 'info');
        return draftId;
    }

    /**
     * โหลดร่างบทความ
     */
    getDrafts() {
        try {
            return JSON.parse(localStorage.getItem('blog_drafts') || '{}');
        } catch (error) {
            console.error('Failed to load drafts:', error);
            return {};
        }
    }

    /**
     * ลบร่างบทความ
     */
    deleteDraft(draftId) {
        const drafts = this.getDrafts();
        delete drafts[draftId];
        localStorage.setItem('blog_drafts', JSON.stringify(drafts));
        this.showMessage('ลบร่างเรียบร้อยแล้ว', 'info');
    }
}

// Export สำหรับใช้งาน
window.BlogAPI = BlogAPI;