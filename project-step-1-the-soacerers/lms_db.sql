-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 07, 2025 at 12:56 PM
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
(1, NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `assignment`
--

CREATE TABLE `assignment` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `due_date` datetime(6) DEFAULT NULL,
  `graded` bit(1) NOT NULL,
  `score` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `total_points` int(11) NOT NULL,
  `course_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `assignment_submission`
--

CREATE TABLE `assignment_submission` (
  `id` bigint(20) NOT NULL,
  `graded` bit(1) NOT NULL,
  `score` int(11) NOT NULL,
  `submission_content` text DEFAULT NULL,
  `submission_date` datetime(6) DEFAULT NULL,
  `assignment_id` bigint(20) DEFAULT NULL,
  `student_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(2, 'h', '2', '2025-05-04 03:00:00.000000', '4', NULL, 'oop', 340, '2025-04-04 02:00:00.000000', NULL),
(3, 'Introduction to LMS', '3 months', '2025-07-01 03:00:00.000000', '1', NULL, 'Course 101', 100, '2025-04-01 02:00:00.000000', NULL),
(5, 'yh', '5 m', '2025-07-02 03:00:00.000000', '4', NULL, 'gg', 667, '2025-06-12 03:00:00.000000', NULL),
(6, 'fr', 'gh', '2025-05-26 03:00:00.000000', '4', NULL, 'fght', 333, '2025-05-02 03:00:00.000000', NULL),
(7, 's', 'df', '2025-05-13 03:00:00.000000', '3', NULL, 'df', 3333, '2025-05-01 03:00:00.000000', NULL),
(8, '5yt6d', '44gh ', '2025-05-29 03:00:00.000000', '1', NULL, 'thth', 455, '2025-05-09 03:00:00.000000', NULL);

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
  `student_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `enrollment`
--

INSERT INTO `enrollment` (`enrollment_id`, `completed`, `enrollment_date`, `student_id`) VALUES
(1, b'1', '2025-05-01 03:00:00.000000', 2),
(2, b'1', '2025-05-01 03:00:00.000000', 2),
(3, b'1', '2025-05-02 03:00:00.000000', 3);

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
(1, 2),
(2, 3),
(3, 2);

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
(1, NULL, NULL, 'karee', 2),
(3, NULL, NULL, 'ddd', 6),
(4, NULL, NULL, 'sdsd', 7),
(5, NULL, NULL, 'gggggg', 10);

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

-- --------------------------------------------------------

--
-- Table structure for table `question_options`
--

CREATE TABLE `question_options` (
  `question_id` bigint(20) NOT NULL,
  `options` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `quiz`
--

CREATE TABLE `quiz` (
  `id` bigint(20) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `course_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(2, NULL, NULL, 5),
(3, NULL, NULL, 8),
(4, NULL, NULL, 9);

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
(2, 2),
(2, 3),
(3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `submission`
--

CREATE TABLE `submission` (
  `id` bigint(20) NOT NULL,
  `graded` tinyint(1) NOT NULL DEFAULT 0,
  `quiz_id` bigint(20) DEFAULT NULL,
  `score` int(11) NOT NULL,
  `student_id` bigint(20) DEFAULT NULL,
  `submission_date` datetime(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `submission_answers`
--

CREATE TABLE `submission_answers` (
  `submission_id` bigint(20) NOT NULL,
  `answers` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_token_expiry` datetime(6) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `auth_provider`, `email`, `password`, `profile`, `reset_token`, `reset_token_expiry`, `role`, `username`) VALUES
(1, NULL, 'f@gmail.com', '$2a$10$oDFegOIalk8V8xB00TkwjO6Vm2xMO6o2bqDHpO6c8WnCtj10BWmv2', 'string', NULL, NULL, 'ADMIN', 'admin'),
(2, NULL, 'ff@gmail.com', '$2a$10$yBg6RK2CE8bXpH/BdivXp.DggdVjHof4TslNIvYS0.XrS9U7oMtsG', 'string', NULL, NULL, 'STUDENT', 'kg'),
(5, NULL, 'ks@gmail.com', '$2a$10$SS7OzOrEaOOblReG0lBcseAM6c/Ls2O7BSLChZ9sP/b6NrIAw0o.e', 'x', NULL, NULL, 'INSTRUCTOR', 'kk'),
(6, NULL, 'a@k.f', '$2a$10$/VVxMbKQ/3.38bID2mp/6.H.jNQFE3F0seMzyu5H4f8/72wpY/ARK', 'd', NULL, NULL, 'INSTRUCTOR', 'ff'),
(7, NULL, 'a@f.k', '$2a$10$jxUbEq3sFjJo61X9F8hKl.GztF2f21kmI3hdes0qev9Iwm8osZy6i', 'zzz', NULL, NULL, 'INSTRUCTOR', 's'),
(8, NULL, 'g@as.kj', '$2a$10$MjaXvlfDzU4dFWlVleQnFOFyg1pmMaCPt5ojt8dAKSdZ5xbIjBsdW', 'qqq', NULL, NULL, 'STUDENT', 'gg'),
(9, NULL, 'sd@wsf.k', '$2a$10$Q1ZcqKX2i2wVG5VWyMHSF.dvtmfW59hs8bpKX8R6.9U1NAmmjCksu', 'wdgdwde', NULL, NULL, 'STUDENT', 'aaazcx'),
(10, NULL, 'hh@ggg.l', '$2a$10$IQhNZ5kOKQoINEHWSlIuiuLdGqkMaajeB1opZiqqjKxsldj5LhGqO', 'ggg', NULL, NULL, 'INSTRUCTOR', 'hggggggg');

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
  ADD KEY `FKio7fsy3vhvfgv7c0gjk15nyk4` (`student_id`);

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
  ADD PRIMARY KEY (`id`);

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
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `assignment`
--
ALTER TABLE `assignment`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `assignment_submission`
--
ALTER TABLE `assignment_submission`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `content`
--
ALTER TABLE `content`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `course`
--
ALTER TABLE `course`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `enrollment_id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `instructor`
--
ALTER TABLE `instructor`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `question`
--
ALTER TABLE `question`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `quiz`
--
ALTER TABLE `quiz`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `submission`
--
ALTER TABLE `submission`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

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
-- Constraints for table `submission_answers`
--
ALTER TABLE `submission_answers`
  ADD CONSTRAINT `FK2eet63chl8p0ll11bs9sp56pg` FOREIGN KEY (`submission_id`) REFERENCES `submission` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
