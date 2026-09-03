import { StorageService } from './storage';

export const MYSQL_SCHEMA_DDL = `-- ========================================================
-- T'AYO SCHOOL MANAGEMENT SYSTEM (ILORIN, KWARA STATE, NIGERIA)
-- Relational MySQL Database Schema (v1.0)
-- Engine: InnoDB | Character Set: utf8mb4_unicode_ci
-- ========================================================

CREATE DATABASE IF NOT EXISTS tayo_school_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE tayo_school_db;

-- 1. ADMINISTRATORS TABLE
CREATE TABLE IF NOT EXISTS administrators (
  id VARCHAR(64) PRIMARY KEY,
  admin_id VARCHAR(32) NOT NULL UNIQUE,
  full_name VARCHAR(128) NOT NULL,
  email VARCHAR(128) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('Super Administrator', 'Academic Principal', 'Registrar') DEFAULT 'Super Administrator',
  photo_url TEXT,
  last_login DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 2. CLASSES TABLE
CREATE TABLE IF NOT EXISTS classes (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(64) NOT NULL UNIQUE,
  section ENUM('primary', 'secondary') NOT NULL,
  class_teacher_name VARCHAR(128),
  class_teacher_id VARCHAR(64),
  total_students INT DEFAULT 0,
  capacity INT DEFAULT 35,
  prefect_name VARCHAR(128),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. STAFF TABLE
CREATE TABLE IF NOT EXISTS staff (
  id VARCHAR(64) PRIMARY KEY,
  staff_id VARCHAR(32) NOT NULL UNIQUE,
  email VARCHAR(128) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(128) NOT NULL,
  gender ENUM('Male', 'Female') NOT NULL,
  phone VARCHAR(32) NOT NULL,
  qualification VARCHAR(128),
  role_title VARCHAR(128),
  assigned_section ENUM('primary', 'secondary', 'both') DEFAULT 'secondary',
  assigned_classes JSON,
  assigned_subjects JSON,
  photo_url TEXT,
  joined_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. STUDENTS TABLE
CREATE TABLE IF NOT EXISTS students (
  id VARCHAR(64) PRIMARY KEY,
  student_number VARCHAR(32) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(64) NOT NULL,
  last_name VARCHAR(64) NOT NULL,
  middle_name VARCHAR(64),
  gender ENUM('Male', 'Female') NOT NULL,
  date_of_birth DATE NOT NULL,
  section ENUM('primary', 'secondary') NOT NULL,
  class_name VARCHAR(64) NOT NULL,
  arm VARCHAR(32) DEFAULT 'Alpha',
  house ENUM('Emerald', 'Ruby', 'Sapphire', 'Topaz') DEFAULT 'Emerald',
  photo_url MEDIUMTEXT,
  status ENUM('Active', 'Suspended', 'Graduated') DEFAULT 'Active',
  admission_year INT NOT NULL,
  guardian_name VARCHAR(128) NOT NULL,
  guardian_phone VARCHAR(32) NOT NULL,
  guardian_email VARCHAR(128),
  guardian_relationship VARCHAR(64),
  address TEXT,
  state_of_origin VARCHAR(64) DEFAULT 'Kwara State',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_class (class_name),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- 5. ADMISSION APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(64) PRIMARY KEY,
  application_number VARCHAR(32) NOT NULL UNIQUE,
  full_name VARCHAR(128) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender ENUM('Male', 'Female') NOT NULL,
  section ENUM('primary', 'secondary') NOT NULL,
  class_applying_for VARCHAR(64) NOT NULL,
  previous_school VARCHAR(128),
  parent_name VARCHAR(128) NOT NULL,
  parent_relationship VARCHAR(64),
  parent_phone VARCHAR(32) NOT NULL,
  parent_email VARCHAR(128) NOT NULL,
  parent_occupation VARCHAR(128),
  residential_address TEXT NOT NULL,
  state_of_origin VARCHAR(64) DEFAULT 'Kwara State',
  passport_photo MEDIUMTEXT,
  birth_certificate_file VARCHAR(255),
  previous_report_card_file VARCHAR(255),
  status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending',
  decision_notes TEXT,
  assigned_student_number VARCHAR(32),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 6. RESULTS TABLE
CREATE TABLE IF NOT EXISTS results (
  id VARCHAR(64) PRIMARY KEY,
  student_id VARCHAR(64) NOT NULL,
  student_number VARCHAR(32) NOT NULL,
  student_name VARCHAR(128) NOT NULL,
  class_name VARCHAR(64) NOT NULL,
  session VARCHAR(32) NOT NULL, -- e.g. 2024/2025
  term ENUM('1st Term', '2nd Term', '3rd Term') NOT NULL,
  subjects JSON NOT NULL, -- Array of {subject, caScore, examScore, totalScore, grade, position, remark}
  overall_total DECIMAL(6,2),
  overall_average DECIMAL(5,2),
  class_position VARCHAR(32),
  teacher_remark TEXT,
  principal_remark TEXT,
  times_school_opened INT DEFAULT 120,
  times_present INT DEFAULT 118,
  status ENUM('Draft', 'Submitted', 'Published') DEFAULT 'Published',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_student_term (student_number, session, term)
) ENGINE=InnoDB;

-- 7. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS announcements (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category ENUM('General', 'Academic', 'Primary', 'Secondary', 'PTA') DEFAULT 'General',
  target_audience ENUM('All', 'Students', 'Staff', 'Parents') DEFAULT 'All',
  is_important BOOLEAN DEFAULT FALSE,
  author VARCHAR(128) DEFAULT 'Principal',
  published_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 8. GALLERY TABLE
CREATE TABLE IF NOT EXISTS gallery (
  id VARCHAR(64) PRIMARY KEY,
  title VARCHAR(128) NOT NULL,
  category ENUM('Campus', 'Sports', 'Science & Arts', 'Cultural Day', 'Graduation') NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
`;

export function generateCompleteSqlDump(): string {
  const students = StorageService.getStudents();
  const staff = StorageService.getStaff();
  const admin = StorageService.getAdmin();
  const classes = StorageService.getClasses();
  const apps = StorageService.getApplications();
  const results = StorageService.getResults();
  const announcements = StorageService.getAnnouncements();
  const gallery = StorageService.getGallery();

  let dump = MYSQL_SCHEMA_DDL;
  dump += `\n-- ========================================================\n`;
  dump += `-- SEED DATA DUMP (EXPORTED AT ${new Date().toISOString()})\n`;
  dump += `-- ========================================================\n\n`;

  // Admin insert
  dump += `INSERT INTO administrators (id, admin_id, full_name, email, password_hash, role, photo_url) VALUES\n`;
  dump += `('${admin.id}', '${admin.adminId}', '${admin.fullName.replace(/'/g, "\\'")}', '${admin.email}', '${admin.password || 'adminpassword'}', '${admin.role}', '${admin.photoUrl}');\n\n`;

  // Classes insert
  if (classes.length > 0) {
    dump += `INSERT INTO classes (id, name, section, class_teacher_name, class_teacher_id, total_students, capacity, prefect_name) VALUES\n`;
    dump += classes.map(c => 
      `('${c.id}', '${c.name.replace(/'/g, "\\'")}', '${c.section}', '${c.classTeacherName.replace(/'/g, "\\'")}', '${c.classTeacherId}', ${c.totalStudents}, ${c.capacity}, '${c.prefectName.replace(/'/g, "\\'")}')`
    ).join(',\n') + ';\n\n';
  }

  // Staff insert
  if (staff.length > 0) {
    dump += `INSERT INTO staff (id, staff_id, email, password_hash, full_name, gender, phone, qualification, role_title, assigned_section, assigned_classes, assigned_subjects, photo_url, joined_date) VALUES\n`;
    dump += staff.map(s => 
      `('${s.id}', '${s.staffId}', '${s.email}', '${s.password || 'password123'}', '${s.fullName.replace(/'/g, "\\'")}', '${s.gender}', '${s.phone}', '${s.qualification.replace(/'/g, "\\'")}', '${s.roleTitle.replace(/'/g, "\\'")}', '${s.assignedSection}', '${JSON.stringify(s.assignedClasses)}', '${JSON.stringify(s.assignedSubjects)}', '${s.photoUrl}', '${s.joinedDate}')`
    ).join(',\n') + ';\n\n';
  }

  // Students insert
  if (students.length > 0) {
    dump += `INSERT INTO students (id, student_number, password_hash, first_name, last_name, middle_name, gender, date_of_birth, section, class_name, arm, house, photo_url, status, admission_year, guardian_name, guardian_phone, guardian_email, guardian_relationship, address, state_of_origin) VALUES\n`;
    dump += students.map(st => 
      `('${st.id}', '${st.studentNumber}', '${st.password || 'password123'}', '${st.firstName.replace(/'/g, "\\'")}', '${st.lastName.replace(/'/g, "\\'")}', '${(st.middleName || '').replace(/'/g, "\\'")}', '${st.gender}', '${st.dateOfBirth}', '${st.section}', '${st.className.replace(/'/g, "\\'")}', '${st.arm || 'Alpha'}', '${st.house}', '${st.photoUrl}', '${st.status}', ${st.admissionYear}, '${st.guardianName.replace(/'/g, "\\'")}', '${st.guardianPhone}', '${st.guardianEmail}', '${st.guardianRelationship}', '${st.address.replace(/'/g, "\\'")}', '${st.stateOfOrigin}')`
    ).join(',\n') + ';\n\n';
  }

  // Results insert
  if (results.length > 0) {
    dump += `INSERT INTO results (id, student_id, student_number, student_name, class_name, session, term, subjects, overall_total, overall_average, class_position, teacher_remark, principal_remark, times_school_opened, times_present, status) VALUES\n`;
    dump += results.map(r => 
      `('${r.id}', '${r.studentId}', '${r.studentNumber}', '${r.studentName.replace(/'/g, "\\'")}', '${r.className.replace(/'/g, "\\'")}', '${r.session}', '${r.term}', '${JSON.stringify(r.subjects).replace(/'/g, "\\'")}', ${r.overallTotal}, ${r.overallAverage}, '${r.classPosition}', '${r.teacherRemark.replace(/'/g, "\\'")}', '${r.principalRemark.replace(/'/g, "\\'")}', ${r.timesSchoolOpened}, ${r.timesPresent}, '${r.status}')`
    ).join(',\n') + ';\n\n';
  }

  return dump;
}

export const PHP_BACKEND_SAMPLE = `<?php
/**
 * T'AYO SCHOOL MANAGEMENT SYSTEM (NIGERIA)
 * Sample PHP Backend API Connection & Result Dispatcher
 * File: api/db_connect.php
 */

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$host     = "localhost";
$db_name  = "tayo_school_db";
$username = "root";
$password = "";

try {
    $conn = new PDO("mysql:host=" . $host . ";dbname=" . $db_name . ";charset=utf8mb4", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $exception) {
    echo json_encode(["status" => "error", "message" => "Connection failed: " . $exception->getMessage()]);
    exit();
}

// Student Login endpoint sample
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'student_login') {
    $data = json_decode(file_get_contents("php://input"));
    $student_no = trim($data->student_number ?? '');
    $password   = trim($data->password ?? '');

    $stmt = $conn->prepare("SELECT * FROM students WHERE student_number = :std_no AND status = 'Active' LIMIT 1");
    $stmt->execute([':std_no' => $student_no]);
    $student = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($student && ($student['password_hash'] === $password || password_verify($password, $student['password_hash']))) {
        echo json_encode(["status" => "success", "user" => $student]);
    } else {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid Student Number or Password."]);
    }
}
?>`;
