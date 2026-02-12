-- Online Student Learning Tracker - Database Setup with Test Data
-- Run this script to set up the database with sample data for testing

-- Create database
CREATE DATABASE IF NOT EXISTS learning_tracker;
USE learning_tracker;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS marks;
DROP TABLE IF EXISTS progress;
DROP TABLE IF EXISTS assignments;
DROP TABLE IF EXISTS enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS users;

-- Users table (students and teachers)
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'teacher') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_role (role)
);

-- Courses table
CREATE TABLE courses (
  course_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  teacher_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (teacher_id) REFERENCES users(user_id) ON DELETE CASCADE,
  INDEX idx_teacher (teacher_id)
);

-- Enrollments table (student-course mapping)
CREATE TABLE enrollments (
  enroll_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
  UNIQUE KEY unique_enrollment (student_id, course_id),
  INDEX idx_student (student_id),
  INDEX idx_course (course_id)
);

-- Assignments table
CREATE TABLE assignments (
  assignment_id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  max_marks INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
  INDEX idx_course (course_id)
);

-- Marks table
CREATE TABLE marks (
  mark_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  assignment_id INT NOT NULL,
  marks_obtained DECIMAL(5,2) NOT NULL,
  grade CHAR(1),
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE,
  UNIQUE KEY unique_submission (student_id, assignment_id),
  INDEX idx_student (student_id),
  INDEX idx_assignment (assignment_id)
);

-- Progress table
CREATE TABLE progress (
  progress_id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  completion_percentage DECIMAL(5,2) DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
  UNIQUE KEY unique_progress (student_id, course_id),
  INDEX idx_student (student_id),
  INDEX idx_course (course_id)
);

-- Insert test users
-- Password for all test accounts: "password123"
-- Hashed using bcrypt with 10 rounds: $2a$10$rXK5YqZ9YqZ9YqZ9YqZ9YeJ3vXK5YqZ9YqZ9YqZ9YqZ9YqZ9YqZ9Y

-- Teachers
INSERT INTO users (name, email, password, role) VALUES
('Dr. Sarah Johnson', 'teacher@test.com', '$2a$10$rXK5YqZ9YqZ9YqZ9YqZ9YeJ3vXK5YqZ9YqZ9YqZ9YqZ9YqZ9YqZ9Y', 'teacher'),
('Prof. Michael Chen', 'teacher2@test.com', '$2a$10$rXK5YqZ9YqZ9YqZ9YqZ9YeJ3vXK5YqZ9YqZ9YqZ9YqZ9YqZ9YqZ9Y', 'teacher');

-- Students
INSERT INTO users (name, email, password, role) VALUES
('Alice Smith', 'alice@test.com', '$2a$10$rXK5YqZ9YqZ9YqZ9YqZ9YeJ3vXK5YqZ9YqZ9YqZ9YqZ9YqZ9YqZ9Y', 'student'),
('Bob Williams', 'bob@test.com', '$2a$10$rXK5YqZ9YqZ9YqZ9YqZ9YeJ3vXK5YqZ9YqZ9YqZ9YqZ9YqZ9YqZ9Y', 'student'),
('Charlie Brown', 'charlie@test.com', '$2a$10$rXK5YqZ9YqZ9YqZ9YqZ9YeJ3vXK5YqZ9YqZ9YqZ9YqZ9YqZ9YqZ9Y', 'student'),
('Diana Prince', 'diana@test.com', '$2a$10$rXK5YqZ9YqZ9YqZ9YqZ9YeJ3vXK5YqZ9YqZ9YqZ9YqZ9YqZ9YqZ9Y', 'student');

-- Note: The above passwords are placeholders. 
-- In practice, you should register users through the application UI
-- which will properly hash passwords using bcrypt.

SELECT 'Database setup complete!' as Status;
SELECT 'Use the registration page to create test accounts' as Note;
SELECT 'Or login with credentials you create through the app' as Reminder;
