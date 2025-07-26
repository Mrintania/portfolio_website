/**
 * Enhanced Blog API for GitHub Pages
 * ระบบ Blog API ที่ทำงานร่วมกับ GitHub Pages โดยใช้ localStorage และ JSON
 */

class GitHubPagesBlogAPI {
    constructor() {
        this.storageKey = 'signal_blog_data';
        this.authKey = 'signal_blog_auth';
        this.adminCredentials = {
            username: 'admin_signal',
            password: 'Signal@2024',
            sessionTimeout: 24 * 60 * 60 * 1000 // 24 hours
        };

        this.initializeData();
    }

    /**
     * เริ่มต้นข้อมูล Blog
     */
    initializeData() {
        if (!this.getBlogData()) {
            const initialData = {
                posts: [
                    {
                        id: 1,
                        title: "การประยุกต์ใช้ AI ในระบบการสื่อสารทหาร",
                        slug: "ai-military-communication-systems",
                        category: "ai-ml",
                        categoryName: "AI/ML",
                        excerpt: "การศึกษาการนำเทคโนโลยี Artificial Intelligence มาใช้ในการปรับปรุงประสิทธิภาพของระบบการสื่อสารทางทหาร พร้อมกรณีศึกษาจากการประยุกต์ใช้งานจริง",
                        content: `ในยุคดิจิทัลปัจจุบัน การนำเทคโนโลยี Artificial Intelligence (AI) มาประยุกต์ใช้ในด้านการทหารได้กลายเป็นสิ่งที่มีความสำคัญอย่างยิ่ง โดยเฉพาะอย่างยิ่งในระบบการสื่อสารทหาร ซึ่งเป็นหัวใจสำคัญของการดำเนินภารกิจต่าง ๆ

**ความสำคัญของ AI ในระบบการสื่อสารทหาร**

1. **การประมวลผลข้อมูลแบบอัตโนมัติ**
   - AI สามารถวิเคราะห์และประมวลผลข้อมูลจำนวนมากได้อย่างรวดเร็ว
   - ลดความผิดพลาดจากการดำเนินงานด้วยมนุษย์
   - เพิ่มความแม่นยำในการตัดสินใจ

2. **การรักษาความปลอดภัยของข้อมูล**
   - ระบบ AI สามารถตรวจจับการบุกรุกและภัยคุกคามได้แบบเรียลไทม์
   - การเข้ารหัสข้อมูลแบบอัจฉริยะ
   - การจัดการและควบคุมการเข้าถึงข้อมูลอย่างมีประสิทธิภาพ

**การนำไปใช้งานจริงในหน่วยงาน**

จากประสบการณ์การทำงานที่โรงเรียนทหารสื่อสาร กรมการทหารสื่อสาร พบว่าการนำ AI มาใช้ในการฝึกอบรมและการพัฒนาระบบได้ให้ผลลัพธ์ที่ดีเยี่ยม โดยเฉพาะในด้าน:

- การจำลองสถานการณ์การสื่อสารในภาวะฉุกเฉิน
- การวิเคราะห์ประสิทธิภาพของเครือข่ายการสื่อสาร
- การพัฒนาระบบการเรียนรู้สำหรับบุคลากรใหม่

**ความท้าทายและแนวทางแก้ไข**

การนำ AI มาใช้ในระบบทหารมีความท้าทายหลายประการ เช่น ความปลอดภัยของข้อมูล การฝึกอบรมบุคลากร และการบำรุงรักษาระบบ แต่ด้วยการวางแผนที่ดีและการพัฒนาอย่างต่อเนื่อง ปัญหาเหล่านี้สามารถแก้ไขได้

**สรุป**

การประยุกต์ใช้ AI ในระบบการสื่อสารทหารเป็นการลงทุนที่คุ้มค่าและจำเป็นสำหรับการเตรียมพร้อมรับมือกับความท้าทายในอนาคต การศึกษาและพัฒนาอย่างต่อเนื่องจะช่วยให้เราสามารถใช้ประโยชน์จากเทคโนโลยีนี้ได้อย่างเต็มศักยภาพ`,
                        tags: ["AI", "Machine Learning", "Military", "Communication", "Technology", "Defense"],
                        author: "SGT. Pornsupat Vutisuwan",
                        authorTitle: "DevOps Engineer & AI Instructor",
                        date: "2024-12-15",
                        lastModified: "2024-12-15",
                        status: "published",
                        featured: true,
                        readTime: 8,
                        views: 1250
                    },
                    {
                        id: 2,
                        title: "DevOps Best Practices สำหรับองค์กรทหาร",
                        slug: "devops-best-practices-military-organizations",
                        category: "devops",
                        categoryName: "DevOps",
                        excerpt: "แนวทางปฏิบัติที่ดีสำหรับการนำ DevOps มาใช้ในสภาพแวดล้อมที่มีความต้องการด้านความปลอดภัยสูง พร้อมเครื่องมือและกระบวนการที่เหมาะสม",
                        content: `DevOps ได้กลายเป็นวิธีการพัฒนาและดำเนินงานที่สำคัญในโลกเทคโนโลยี แต่การนำมาใช้ในองค์กรทหารต้องการการปรับแต่งและความระมัดระวังเป็นพิเศษ

**ความสำคัญของ DevOps ในองค์กรทหาร**

การทำงานในสภาพแวดล้อมทหารต้องการความรวดเร็ว ความถูกต้อง และความปลอดภัยสูงสุด DevOps ช่วยให้เราบรรลุเป้าหมายเหล่านี้ได้อย่างมีประสิทธิภาพ

**หลักการสำคัญที่ควรปฏิบัติ**

1. **Security First Approach**
   - การรักษาความปลอดภัยต้องอยู่ในทุกขั้นตอนของการพัฒนา
   - การใช้ Container Security และ Image Scanning
   - การจัดการ Secrets และ Credentials อย่างปลอดภัย

2. **Infrastructure as Code (IaC)**
   - การจัดการโครงสร้างพื้นฐานผ่านโค้ด
   - ความสามารถในการ Reproduce สภาพแวดล้อม
   - การควบคุมเวอร์ชันของโครงสร้างพื้นฐาน

3. **Monitoring และ Logging**
   - การติดตามระบบแบบเรียลไทม์
   - การเก็บบันทึกเพื่อการวิเคราะห์และติดตาม
   - การแจ้งเตือนเมื่อเกิดปัญหา

**เครื่องมือที่แนะนำ**

- **CI/CD Pipeline**: Jenkins, GitLab CI, GitHub Actions
- **Containerization**: Docker, Kubernetes
- **Infrastructure**: Terraform, Ansible
- **Monitoring**: Prometheus, Grafana, ELK Stack

**การนำไปใช้จริง**

จากประสบการณ์การทำงาน การนำ DevOps มาใช้ในโรงเรียนทหารสื่อสารได้ช่วยปรับปรุงประสิทธิภาพการทำงานอย่างมาก โดยเฉพาะในด้าน:

- การพัฒนาระบบการเรียนการสอนออนไลน์
- การจัดการระบบข้อมูลนักเรียน
- การพัฒนาแอปพลิเคชันสำหรับการฝึกอบรม

**ความท้าทายและการแก้ไข**

การนำ DevOps มาใช้ในสภาพแวดล้อมทหารมีความท้าทายเฉพาะ เช่น ข้อจำกัดด้านความปลอดภัย การได้รับอนุมัติสำหรับเครื่องมือใหม่ และการฝึกอบรมบุคลากร

**สรุป**

DevOps เป็นเครื่องมือที่ทรงพลังสำหรับการปรับปรุงประสิทธิภาพขององค์กรทหาร แต่ต้องนำมาใช้อย่างระมัดระวังและเหมาะสมกับบริบทของแต่ละหน่วยงาน`,
                        tags: ["DevOps", "CI/CD", "Security", "Military", "Infrastructure", "Automation"],
                        author: "SGT. Pornsupat Vutisuwan",
                        authorTitle: "DevOps Engineer & AI Instructor",
                        date: "2024-12-10",
                        lastModified: "2024-12-12",
                        status: "published",
                        featured: false,
                        readTime: 12,
                        views: 980
                    },
                    {
                        id: 3,
                        title: "Cybersecurity ในยุค Digital Transformation",
                        slug: "cybersecurity-digital-transformation-era",
                        category: "cybersecurity",
                        categoryName: "Cybersecurity",
                        excerpt: "ความท้าทายด้านความปลอดภัยทางไซเบอร์และแนวทางการป้องกันในองค์กรสมัยใหม่ รวมถึงเทคนิคและเครื่องมือใหม่ล่าสุด",
                        content: `ในยุคของการเปลี่ยนแปลงสู่ดิจิทัล (Digital Transformation) ความปลอดภัยทางไซเบอร์ได้กลายเป็นประเด็นที่สำคัญอย่างยิ่ง โดยเฉพาะอย่างยิ่งสำหรับองค์กรที่มีข้อมูลสำคัญ

**ภัยคุกคามใหม่ในยุคดิจิทัล**

1. **Advanced Persistent Threats (APT)**
   - การโจมตีที่มีการวางแผนมาอย่างดี
   - การแฝงตัวในระบบเป็นเวลานาน
   - การขโมยข้อมูลอย่างต่อเนื่อง

2. **Social Engineering**
   - การหลอกลวงผ่านจิตวิทยา
   - Phishing และ Spear Phishing
   - การปลอมแปลงตัวตน

3. **IoT Security Risks**
   - อุปกรณ์ IoT ที่ไม่ปลอดภัย
   - การขาดการอัปเดตความปลอดภัย
   - จุดเชื่อมต่อที่เป็นช่องโหว่

**กลยุทธ์การป้องกัน**

การป้องกันภัยคุกคามทางไซเบอร์ต้องใช้แนวทาง Multi-layered Security:

1. **การศึกษาและการฝึกอบรม**
   - การสร้างความตระหนักรู้ให้บุคลากร
   - การฝึกซ้อมการตอบสนองต่อเหตุการณ์
   - การอัปเดตความรู้อย่างสม่ำเสมอ

2. **เทคโนโลยีป้องกัน**
   - การใช้ AI สำหรับการตรวจจับภัยคุกคาม
   - Zero Trust Architecture
   - Multi-Factor Authentication

3. **การจัดการและควบคุม**
   - การจัดทำนโยบายความปลอดภัย
   - การติดตามและประเมินความเสี่ยง
   - การรายงานและการตอบสนองต่อเหตุการณ์

**ประสบการณ์จากการทำงาน**

ในการทำงานที่กรมการทหารสื่อสาร ได้เรียนรู้และประสบการณ์เกี่ยวกับ:

- การจัดการความปลอดภัยของระบบการสื่อสาร
- การฝึกอบรมด้าน Cyber Security สำหรับบุคลากร
- การพัฒนาระบบป้องกันภัยคุกคามทางไซเบอร์

**แนวโน้มในอนาคต**

1. **AI-Powered Security**
   - การใช้ Machine Learning ในการตรวจจับภัยคุกคาม
   - การวิเคราะห์พฤติกรรมแบบอัตโนมัติ

2. **Quantum Cryptography**
   - การเข้ารหัสที่ปลอดภัยจาก Quantum Computer
   - การเตรียมพร้อมสำหรับยุค Post-Quantum

**สรุป**

Cybersecurity ในยุค Digital Transformation ต้องการการปรับตัวและการพัฒนาอย่างต่อเนื่อง การใช้เทคโนโลยีร่วมกับการพัฒนาบุคลากรเป็นกุญแจสำคัญในการป้องกันภัยคุกคามทางไซเบอร์`,
                        tags: ["Cybersecurity", "Digital Transformation", "AI Security", "Threat Detection", "Zero Trust"],
                        author: "SGT. Pornsupat Vutisuwan",
                        authorTitle: "DevOps Engineer & AI Instructor",
                        date: "2024-12-05",
                        lastModified: "2024-12-08",
                        status: "published",
                        featured: true,
                        readTime: 10,
                        views: 1450
                    }
                ],
                categories: [
                    { id: "ai-ml", name: "AI/ML", description: "บทความเกี่ยวกับ Artificial Intelligence และ Machine Learning", color: "#667eea", icon: "fas fa-robot" },
                    { id: "devops", name: "DevOps", description: "เทคนิคและแนวทางปฏิบัติด้าน DevOps", color: "#764ba2", icon: "fas fa-server" },
                    { id: "cybersecurity", name: "Cybersecurity", description: "ความปลอดภัยทางไซเบอร์และการป้องกันภัยคุกคาม", color: "#dc3545", icon: "fas fa-shield-alt" },
                    { id: "military-tech", name: "Military Tech", description: "เทคโนโลยีทางทหารและการประยุกต์ใช้", color: "#28a745", icon: "fas fa-satellite" },
                    { id: "education", name: "Education", description: "การศึกษาและการฝึกอบรมด้านเทคโนโลจี", color: "#ffc107", icon: "fas fa-graduation-cap" }
                ],
                metadata: {
                    totalPosts: 3,
                    publishedPosts: 3,
                    draftPosts: 0,
                    lastUpdated: new Date().toISOString(),
                    version: "1.0"
                }
            };

            this.saveBlogData(initialData);
            console.log('Blog data initialized successfully');
        }
    }

    /**
     * บันทึกข้อมูล Blog
     */
    saveBlogData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('Error saving blog data:', error);
            return false;
        }
    }

    /**
     * อ่านข้อมูล Blog
     */
    getBlogData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading blog data:', error);
            return null;
        }
    }

    /**
     * ตรวจสอบการเข้าสู่ระบบ
     */
    async login(username, password) {
        try {
            if (username === this.adminCredentials.username &&
                password === this.adminCredentials.password) {

                const authData = {
                    username: username,
                    loginTime: Date.now(),
                    token: this.generateToken(),
                    expires: Date.now() + this.adminCredentials.sessionTimeout
                };

                localStorage.setItem(this.authKey, JSON.stringify(authData));

                return {
                    success: true,
                    token: authData.token,
                    user: {
                        username: username,
                        role: 'admin'
                    }
                };
            } else {
                return {
                    success: false,
                    error: 'Invalid credentials'
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return {
                success: false,
                error: 'Login failed'
            };
        }
    }

    /**
     * ออกจากระบบ
     */
    logout() {
        localStorage.removeItem(this.authKey);
        return { success: true };
    }

    /**
     * ตรวจสอบสถานะการเข้าสู่ระบบ
     */
    checkAuthStatus() {
        try {
            const authData = localStorage.getItem(this.authKey);
            if (!authData) return false;

            const auth = JSON.parse(authData);
            if (Date.now() > auth.expires) {
                localStorage.removeItem(this.authKey);
                return false;
            }

            return true;
        } catch (error) {
            console.error('Auth check error:', error);
            return false;
        }
    }

    /**
     * สร้าง Token
     */
    generateToken() {
        return 'signal_' + Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
    }

    /**
     * ตรวจสอบ Token
     */
    validateToken(token) {
        try {
            const authData = localStorage.getItem(this.authKey);
            if (!authData) return false;

            const auth = JSON.parse(authData);
            return auth.token === token && Date.now() < auth.expires;
        } catch (error) {
            return false;
        }
    }

    /**
     * โหลดบทความทั้งหมด
     */
    async loadPosts() {
        try {
            const data = this.getBlogData();
            return data ? data.posts : [];
        } catch (error) {
            console.error('Error loading posts:', error);
            return [];
        }
    }

    /**
     * โหลดบทความตาม ID
     */
    async getPost(id) {
        try {
            const data = this.getBlogData();
            if (!data) return null;

            return data.posts.find(post => post.id === parseInt(id));
        } catch (error) {
            console.error('Error getting post:', error);
            return null;
        }
    }

    /**
     * สร้างบทความใหม่
     */
    async createPost(postData) {
        try {
            if (!this.checkAuthStatus()) {
                throw new Error('Unauthorized: Please login first');
            }

            const data = this.getBlogData();
            if (!data) throw new Error('Blog data not found');

            // Generate new ID
            const maxId = Math.max(...data.posts.map(post => post.id), 0);

            const newPost = {
                id: maxId + 1,
                title: postData.title,
                slug: this.generateSlug(postData.title),
                category: postData.category,
                categoryName: postData.categoryName,
                excerpt: postData.excerpt,
                content: postData.content,
                tags: Array.isArray(postData.tags) ? postData.tags :
                    typeof postData.tags === 'string' ?
                        postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                author: "SGT. Pornsupat Vutisuwan",
                authorTitle: "DevOps Engineer & AI Instructor",
                date: new Date().toISOString().split('T')[0],
                lastModified: new Date().toISOString().split('T')[0],
                status: postData.status || 'draft',
                featured: postData.featured || false,
                readTime: this.calculateReadTime(postData.content),
                views: 0
            };

            data.posts.push(newPost);
            data.metadata.totalPosts = data.posts.length;
            data.metadata.publishedPosts = data.posts.filter(post => post.status === 'published').length;
            data.metadata.draftPosts = data.posts.filter(post => post.status === 'draft').length;
            data.metadata.lastUpdated = new Date().toISOString();

            if (this.saveBlogData(data)) {
                return {
                    success: true,
                    post: newPost,
                    message: 'Post created successfully'
                };
            } else {
                throw new Error('Failed to save post');
            }
        } catch (error) {
            console.error('Error creating post:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * อัปเดตบทความ
     */
    async updatePost(id, postData) {
        try {
            if (!this.checkAuthStatus()) {
                throw new Error('Unauthorized: Please login first');
            }

            const data = this.getBlogData();
            if (!data) throw new Error('Blog data not found');

            const postIndex = data.posts.findIndex(post => post.id === parseInt(id));
            if (postIndex === -1) throw new Error('Post not found');

            const updatedPost = {
                ...data.posts[postIndex],
                title: postData.title,
                slug: this.generateSlug(postData.title),
                category: postData.category,
                categoryName: postData.categoryName,
                excerpt: postData.excerpt,
                content: postData.content,
                tags: Array.isArray(postData.tags) ? postData.tags :
                    typeof postData.tags === 'string' ?
                        postData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
                lastModified: new Date().toISOString().split('T')[0],
                status: postData.status || data.posts[postIndex].status,
                readTime: this.calculateReadTime(postData.content)
            };

            data.posts[postIndex] = updatedPost;
            data.metadata.publishedPosts = data.posts.filter(post => post.status === 'published').length;
            data.metadata.draftPosts = data.posts.filter(post => post.status === 'draft').length;
            data.metadata.lastUpdated = new Date().toISOString();

            if (this.saveBlogData(data)) {
                return {
                    success: true,
                    post: updatedPost,
                    message: 'Post updated successfully'
                };
            } else {
                throw new Error('Failed to update post');
            }
        } catch (error) {
            console.error('Error updating post:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * ลบบทความ
     */
    async deletePost(id) {
        try {
            if (!this.checkAuthStatus()) {
                throw new Error('Unauthorized: Please login first');
            }

            const data = this.getBlogData();
            if (!data) throw new Error('Blog data not found');

            const postIndex = data.posts.findIndex(post => post.id === parseInt(id));
            if (postIndex === -1) throw new Error('Post not found');

            data.posts.splice(postIndex, 1);
            data.metadata.totalPosts = data.posts.length;
            data.metadata.publishedPosts = data.posts.filter(post => post.status === 'published').length;
            data.metadata.draftPosts = data.posts.filter(post => post.status === 'draft').length;
            data.metadata.lastUpdated = new Date().toISOString();

            if (this.saveBlogData(data)) {
                return {
                    success: true,
                    message: 'Post deleted successfully'
                };
            } else {
                throw new Error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * ค้นหาบทความ
     */
    async searchPosts(query) {
        try {
            const posts = await this.loadPosts();
            const lowercaseQuery = query.toLowerCase();

            return posts.filter(post => {
                const searchableText = `${post.title} ${post.excerpt} ${post.content} ${post.tags.join(' ')}`.toLowerCase();
                return searchableText.includes(lowercaseQuery);
            });
        } catch (error) {
            console.error('Search error:', error);
            return [];
        }
    }

    /**
     * โหลดหมวดหมู่
     */
    async loadCategories() {
        try {
            const data = this.getBlogData();
            return data ? data.categories : [];
        } catch (error) {
            console.error('Error loading categories:', error);
            return [];
        }
    }

    /**
     * โหลด Metadata
     */
    async loadMetadata() {
        try {
            const data = this.getBlogData();
            return data ? data.metadata : {};
        } catch (error) {
            console.error('Error loading metadata:', error);
            return {};
        }
    }

    /**
     * อัปเดตจำนวนการดู
     */
    async updatePostViews(id) {
        try {
            const data = this.getBlogData();
            if (!data) return false;

            const post = data.posts.find(post => post.id === parseInt(id));
            if (post) {
                post.views = (post.views || 0) + 1;
                return this.saveBlogData(data);
            }
            return false;
        } catch (error) {
            console.error('Error updating views:', error);
            return false;
        }
    }

    /**
     * สร้าง Slug จากชื่อเรื่อง
     */
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9ก-๙\s-]/g, '')
            .replace(/[\s-]+/g, '-')
            .trim()
            .replace(/^-+|-+$/g, '');
    }

    /**
     * คำนวณเวลาในการอ่าน
     */
    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    }

    /**
     * บันทึกร่างบทความ
     */
    saveDraft(postData) {
        try {
            const draftKey = `${this.storageKey}_draft_${Date.now()}`;
            const draftData = {
                ...postData,
                savedAt: new Date().toISOString(),
                type: 'draft'
            };

            localStorage.setItem(draftKey, JSON.stringify(draftData));
            return {
                success: true,
                draftId: draftKey,
                message: 'Draft saved successfully'
            };
        } catch (error) {
            console.error('Error saving draft:', error);
            return {
                success: false,
                error: 'Failed to save draft'
            };
        }
    }

    /**
     * โหลดร่างบทความทั้งหมด
     */
    loadDrafts() {
        try {
            const drafts = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(`${this.storageKey}_draft_`)) {
                    const draftData = JSON.parse(localStorage.getItem(key));
                    drafts.push({
                        id: key,
                        ...draftData
                    });
                }
            }
            return drafts.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        } catch (error) {
            console.error('Error loading drafts:', error);
            return [];
        }
    }

    /**
     * ลบร่างบทความ
     */
    deleteDraft(draftId) {
        try {
            localStorage.removeItem(draftId);
            return {
                success: true,
                message: 'Draft deleted successfully'
            };
        } catch (error) {
            console.error('Error deleting draft:', error);
            return {
                success: false,
                error: 'Failed to delete draft'
            };
        }
    }

    /**
     * Export ข้อมูล Blog (สำหรับ Backup)
     */
    exportBlogData() {
        try {
            const data = this.getBlogData();
            if (!data) throw new Error('No blog data found');

            const exportData = {
                ...data,
                exportDate: new Date().toISOString(),
                version: data.metadata.version
            };

            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });

            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `signal_blog_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return {
                success: true,
                message: 'Blog data exported successfully'
            };
        } catch (error) {
            console.error('Export error:', error);
            return {
                success: false,
                error: 'Failed to export data'
            };
        }
    }

    /**
     * Import ข้อมูล Blog (สำหรับ Restore)
     */
    async importBlogData(file) {
        try {
            if (!this.checkAuthStatus()) {
                throw new Error('Unauthorized: Please login first');
            }

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const importData = JSON.parse(e.target.result);

                        // Validate data structure
                        if (!importData.posts || !importData.categories || !importData.metadata) {
                            throw new Error('Invalid blog data format');
                        }

                        // Backup current data
                        const currentData = this.getBlogData();
                        const backupKey = `${this.storageKey}_backup_${Date.now()}`;
                        localStorage.setItem(backupKey, JSON.stringify(currentData));

                        // Import new data
                        if (this.saveBlogData(importData)) {
                            resolve({
                                success: true,
                                message: 'Blog data imported successfully',
                                backup: backupKey
                            });
                        } else {
                            throw new Error('Failed to save imported data');
                        }
                    } catch (error) {
                        reject({
                            success: false,
                            error: error.message
                        });
                    }
                };
                reader.onerror = () => {
                    reject({
                        success: false,
                        error: 'Failed to read file'
                    });
                };
                reader.readAsText(file);
            });
        } catch (error) {
            console.error('Import error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * เคลียร์ข้อมูลทั้งหมด (ใช้ระวัง!)
     */
    clearAllData() {
        try {
            if (!this.checkAuthStatus()) {
                throw new Error('Unauthorized: Please login first');
            }

            // Backup before clear
            const currentData = this.getBlogData();
            const backupKey = `${this.storageKey}_backup_${Date.now()}`;
            localStorage.setItem(backupKey, JSON.stringify(currentData));

            // Clear blog data
            localStorage.removeItem(this.storageKey);

            // Clear auth data
            localStorage.removeItem(this.authKey);

            // Clear drafts
            const keysToRemove = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.startsWith(`${this.storageKey}_draft_`)) {
                    keysToRemove.push(key);
                }
            }
            keysToRemove.forEach(key => localStorage.removeItem(key));

            return {
                success: true,
                message: 'All data cleared successfully',
                backup: backupKey
            };
        } catch (error) {
            console.error('Clear data error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * ตรวจสอบสถานะของระบบ
     */
    getSystemStatus() {
        try {
            const data = this.getBlogData();
            const isLoggedIn = this.checkAuthStatus();
            const drafts = this.loadDrafts();

            return {
                isInitialized: !!data,
                isLoggedIn: isLoggedIn,
                totalPosts: data ? data.posts.length : 0,
                publishedPosts: data ? data.posts.filter(post => post.status === 'published').length : 0,
                draftPosts: data ? data.posts.filter(post => post.status === 'draft').length : 0,
                savedDrafts: drafts.length,
                lastUpdated: data ? data.metadata.lastUpdated : null,
                storageUsed: this.getStorageUsage()
            };
        } catch (error) {
            console.error('Error getting system status:', error);
            return {
                isInitialized: false,
                isLoggedIn: false,
                error: error.message
            };
        }
    }

    /**
     * คำนวณการใช้ Storage
     */
    getStorageUsage() {
        try {
            let totalSize = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    totalSize += localStorage[key].length;
                }
            }
            return {
                used: totalSize,
                usedMB: (totalSize / (1024 * 1024)).toFixed(2),
                percentUsed: ((totalSize / (5 * 1024 * 1024)) * 100).toFixed(1) // Assuming 5MB limit
            };
        } catch (error) {
            return { error: 'Cannot calculate storage usage' };
        }
    }

    /**
     * รีเซ็ตรหัสผ่าน (สำหรับการทดสอบ)
     */
    resetPassword(oldPassword, newPassword) {
        try {
            if (!this.checkAuthStatus()) {
                throw new Error('Unauthorized: Please login first');
            }

            if (oldPassword !== this.adminCredentials.password) {
                throw new Error('Invalid current password');
            }

            // ในการใช้งานจริง ควรมีการเข้ารหัสรหัสผ่าน
            this.adminCredentials.password = newPassword;

            // ออกจากระบบทั้งหมด
            this.logout();

            return {
                success: true,
                message: 'Password changed successfully. Please login again.'
            };
        } catch (error) {
            console.error('Password reset error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

// สร้าง instance และ export
const gitHubPagesBlogAPI = new GitHubPagesBlogAPI();

// Export สำหรับใช้งาน
if (typeof window !== 'undefined') {
    window.GitHubPagesBlogAPI = GitHubPagesBlogAPI;
    window.blogAPI = gitHubPagesBlogAPI;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GitHubPagesBlogAPI;
}