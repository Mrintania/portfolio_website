<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

class BlogAPI
{
    private $dataFile = 'config/blog-content.json';
    private $adminUsername = 'admin_signal';
    private $adminPassword = 'Signal@2024';
    private $tokenSecret = 'military_signal_blog_secret_2024';

    public function __construct()
    {
        // Create config directory if not exists
        if (!file_exists('config')) {
            mkdir('config', 0755, true);
        }

        // Initialize file if not exists
        if (!file_exists($this->dataFile)) {
            $this->initializeDataFile();
        }
    }

    private function initializeDataFile()
    {
        $initialData = [
            "posts" => [
                [
                    "id" => 1,
                    "title" => "การประยุกต์ใช้ AI ในระบบการสื่อสารทหาร",
                    "slug" => "ai-military-communication-systems",
                    "category" => "ai-ml",
                    "categoryName" => "AI/ML",
                    "excerpt" => "การศึกษาการนำเทคโนโลยี Artificial Intelligence มาใช้ในการปรับปรุงประสิทธิภาพของระบบการสื่อสารทางทหาร พร้อมกรณีศึกษาจากการประยุกต์ใช้งานจริง",
                    "content" => "ในยุคดิจิทัลปัจจุบัน การนำเทคโนโลยี Artificial Intelligence (AI) มาประยุกต์ใช้ในด้านการทหารได้กลายเป็นสิ่งที่มีความสำคัญอย่างยิ่ง โดยเฉพาะอย่างยิ่งในระบบการสื่อสารทหาร ซึ่งเป็นหัวใจสำคัญของการดำเนินภารกิจต่าง ๆ\n\n**ความสำคัญของ AI ในระบบการสื่อสารทหาร**\n\n1. **การประมวลผลข้อมูลแบบอัตโนมัติ**\n   - AI สามารถวิเคราะห์และประมวลผลข้อมูลจำนวนมากได้อย่างรวดเร็ว\n   - ลดความผิดพลาดจากการดำเนินงานด้วยมนุษย์\n   - เพิ่มความแม่นยำในการตัดสินใจ\n\n2. **การรักษาความปลอดภัยของข้อมูล**\n   - ระบบ AI สามารถตรวจจับการบุกรุกและภัยคุกคามได้แบบเรียลไทม์\n   - การเข้ารหัสข้อมูลแบบอัจฉริยะ\n   - การจัดการและควบคุมการเข้าถึงข้อมูลอย่างมีประสิทธิภาพ\n\n**การนำไปใช้งานจริงในหน่วยงาน**\n\nจากประสบการณ์การทำงานที่โรงเรียนทหารสื่อสาร กรมการทหารสื่อสาร พบว่าการนำ AI มาใช้ในการฝึกอบรมและการพัฒนาระบบได้ให้ผลลัพธ์ที่ดีเยี่ยม โดยเฉพาะในด้าน:\n\n- การจำลองสถานการณ์การสื่อสารในภาวะฉุกเฉิน\n- การวิเคราะห์ประสิทธิภาพของเครือข่ายการสื่อสาร\n- การพัฒนาระบบการเรียนรู้สำหรับบุคลากรใหม่\n\n**ความท้าทายและแนวทางแก้ไข**\n\nการนำ AI มาใช้ในระบบทหารมีความท้าทายหลายประการ เช่น ความปลอดภัยของข้อมูล การฝึกอบรมบุคลากร และการบำรุงรักษาระบบ แต่ด้วยการวางแผนที่ดีและการพัฒนาอย่างต่อเนื่อง ปัญหาเหล่านี้สามารถแก้ไขได้\n\n**สรุป**\n\nการประยุกต์ใช้ AI ในระบบการสื่อสารทหารเป็นการลงทุนที่คุ้มค่าและจำเป็นสำหรับการเตรียมพร้อมรับมือกับความท้าทายในอนาคต การศึกษาและพัฒนาอย่างต่อเนื่องจะช่วยให้เราสามารถใช้ประโยชน์จากเทคโนโลยีนี้ได้อย่างเต็มศักยภาพ",
                    "tags" => [
                        "AI",
                        "Machine Learning",
                        "Military",
                        "Communication",
                        "Technology",
                        "Defense"
                    ],
                    "author" => "SGT. Pornsupat Vutisuwan",
                    "authorTitle" => "DevOps Engineer & AI Instructor",
                    "date" => "2024-12-15",
                    "lastModified" => "2024-12-15",
                    "status" => "published",
                    "featured" => true,
                    "readTime" => 8,
                    "views" => 1250
                ]
            ],
            "categories" => [
                [
                    "id" => "ai-ml",
                    "name" => "AI/ML",
                    "description" => "บทความเกี่ยวกับ Artificial Intelligence และ Machine Learning",
                    "color" => "#667eea",
                    "icon" => "fas fa-robot"
                ],
                [
                    "id" => "devops",
                    "name" => "DevOps",
                    "description" => "เทคนิคและแนวทางปฏิบัติด้าน DevOps",
                    "color" => "#764ba2",
                    "icon" => "fas fa-server"
                ],
                [
                    "id" => "cybersecurity",
                    "name" => "Cybersecurity",
                    "description" => "ความปลอดภัยทางไซเบอร์และการป้องกันภัยคุกคาม",
                    "color" => "#dc3545",
                    "icon" => "fas fa-shield-alt"
                ],
                [
                    "id" => "military-tech",
                    "name" => "Military Tech",
                    "description" => "เทคโนโลยีทางทหารและการประยุกต์ใช้",
                    "color" => "#28a745",
                    "icon" => "fas fa-satellite"
                ],
                [
                    "id" => "education",
                    "name" => "Education",
                    "description" => "การศึกษาและการฝึกอบรมด้านเทคโนโลจี",
                    "color" => "#ffc107",
                    "icon" => "fas fa-graduation-cap"
                ]
            ],
            "tags" => [
                "AI",
                "Machine Learning",
                "DevOps",
                "CI/CD",
                "Cybersecurity",
                "Military",
                "Technology",
                "Education",
                "Security",
                "Infrastructure",
                "Automation",
                "Digital Transformation",
                "Communication",
                "Defense"
            ],
            "metadata" => [
                "totalPosts" => 1,
                "publishedPosts" => 1,
                "draftPosts" => 0,
                "lastUpdated" => date('Y-m-d H:i:s'),
                "version" => "1.0"
            ]
        ];

        $result = file_put_contents($this->dataFile, json_encode($initialData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        if ($result === false) {
            $this->logError("Failed to initialize data file");
        }
    }

    private function readData()
    {
        if (!file_exists($this->dataFile)) {
            $this->initializeDataFile();
        }

        $content = file_get_contents($this->dataFile);
        if ($content === false) {
            $this->logError("Failed to read data file");
            return null;
        }

        $data = json_decode($content, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->logError("JSON decode error: " . json_last_error_msg());
            return null;
        }

        return $data;
    }

    private function writeData($data)
    {
        // Update metadata
        $data['metadata']['totalPosts'] = count($data['posts']);
        $data['metadata']['publishedPosts'] = count(array_filter($data['posts'], function ($post) {
            return $post['status'] === 'published';
        }));
        $data['metadata']['draftPosts'] = count(array_filter($data['posts'], function ($post) {
            return $post['status'] === 'draft';
        }));
        $data['metadata']['lastUpdated'] = date('Y-m-d H:i:s');

        $result = file_put_contents($this->dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        if ($result === false) {
            $this->logError("Failed to write data file");
            return false;
        }

        return true;
    }

    private function authenticate()
    {
        $headers = $this->getAllHeaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

        if (empty($authHeader)) {
            return false;
        }

        // Remove 'Bearer ' prefix if present
        $token = str_replace('Bearer ', '', $authHeader);

        return $this->validateToken($token);
    }

    private function getAllHeaders()
    {
        $headers = [];

        // Try apache_request_headers() first
        if (function_exists('apache_request_headers')) {
            $headers = apache_request_headers();
        } else {
            // Fallback to $_SERVER
            foreach ($_SERVER as $key => $value) {
                if (substr($key, 0, 5) == 'HTTP_') {
                    $header = str_replace('_', '-', substr($key, 5));
                    $headers[$header] = $value;
                }
            }
        }

        return $headers;
    }

    private function generateToken($username)
    {
        $payload = [
            'username' => $username,
            'issued_at' => time(),
            'expires_at' => time() + (24 * 60 * 60) // 24 hours
        ];

        $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload = base64_encode(json_encode($payload));
        $signature = base64_encode(hash_hmac('sha256', "$header.$payload", $this->tokenSecret, true));

        return "$header.$payload.$signature";
    }

    private function validateToken($token)
    {
        if (empty($token)) {
            return false;
        }

        // Simple token validation for demonstration
        // In production, use proper JWT validation
        if ($token === 'admin_signal_token' || $token === 'military_signal_token_2024') {
            return true;
        }

        // JWT validation
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }

        list($header, $payload, $signature) = $parts;

        // Verify signature
        $expected_signature = base64_encode(hash_hmac('sha256', "$header.$payload", $this->tokenSecret, true));
        if ($signature !== $expected_signature) {
            return false;
        }

        // Check expiration
        $decoded_payload = json_decode(base64_decode($payload), true);
        if ($decoded_payload['expires_at'] < time()) {
            return false;
        }

        return true;
    }

    private function generateSlug($title)
    {
        // Simple slug generation for Thai/English
        $slug = strtolower($title);
        $slug = preg_replace('/[^a-z0-9ก-๙\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        return trim($slug, '-');
    }

    private function logError($message)
    {
        error_log("[BlogAPI Error] " . $message);
    }

    private function logInfo($message)
    {
        error_log("[BlogAPI Info] " . $message);
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $_GET['action'] ?? '';

        // Log request
        $this->logInfo("Request: $method $path");

        try {
            switch ($method) {
                case 'GET':
                    $this->handleGet($path);
                    break;
                case 'POST':
                    $this->handlePost($path);
                    break;
                case 'PUT':
                    $this->handlePut($path);
                    break;
                case 'DELETE':
                    $this->handleDelete($path);
                    break;
                default:
                    http_response_code(405);
                    echo json_encode(['error' => 'Method not allowed', 'method' => $method]);
            }
        } catch (Exception $e) {
            $this->logError("Exception: " . $e->getMessage());
            http_response_code(500);
            echo json_encode(['error' => 'Internal server error', 'message' => $e->getMessage()]);
        }
    }

    private function handleGet($path)
    {
        $data = $this->readData();

        if ($data === null) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to read data']);
            return;
        }

        switch ($path) {
            case 'posts':
                echo json_encode($data['posts']);
                break;
            case 'categories':
                echo json_encode($data['categories']);
                break;
            case 'tags':
                echo json_encode($data['tags']);
                break;
            case 'metadata':
                echo json_encode($data['metadata']);
                break;
            case 'test':
                echo json_encode([
                    'status' => 'OK',
                    'message' => 'Blog API is working',
                    'timestamp' => date('Y-m-d H:i:s'),
                    'data_file_exists' => file_exists($this->dataFile),
                    'posts_count' => count($data['posts'])
                ]);
                break;
            default:
                echo json_encode($data);
        }
    }

    private function handlePost($path)
    {
        $input = $this->getJsonInput();

        if ($input === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON input']);
            return;
        }

        switch ($path) {
            case 'login':
                $this->handleLogin($input);
                break;
            case 'posts':
                if (!$this->authenticate()) {
                    http_response_code(401);
                    echo json_encode(['error' => 'Unauthorized']);
                    return;
                }
                $data = $this->readData();
                if ($data === null) {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to read data']);
                    return;
                }
                $this->createPost($data, $input);
                break;
            default:
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint not found']);
        }
    }

    private function handlePut($path)
    {
        if (!$this->authenticate()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $input = $this->getJsonInput();
        if ($input === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid JSON input']);
            return;
        }

        $data = $this->readData();
        if ($data === null) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to read data']);
            return;
        }

        $id = $_GET['id'] ?? null;

        switch ($path) {
            case 'posts':
                $this->updatePost($data, $id, $input);
                break;
            default:
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint not found']);
        }
    }

    private function handleDelete($path)
    {
        if (!$this->authenticate()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $data = $this->readData();
        if ($data === null) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to read data']);
            return;
        }

        $id = $_GET['id'] ?? null;

        switch ($path) {
            case 'posts':
                $this->deletePost($data, $id);
                break;
            default:
                http_response_code(404);
                echo json_encode(['error' => 'Endpoint not found']);
        }
    }

    private function getJsonInput()
    {
        $input = file_get_contents('php://input');

        if (empty($input)) {
            $this->logError("Empty input received");
            return null;
        }

        $decoded = json_decode($input, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            $this->logError("JSON decode error: " . json_last_error_msg() . " Input: " . $input);
            return null;
        }

        return $decoded;
    }

    private function createPost($data, $input)
    {
        // Validate required fields
        $required_fields = ['title', 'category', 'categoryName', 'excerpt', 'content'];
        foreach ($required_fields as $field) {
            if (empty($input[$field])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing required field: $field"]);
                return;
            }
        }

        // Generate new ID
        $maxId = 0;
        foreach ($data['posts'] as $post) {
            if ($post['id'] > $maxId) {
                $maxId = $post['id'];
            }
        }

        $newPost = [
            'id' => $maxId + 1,
            'title' => $input['title'],
            'slug' => $this->generateSlug($input['title']),
            'category' => $input['category'],
            'categoryName' => $input['categoryName'],
            'excerpt' => $input['excerpt'],
            'content' => $input['content'],
            'tags' => $input['tags'] ?? [],
            'author' => 'SGT. Pornsupat Vutisuwan',
            'authorTitle' => 'DevOps Engineer & AI Instructor',
            'date' => date('Y-m-d'),
            'lastModified' => date('Y-m-d'),
            'status' => $input['status'] ?? 'draft',
            'featured' => $input['featured'] ?? false,
            'readTime' => $this->calculateReadTime($input['content']),
            'views' => 0
        ];

        $data['posts'][] = $newPost;

        if ($this->writeData($data)) {
            echo json_encode(['success' => true, 'post' => $newPost]);
            $this->logInfo("Post created: " . $newPost['title']);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save post']);
        }
    }

    private function updatePost($data, $id, $input)
    {
        if ($id === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Post ID is required']);
            return;
        }

        $postIndex = -1;
        for ($i = 0; $i < count($data['posts']); $i++) {
            if ($data['posts'][$i]['id'] == $id) {
                $postIndex = $i;
                break;
            }
        }

        if ($postIndex === -1) {
            http_response_code(404);
            echo json_encode(['error' => 'Post not found']);
            return;
        }

        $data['posts'][$postIndex] = array_merge($data['posts'][$postIndex], [
            'title' => $input['title'],
            'slug' => $this->generateSlug($input['title']),
            'category' => $input['category'],
            'categoryName' => $input['categoryName'],
            'excerpt' => $input['excerpt'],
            'content' => $input['content'],
            'tags' => $input['tags'] ?? [],
            'lastModified' => date('Y-m-d'),
            'status' => $input['status'] ?? 'draft',
            'readTime' => $this->calculateReadTime($input['content'])
        ]);

        if ($this->writeData($data)) {
            echo json_encode(['success' => true, 'post' => $data['posts'][$postIndex]]);
            $this->logInfo("Post updated: ID $id");
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update post']);
        }
    }

    private function deletePost($data, $id)
    {
        if ($id === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Post ID is required']);
            return;
        }

        $postIndex = -1;
        for ($i = 0; $i < count($data['posts']); $i++) {
            if ($data['posts'][$i]['id'] == $id) {
                $postIndex = $i;
                break;
            }
        }

        if ($postIndex === -1) {
            http_response_code(404);
            echo json_encode(['error' => 'Post not found']);
            return;
        }

        array_splice($data['posts'], $postIndex, 1);

        if ($this->writeData($data)) {
            echo json_encode(['success' => true]);
            $this->logInfo("Post deleted: ID $id");
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete post']);
        }
    }

    private function handleLogin($input)
    {
        $username = trim($input['username'] ?? '');
        $password = trim($input['password'] ?? '');

        $this->logInfo("Login attempt for username: $username");

        // Validate input
        if (empty($username) || empty($password)) {
            $this->logError("Login failed: Empty username or password");
            http_response_code(400);
            echo json_encode(['error' => 'Username and password are required']);
            return;
        }

        // Check credentials
        if ($username === $this->adminUsername && $password === $this->adminPassword) {
            $token = $this->generateToken($username);

            $response = [
                'success' => true,
                'token' => $token,
                'user' => [
                    'username' => $username,
                    'role' => 'admin',
                    'title' => 'Military Blog Administrator'
                ],
                'message' => 'Login successful'
            ];

            echo json_encode($response);
            $this->logInfo("Login successful for: $username");
        } else {
            $this->logError("Login failed: Invalid credentials for $username");
            http_response_code(401);
            echo json_encode([
                'error' => 'Invalid credentials',
                'message' => 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
            ]);
        }
    }

    private function calculateReadTime($content)
    {
        $wordCount = str_word_count(strip_tags($content));
        return max(1, ceil($wordCount / 200)); // 200 words per minute
    }
}

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Handle the request
try {
    $api = new BlogAPI();
    $api->handleRequest();
} catch (Exception $e) {
    error_log("BlogAPI Fatal Error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal server error',
        'message' => $e->getMessage(),
        'file' => $e->getFile(),
        'line' => $e->getLine()
    ]);
}
