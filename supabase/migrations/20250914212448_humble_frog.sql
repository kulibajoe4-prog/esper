-- Base de données pour iPresence UCB
-- Script de création des tables

CREATE DATABASE IF NOT EXISTS ipresence_ucb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ipresence_ucb;

-- Table des entités (facultés/départements)
CREATE TABLE entities (
    id INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    label VARCHAR(50) NOT NULL,
    level INT NOT NULL,
    parent_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_parent_id (parent_id),
    INDEX idx_level (level)
);

-- Table des promotions
CREATE TABLE promotions (
    id INT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    label VARCHAR(50) NOT NULL,
    level INT NOT NULL,
    entityId INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_entity_id (entityId),
    INDEX idx_level (level),
    FOREIGN KEY (entityId) REFERENCES entities(id) ON DELETE CASCADE
);

-- Table des étudiants
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(50) UNIQUE NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    birthday DATE,
    birthplace VARCHAR(100),
    city VARCHAR(100),
    civilStatus VARCHAR(50),
    avatar VARCHAR(255),
    active TINYINT(1) DEFAULT 1,
    promotionId INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_matricule (matricule),
    INDEX idx_promotion_id (promotionId),
    INDEX idx_active (active),
    FOREIGN KEY (promotionId) REFERENCES promotions(id) ON DELETE SET NULL
);

-- Table des présences
CREATE TABLE presences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    status ENUM('on_time', 'late', 'absent') NOT NULL,
    course_id INT NULL,
    notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_presence (matricule, date, course_id),
    INDEX idx_matricule (matricule),
    INDEX idx_date (date),
    INDEX idx_status (status),
    INDEX idx_course_id (course_id),
    FOREIGN KEY (matricule) REFERENCES students(matricule) ON DELETE CASCADE
);

-- Table des cours
CREATE TABLE courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    code VARCHAR(20) NOT NULL,
    start_time TIME NOT NULL DEFAULT '08:30:00',
    end_time TIME NOT NULL DEFAULT '10:30:00',
    promotionId INT NOT NULL,
    professor VARCHAR(100),
    room VARCHAR(50),
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL,
    active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_promotion_id (promotionId),
    INDEX idx_day_of_week (day_of_week),
    INDEX idx_active (active),
    FOREIGN KEY (promotionId) REFERENCES promotions(id) ON DELETE CASCADE
);

-- Données d'exemple pour les entités (facultés)
INSERT INTO entities (id, title, label, level, parent_id) VALUES
(1, 'Sciences et Technologies', 'Sci & Tech', 1, NULL),
(2, 'Sciences Économiques et de Gestion', 'Éco & Gestion', 1, NULL),
(3, 'Droit et Sciences Politiques', 'Droit & Pol', 1, NULL),
(4, 'Médecine', 'Médecine', 1, NULL),
(5, 'Sciences Sociales', 'Sci Sociales', 1, NULL),
(6, 'Informatique', 'Info', 2, 1),
(7, 'Génie Civil', 'Génie Civil', 2, 1),
(8, 'Économie', 'Économie', 2, 2),
(9, 'Gestion', 'Gestion', 2, 2),
(10, 'Droit Privé', 'Droit Privé', 2, 3),
(11, 'Droit Public', 'Droit Public', 2, 3);

-- Données d'exemple pour les promotions
INSERT INTO promotions (id, title, label, level, entityId) VALUES
(1, 'BAC1 SYSTEMES INFORMATIQUES', 'BAC1 INFO', 1, 6),
(2, 'BAC2 SYSTEMES INFORMATIQUES', 'BAC2 INFO', 2, 6),
(3, 'BAC3 SYSTEMES INFORMATIQUES', 'BAC3 INFO', 3, 6),
(4, 'BAC1 GENIE CIVIL', 'BAC1 GC', 1, 7),
(5, 'BAC1 ECONOMIE', 'BAC1 ECO', 1, 8),
(6, 'BAC2 ECONOMIE', 'BAC2 ECO', 2, 8),
(7, 'BAC1 GESTION', 'BAC1 GEST', 1, 9),
(8, 'BAC1 DROIT PRIVE', 'BAC1 DP', 1, 10),
(9, 'BAC1 MEDECINE', 'BAC1 MED', 1, 4),
(10, 'BAC2 MEDECINE', 'BAC2 MED', 2, 4),
(11, 'BAC1 SYSTEMES INFORMATIQUES', 'BAC1 INFO', 1, 6);

-- Données d'exemple pour les étudiants
INSERT INTO students (matricule, fullname, birthday, birthplace, city, civilStatus, avatar, active, promotionId) VALUES
('05/23.07433', 'MUKOZI KAJABIKA BUGUGU', '2004-04-11', 'BUKAVU', 'BUKAVU', 'single', 'https://example.com/avatars/0523.07433.jpg', 1, 11),
('05/23.07434', 'MARIE CURIE EXAMPLE', '2003-11-15', 'BUKAVU', 'BUKAVU', 'single', 'https://example.com/avatars/0523.07434.jpg', 1, 1),
('05/23.07435', 'PIERRE MARTIN EXAMPLE', '2004-02-20', 'GOMA', 'GOMA', 'single', 'https://example.com/avatars/0523.07435.jpg', 1, 1),
('05/23.07436', 'SOPHIE DUBOIS EXAMPLE', '2003-08-10', 'BUKAVU', 'BUKAVU', 'single', 'https://example.com/avatars/0523.07436.jpg', 1, 8),
('05/23.07437', 'LUC BERNARD EXAMPLE', '2002-12-05', 'UVIRA', 'UVIRA', 'single', 'https://example.com/avatars/0523.07437.jpg', 1, 9);

-- Données d'exemple pour les cours
INSERT INTO courses (title, code, start_time, end_time, promotionId, professor, room, day_of_week) VALUES
('Programmation Web', 'PROG001', '08:30:00', '10:30:00', 1, 'Prof. MUKAMBA', 'A101', 'monday'),
('Base de Données', 'BD001', '10:45:00', '12:45:00', 1, 'Prof. KASONGO', 'A102', 'monday'),
('Mathématiques', 'MATH001', '08:30:00', '10:30:00', 1, 'Prof. KABILA', 'A103', 'tuesday'),
('Anglais', 'ANG001', '14:00:00', '16:00:00', 1, 'Prof. SMITH', 'B201', 'wednesday');

-- Données d'exemple pour les présences
INSERT INTO presences (matricule, date, time, status, course_id) VALUES
('05/23.07433', '2024-01-15', '08:25:00', 'on_time', 1),
('05/23.07433', '2024-01-15', '10:40:00', 'on_time', 2),
('05/23.07433', '2024-01-16', '08:45:00', 'late', 3),
('05/23.07434', '2024-01-15', '08:30:00', 'on_time', 1),
('05/23.07434', '2024-01-15', '10:50:00', 'late', 2),
('05/23.07435', '2024-01-15', '09:00:00', 'late', 1);