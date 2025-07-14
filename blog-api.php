<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

class BlogAPI
{
    private $dataFile = 'config/blog-content.json';

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
                    "excerpt" => "การศึกษาการนำเทคโนโลยี Artificial Intelligence มาใช้ในการปรับปรุงประสิทธิภาพของระบบการสื่อสารทางทหาร",
                    "content" => "ในยุคดิจิทัลปัจจุบัน การนำเทคโนโลยี Artificial Intelligence (AI) มาประยุกต์ใช้ในด้านการทหารได้กลายเป็นสิ่งที่มีความสำคัญอย่างยิ่ง...",
                    "tags" => ["AI", "Military", "Communication", "Technology"],
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
                ["id" => "ai-ml", "name" => "AI/ML", "color" => "#667eea"],
                ["id" => "devops", "name" => "DevOps", "color" => "#764ba2"],
                ["id" => "cybersecurity", "name" => "Cybersecurity", "color" => "#dc3545"],
                ["id" => "military-tech", "name" => "Military Tech", "color" => "#28a745"],
                ["id" => "education", "name" => "Education", "color" => "#ffc107"]
            ],
            "metadata" => [
                "totalPosts" => 1,
                "publishedPosts" => 1,
                "lastUpdated" => date('Y-m-d H:i:s')
            ]
        ];

        file_put_contents($this->dataFile, json_encode($initialData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    private function readData()
    {
        if (!file_exists($this->dataFile)) {
            $this->initializeDataFile();
        }

        $content = file_get_contents($this->dataFile);
        return json_decode($content, true);
    }

    private function writeData($data)
    {
        // Update metadata
        $data['metadata']['totalPosts'] = count($data['posts']);
        $data['metadata']['publishedPosts'] = count(array_filter($data['posts'], function ($post) {
            return $post['status'] === 'published';
        }));
        $data['metadata']['lastUpdated'] = date('Y-m-d H:i:s');

        return file_put_contents($this->dataFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    private function authenticate()
    {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';

        // Simple token check (in production, use proper JWT)
        return $authHeader === 'Bearer admin_signal_token';
    }

    private function generateSlug($title)
    {
        // Simple slug generation for Thai/English
        $slug = strtolower($title);
        $slug = preg_replace('/[^a-z0-9ก-๙\s-]/', '', $slug);
        $slug = preg_replace('/[\s-]+/', '-', $slug);
        return trim($slug, '-');
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];
        $path = $_GET['action'] ?? '';

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
                    echo json_encode(['error' => 'Method not allowed']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }

    private function handleGet($path)
    {
        $data = $this->readData();

        switch ($path) {
            case 'posts':
                echo json_encode($data['posts']);
                break;
            case 'categories':
                echo json_encode($data['categories']);
                break;
            case 'metadata':
                echo json_encode($data['metadata']);
                break;
            default:
                echo json_encode($data);
        }
    }

    private function handlePost($path)
    {
        if (!$this->authenticate()) {
            http_response_code(401);
            echo json_encode(['error' => 'Unauthorized']);
            return;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        $data = $this->readData();

        switch ($path) {
            case 'posts':
                $this->createPost($data, $input);
                break;
            case 'login':
                $this->handleLogin($input);
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

        $input = json_decode(file_get_contents('php://input'), true);
        $data = $this->readData();
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

    private function createPost($data, $input)
    {
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
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save post']);
        }
    }

    private function updatePost($data, $id, $input)
    {
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
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update post']);
        }
    }

    private function deletePost($data, $id)
    {
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
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete post']);
        }
    }

    private function handleLogin($input)
    {
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';

        // Simple authentication (use proper password hashing in production)
        if ($username === 'admin_signal' && $password === 'Signal@2024') {
            echo json_encode([
                'success' => true,
                'token' => 'admin_signal_token',
                'user' => [
                    'username' => $username,
                    'role' => 'admin'
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
    }

    private function calculateReadTime($content)
    {
        $wordCount = str_word_count(strip_tags($content));
        return max(1, ceil($wordCount / 200)); // 200 words per minute
    }
}

// Handle the request
$api = new BlogAPI();
$api->handleRequest();
