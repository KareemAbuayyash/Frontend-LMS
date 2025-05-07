-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 30, 2025 at 01:50 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `lms_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_table`
--

CREATE TABLE `admin_table` (
  `id` bigint(20) NOT NULL,
  `department` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin_table`
--

INSERT INTO `admin_table` (`id`, `department`, `user_id`) VALUES
(1, 'New Department', 1),
(2, NULL, 2);

-- --------------------------------------------------------

--
-- Table structure for table `assignment`
--

CREATE TABLE `assignment` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `graded` bit(1) NOT NULL,
  `score` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `student_id` bigint(20) DEFAULT NULL,
  `course_id` bigint(20) DEFAULT NULL,
  `student_solution` varchar(255) DEFAULT NULL,
  `total_points` int(11) NOT NULL,
  `due_date` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignment`
--

INSERT INTO `assignment` (`id`, `description`, `graded`, `score`, `title`, `student_id`, `course_id`, `student_solution`, `total_points`, `due_date`) VALUES
(1, 'This is the description of my assignment', b'0', 0, 'My Assignment', 1, NULL, NULL, 0, NULL),
(2, 'This is a math assignment for the students.', b'0', 0, 'Math Assignment 1', NULL, NULL, NULL, 0, NULL),
(3, 'This is the description of my assignment', b'1', 95, 'My Assignment', 1, NULL, NULL, 0, NULL),
(4, 'This is the description of my assignment', b'1', 95, 'My Assignment', 2, NULL, NULL, 0, NULL),
(5, 'This is the description of my assignment', b'1', 95, 'My Assignment', 2, NULL, NULL, 0, NULL),
(6, 'This is the description of my assignment', b'0', 0, 'My Assignment', 2, NULL, NULL, 0, NULL),
(7, 'Thiss is the description of my assignment', b'0', 0, 'My Assisgnment', 2, NULL, NULL, 0, NULL),
(8, 'Complete the questions at the end of chapter 5', b'1', 90, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(9, 'Complete the questions at the end of chapter 5', b'1', 90, 'New Assignment on Chapter 5', 1, NULL, NULL, 0, NULL),
(10, 'Complete the questions at the end of chapter 5', b'1', 90, 'New Assignment on Chapter 5', 2, NULL, NULL, 0, NULL),
(11, 'Complete the questions at the end of chapter 5', b'0', 0, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(12, 'Complete the questions at the end of chapter 5', b'0', 0, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(13, 'Complete the questions at the end of chapter 5', b'0', 0, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(14, 'Complete the questions at the end of chapter 5', b'0', 0, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(15, 'Answer the following questions', b'0', 0, 'Homework 1', NULL, NULL, NULL, 0, NULL),
(16, 'Answer the following questions', b'0', 0, 'Homework 1', NULL, NULL, NULL, 0, NULL),
(17, 'Complete the questions at the end of chapter 5', b'0', 0, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(18, 'Complete the questions at the end of chapter 5', b'0', 0, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(19, 'Complete the questions at the end of chapter 5', b'0', 0, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(20, 'Complete the questions at the end of chapter 5', b'0', 0, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(21, 'Complete the questions at the end of chapter 5', b'0', 0, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(22, 'Complete the questions at the end of chapter 5', b'0', 0, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(23, 'Complete the questions at the end of chapter 5', b'0', 0, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(24, 'Complete the questions at the end of chapter 5', b'0', 0, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(25, 'Complete the questions at the end of chapter 5', b'0', 0, 'New Assignment on Chapter 5', NULL, NULL, NULL, 0, NULL),
(26, 'This is a test assignment', b'0', 0, 'Test Assignment', NULL, NULL, NULL, 100, '2023-12-31 23:59:59.000000'),
(27, 'This is a test assignment', b'0', 0, 'Test Assignment', NULL, NULL, NULL, 100, '2023-12-31 23:59:59.000000'),
(28, 'Assignment for specific course', b'0', 0, 'Course Assignment', NULL, 7, NULL, 100, '2023-12-31 23:59:59.000000'),
(29, 'Assignment for specific course', b'0', 0, 'Course Assignment', NULL, 7, NULL, 100, '2023-12-31 23:59:59.000000'),
(30, 'Assignment for specific course', b'0', 0, 'Course Assignment', NULL, 7, NULL, 100, '2023-12-31 23:59:59.000000'),
(31, 'All students must complete this', b'0', 0, 'Assignment For Everyone', NULL, 7, NULL, 100, '2025-05-01 23:59:59.000000'),
(32, 'Draft a project outline for the final project', b'0', 0, 'Project Outline', NULL, 7, NULL, 50, '2025-04-15 23:59:59.000000'),
(33, 'Draft a project outline for the final project', b'0', 0, 'Project Outline', NULL, 7, NULL, 50, '2025-04-15 23:59:59.000000'),
(34, 'Draft a project outline for the final project', b'0', 0, 'Project Outline', NULL, 7, NULL, 50, '2025-04-15 23:59:59.000000'),
(35, 'Draft a project outline for the final project', b'0', 0, 'Project Outline', NULL, 7, NULL, 50, '2025-04-15 23:59:59.000000'),
(36, 'Draft a project outline for the final project', b'0', 0, 'Project Outline', NULL, 8, NULL, 100, '2025-04-30 23:59:59.000000'),
(37, 'Draft a project outline for the final project', b'0', 0, 'Project Outline', NULL, 9, NULL, 100, '2025-04-30 23:59:59.000000'),
(38, 'Draft a project outline for the final project', b'0', 0, 'Project Outline', NULL, 9, NULL, 100, '2025-04-30 23:59:59.000000'),
(39, 'Draft a project outline for the final project', b'0', 0, 'Project Outline', NULL, 9, NULL, 100, '2025-04-30 23:59:59.000000'),
(40, 'Description of assignment', b'0', 0, 'Assignment 1', NULL, 1, NULL, 100, '2025-04-30 23:59:00.000000'),
(41, 'This is a test assignment to check email notifications.', b'0', 0, 'Test Assignment', NULL, 11, NULL, 100, '2025-03-30 23:59:00.000000'),
(42, 'This is a test assignment to check email notifications.', b'0', 0, 'Test Assignment', NULL, 11, NULL, 100, '2025-03-29 21:44:00.000000'),
(43, 'This is a test assignment to check email notifications.', b'0', 0, 'Test Assignment', NULL, 11, NULL, 100, '2025-03-29 21:44:00.000000'),
(44, 'Solve the problems', b'0', 0, 'Assignment 1', NULL, 11, NULL, 100, '2025-03-29 21:44:00.000000'),
(45, 'Solve the problems', b'0', 0, 'Assignment 1', NULL, 11, NULL, 100, '2025-03-29 21:44:00.000000'),
(46, 'Solve the problems', b'0', 0, 'Assignment 1', NULL, 11, NULL, 100, '2025-03-29 21:44:00.000000'),
(47, 'Solve the problems', b'0', 0, 'Assignment 1', NULL, 11, NULL, 100, '2025-03-29 21:44:00.000000'),
(48, 'Solve the problems', b'0', 0, 'Assignment 1', NULL, 11, NULL, 100, '2025-03-29 21:44:00.000000');

-- --------------------------------------------------------

--
-- Table structure for table `assignment_submission`
--

CREATE TABLE `assignment_submission` (
  `id` bigint(20) NOT NULL,
  `answer` longtext DEFAULT NULL,
  `grade` double DEFAULT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `assignment_id` bigint(20) DEFAULT NULL,
  `student_id` bigint(20) DEFAULT NULL,
  `graded` bit(1) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `submission_date` datetime(6) DEFAULT NULL,
  `submission_content` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `assignment_submission`
--

INSERT INTO `assignment_submission` (`id`, `answer`, `grade`, `submitted_at`, `assignment_id`, `student_id`, `graded`, `score`, `submission_date`, `submission_content`) VALUES
(1, '{\r\n    \"answers\": [\r\n        \"True\", \r\n        \"Paris\", \r\n        \"2,3,5\", \r\n        \"H2O\", \r\n        \"I\", \r\n        \"Mercury,Venus,Earth\", \r\n        \"circle\", \r\n        \"France:Paris,Germany:Berlin\", \r\n        \"Quantum computing uses...\"\r\n    ]\r\n}', NULL, '2025-03-28 22:43:31.000000', 10, 1, b'0', NULL, NULL, NULL),
(2, 'My detailed answer', 90, '2025-03-28 22:43:50.000000', 10, 2, b'0', NULL, NULL, NULL),
(4, 'My detailed answer', 90, '2025-03-28 22:45:21.000000', 10, 2, b'0', NULL, NULL, NULL),
(5, '\"My answer to the assignment.\"\r\n', 90, '2025-03-28 22:47:21.000000', 10, 1, b'0', NULL, NULL, NULL),
(6, 'My detailed answer', 99.22, '2025-03-28 22:47:35.000000', 10, 2, b'0', NULL, NULL, NULL),
(7, 'My detailed answer', NULL, '2025-03-29 00:04:29.000000', 10, 2, b'0', NULL, NULL, NULL),
(8, NULL, NULL, NULL, 11, 3, b'0', NULL, NULL, NULL),
(9, NULL, NULL, NULL, 12, 3, b'0', NULL, NULL, NULL),
(10, '{\r\n  \"answer\": \"My answer to the assignment.\"\r\n}\r\n', NULL, NULL, 13, 3, b'1', 90, NULL, NULL),
(11, NULL, NULL, NULL, 14, 3, b'0', NULL, NULL, NULL),
(12, NULL, NULL, NULL, 15, 3, b'0', NULL, NULL, NULL),
(13, NULL, NULL, NULL, 18, 2, b'0', NULL, NULL, NULL),
(14, NULL, NULL, NULL, 18, 3, b'0', NULL, NULL, NULL),
(15, NULL, NULL, NULL, 19, 2, b'0', NULL, NULL, NULL),
(16, NULL, NULL, NULL, 19, 3, b'0', NULL, NULL, NULL),
(17, NULL, NULL, NULL, 20, 2, b'0', NULL, NULL, NULL),
(18, NULL, NULL, NULL, 20, 3, b'0', NULL, NULL, NULL),
(19, NULL, NULL, NULL, 21, 2, b'0', NULL, NULL, NULL),
(20, NULL, NULL, NULL, 21, 3, b'0', NULL, NULL, NULL),
(21, NULL, NULL, NULL, 35, 2, b'0', 0, '2025-03-29 11:12:24.000000', 'My final project outline...'),
(22, NULL, NULL, NULL, 35, 2, b'0', 0, '2025-03-29 11:12:33.000000', 'My final project outline...'),
(23, NULL, NULL, NULL, 35, 2, b'1', 45, '2025-03-29 11:15:07.000000', 'My final project outline...'),
(24, NULL, NULL, NULL, 36, 2, b'0', 0, '2025-03-29 11:30:55.000000', 'My final project outline...'),
(25, NULL, NULL, NULL, 36, 2, b'0', 0, '2025-03-29 11:36:23.000000', 'My final project outline...'),
(26, NULL, NULL, NULL, 36, 1, b'0', 0, '2025-03-29 11:36:38.000000', 'My final project outline...'),
(27, NULL, NULL, NULL, 36, 3, b'0', 0, '2025-03-29 11:53:29.000000', 'My final project outline...'),
(28, NULL, NULL, NULL, 36, 2, b'0', 0, '2025-03-29 11:53:37.000000', 'My final project outline...'),
(29, NULL, NULL, NULL, 36, 1, b'0', 0, '2025-03-29 11:54:00.000000', 'My final project outline...'),
(30, NULL, NULL, NULL, 37, 1, b'0', 0, '2025-03-29 12:35:03.000000', 'My final project outline...'),
(31, NULL, NULL, NULL, 37, 1, b'0', 0, '2025-03-29 12:46:29.000000', 'My final project outline...'),
(32, NULL, NULL, NULL, 39, 1, b'0', 0, '2025-03-29 16:04:43.000000', 'My submission text or URL'),
(33, NULL, NULL, NULL, 47, 2, b'0', 0, '2025-03-30 01:41:52.000000', 'Here is my assignment submission.'),
(34, NULL, NULL, NULL, 47, 2, b'0', 0, '2025-03-30 01:53:26.000000', 'Here is my assignment submission.'),
(35, NULL, NULL, NULL, 47, 2, b'0', 0, '2025-03-30 01:54:01.000000', 'Here is my assignment submission.');

-- --------------------------------------------------------

--
-- Table structure for table `content`
--

CREATE TABLE `content` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `file_path` varchar(255) DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `course_id` bigint(20) DEFAULT NULL,
  `uploaded_by` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `content`
--

INSERT INTO `content` (`id`, `description`, `file_path`, `file_type`, `title`, `course_id`, `uploaded_by`) VALUES
(1, 'Content Description', 'C:\\my-uploads\\Introduction to English.pdf', 'application/pdf', 'Content Title', 1, 1),
(2, 'Content Description', 'C:\\my-uploads\\Introduction to English.pdf', 'application/pdf', 'Content Title', 1, 1),
(3, 'Content Description', 'C:\\my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 1, 1),
(4, 'Content Description', 'C:\\my-uploads\\Screenshot 2025-01-14 115928.png', 'image/png', 'Content Title', 1, 1),
(5, 'Content Description', 'C:/my-uploads\\tomcat.zip', 'application/zip', 'Content Title', 1, 1),
(6, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 1, 1),
(7, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 1, 1),
(8, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 1, 1),
(9, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 1, 1),
(10, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 1, 1),
(11, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 1, 1),
(12, 'Content Description', 'C:/my-uploads\\Introduction to English.pdf', 'application/pdf', 'Content Title', 1, 1),
(13, 'Content Description', 'C:/my-uploads\\Introduction to English.pdf', 'application/pdf', 'Content Title', 1, 1),
(14, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 1, 1),
(15, 'Content Description', 'C:/my-uploads\\Introduction to English.pdf', 'application/pdf', 'Content Title', 1, 1),
(16, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 1, 1),
(17, 'Content Description', 'C:/my-uploads\\Introduction to English.pdf', 'application/pdf', 'Content Title', 1, 1),
(18, 'Content Description', 'C:/my-uploads\\Introduction to English.pdf', 'application/pdf', 'Content Title', 1, 1),
(19, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 1, 1),
(20, 'Content Description', 'C:/my-uploads\\Introduction to English.pdf', 'application/pdf', 'Content Title', 1, 1),
(21, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 1, 1),
(22, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 1, 1),
(23, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 1, 1),
(24, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 1, 1),
(25, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 3, 1),
(26, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 3, 1),
(27, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 3, 1),
(28, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 3, 1),
(29, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 3, 1),
(30, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 3, 1),
(31, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 3, 1),
(32, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 3, 1),
(33, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 4, 1),
(34, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 4, 1),
(35, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 4, 1),
(36, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 4, 1),
(37, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 4, 1),
(38, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 4, 1),
(39, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 5, 1),
(40, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 5, 1),
(41, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 5, 1),
(42, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 5, 1),
(43, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 5, 1),
(44, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 5, 1),
(45, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 5, 1),
(46, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 5, 1),
(47, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 5, 1),
(48, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 5, 1),
(49, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 5, 1),
(50, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 5, 1),
(51, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 10, 1),
(52, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 10, 1),
(53, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 10, 1),
(54, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 10, 1),
(55, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 10, 1),
(56, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 10, 1),
(57, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 10, 1),
(58, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 10, 1),
(59, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 11, 1),
(60, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 11, 1),
(61, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 11, 1),
(62, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 11, 1),
(63, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 11, 1),
(64, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 11, 1),
(65, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 11, 1),
(66, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 11, 1),
(67, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 11, 1),
(68, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 11, 1),
(69, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 11, 1),
(70, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 11, 1),
(71, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 11, 1),
(72, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 11, 1),
(73, 'Content Description', 'C:/my-uploads\\WhatsApp Video 2025-03-25 at 20.59.51_bcfe107f.mp4', 'video/mp4', 'Content Title', 11, 1),
(74, 'Content Description', 'C:/my-uploads\\English Practice.txt', 'text/plain', 'Content Title', 11, 1);

-- --------------------------------------------------------

--
-- Table structure for table `course`
--

CREATE TABLE `course` (
  `id` bigint(20) NOT NULL,
  `course_description` varchar(255) DEFAULT NULL,
  `course_duration` varchar(255) DEFAULT NULL,
  `course_end_date` datetime(6) DEFAULT NULL,
  `course_instructor` varchar(255) DEFAULT NULL,
  `course_level` varchar(255) DEFAULT NULL,
  `course_name` varchar(255) DEFAULT NULL,
  `course_price` double DEFAULT NULL,
  `course_start_date` datetime(6) DEFAULT NULL,
  `instructor_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `course`
--

INSERT INTO `course` (`id`, `course_description`, `course_duration`, `course_end_date`, `course_instructor`, `course_level`, `course_name`, `course_price`, `course_start_date`, `instructor_id`) VALUES
(1, 'Updated course description', '4 months', '2025-08-01 03:00:00.000000', 'Jane Doe', NULL, 'Updated Course 101', 120, '2025-04-01 02:00:00.000000', NULL),
(2, 'Learn advanced topics in Java programming.', '3 months', '2025-06-30 03:00:00.000000', 'John Doe', NULL, 'Advanced Java Programming', 299.99, '2025-04-01 02:00:00.000000', NULL),
(3, 'Learn advanced topics in Java programming.', '3 months', '2025-06-30 03:00:00.000000', 'John Doe', NULL, 'Advanced Java Programming', 299.99, '2025-04-01 02:00:00.000000', NULL),
(4, 'Learn advanced topics in Java programming.', '3 months', '2025-06-30 03:00:00.000000', 'John Doe', NULL, 'Advanced Java Programming', 299.99, '2025-04-01 02:00:00.000000', NULL),
(5, 'Learn advanced topics in Java programming.', '3 months', '2025-06-30 03:00:00.000000', 'John Doe', NULL, 'Advanced Java Programming', 299.99, '2025-04-01 02:00:00.000000', NULL),
(6, 'Learn advanced topics in Java programming.', '3 months', '2025-06-30 03:00:00.000000', 'John Doe', NULL, 'Advanced Java Programming', 299.99, '2025-04-01 02:00:00.000000', NULL),
(7, 'Learn advanced topics in Java programming.', '3 months', '2025-06-30 03:00:00.000000', 'John Doe', NULL, 'Advanced Java Programming', 299.99, '2025-04-01 02:00:00.000000', NULL),
(8, 'Learn advanced topics in Java programming.', '3 months', '2025-06-30 03:00:00.000000', 'John Doe', NULL, 'Advanced Java Programming', 299.99, '2025-04-01 02:00:00.000000', NULL),
(9, 'Learn advanced topics in Java programming.', '3 months', '2025-06-30 03:00:00.000000', 'John Doe', NULL, 'Advanced Java Programming', 299.99, '2025-04-01 02:00:00.000000', NULL),
(10, 'Learn advanced topics in Java programming.', '3 months', '2025-06-30 03:00:00.000000', 'John Doe', NULL, 'Advanced Java Programming', 299.99, '2025-04-01 02:00:00.000000', NULL),
(11, 'Updated description of the course.', '12 weeks', '2025-06-24 03:00:00.000000', 'Dr. Smith', NULL, 'Math 101 - Upddated', 199.99, '2025-04-01 02:00:00.000000', 1),
(12, 'Introduction to LMS', '3 months', '2025-07-01 03:00:00.000000', 'John Doe', NULL, 'Course 101', 100, '2025-04-01 02:00:00.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `course_enrollment`
--

CREATE TABLE `course_enrollment` (
  `course_id` bigint(20) NOT NULL,
  `enrollment_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `enrollment`
--

CREATE TABLE `enrollment` (
  `enrollment_id` bigint(20) NOT NULL,
  `completed` bit(1) NOT NULL,
  `enrollment_date` datetime(6) DEFAULT NULL,
  `student_id` bigint(20) DEFAULT NULL,
  `course_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`enrollment_id`, `completed`, `enrollment_date`, `student_id`, `course_id`) VALUES
(1, b'0', '2025-03-26 02:00:00.000000', 1, NULL),
(2, b'0', '2025-03-26 02:00:00.000000', 1, NULL),
(3, b'0', '2025-03-26 02:00:00.000000', 2, NULL),
(4, b'0', '2025-03-26 02:00:00.000000', 2, NULL),
(5, b'0', '2025-03-26 02:00:00.000000', 2, NULL),
(6, b'0', '2025-03-26 02:00:00.000000', 1, NULL),
(7, b'0', '2025-03-26 02:00:00.000000', 2, NULL),
(8, b'0', '2025-03-26 02:00:00.000000', 2, NULL),
(9, b'0', '2025-03-26 02:00:00.000000', 1, NULL),
(10, b'0', '2025-03-26 02:00:00.000000', 2, NULL),
(11, b'0', '2025-03-26 02:00:00.000000', 2, NULL),
(12, b'0', NULL, 2, NULL),
(13, b'0', '2025-03-26 02:00:00.000000', 3, NULL),
(14, b'0', '2025-03-26 02:00:00.000000', 3, NULL),
(15, b'0', NULL, 3, NULL),
(16, b'0', NULL, 3, NULL),
(17, b'0', '2025-03-26 02:00:00.000000', 3, NULL),
(18, b'0', '2025-03-26 02:00:00.000000', 3, NULL),
(19, b'0', '2025-03-26 02:00:00.000000', 2, NULL),
(20, b'0', '2025-03-26 02:00:00.000000', 1, NULL),
(21, b'0', '2025-03-26 02:00:00.000000', 1, NULL),
(22, b'0', '2025-03-26 02:00:00.000000', 2, NULL),
(23, b'0', '2025-03-26 02:00:00.000000', 2, NULL),
(24, b'0', '2025-03-26 02:00:00.000000', 3, NULL),
(25, b'0', '2025-03-26 02:00:00.000000', 3, NULL),
(26, b'0', '2025-03-26 02:00:00.000000', 2, NULL),
(27, b'0', '2025-03-26 02:00:00.000000', 2, NULL),
(28, b'0', '2025-03-26 02:00:00.000000', 1, NULL),
(29, b'0', '2025-03-26 02:00:00.000000', 3, NULL),
(30, b'0', '2025-03-26 02:00:00.000000', 1, NULL),
(31, b'0', '2025-03-26 02:00:00.000000', 1, NULL),
(32, b'0', '2025-03-26 02:00:00.000000', 1, NULL),
(33, b'0', '2025-03-26 02:00:00.000000', 1, NULL),
(34, b'0', '2025-03-26 02:00:00.000000', 2, NULL),
(35, b'0', '2025-03-26 02:00:00.000000', 3, NULL),
(36, b'0', '2025-03-26 02:00:00.000000', 3, NULL),
(37, b'0', '2025-03-29 02:00:00.000000', 3, NULL),
(38, b'0', '2025-03-29 02:00:00.000000', 3, NULL),
(39, b'0', '2025-03-29 02:00:00.000000', 3, NULL),
(40, b'0', '2025-03-29 02:00:00.000000', 3, NULL),
(41, b'0', '2025-03-29 02:00:00.000000', 3, NULL),
(42, b'0', '2025-03-29 02:00:00.000000', 3, NULL),
(43, b'0', '2025-03-29 02:00:00.000000', 2, NULL),
(44, b'0', '2025-03-29 02:00:00.000000', 2, NULL),
(45, b'0', '2025-03-29 02:00:00.000000', 1, NULL),
(46, b'0', '2025-03-29 02:00:00.000000', 1, NULL),
(47, b'0', '2025-03-29 02:00:00.000000', 1, NULL),
(48, b'0', '2025-03-29 02:00:00.000000', 1, NULL),
(49, b'0', '2025-03-29 02:00:00.000000', 2, NULL),
(50, b'0', '2025-03-29 02:00:00.000000', 2, NULL),
(51, b'0', '2025-03-29 02:00:00.000000', 2, NULL),
(52, b'0', '2025-03-30 02:00:00.000000', 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `enrollment_courses`
--

CREATE TABLE `enrollment_courses` (
  `enrollment_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollment_courses`
--

INSERT INTO `enrollment_courses` (`enrollment_id`, `course_id`) VALUES
(1, 1),
(1, 2),
(2, 1),
(2, 2),
(3, 1),
(3, 2),
(4, 1),
(4, 2),
(5, 1),
(5, 2),
(6, 1),
(6, 2),
(7, 3),
(8, 4),
(9, 4),
(10, 4),
(11, 5),
(12, 5),
(13, 5),
(14, 5),
(15, 5),
(16, 5),
(17, 5),
(18, 5),
(19, 5),
(20, 5),
(21, 6),
(22, 6),
(23, 6),
(24, 6),
(25, 6),
(26, 6),
(27, 6),
(28, 6),
(29, 6),
(30, 6),
(31, 6),
(32, 6),
(33, 7),
(34, 7),
(35, 7),
(36, 7),
(37, 7),
(38, 7),
(39, 7),
(40, 8),
(41, 8),
(42, 8),
(43, 8),
(44, 8),
(45, 8),
(46, 8),
(47, 9),
(48, 10),
(49, 10),
(50, 11),
(51, 11),
(52, 11);

-- --------------------------------------------------------

--
-- Table structure for table `instructor`
--

CREATE TABLE `instructor` (
  `id` bigint(20) NOT NULL,
  `expertise` varchar(255) DEFAULT NULL,
  `graduate_degree` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `instructor`
--

INSERT INTO `instructor` (`id`, `expertise`, `graduate_degree`, `name`, `user_id`) VALUES
(1, 'Machine Learning', 'MSc in Computer Science', NULL, 3),
(2, 'Machine Learning', 'MSc in Computer Science', NULL, 10);

-- --------------------------------------------------------

--
-- Table structure for table `question`
--

CREATE TABLE `question` (
  `id` bigint(20) NOT NULL,
  `correct_answer` varchar(255) DEFAULT NULL,
  `question_type` enum('DRAG_AND_DROP','ESSAY','FILL_IN_THE_BLANK','IMAGE_PATTERN_RECOGNITION','MATCH_THE_PATTERNS','MULTIPLE_CHOICE_MULTIPLE','MULTIPLE_CHOICE_SINGLE','PATTERN_RECOGNITION','TRUE_FALSE') DEFAULT NULL,
  `text` varchar(255) DEFAULT NULL,
  `quiz_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question`
--

INSERT INTO `question` (`id`, `correct_answer`, `question_type`, `text`, `quiz_id`) VALUES
(1, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', 1),
(2, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', 1),
(3, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', 1),
(4, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', 1),
(5, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', 1),
(6, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', 1),
(7, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', 1),
(8, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', 1),
(9, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', 1),
(10, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', 2),
(11, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', 2),
(12, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', 2),
(13, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', 2),
(14, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', 2),
(15, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', 2),
(16, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', 2),
(17, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', 2),
(18, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', 2),
(19, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', 3),
(20, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', 3),
(21, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', 3),
(22, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', 3),
(23, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', 3),
(24, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', 3),
(25, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', 3),
(26, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', 3),
(27, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', 3),
(28, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', 4),
(29, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', 4),
(30, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', 4),
(31, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', 4),
(32, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', 4),
(33, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', 4),
(34, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', 4),
(35, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', 4),
(36, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', 4),
(37, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', 5),
(38, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', 5),
(39, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', 5),
(40, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', 5),
(41, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', 5),
(42, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', 5),
(43, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', 5),
(44, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', 5),
(45, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', 5),
(46, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', 6),
(47, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', 6),
(48, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', 6),
(49, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', 6),
(50, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', 6),
(51, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', 6),
(52, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', 6),
(53, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', 6),
(54, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', 6),
(55, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', NULL),
(56, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', NULL),
(57, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', NULL),
(58, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', NULL),
(59, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', NULL),
(60, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', NULL),
(61, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', NULL),
(62, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', NULL),
(63, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', NULL),
(64, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', NULL),
(65, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', NULL),
(66, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', NULL),
(67, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', NULL),
(68, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', NULL),
(69, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', NULL),
(70, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', NULL),
(71, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', NULL),
(72, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', NULL),
(73, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', NULL),
(74, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', NULL),
(75, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', NULL),
(76, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', NULL),
(77, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', NULL),
(78, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', NULL),
(79, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', NULL),
(80, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', NULL),
(81, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', NULL),
(82, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', NULL),
(83, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', NULL),
(84, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', NULL),
(85, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', NULL),
(86, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', NULL),
(87, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', NULL),
(88, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', NULL),
(89, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', NULL),
(90, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', NULL),
(91, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', NULL),
(92, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', NULL),
(93, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', NULL),
(94, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', NULL),
(95, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', NULL),
(96, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', NULL),
(97, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', NULL),
(98, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', NULL),
(99, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', NULL),
(100, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', NULL),
(101, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', NULL),
(102, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', NULL),
(103, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', NULL),
(104, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', NULL),
(105, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', NULL),
(106, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', NULL),
(107, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', NULL),
(108, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', NULL),
(109, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', NULL),
(110, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', NULL),
(111, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', NULL),
(112, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', NULL),
(113, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', NULL),
(114, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', NULL),
(115, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', NULL),
(116, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', NULL),
(117, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', NULL),
(118, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', NULL),
(119, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', NULL),
(120, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', NULL),
(121, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', NULL),
(122, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', NULL),
(123, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', NULL),
(124, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', NULL),
(125, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', NULL),
(126, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', NULL),
(127, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', NULL),
(128, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', NULL),
(129, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', NULL),
(130, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', NULL),
(131, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', NULL),
(132, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', NULL),
(133, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', NULL),
(134, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', NULL),
(135, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', NULL),
(136, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', 16),
(137, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', 16),
(138, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', 16),
(139, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', 16),
(140, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', 16),
(141, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', 16),
(142, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', 16),
(143, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', 16),
(144, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', 16),
(145, 'False', 'TRUE_FALSE', 'The sun revolves around the Earth', 17),
(146, 'Paris', 'MULTIPLE_CHOICE_SINGLE', 'What is the capital of France?', 17),
(147, '2,3,5', 'MULTIPLE_CHOICE_MULTIPLE', 'Select prime numbers', 17),
(148, 'H2O', 'FILL_IN_THE_BLANK', 'The chemical symbol for water is ___', 17),
(149, 'I', 'PATTERN_RECOGNITION', 'Continue the pattern: A, C, E, G, ___', 17),
(150, 'Mercury,Venus,Earth', 'DRAG_AND_DROP', 'Arrange planets from Sun: Mercury, Venus, Earth', 17),
(151, 'circle', 'IMAGE_PATTERN_RECOGNITION', 'Identify the circle pattern (image ID: 123)', 17),
(152, 'France:Paris,Germany:Berlin', 'MATCH_THE_PATTERNS', 'Match countries to capitals: France-? Germany-?', 17),
(153, 'essay_grading_required', 'ESSAY', 'Explain quantum computing basics', 17);

-- --------------------------------------------------------

--
-- Table structure for table `question_options`
--

CREATE TABLE `question_options` (
  `question_id` bigint(20) NOT NULL,
  `options` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `question_options`
--

INSERT INTO `question_options` (`question_id`, `options`) VALUES
(2, 'London'),
(2, 'Berlin'),
(2, 'Paris'),
(2, 'Madrid'),
(3, '1'),
(3, '2'),
(3, '3'),
(3, '4'),
(3, '5'),
(11, 'London'),
(11, 'Berlin'),
(11, 'Paris'),
(11, 'Madrid'),
(12, '1'),
(12, '2'),
(12, '3'),
(12, '4'),
(12, '5'),
(20, 'London'),
(20, 'Berlin'),
(20, 'Paris'),
(20, 'Madrid'),
(21, '1'),
(21, '2'),
(21, '3'),
(21, '4'),
(21, '5'),
(29, 'London'),
(29, 'Berlin'),
(29, 'Paris'),
(29, 'Madrid'),
(30, '1'),
(30, '2'),
(30, '3'),
(30, '4'),
(30, '5'),
(38, 'London'),
(38, 'Berlin'),
(38, 'Paris'),
(38, 'Madrid'),
(39, '1'),
(39, '2'),
(39, '3'),
(39, '4'),
(39, '5'),
(47, 'London'),
(47, 'Berlin'),
(47, 'Paris'),
(47, 'Madrid'),
(48, '1'),
(48, '2'),
(48, '3'),
(48, '4'),
(48, '5'),
(56, 'London'),
(56, 'Berlin'),
(56, 'Paris'),
(56, 'Madrid'),
(57, '1'),
(57, '2'),
(57, '3'),
(57, '4'),
(57, '5'),
(65, 'London'),
(65, 'Berlin'),
(65, 'Paris'),
(65, 'Madrid'),
(66, '1'),
(66, '2'),
(66, '3'),
(66, '4'),
(66, '5'),
(74, 'London'),
(74, 'Berlin'),
(74, 'Paris'),
(74, 'Madrid'),
(75, '1'),
(75, '2'),
(75, '3'),
(75, '4'),
(75, '5'),
(83, 'London'),
(83, 'Berlin'),
(83, 'Paris'),
(83, 'Madrid'),
(84, '1'),
(84, '2'),
(84, '3'),
(84, '4'),
(84, '5'),
(92, 'London'),
(92, 'Berlin'),
(92, 'Paris'),
(92, 'Madrid'),
(93, '1'),
(93, '2'),
(93, '3'),
(93, '4'),
(93, '5'),
(101, 'London'),
(101, 'Berlin'),
(101, 'Paris'),
(101, 'Madrid'),
(102, '1'),
(102, '2'),
(102, '3'),
(102, '4'),
(102, '5'),
(110, 'London'),
(110, 'Berlin'),
(110, 'Paris'),
(110, 'Madrid'),
(111, '1'),
(111, '2'),
(111, '3'),
(111, '4'),
(111, '5'),
(119, 'London'),
(119, 'Berlin'),
(119, 'Paris'),
(119, 'Madrid'),
(120, '1'),
(120, '2'),
(120, '3'),
(120, '4'),
(120, '5'),
(129, 'London'),
(129, 'Berlin'),
(129, 'Paris'),
(129, 'Madrid'),
(131, '1'),
(131, '2'),
(131, '3'),
(131, '4'),
(131, '5'),
(137, 'London'),
(137, 'Berlin'),
(137, 'Paris'),
(137, 'Madrid'),
(138, '1'),
(138, '2'),
(138, '3'),
(138, '4'),
(138, '5'),
(146, 'London'),
(146, 'Berlin'),
(146, 'Paris'),
(146, 'Madrid'),
(147, '1'),
(147, '2'),
(147, '3'),
(147, '4'),
(147, '5');

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `course_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `quiz`
--

INSERT INTO `quiz` (`id`, `title`, `course_id`) VALUES
(1, 'Comprehensive Quiz', NULL),
(2, 'Comprehensive Quiz', NULL),
(3, 'Comprehensive Quiz', NULL),
(4, 'Comprehensive Quiz', NULL),
(5, 'Comprehensive Quiz', 9),
(6, 'Comprehensive Quiz', 9),
(7, 'Comprehensive Quiz', 9),
(8, 'Comprehensive Quiz', 9),
(9, 'Comprehensive Quiz', 9),
(10, 'Comprehensive Quiz', 9),
(11, 'Comprehensive Quiz', 9),
(12, 'Comprehensive Quiz', 9),
(13, 'Comprehensive Quiz', 9),
(14, 'Comprehensive Quiz', 10),
(15, 'Comprehensive Quiz', 10),
(16, 'Comprehensive Quiz', 10),
(17, 'Comprehensive Quiz', 10);

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `id` bigint(20) NOT NULL,
  `grade` varchar(255) DEFAULT NULL,
  `hobbies` varchar(255) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`id`, `grade`, `hobbies`, `user_id`) VALUES
(1, 'A', 'Reading, Coding', 4),
(2, NULL, NULL, 5),
(3, NULL, NULL, 6),
(4, NULL, NULL, 7),
(5, NULL, NULL, 9);

-- --------------------------------------------------------

--
-- Table structure for table `student_course`
--

CREATE TABLE `student_course` (
  `student_id` bigint(20) NOT NULL,
  `course_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_course`
--

INSERT INTO `student_course` (`student_id`, `course_id`) VALUES
(3, 5),
(3, 5),
(3, 6),
(3, 8),
(1, 8),
(1, 8),
(1, 9),
(1, 10),
(2, 6),
(2, 8),
(2, 8),
(2, 10),
(2, 11),
(2, 11),
(2, 11);

-- --------------------------------------------------------

--
-- Table structure for table `submission`
--

CREATE TABLE `submission` (
  `id` bigint(20) NOT NULL,
  `quiz_id` bigint(20) DEFAULT NULL,
  `score` int(11) NOT NULL,
  `student_id` bigint(20) DEFAULT NULL,
  `submission_date` datetime(6) NOT NULL,
  `answer` varchar(255) DEFAULT NULL,
  `graded` bit(1) NOT NULL,
  `assignment_id` bigint(20) DEFAULT NULL,
  `quiz_ref_id` bigint(20) DEFAULT NULL,
  `student_ref_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `submission`
--

INSERT INTO `submission` (`id`, `quiz_id`, `score`, `student_id`, `submission_date`, `answer`, `graded`, `assignment_id`, `quiz_ref_id`, `student_ref_id`) VALUES
(1, 1, 9, 1, '2025-03-28 11:30:37.000000', NULL, b'0', NULL, NULL, NULL),
(2, 1, 9, 1, '2025-03-28 19:34:24.000000', NULL, b'0', NULL, NULL, NULL),
(3, NULL, 0, 2, '2025-03-29 09:53:35.000000', 'This is my answer to the assignment question.', b'0', 31, NULL, 2),
(4, NULL, 0, 2, '2025-03-29 09:54:25.000000', 'This is my answer to the assignment question.', b'0', 31, NULL, 2),
(5, NULL, 0, 2, '2025-03-29 09:59:33.000000', 'This is my answer to the assignment question.', b'0', 31, NULL, 2),
(6, NULL, 95, 2, '2025-03-29 10:06:23.000000', 'This is my answer to the assignment question.', b'1', 32, NULL, 2),
(7, 5, 9, 1, '2025-03-29 13:05:27.000000', NULL, b'0', NULL, NULL, NULL),
(8, 5, 9, 2, '2025-03-29 13:05:37.000000', NULL, b'0', NULL, NULL, NULL),
(9, 5, 9, 3, '2025-03-29 13:05:43.000000', NULL, b'0', NULL, NULL, NULL),
(10, 5, 9, 4, '2025-03-29 13:05:48.000000', NULL, b'0', NULL, NULL, NULL),
(11, 5, 9, 111, '2025-03-29 13:06:05.000000', NULL, b'0', NULL, NULL, NULL),
(12, 5, 9, 1, '2025-03-29 13:10:21.000000', NULL, b'0', NULL, NULL, NULL),
(13, 6, 9, 1, '2025-03-29 13:47:37.000000', NULL, b'0', NULL, NULL, NULL),
(14, 7, 90, 1, '2025-03-29 13:48:41.000000', NULL, b'1', NULL, NULL, NULL),
(15, 8, 90, 1, '2025-03-29 13:52:50.000000', NULL, b'1', NULL, NULL, NULL),
(16, 8, 0, 1, '2025-03-29 14:37:39.000000', NULL, b'0', NULL, NULL, NULL),
(17, 9, 0, 1, '2025-03-29 14:38:44.000000', NULL, b'0', NULL, NULL, NULL),
(18, 9, 0, 1, '2025-03-29 14:38:55.000000', NULL, b'0', NULL, NULL, NULL),
(19, 16, 9, 1, '2025-03-29 15:35:45.000000', NULL, b'0', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `submission_answers`
--

CREATE TABLE `submission_answers` (
  `submission_id` bigint(20) NOT NULL,
  `answers` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `submission_answers`
--

INSERT INTO `submission_answers` (`submission_id`, `answers`) VALUES
(1, 'False'),
(1, 'Paris'),
(1, '2,3,5'),
(1, 'H2O'),
(1, 'I'),
(1, 'Mercury,Venus,Earth'),
(1, 'circle'),
(1, 'France:Paris,Germany:Berlin'),
(1, 'essay_grading_required'),
(2, 'False'),
(2, 'Paris'),
(2, '2,3,5'),
(2, 'H2O'),
(2, 'I'),
(2, 'Mercury,Venus,Earth'),
(2, 'circle'),
(2, 'France:Paris,Germany:Berlin'),
(2, 'essay_grading_required'),
(7, 'False'),
(7, 'Paris'),
(7, '2,3,5'),
(7, 'H2O'),
(7, 'I'),
(7, 'Mercury,Venus,Earth'),
(7, 'circle'),
(7, 'France:Paris,Germany:Berlin'),
(7, 'essay_grading_required'),
(8, 'False'),
(8, 'Paris'),
(8, '2,3,5'),
(8, 'H2O'),
(8, 'I'),
(8, 'Mercury,Venus,Earth'),
(8, 'circle'),
(8, 'France:Paris,Germany:Berlin'),
(8, 'essay_grading_required'),
(9, 'False'),
(9, 'Paris'),
(9, '2,3,5'),
(9, 'H2O'),
(9, 'I'),
(9, 'Mercury,Venus,Earth'),
(9, 'circle'),
(9, 'France:Paris,Germany:Berlin'),
(9, 'essay_grading_required'),
(10, 'False'),
(10, 'Paris'),
(10, '2,3,5'),
(10, 'H2O'),
(10, 'I'),
(10, 'Mercury,Venus,Earth'),
(10, 'circle'),
(10, 'France:Paris,Germany:Berlin'),
(10, 'essay_grading_required'),
(11, 'False'),
(11, 'Paris'),
(11, '2,3,5'),
(11, 'H2O'),
(11, 'I'),
(11, 'Mercury,Venus,Earth'),
(11, 'circle'),
(11, 'France:Paris,Germany:Berlin'),
(11, 'essay_grading_required'),
(12, 'False'),
(12, 'Paris'),
(12, '2,3,5'),
(12, 'H2O'),
(12, 'I'),
(12, 'Mercury,Venus,Earth'),
(12, 'circle'),
(12, 'France:Paris,Germany:Berlin'),
(12, 'essay_grading_required'),
(13, 'False'),
(13, 'Paris'),
(13, '2,3,5'),
(13, 'H2O'),
(13, 'I'),
(13, 'Mercury,Venus,Earth'),
(13, 'circle'),
(13, 'France:Paris,Germany:Berlin'),
(13, 'essay_grading_required'),
(14, 'False'),
(14, 'Paris'),
(14, '2,3,5'),
(14, 'H2O'),
(14, 'I'),
(14, 'Mercury,Venus,Earth'),
(14, 'circle'),
(14, 'France:Paris,Germany:Berlin'),
(14, 'essay_grading_required'),
(15, 'False'),
(15, 'Paris'),
(15, '2,3,5'),
(15, 'H2O'),
(15, 'I'),
(15, 'Mercury,Venus,Earth'),
(15, 'circle'),
(15, 'France:Paris,Germany:Berlin'),
(15, 'essay_grading_required'),
(16, 'False'),
(16, 'Paris'),
(16, '2,3,5'),
(16, 'H2O'),
(16, 'I'),
(16, 'Mercury,Venus,Earth'),
(16, 'circle'),
(16, 'France:Paris,Germany:Berlin'),
(16, 'essay_grading_required'),
(17, 'False'),
(17, 'Paris'),
(17, '2,3,5'),
(17, 'H2O'),
(17, 'I'),
(17, 'Mercury,Venus,Earth'),
(17, 'circle'),
(17, 'France:Paris,Germany:Berlin'),
(17, 'essay_grading_required'),
(18, 'False'),
(18, 'Paris'),
(18, '2,3,5'),
(18, 'H2O'),
(18, 'I'),
(18, 'Mercury,Venus,Earth'),
(18, 'circle'),
(18, 'France:Paris,Germany:Berlin'),
(18, 'essay_grading_required'),
(19, 'False'),
(19, 'Paris'),
(19, '2,3,5'),
(19, 'H2O'),
(19, 'I'),
(19, 'Mercury,Venus,Earth'),
(19, 'circle'),
(19, 'France:Paris,Germany:Berlin'),
(19, 'essay_grading_required');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `auth_provider` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `profile` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `auth_provider`, `email`, `password`, `profile`, `role`, `username`, `reset_token`, `reset_token_expiry`) VALUES
(1, NULL, 'newemail@example.com', '$2a$10$qtwsukE1t4NWKNHCJk40buDJlEX3Doo8aU64ZXkdFPCcoujQmZ8IG', 'updated profile', 'ADMIN', 'newusername', 'e1f7fcb2-bc4f-40ef-bbba-c564113090e4', '2025-03-30 02:31:01.000000'),
(2, NULL, 'admiin@example.com', '$2a$10$V7BC2/6UUl12EjICfvhixe2Ew465xhfBaf4HZi78BmSJ5u8dVmc/G', 'Administrator account', 'ADMIN', 'admiin', NULL, NULL),
(3, NULL, 'instructor@example.com', '$2a$10$UXu3dRO3vPvEUtGiSPJMTuHoNXdsLzyJ/TM.Srkyor4u65/YsMIna', 'Instructor account', 'INSTRUCTOR', 'instructor', '85edb667-0f64-41b8-b25a-cfb44880a19e', '2025-03-28 12:16:44.000000'),
(4, NULL, 'student@example.com', '$2a$10$C5O2K3oGNSD5FOvx1zllfOLMttBOJUhwNk3KIcHfm/gTsR4o6to5u', 'I only can update my own data', 'STUDENT', 'userWhoIsLoggedIn', NULL, NULL),
(5, NULL, 'marahabuayyash9@gmail.com', '$2a$10$cF8guf2hex0hNT4MhwxhK.2THhcMXZjh13vM.PuOa8WSpR3xG2nzG', 'Updated profile text', 'STUDENT', 'mmm', NULL, NULL),
(6, NULL, 'student1@example.com', '$2a$10$1sSePf1aYHV4kybjj5laZeRtkSUppPXJ2kmJEg2v63YVKS8q0W3Uu', NULL, 'STUDENT', 'student1', NULL, NULL),
(7, NULL, 'testuser@example.com', '$2a$10$fCoYRb8xlspF9J8Pk.clve0B7YlOwsCYT2bDSeqJdS4fr3.IG/Qb6', 'Profile info', 'STUDENT', 'testuser', NULL, NULL),
(9, NULL, 'user@example.com', '$2a$10$bwqt/3g4YO07.OEbIhGVEuk44/n9Cstz031SQTLEyjk2zCGFotVf2', 'Profile info here', 'STUDENT', 'newuser', NULL, NULL),
(10, NULL, 'kareemp44p4@gmail.com', '$2a$10$kaD5sFzA1L/Fg4auR6pNcuA6V7oj6qflQKC2tROqd78iE2ZNCf5KC', 'Instructor account', 'INSTRUCTOR', 'innnstructor', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_table`
--
ALTER TABLE `admin_table`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKmfht1v2b8m6s3mawhdtm7hr4b` (`user_id`);

--
-- Indexes for table `assignment`
--
ALTER TABLE `assignment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKmvmqk474t3gwjx659lt0epr46` (`student_id`),
  ADD KEY `FKrop26uwnbkstbtfha3ormxp85` (`course_id`);

--
-- Indexes for table `assignment_submission`
--
ALTER TABLE `assignment_submission`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKi9tdkyaqlb4j7qm7y2k74jd7o` (`assignment_id`),
  ADD KEY `FKb4ifsk7hs0eflfk1sqj4y3mq` (`student_id`);

--
-- Indexes for table `content`
--
ALTER TABLE `content`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKrftaakmtki1c63nd2f8y4spof` (`course_id`),
  ADD KEY `FKlnthsgafrc3i7sarakn6wcj33` (`uploaded_by`);

--
-- Indexes for table `course`
--
ALTER TABLE `course`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKqk2yq2yk124dhlsilomy36qr9` (`instructor_id`);

--
-- Indexes for table `course_enrollment`
--
ALTER TABLE `course_enrollment`
  ADD KEY `FKpurd525bwrsn45j4mncmm1bbk` (`enrollment_id`),
  ADD KEY `FKmdu3eh7r8fvaemtwyps4dtqoh` (`course_id`);

--
-- Indexes for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`enrollment_id`),
  ADD KEY `FKio7fsy3vhvfgv7c0gjk15nyk4` (`student_id`),
  ADD KEY `FKbhhcqkw1px6yljqg92m0sh2gt` (`course_id`);

--
-- Indexes for table `enrollment_courses`
--
ALTER TABLE `enrollment_courses`
  ADD KEY `FKthidpibr5sdje3d6iimb9jklp` (`course_id`),
  ADD KEY `FKc3seoxqdkc1vs6w4twl7m9rtq` (`enrollment_id`);

--
-- Indexes for table `instructor`
--
ALTER TABLE `instructor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKcr0g7gh88hv7sfdx9kqbrbiyw` (`user_id`);

--
-- Indexes for table `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKb0yh0c1qaxfwlcnwo9dms2txf` (`quiz_id`);

--
-- Indexes for table `question_options`
--
ALTER TABLE `question_options`
  ADD KEY `FKjk4v42xhyfv4ca1yyhorsg5tv` (`question_id`);

--
-- Indexes for table `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKce16mrsgeokucc022mpyev7xk` (`course_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKbkix9btnoi1n917ll7bplkvg5` (`user_id`);

--
-- Indexes for table `student_course`
--
ALTER TABLE `student_course`
  ADD KEY `FKejrkh4gv8iqgmspsanaji90ws` (`course_id`),
  ADD KEY `FKq7yw2wg9wlt2cnj480hcdn6dq` (`student_id`);

--
-- Indexes for table `submission`
--
ALTER TABLE `submission`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK3q8643roa73llngo64dvpvtxt` (`assignment_id`),
  ADD KEY `FK6c3r6tucy43dxlnnky9yisevi` (`quiz_ref_id`),
  ADD KEY `FKsxf4ffoy9o7jobcws4rv67os3` (`student_ref_id`);

--
-- Indexes for table `submission_answers`
--
ALTER TABLE `submission_answers`
  ADD KEY `FK2eet63chl8p0ll11bs9sp56pg` (`submission_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKob8kqyqqgmefl0aco34akdtpe` (`email`),
  ADD UNIQUE KEY `UKsb8bbouer5wak8vyiiy4pf2bx` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_table`
--
ALTER TABLE `admin_table`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `assignment`
--
ALTER TABLE `assignment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `assignment_submission`
--
ALTER TABLE `assignment_submission`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `content`
--
ALTER TABLE `content`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `enrollment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `instructor`
--
ALTER TABLE `instructor`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=154;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `submission`
--
ALTER TABLE `submission`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin_table`
--
ALTER TABLE `admin_table`
  ADD CONSTRAINT `FKspffew5mrttaxfscevhufqu9m` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `assignment`
--
ALTER TABLE `assignment`
  ADD CONSTRAINT `FKmvmqk474t3gwjx659lt0epr46` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  ADD CONSTRAINT `FKrop26uwnbkstbtfha3ormxp85` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`);

--
-- Constraints for table `assignment_submission`
--
ALTER TABLE `assignment_submission`
  ADD CONSTRAINT `FKb4ifsk7hs0eflfk1sqj4y3mq` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  ADD CONSTRAINT `FKi9tdkyaqlb4j7qm7y2k74jd7o` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`);

--
-- Constraints for table `content`
--
ALTER TABLE `content`
  ADD CONSTRAINT `FKlnthsgafrc3i7sarakn6wcj33` FOREIGN KEY (`uploaded_by`) REFERENCES `instructor` (`id`),
  ADD CONSTRAINT `FKrftaakmtki1c63nd2f8y4spof` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`);

--
-- Constraints for table `course`
--
ALTER TABLE `course`
  ADD CONSTRAINT `FKqk2yq2yk124dhlsilomy36qr9` FOREIGN KEY (`instructor_id`) REFERENCES `instructor` (`id`);

--
-- Constraints for table `course_enrollment`
--
ALTER TABLE `course_enrollment`
  ADD CONSTRAINT `FKmdu3eh7r8fvaemtwyps4dtqoh` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `FKpurd525bwrsn45j4mncmm1bbk` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollment` (`enrollment_id`);

--
-- Constraints for table `enrollment`
--
ALTER TABLE `enrollment`
  ADD CONSTRAINT `FKbhhcqkw1px6yljqg92m0sh2gt` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `FKio7fsy3vhvfgv7c0gjk15nyk4` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`);

--
-- Constraints for table `enrollment_courses`
--
ALTER TABLE `enrollment_courses`
  ADD CONSTRAINT `FKc3seoxqdkc1vs6w4twl7m9rtq` FOREIGN KEY (`enrollment_id`) REFERENCES `enrollment` (`enrollment_id`),
  ADD CONSTRAINT `FKthidpibr5sdje3d6iimb9jklp` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`);

--
-- Constraints for table `instructor`
--
ALTER TABLE `instructor`
  ADD CONSTRAINT `FKpyhf3fgtvlqq630u3697wsmre` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `FKb0yh0c1qaxfwlcnwo9dms2txf` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`);

--
-- Constraints for table `question_options`
--
ALTER TABLE `question_options`
  ADD CONSTRAINT `FKjk4v42xhyfv4ca1yyhorsg5tv` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`);

--
-- Constraints for table `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `FKce16mrsgeokucc022mpyev7xk` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `FKk5m148xqefonqw7bgnpm0snwj` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`);

--
-- Constraints for table `student_course`
--
ALTER TABLE `student_course`
  ADD CONSTRAINT `FKejrkh4gv8iqgmspsanaji90ws` FOREIGN KEY (`course_id`) REFERENCES `course` (`id`),
  ADD CONSTRAINT `FKq7yw2wg9wlt2cnj480hcdn6dq` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`);

--
-- Constraints for table `submission`
--
ALTER TABLE `submission`
  ADD CONSTRAINT `FK3q8643roa73llngo64dvpvtxt` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`),
  ADD CONSTRAINT `FK6c3r6tucy43dxlnnky9yisevi` FOREIGN KEY (`quiz_ref_id`) REFERENCES `quiz` (`id`),
  ADD CONSTRAINT `FKsxf4ffoy9o7jobcws4rv67os3` FOREIGN KEY (`student_ref_id`) REFERENCES `student` (`id`);

--
-- Constraints for table `submission_answers`
--
ALTER TABLE `submission_answers`
  ADD CONSTRAINT `FK2eet63chl8p0ll11bs9sp56pg` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
