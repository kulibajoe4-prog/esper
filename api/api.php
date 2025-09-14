<?php
/**
 * API iPresence UCB - Gestion des présences étudiantes
 * Version: 1.0.0
 */

require_once 'config.php';

class iPresentAPI {
    private $pdo;
    private $action;
    
    public function __construct() {
        $this->setupCORS();
        $this->connectDatabase();
        $this->action = $_GET['action'] ?? '';
        
        // Gestion des requêtes OPTIONS pour CORS
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }
    
    private function setupCORS() {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        if (in_array($origin, CORS_ALLOWED_ORIGINS)) {
            header("Access-Control-Allow-Origin: $origin");
        }
        header('Access-Control-Allow-Methods: ' . implode(', ', CORS_ALLOWED_METHODS));
        header('Access-Control-Allow-Headers: ' . implode(', ', CORS_ALLOWED_HEADERS));
        header('Access-Control-Allow-Credentials: true');
    }
    
    private function connectDatabase() {
        try {
            $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
            $this->pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false
            ]);
        } catch (PDOException $e) {
            $this->sendError('Database connection failed', 500);
        }
    }
    
    public function handleRequest() {
        try {
            switch ($this->action) {
                case 'getStudent':
                    $this->getStudent();
                    break;
                case 'getStructure':
                    $this->getStructure();
                    break;
                case 'markPresence':
                    $this->markPresence();
                    break;
                case 'getPresences':
                    $this->getPresences();
                    break;
                case 'getStats':
                    $this->getStats();
                    break;
                case 'getStudents':
                    $this->getStudents();
                    break;
                case 'getCourses':
                    $this->getCourses();
                    break;
                default:
                    $this->sendError('Invalid action', 400);
            }
        } catch (Exception $e) {
            $this->logError($e->getMessage());
            $this->sendError('Internal server error', 500);
        }
    }
    
    private function getStudent() {
        $matricule = $_GET['matricule'] ?? '';
        
        if (empty($matricule)) {
            $this->sendError('Matricule is required', 400);
        }
        
        // Vérifier d'abord dans la base locale
        $stmt = $this->pdo->prepare("
            SELECT s.*, p.title as promotion_title, p.label as promotion_label 
            FROM students s 
            LEFT JOIN promotions p ON s.promotionId = p.id 
            WHERE s.matricule = ?
        ");
        $stmt->execute([$matricule]);
        $student = $stmt->fetch();
        
        if ($student) {
            $this->sendSuccess($student);
            return;
        }
        
        // Si pas trouvé localement, chercher dans l'API UCB
        $ucbStudent = $this->fetchFromUCBAPI("school-students/read-by-matricule?matricule=" . urlencode($matricule));
        
        if ($ucbStudent) {
            // Sauvegarder l'étudiant localement
            $this->saveStudentFromUCB($ucbStudent);
            $this->sendSuccess($ucbStudent);
        } else {
            $this->sendError('Student not found', 404);
        }
    }
    
    private function getStructure() {
        $stmt = $this->pdo->prepare("
            SELECT 
                p.id,
                p.title,
                p.label,
                p.level,
                p.entityId,
                e.title as entity_title,
                e.label as entity_label
            FROM promotions p
            LEFT JOIN entities e ON p.entityId = e.id
            ORDER BY e.title, p.level, p.title
        ");
        $stmt->execute();
        $promotions = $stmt->fetchAll();
        
        // Récupérer aussi les entités
        $stmt = $this->pdo->prepare("
            SELECT * FROM entities 
            ORDER BY level, title
        ");
        $stmt->execute();
        $entities = $stmt->fetchAll();
        
        $this->sendSuccess([
            'promotions' => $promotions,
            'entities' => $entities
        ]);
    }
    
    private function markPresence() {
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            $this->sendError('POST method required', 405);
        }
        
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input) {
            $input = $_POST;
        }
        
        $matricule = $input['matricule'] ?? '';
        $date = $input['date'] ?? date('Y-m-d');
        $time = $input['time'] ?? date('H:i:s');
        $courseId = $input['course_id'] ?? null;
        
        if (empty($matricule)) {
            $this->sendError('Matricule is required', 400);
        }
        
        // Vérifier si l'étudiant existe
        $stmt = $this->pdo->prepare("SELECT id FROM students WHERE matricule = ?");
        $stmt->execute([$matricule]);
        if (!$stmt->fetch()) {
            $this->sendError('Student not found', 404);
        }
        
        // Déterminer le statut (retard ou à l'heure)
        $courseStartTime = DEFAULT_COURSE_START_TIME;
        if ($courseId) {
            $stmt = $this->pdo->prepare("SELECT start_time FROM courses WHERE id = ?");
            $stmt->execute([$courseId]);
            $course = $stmt->fetch();
            if ($course) {
                $courseStartTime = $course['start_time'];
            }
        }
        
        $status = (strtotime($time) > strtotime($courseStartTime)) ? 'late' : 'on_time';
        
        // Enregistrer la présence
        $stmt = $this->pdo->prepare("
            INSERT INTO presences (matricule, date, time, status, course_id) 
            VALUES (?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            time = VALUES(time), 
            status = VALUES(status),
            updated_at = CURRENT_TIMESTAMP
        ");
        
        $stmt->execute([$matricule, $date, $time, $status, $courseId]);
        
        $this->sendSuccess([
            'message' => 'Presence marked successfully',
            'matricule' => $matricule,
            'date' => $date,
            'time' => $time,
            'status' => $status
        ]);
    }
    
    private function getPresences() {
        $matricule = $_GET['matricule'] ?? '';
        $date = $_GET['date'] ?? '';
        $startDate = $_GET['start_date'] ?? '';
        $endDate = $_GET['end_date'] ?? '';
        $limit = intval($_GET['limit'] ?? 100);
        $offset = intval($_GET['offset'] ?? 0);
        
        $where = [];
        $params = [];
        
        if ($matricule) {
            $where[] = "p.matricule = ?";
            $params[] = $matricule;
        }
        
        if ($date) {
            $where[] = "p.date = ?";
            $params[] = $date;
        }
        
        if ($startDate && $endDate) {
            $where[] = "p.date BETWEEN ? AND ?";
            $params[] = $startDate;
            $params[] = $endDate;
        }
        
        $whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';
        
        $stmt = $this->pdo->prepare("
            SELECT 
                p.*,
                s.fullname,
                c.title as course_title,
                c.code as course_code
            FROM presences p
            LEFT JOIN students s ON p.matricule = s.matricule
            LEFT JOIN courses c ON p.course_id = c.id
            $whereClause
            ORDER BY p.date DESC, p.time DESC
            LIMIT ? OFFSET ?
        ");
        
        $params[] = $limit;
        $params[] = $offset;
        $stmt->execute($params);
        $presences = $stmt->fetchAll();
        
        $this->sendSuccess($presences);
    }
    
    private function getStats() {
        $startDate = $_GET['start_date'] ?? date('Y-m-01');
        $endDate = $_GET['end_date'] ?? date('Y-m-t');
        
        // Statistiques globales
        $stmt = $this->pdo->prepare("
            SELECT 
                COUNT(*) as total_presences,
                COUNT(CASE WHEN status = 'on_time' THEN 1 END) as on_time_count,
                COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count,
                COUNT(DISTINCT matricule) as unique_students,
                COUNT(DISTINCT date) as days_with_presences
            FROM presences 
            WHERE date BETWEEN ? AND ?
        ");
        $stmt->execute([$startDate, $endDate]);
        $globalStats = $stmt->fetch();
        
        // Statistiques par promotion
        $stmt = $this->pdo->prepare("
            SELECT 
                p.title as promotion,
                COUNT(pr.id) as total_presences,
                COUNT(CASE WHEN pr.status = 'on_time' THEN 1 END) as on_time_count,
                COUNT(CASE WHEN pr.status = 'late' THEN 1 END) as late_count,
                COUNT(DISTINCT pr.matricule) as unique_students
            FROM presences pr
            JOIN students s ON pr.matricule = s.matricule
            JOIN promotions p ON s.promotionId = p.id
            WHERE pr.date BETWEEN ? AND ?
            GROUP BY p.id, p.title
            ORDER BY total_presences DESC
        ");
        $stmt->execute([$startDate, $endDate]);
        $promotionStats = $stmt->fetchAll();
        
        // Statistiques par jour
        $stmt = $this->pdo->prepare("
            SELECT 
                date,
                COUNT(*) as total_presences,
                COUNT(CASE WHEN status = 'on_time' THEN 1 END) as on_time_count,
                COUNT(CASE WHEN status = 'late' THEN 1 END) as late_count
            FROM presences 
            WHERE date BETWEEN ? AND ?
            GROUP BY date
            ORDER BY date DESC
        ");
        $stmt->execute([$startDate, $endDate]);
        $dailyStats = $stmt->fetchAll();
        
        $this->sendSuccess([
            'global' => $globalStats,
            'by_promotion' => $promotionStats,
            'daily' => $dailyStats,
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate
            ]
        ]);
    }
    
    private function getStudents() {
        $promotionId = $_GET['promotion_id'] ?? '';
        $search = $_GET['search'] ?? '';
        $limit = intval($_GET['limit'] ?? 50);
        $offset = intval($_GET['offset'] ?? 0);
        
        $where = ['s.active = 1'];
        $params = [];
        
        if ($promotionId) {
            $where[] = "s.promotionId = ?";
            $params[] = $promotionId;
        }
        
        if ($search) {
            $where[] = "(s.fullname LIKE ? OR s.matricule LIKE ?)";
            $params[] = "%$search%";
            $params[] = "%$search%";
        }
        
        $whereClause = 'WHERE ' . implode(' AND ', $where);
        
        $stmt = $this->pdo->prepare("
            SELECT 
                s.*,
                p.title as promotion_title,
                p.label as promotion_label,
                e.title as entity_title
            FROM students s
            LEFT JOIN promotions p ON s.promotionId = p.id
            LEFT JOIN entities e ON p.entityId = e.id
            $whereClause
            ORDER BY s.fullname
            LIMIT ? OFFSET ?
        ");
        
        $params[] = $limit;
        $params[] = $offset;
        $stmt->execute($params);
        $students = $stmt->fetchAll();
        
        $this->sendSuccess($students);
    }
    
    private function getCourses() {
        $promotionId = $_GET['promotion_id'] ?? '';
        $dayOfWeek = $_GET['day_of_week'] ?? '';
        
        $where = ['active = 1'];
        $params = [];
        
        if ($promotionId) {
            $where[] = "promotionId = ?";
            $params[] = $promotionId;
        }
        
        if ($dayOfWeek) {
            $where[] = "day_of_week = ?";
            $params[] = $dayOfWeek;
        }
        
        $whereClause = 'WHERE ' . implode(' AND ', $where);
        
        $stmt = $this->pdo->prepare("
            SELECT 
                c.*,
                p.title as promotion_title,
                p.label as promotion_label
            FROM courses c
            LEFT JOIN promotions p ON c.promotionId = p.id
            $whereClause
            ORDER BY c.day_of_week, c.start_time
        ");
        
        $stmt->execute($params);
        $courses = $stmt->fetchAll();
        
        $this->sendSuccess($courses);
    }
    
    private function fetchFromUCBAPI($endpoint) {
        $url = UCB_API_BASE_URL . '/' . $endpoint;
        
        $context = stream_context_create([
            'http' => [
                'timeout' => UCB_API_TIMEOUT,
                'method' => 'GET',
                'header' => [
                    'Content-Type: application/json',
                    'User-Agent: iPresence-UCB-API/1.0'
                ]
            ]
        ]);
        
        $response = @file_get_contents($url, false, $context);
        
        if ($response === false) {
            $this->logError("Failed to fetch from UCB API: $url");
            return null;
        }
        
        return json_decode($response, true);
    }
    
    private function saveStudentFromUCB($ucbStudent) {
        $stmt = $this->pdo->prepare("
            INSERT INTO students (matricule, fullname, birthday, birthplace, city, civilStatus, avatar, active, promotionId)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            fullname = VALUES(fullname),
            birthday = VALUES(birthday),
            birthplace = VALUES(birthplace),
            city = VALUES(city),
            civilStatus = VALUES(civilStatus),
            avatar = VALUES(avatar),
            active = VALUES(active),
            promotionId = VALUES(promotionId),
            updated_at = CURRENT_TIMESTAMP
        ");
        
        $stmt->execute([
            $ucbStudent['matricule'],
            $ucbStudent['fullname'],
            $ucbStudent['birthday'],
            $ucbStudent['birthplace'],
            $ucbStudent['city'],
            $ucbStudent['civilStatus'],
            $ucbStudent['avatar'],
            $ucbStudent['active'],
            $ucbStudent['promotionId']
        ]);
    }
    
    private function sendSuccess($data, $message = 'Success') {
        http_response_code(200);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => date('c')
        ]);
        exit();
    }
    
    private function sendError($message, $code = 400) {
        http_response_code($code);
        header('Content-Type: application/json');
        echo json_encode([
            'success' => false,
            'error' => $message,
            'code' => $code,
            'timestamp' => date('c')
        ]);
        exit();
    }
    
    private function logError($message) {
        if (ENABLE_LOGGING) {
            $logDir = dirname(LOG_FILE);
            if (!is_dir($logDir)) {
                mkdir($logDir, 0755, true);
            }
            
            $logMessage = date('Y-m-d H:i:s') . " - ERROR: $message" . PHP_EOL;
            file_put_contents(LOG_FILE, $logMessage, FILE_APPEND | LOCK_EX);
        }
    }
}

// Initialiser et exécuter l'API
$api = new iPresentAPI();
$api->handleRequest();