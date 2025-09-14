<?php
/**
 * Configuration de l'API iPresence UCB
 */

// Configuration de la base de données
define('DB_HOST', 'localhost');
define('DB_NAME', 'ipresence_ucb');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// Configuration de l'API externe UCB
define('UCB_API_BASE_URL', 'https://akhademie.ucbukavu.ac.cd/api/v1');
define('UCB_API_TIMEOUT', 30);

// Configuration générale
define('API_VERSION', '1.0.0');
define('TIMEZONE', 'Africa/Lubumbashi');
define('DEFAULT_COURSE_START_TIME', '08:30:00');

// Configuration CORS
define('CORS_ALLOWED_ORIGINS', ['http://localhost:3000', 'http://localhost:9002']);
define('CORS_ALLOWED_METHODS', ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']);
define('CORS_ALLOWED_HEADERS', ['Content-Type', 'Authorization', 'X-Requested-With']);

// Configuration de sécurité
define('API_KEY_REQUIRED', false); // Mettre à true en production
define('API_KEY', 'your-secret-api-key-here');

// Configuration des logs
define('ENABLE_LOGGING', true);
define('LOG_FILE', __DIR__ . '/logs/api.log');

// Fuseau horaire
date_default_timezone_set(TIMEZONE);