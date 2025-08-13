-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: epathshalaai
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `academic_calendar`
--

DROP TABLE IF EXISTS `academic_calendar`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `academic_calendar` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `event_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `academic_calendar`
--

LOCK TABLES `academic_calendar` WRITE;
/*!40000 ALTER TABLE `academic_calendar` DISABLE KEYS */;
INSERT INTO `academic_calendar` VALUES (1,'2025-08-03','Annual sports competition for all students','Annual Sports Day'),(2,'2025-08-18','Meeting between parents and teachers to discuss student progress','Parent-Teacher Meeting'),(3,'2025-09-02','Students showcase their science projects','Science Exhibition'),(4,'2025-09-17','Annual cultural and academic celebration','Annual Day Celebration'),(5,'2025-10-02','Mid-term examinations for all classes','Mid-Term Examinations'),(6,'2025-10-17','Republic Day celebration with cultural programs','Republic Day Celebration'),(7,'2025-11-01','Independence Day celebration with flag hoisting','Independence Day Celebration'),(8,'2025-11-16','Teachers\' Day celebration by students','Teachers\' Day'),(9,'2025-12-01','Children\'s Day celebration with fun activities','Children\'s Day'),(10,'2025-12-16','Christmas celebration with carols and gifts','Christmas Celebration');
/*!40000 ALTER TABLE `academic_calendar` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment`
--

DROP TABLE IF EXISTS `assignment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `class_name` varchar(255) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `file_url` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `teacher_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text,
  `file_name` varchar(255) DEFAULT NULL,
  `file_size` bigint DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK30dlo8n82vkt7657237hn67ko` (`teacher_id`),
  CONSTRAINT `FK30dlo8n82vkt7657237hn67ko` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment`
--

LOCK TABLES `assignment` WRITE;
/*!40000 ALTER TABLE `assignment` DISABLE KEYS */;
INSERT INTO `assignment` VALUES (1,'Class 10A','2025-08-10','/api/files/assignments/1753983287395_database.pdf','Mathematics','Math Homework',1,NULL,NULL,NULL,NULL,NULL,NULL),(2,'Class 10A','2025-08-10','/api/files/assignments/1754043875194_database.pdf','Science','Science Project',1,NULL,NULL,NULL,NULL,NULL,NULL),(3,'Class 10A','2025-08-10','/api/files/assignments/1753983287395_database.pdf','English','English Essay',1,NULL,NULL,NULL,NULL,NULL,NULL),(4,'Class 10B','2025-08-10','/api/files/assignments/1753983287395_database.pdf','Mathematics','Math Homework',2,NULL,NULL,NULL,NULL,NULL,NULL),(5,'Class 10B','2025-08-10','/api/files/assignments/1754043875194_database.pdf','Science','Science Project',2,NULL,NULL,NULL,NULL,NULL,NULL),(6,'Class 10B','2025-08-10','/api/files/assignments/1753983287395_database.pdf','English','English Essay',2,NULL,NULL,NULL,NULL,NULL,NULL),(7,'Class 9A','2025-08-10','/api/files/assignments/1753983287395_database.pdf','Mathematics','Math Homework',3,NULL,NULL,NULL,NULL,NULL,NULL),(8,'Class 9A','2025-08-10','/api/files/assignments/1754043875194_database.pdf','Science','Science Project',3,NULL,NULL,NULL,NULL,NULL,NULL),(9,'Class 9A','2025-08-10','/api/files/assignments/1753983287395_database.pdf','English','English Essay',3,NULL,NULL,NULL,NULL,NULL,NULL),(10,'Class 10A','2025-08-10','/api/files/assignments/1753983287395_database.pdf','Mathematics','Math Homework',1,NULL,NULL,NULL,NULL,NULL,NULL),(11,'Class 10A','2025-08-10','/api/files/assignments/1754043875194_database.pdf','Science','Science Project',1,NULL,NULL,NULL,NULL,NULL,NULL),(12,'Class 10A','2025-08-10','/api/files/assignments/1753983287395_database.pdf','English','English Essay',1,NULL,NULL,NULL,NULL,NULL,NULL),(13,'Class 10B','2025-08-10','/api/files/assignments/1753983287395_database.pdf','Mathematics','Math Homework',2,NULL,NULL,NULL,NULL,NULL,NULL),(14,'Class 10B','2025-08-10','/api/files/assignments/1754043875194_database.pdf','Science','Science Project',2,NULL,NULL,NULL,NULL,NULL,NULL),(15,'Class 10B','2025-08-10','/api/files/assignments/1753983287395_database.pdf','English','English Essay',2,NULL,NULL,NULL,NULL,NULL,NULL),(16,'Class 11A','2025-08-10','/api/files/assignments/1753983287395_database.pdf','Mathematics','Math Homework',5,NULL,NULL,NULL,NULL,NULL,NULL),(17,'Class 11A','2025-08-10','/api/files/assignments/1754043875194_database.pdf','Science','Science Project',5,NULL,NULL,NULL,NULL,NULL,NULL),(18,'Class 11A','2025-08-10','/api/files/assignments/1753983287395_database.pdf','English','English Essay',5,NULL,NULL,NULL,NULL,NULL,NULL),(19,'Class 9A','2025-08-10','/api/files/assignments/1753983287395_database.pdf','Mathematics','Math Homework',3,NULL,NULL,NULL,NULL,NULL,NULL),(20,'Class 9A','2025-08-10','/api/files/assignments/1754043875194_database.pdf','Science','Science Project',3,NULL,NULL,NULL,NULL,NULL,NULL),(21,'Class 9A','2025-08-10','/api/files/assignments/1753983287395_database.pdf','English','English Essay',3,NULL,NULL,NULL,NULL,NULL,NULL),(22,'Class 11A','2025-08-10','/api/files/assignments/1753983287395_database.pdf','Mathematics','Math Homework',5,NULL,NULL,NULL,NULL,NULL,NULL),(23,'Class 11A','2025-08-10','/api/files/assignments/1754043875194_database.pdf','Science','Science Project',5,NULL,NULL,NULL,NULL,NULL,NULL),(24,'Class 11A','2025-08-10','/api/files/assignments/1753983287395_database.pdf','English','English Essay',5,NULL,NULL,NULL,NULL,NULL,NULL),(25,'Class 10A','2025-08-13','/api/files/assignments/math_assignment.pdf','Mathematics','Calculus Problem Set',1,NULL,NULL,NULL,NULL,NULL,NULL),(26,'Class 10A','2025-08-10','/api/files/assignments/math_assignment.pdf','Mathematics','Algebra Quiz',1,NULL,NULL,NULL,NULL,NULL,NULL),(27,'Class 10A','2025-08-12','/api/files/assignments/math_assignment.pdf','Mathematics','Geometry Project',1,NULL,NULL,NULL,NULL,NULL,NULL),(28,'Class 10A','2025-08-09','/api/files/assignments/math_assignment.pdf','Mathematics','Statistics Assignment',1,NULL,NULL,NULL,NULL,NULL,NULL),(29,'Class 10B','2025-08-17','/api/files/assignments/science_assignment.pdf','Science','Physics Lab Report',2,NULL,NULL,NULL,NULL,NULL,NULL),(30,'Class 10B','2025-08-09','/api/files/assignments/science_assignment.pdf','Science','Chemistry Experiment',2,NULL,NULL,NULL,NULL,NULL,NULL),(31,'Class 10B','2025-08-17','/api/files/assignments/science_assignment.pdf','Science','Biology Research',2,NULL,NULL,NULL,NULL,NULL,NULL),(32,'Class 10B','2025-08-12','/api/files/assignments/science_assignment.pdf','Science','Environmental Science Project',2,NULL,NULL,NULL,NULL,NULL,NULL),(33,'Class 9A','2025-08-09','/api/files/assignments/english_assignment.pdf','English','Shakespeare Analysis',3,NULL,NULL,NULL,NULL,NULL,NULL),(34,'Class 9A','2025-08-10','/api/files/assignments/english_assignment.pdf','English','Creative Writing',3,NULL,NULL,NULL,NULL,NULL,NULL),(35,'Class 9A','2025-08-13','/api/files/assignments/english_assignment.pdf','English','Grammar Test',3,NULL,NULL,NULL,NULL,NULL,NULL),(36,'Class 9A','2025-08-17','/api/files/assignments/english_assignment.pdf','English','Literature Review',3,NULL,NULL,NULL,NULL,NULL,NULL),(37,'Class 10A','2025-08-17','/api/files/assignments/history_assignment.pdf','History','World War II Research',4,NULL,NULL,NULL,NULL,NULL,NULL),(38,'Class 10A','2025-08-14','/api/files/assignments/history_assignment.pdf','History','Ancient Civilizations',4,NULL,NULL,NULL,NULL,NULL,NULL),(39,'Class 10A','2025-08-17','/api/files/assignments/history_assignment.pdf','History','Indian Independence Movement',4,NULL,NULL,NULL,NULL,NULL,NULL),(40,'Class 10A','2025-08-16','/api/files/assignments/history_assignment.pdf','History','Modern History Essay',4,NULL,NULL,NULL,NULL,NULL,NULL),(41,'Class 11A','2025-08-15','/api/files/assignments/cs_assignment.pdf','Computer Science','Java Programming',5,NULL,NULL,NULL,NULL,NULL,NULL),(42,'Class 11A','2025-08-13','/api/files/assignments/cs_assignment.pdf','Computer Science','Database Design',5,NULL,NULL,NULL,NULL,NULL,NULL),(43,'Class 11A','2025-08-10','/api/files/assignments/cs_assignment.pdf','Computer Science','Web Development',5,NULL,NULL,NULL,NULL,NULL,NULL),(44,'Class 11A','2025-08-11','/api/files/assignments/cs_assignment.pdf','Computer Science','Algorithm Analysis',5,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `assignment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `assignment_submissions`
--

DROP TABLE IF EXISTS `assignment_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assignment_submissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `feedback` text,
  `grade` double DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `submission_file_url` varchar(255) DEFAULT NULL,
  `submission_text` text,
  `submitted_at` datetime(6) DEFAULT NULL,
  `submitted_late` bit(1) DEFAULT NULL,
  `assignment_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK1hq7eb24o9em9pyl4upjkwfcl` (`assignment_id`),
  KEY `FKmj0bfml9xmt40ix97swlwmhv6` (`student_id`),
  CONSTRAINT `FK1hq7eb24o9em9pyl4upjkwfcl` FOREIGN KEY (`assignment_id`) REFERENCES `assignment` (`id`),
  CONSTRAINT `FKmj0bfml9xmt40ix97swlwmhv6` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `assignment_submissions`
--

LOCK TABLES `assignment_submissions` WRITE;
/*!40000 ALTER TABLE `assignment_submissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `assignment_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attendance`
--

DROP TABLE IF EXISTS `attendance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `date` date DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `marked_by_id` bigint DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlb8kmdiu0nxqeuveaueboy8jf` (`marked_by_id`),
  KEY `FKnq6vm31it076obtjf2qp5coim` (`student_id`),
  CONSTRAINT `FKlb8kmdiu0nxqeuveaueboy8jf` FOREIGN KEY (`marked_by_id`) REFERENCES `teacher` (`id`),
  CONSTRAINT `FKnq6vm31it076obtjf2qp5coim` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attendance`
--

LOCK TABLES `attendance` WRITE;
/*!40000 ALTER TABLE `attendance` DISABLE KEYS */;
INSERT INTO `attendance` VALUES (1,'2025-08-03','Present',1,1),(2,'2025-08-02','Absent',1,1),(3,'2025-08-01','Present',1,1),(4,'2025-07-31','Absent',1,1),(5,'2025-07-30','Present',1,1),(6,'2025-08-03','Present',2,2),(7,'2025-08-02','Absent',2,2),(8,'2025-08-01','Present',2,2),(9,'2025-07-31','Absent',2,2),(10,'2025-07-30','Present',2,2),(11,'2025-08-03','Present',3,3),(12,'2025-08-02','Absent',3,3),(13,'2025-08-01','Present',3,3),(14,'2025-07-31','Absent',3,3),(15,'2025-07-30','Present',3,3),(16,'2025-08-03','Present',1,4),(17,'2025-08-02','Absent',1,4),(18,'2025-08-01','Present',1,4),(19,'2025-07-31','Absent',1,4),(20,'2025-07-30','Present',1,4),(21,'2025-08-03','Present',2,5),(22,'2025-08-02','Absent',2,5),(23,'2025-08-01','Present',2,5),(24,'2025-07-31','Absent',2,5),(25,'2025-07-30','Present',2,5),(26,'2025-08-03','Present',5,6),(27,'2025-08-02','Absent',5,6),(28,'2025-08-01','Present',5,6),(29,'2025-07-31','Absent',5,6),(30,'2025-07-30','Present',5,6),(31,'2025-08-03','Present',3,7),(32,'2025-08-02','Absent',3,7),(33,'2025-08-01','Present',3,7),(34,'2025-07-31','Absent',3,7),(35,'2025-07-30','Present',3,7),(36,'2025-08-03','Present',5,8),(37,'2025-08-02','Absent',5,8),(38,'2025-08-01','Present',5,8),(39,'2025-07-31','Absent',5,8),(40,'2025-07-30','Present',5,8);
/*!40000 ALTER TABLE `attendance` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_message`
--

DROP TABLE IF EXISTS `chat_message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_message` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `attachment_url` text,
  `author_name` varchar(255) NOT NULL,
  `is_user_message` bit(1) NOT NULL,
  `message` varchar(255) NOT NULL,
  `message_type` varchar(255) NOT NULL,
  `response` varchar(255) NOT NULL,
  `session_id` varchar(255) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `user_email` varchar(255) NOT NULL,
  `user_role` varchar(255) NOT NULL,
  `author_id` bigint DEFAULT NULL,
  `chat_room_id` bigint DEFAULT NULL,
  `thread_id` bigint DEFAULT NULL,
  `reply_to_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKjd127gygofytpjha5tv76dcpx` (`author_id`),
  KEY `FKj52yap2xrm9u0721dct0tjor9` (`chat_room_id`),
  KEY `FKe5a0icsphg4w0xp5y6b8li130` (`reply_to_id`),
  CONSTRAINT `FKe5a0icsphg4w0xp5y6b8li130` FOREIGN KEY (`reply_to_id`) REFERENCES `chat_message` (`id`),
  CONSTRAINT `FKj52yap2xrm9u0721dct0tjor9` FOREIGN KEY (`chat_room_id`) REFERENCES `chat_room` (`id`),
  CONSTRAINT `FKjd127gygofytpjha5tv76dcpx` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_message`
--

LOCK TABLES `chat_message` WRITE;
/*!40000 ALTER TABLE `chat_message` DISABLE KEYS */;
INSERT INTO `chat_message` VALUES (1,NULL,'Admin User',_binary '','Hello everyone! Welcome to the chat room.','TEXT','Sample response for: Hello everyone! Welcome to the chat room.','sample-session-1','2025-08-03 14:32:16.244927','admin@epathshala.com','ADMIN',1,1,NULL,NULL),(2,NULL,'John Smith',_binary '','Hi! Great to be here. How is everyone doing?','TEXT','Sample response for: Hi! Great to be here. How is everyone doing?','sample-session-1','2025-08-03 14:31:16.250951','teacher1@epathshala.com','TEACHER',2,1,NULL,NULL),(3,NULL,'Alice Johnson',_binary '','I\'m doing well, thanks for asking!','TEXT','Sample response for: I\'m doing well, thanks for asking!','sample-session-1','2025-08-03 14:30:16.253949','student1@epathshala.com','STUDENT',12,1,NULL,NULL),(4,NULL,'John Smith',_binary '','Hello everyone! Welcome to the chat room.','TEXT','Sample response for: Hello everyone! Welcome to the chat room.','sample-session-2','2025-08-03 14:32:16.257956','teacher1@epathshala.com','TEACHER',2,2,NULL,NULL),(5,NULL,'Alice Johnson',_binary '','Hi! Great to be here. How is everyone doing?','TEXT','Sample response for: Hi! Great to be here. How is everyone doing?','sample-session-2','2025-08-03 14:31:16.261953','student1@epathshala.com','STUDENT',12,2,NULL,NULL),(6,NULL,'Admin User',_binary '','I\'m doing well, thanks for asking!','TEXT','Sample response for: I\'m doing well, thanks for asking!','sample-session-2','2025-08-03 14:30:16.265462','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(7,NULL,'Alice Johnson',_binary '','Hello everyone! Welcome to the chat room.','TEXT','Sample response for: Hello everyone! Welcome to the chat room.','sample-session-3','2025-08-03 14:32:16.268472','student1@epathshala.com','STUDENT',12,3,NULL,NULL),(8,NULL,'Admin User',_binary '','Hi! Great to be here. How is everyone doing?','TEXT','Sample response for: Hi! Great to be here. How is everyone doing?','sample-session-3','2025-08-03 14:31:16.272475','admin@epathshala.com','ADMIN',1,3,NULL,NULL),(9,NULL,'John Smith',_binary '','I\'m doing well, thanks for asking!','TEXT','Sample response for: I\'m doing well, thanks for asking!','sample-session-3','2025-08-03 14:30:16.276473','teacher1@epathshala.com','TEACHER',2,3,NULL,NULL),(10,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754214642454','2025-08-03 15:20:42.456515','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(12,NULL,'Admin User',_binary '','hii','TEXT','Message sent successfully','session_1754214650123','2025-08-03 15:20:50.124224','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(13,NULL,'Admin User',_binary '','s','TEXT','Message sent successfully','session_1754214652272','2025-08-03 15:20:52.272165','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(14,NULL,'Admin User',_binary '','sd','TEXT','Message sent successfully','session_1754214653467','2025-08-03 15:20:53.467973','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(15,NULL,'Admin User',_binary '','sfa','TEXT','Message sent successfully','session_1754214654826','2025-08-03 15:20:54.826990','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(16,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754214657454','2025-08-03 15:20:57.454651','admin@epathshala.com','ADMIN',1,1,NULL,NULL),(17,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754214671177','2025-08-03 15:21:11.177714','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(18,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754214934468','2025-08-03 15:25:34.469858','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(19,NULL,'System',_binary '\0','Admin User left the chat','SYSTEM','User left successfully','session_1754217826250','2025-08-03 16:13:46.252297','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(20,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261089326','2025-08-04 04:14:49.326399','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(21,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261170056','2025-08-04 04:16:10.056210','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(22,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261177214','2025-08-04 04:16:17.214006','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(23,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261217186','2025-08-04 04:16:57.186809','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(24,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261218607','2025-08-04 04:16:58.607184','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(25,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261226135','2025-08-04 04:17:06.136790','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(26,NULL,'Admin User',_binary '','hry','TEXT','Message sent successfully','session_1754261232229','2025-08-04 04:17:12.229027','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(27,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261262760','2025-08-04 04:17:42.760221','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(28,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261266455','2025-08-04 04:17:46.455770','admin@epathshala.com','ADMIN',1,1,NULL,NULL),(29,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261268036','2025-08-04 04:17:48.036967','admin@epathshala.com','ADMIN',1,3,NULL,NULL),(30,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261280934','2025-08-04 04:18:00.934342','admin@epathshala.com','ADMIN',1,1,NULL,NULL),(31,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261281761','2025-08-04 04:18:01.761674','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(32,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261310157','2025-08-04 04:18:30.157336','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(33,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261366662','2025-08-04 04:19:26.662479','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(34,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261374933','2025-08-04 04:19:34.933313','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(35,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261443551','2025-08-04 04:20:43.551105','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(36,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261450983','2025-08-04 04:20:50.983393','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(37,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261459113','2025-08-04 04:20:59.113056','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(38,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261466259','2025-08-04 04:21:06.259148','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(39,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261473012','2025-08-04 04:21:13.012114','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(40,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261480518','2025-08-04 04:21:20.518355','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(41,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261490047','2025-08-04 04:21:30.047386','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(42,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261544258','2025-08-04 04:22:24.258674','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(43,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261548266','2025-08-04 04:22:28.266466','admin@epathshala.com','ADMIN',1,1,NULL,NULL),(44,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261550739','2025-08-04 04:22:30.739533','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(45,NULL,'System',_binary '\0','Alice Johnson left the chat','SYSTEM','User left successfully','session_1754261553596','2025-08-04 04:22:33.596362','student1@epathshala.com','STUDENT',12,2,NULL,NULL),(46,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261588812','2025-08-04 04:23:08.812931','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(47,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261629852','2025-08-04 04:23:49.852015','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(48,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261639092','2025-08-04 04:23:59.092588','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(49,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261649517','2025-08-04 04:24:09.517421','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(50,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261656710','2025-08-04 04:24:16.710013','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(51,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261662542','2025-08-04 04:24:22.542665','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(52,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261669781','2025-08-04 04:24:29.781192','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(53,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261716421','2025-08-04 04:25:16.421287','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(54,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261725225','2025-08-04 04:25:25.225529','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(55,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261737143','2025-08-04 04:25:37.143399','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(56,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261751471','2025-08-04 04:25:51.471091','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(57,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261777376','2025-08-04 04:26:17.376951','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(58,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261794771','2025-08-04 04:26:34.771723','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(59,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261842522','2025-08-04 04:27:22.522027','admin@epathshala.com','ADMIN',1,1,NULL,NULL),(60,NULL,'Admin User',_binary '','hey','TEXT','Message sent successfully','session_1754261846756','2025-08-04 04:27:26.756979','admin@epathshala.com','ADMIN',1,1,NULL,NULL),(61,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754261850074','2025-08-04 04:27:30.074871','admin@epathshala.com','ADMIN',1,3,NULL,NULL),(62,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754262544140','2025-08-04 04:39:04.140096','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(63,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754295838471','2025-08-04 13:53:58.471617','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(64,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754295841863','2025-08-04 13:54:01.863263','admin@epathshala.com','ADMIN',1,1,NULL,NULL),(65,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754303891085','2025-08-04 16:08:11.085420','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(66,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754305070588','2025-08-04 16:27:50.588329','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(67,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754323341858','2025-08-04 21:32:21.858558','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(68,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754323350422','2025-08-04 21:32:30.422356','admin@epathshala.com','ADMIN',1,1,NULL,NULL),(69,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754323355412','2025-08-04 21:32:35.412732','admin@epathshala.com','ADMIN',1,3,NULL,NULL),(70,NULL,'System',_binary '\0','Admin User joined the chat','SYSTEM','User joined successfully','session_1754361586773','2025-08-05 08:09:46.774584','admin@epathshala.com','ADMIN',1,2,NULL,NULL),(71,NULL,'Admin User',_binary '','hii','TEXT','Message sent successfully','session_1754361590768','2025-08-05 08:09:50.769195','admin@epathshala.com','ADMIN',1,2,NULL,NULL);
/*!40000 ALTER TABLE `chat_message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chat_room`
--

DROP TABLE IF EXISTS `chat_room`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chat_room` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `current_users` int NOT NULL,
  `description` varchar(255) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `is_private` bit(1) NOT NULL,
  `max_users` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_gyfupulda7j3uiti15v0h98ls` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chat_room`
--

LOCK TABLES `chat_room` WRITE;
/*!40000 ALTER TABLE `chat_room` DISABLE KEYS */;
INSERT INTO `chat_room` VALUES (1,'General','2025-08-03 14:32:16.222930',12,'General discussion and casual chat',_binary '',_binary '\0',100,'General Chat','2025-08-04 21:32:30.426353'),(2,'Academic','2025-08-03 14:32:16.226941',43,'Get help with academic questions',_binary '',_binary '\0',50,'Academic Support','2025-08-05 08:09:46.785892'),(3,'Technology','2025-08-03 14:32:16.230929',5,'Discuss technology, programming, and tech news',_binary '',_binary '\0',75,'Technology Discussion','2025-08-04 21:32:35.416733');
/*!40000 ALTER TABLE `chat_room` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_answers`
--

DROP TABLE IF EXISTS `exam_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_answers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `is_correct` bit(1) NOT NULL,
  `marks_obtained` int NOT NULL,
  `selected_answer` varchar(255) NOT NULL,
  `time_spent_seconds` int NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `attempt_id` bigint NOT NULL,
  `question_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpcx0r6nsdbcx1pq8h7or1o8bc` (`attempt_id`),
  KEY `FKcgxivsvqp4ns0wtdsd5r1ymma` (`question_id`),
  CONSTRAINT `FKcgxivsvqp4ns0wtdsd5r1ymma` FOREIGN KEY (`question_id`) REFERENCES `exam_questions` (`id`),
  CONSTRAINT `FKpcx0r6nsdbcx1pq8h7or1o8bc` FOREIGN KEY (`attempt_id`) REFERENCES `exam_attempts` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_answers`
--

LOCK TABLES `exam_answers` WRITE;
/*!40000 ALTER TABLE `exam_answers` DISABLE KEYS */;
/*!40000 ALTER TABLE `exam_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_attempts`
--

DROP TABLE IF EXISTS `exam_attempts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_attempts` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `answered_questions` int NOT NULL,
  `correct_answers` int NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `end_time` datetime(6) DEFAULT NULL,
  `incorrect_answers` int NOT NULL,
  `obtained_marks` int NOT NULL,
  `percentage` double NOT NULL,
  `start_time` datetime(6) NOT NULL,
  `status` varchar(255) NOT NULL,
  `total_marks` int NOT NULL,
  `total_questions` int NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `exam_id` bigint NOT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5tomiinihc09ywy0wh15pi2cs` (`exam_id`),
  KEY `FKryummt7tvu2pwc1gcwvyuruil` (`student_id`),
  CONSTRAINT `FK5tomiinihc09ywy0wh15pi2cs` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`),
  CONSTRAINT `FKryummt7tvu2pwc1gcwvyuruil` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_attempts`
--

LOCK TABLES `exam_attempts` WRITE;
/*!40000 ALTER TABLE `exam_attempts` DISABLE KEYS */;
INSERT INTO `exam_attempts` VALUES (2,0,0,'2025-08-06 09:29:51.343329',NULL,0,0,0,'2025-08-06 09:29:51.330332','IN_PROGRESS',0,0,'2025-08-06 09:29:51.343329',4,1);
/*!40000 ALTER TABLE `exam_attempts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exam_questions`
--

DROP TABLE IF EXISTS `exam_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exam_questions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `correct_answer` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `difficulty` varchar(255) NOT NULL,
  `marks` int NOT NULL,
  `optiona` varchar(255) NOT NULL,
  `optionb` varchar(255) NOT NULL,
  `optionc` varchar(255) NOT NULL,
  `optiond` varchar(255) NOT NULL,
  `question_text` text NOT NULL,
  `topic` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `exam_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5cd6sjmccb11rrwpyabyc81c0` (`exam_id`),
  CONSTRAINT `FK5cd6sjmccb11rrwpyabyc81c0` FOREIGN KEY (`exam_id`) REFERENCES `exams` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exam_questions`
--

LOCK TABLES `exam_questions` WRITE;
/*!40000 ALTER TABLE `exam_questions` DISABLE KEYS */;
INSERT INTO `exam_questions` VALUES (1,'B','2025-08-05 18:57:34.000000','Medium',4,'x','2x','x²','2x²','What is the derivative of x²?','Calculus','2025-08-05 18:57:34.000000',1),(2,'B','2025-08-05 18:57:34.000000','Easy',4,'3','4','5','6','Solve for x: 2x + 5 = 13','Algebra','2025-08-05 18:57:34.000000',1),(3,'B','2025-08-05 18:57:34.000000','Easy',4,'0','1','-1','0.5','What is the value of sin(90°)?','Trigonometry','2025-08-05 18:57:34.000000',1),(4,'B','2025-08-05 18:57:34.000000','Easy',3,'Joule','Newton','Watt','Pascal','What is the SI unit of force?','Physics','2025-08-05 18:57:34.000000',2),(5,'B','2025-08-05 18:57:34.000000','Easy',3,'Venus','Mercury','Mars','Earth','Which planet is closest to the Sun?','Astronomy','2025-08-05 18:57:34.000000',2),(6,'B','2025-08-05 18:57:34.000000','Medium',5,'Charles Dickens','William Shakespeare','Jane Austen','Mark Twain','Who wrote \"Romeo and Juliet\"?','Literature','2025-08-05 18:57:34.000000',3);
/*!40000 ALTER TABLE `exam_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `exams`
--

DROP TABLE IF EXISTS `exams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `exams` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `description` text,
  `duration_minutes` int NOT NULL,
  `end_time` datetime(6) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `negative_marking` bit(1) NOT NULL,
  `negative_marking_percentage` double NOT NULL,
  `start_time` datetime(6) NOT NULL,
  `title` varchar(255) NOT NULL,
  `total_marks` int NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `course_id` bigint NOT NULL,
  `created_by` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5owpcaaegw8lwlxw2g0ccxegr` (`course_id`),
  KEY `FKhbsfjtliaue86yw4fv5jgt57p` (`created_by`),
  CONSTRAINT `FK5owpcaaegw8lwlxw2g0ccxegr` FOREIGN KEY (`course_id`) REFERENCES `teacher` (`id`),
  CONSTRAINT `FKhbsfjtliaue86yw4fv5jgt57p` FOREIGN KEY (`created_by`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `exams`
--

LOCK TABLES `exams` WRITE;
/*!40000 ALTER TABLE `exams` DISABLE KEYS */;
INSERT INTO `exams` VALUES (1,'2025-08-05 18:57:17.000000','Covers algebra and calculus topics',90,'2025-08-05 20:30:00.000000',_binary '',_binary '',25,'2024-01-15 10:00:00.000000','Mathematics Mid-Term',100,'2025-08-05 18:57:17.000000',1,2),(2,'2025-08-05 18:57:17.000000','Basic physics concepts and formulas',60,'2024-01-20 15:00:00.000000',_binary '',_binary '\0',0,'2024-01-20 14:00:00.000000','Science Quiz',50,'2025-08-05 18:57:17.000000',2,3),(3,'2025-08-05 18:57:17.000000','Shakespeare and modern literature',75,'2024-01-25 10:15:00.000000',_binary '',_binary '',20,'2024-01-25 09:00:00.000000','English Literature Test',75,'2025-08-05 18:57:17.000000',3,4),(4,'2025-08-06 09:10:45.541960','Assessment covering core Java concepts including OOP, collections, and exception handling.',60,'2025-08-06 10:00:00.000000',_binary '',_binary '',25,'2025-08-06 09:00:00.000000','Java Fundamentals Exam',100,'2025-08-06 09:10:45.541960',1,2),(5,'2025-08-06 09:17:38.976941','fadn',60,'2026-09-07 04:48:00.000000',_binary '',_binary '\0',0,'2025-08-06 03:47:00.000000','CSE',100,'2025-08-06 09:17:38.976941',1,2);
/*!40000 ALTER TABLE `exams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_category`
--

DROP TABLE IF EXISTS `forum_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `color` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `description` varchar(255) NOT NULL,
  `icon` varchar(255) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_cwf69qhj1ylscrrhdcsnild5k` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_category`
--

LOCK TABLES `forum_category` WRITE;
/*!40000 ALTER TABLE `forum_category` DISABLE KEYS */;
INSERT INTO `forum_category` VALUES (1,'#2196F3','2025-08-03 14:32:16.054599','General topics and discussions','forum',_binary '','General Discussion','2025-08-03 14:32:16.054599'),(2,'#4CAF50','2025-08-03 14:32:16.063607','Academic questions and support','school',_binary '','Academic Support','2025-08-03 14:32:16.063607'),(3,'#FF9800','2025-08-03 14:32:16.067134','Technology and programming discussions','computer',_binary '','Technology','2025-08-03 14:32:16.067134'),(4,'#E91E63','2025-08-03 14:32:16.070129','Sports, extracurricular activities, and events','sports_soccer',_binary '','Sports & Activities','2025-08-03 14:32:16.071126'),(5,'#9C27B0','2025-08-03 14:32:16.074126','Career advice, college applications, and future planning','work',_binary '','Career Guidance','2025-08-03 14:32:16.074126');
/*!40000 ALTER TABLE `forum_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_reply`
--

DROP TABLE IF EXISTS `forum_reply`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_reply` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `author_name` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `reply_number` int NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `author_id` bigint NOT NULL,
  `parent_reply_id` bigint DEFAULT NULL,
  `thread_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlgo14orc0w8m4rcaqqcvf1c1y` (`author_id`),
  KEY `FKkouuwmoj07029ckmsjmnb58kk` (`parent_reply_id`),
  KEY `FK25xkttfgi3hrij28qw7b9evq5` (`thread_id`),
  CONSTRAINT `FK25xkttfgi3hrij28qw7b9evq5` FOREIGN KEY (`thread_id`) REFERENCES `forum_thread` (`id`),
  CONSTRAINT `FKkouuwmoj07029ckmsjmnb58kk` FOREIGN KEY (`parent_reply_id`) REFERENCES `forum_reply` (`id`),
  CONSTRAINT `FKlgo14orc0w8m4rcaqqcvf1c1y` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_reply`
--

LOCK TABLES `forum_reply` WRITE;
/*!40000 ALTER TABLE `forum_reply` DISABLE KEYS */;
INSERT INTO `forum_reply` VALUES (1,'Admin User','Great thread! Thanks for sharing.','2025-08-03 14:32:16.148140',1,'2025-08-03 14:32:16.148140',1,NULL,1),(2,'John Smith','I agree with your points. Very helpful discussion.','2025-08-03 14:32:16.155621',2,'2025-08-03 14:32:16.155621',2,NULL,1),(3,'Alice Johnson','This is exactly what I was looking for. Thanks!','2025-08-03 14:32:16.159402',3,'2025-08-03 14:32:16.159402',12,NULL,1),(4,'John Smith','Great thread! Thanks for sharing.','2025-08-03 14:32:16.164289',1,'2025-08-03 14:32:16.164289',2,NULL,2),(5,'Admin User','I agree with your points. Very helpful discussion.','2025-08-03 14:32:16.167937',2,'2025-08-03 14:32:16.167937',1,NULL,2),(6,'Alice Johnson','This is exactly what I was looking for. Thanks!','2025-08-03 14:32:16.171927',3,'2025-08-03 14:32:16.171927',12,NULL,2),(7,'Alice Johnson','Great thread! Thanks for sharing.','2025-08-03 14:32:16.175928',1,'2025-08-03 14:32:16.175928',12,NULL,3),(8,'John Smith','I agree with your points. Very helpful discussion.','2025-08-03 14:32:16.178928',2,'2025-08-03 14:32:16.178928',2,NULL,3),(9,'Admin User','This is exactly what I was looking for. Thanks!','2025-08-03 14:32:16.182933',3,'2025-08-03 14:32:16.182933',1,NULL,3),(10,'Admin User','Great thread! Thanks for sharing.','2025-08-03 14:32:16.186931',1,'2025-08-03 14:32:16.186931',1,NULL,4),(11,'John Smith','I agree with your points. Very helpful discussion.','2025-08-03 14:32:16.190933',2,'2025-08-03 14:32:16.190933',2,NULL,4),(12,'Alice Johnson','This is exactly what I was looking for. Thanks!','2025-08-03 14:32:16.193934',3,'2025-08-03 14:32:16.194942',12,NULL,4),(13,'John Smith','Great thread! Thanks for sharing.','2025-08-03 14:32:16.198927',1,'2025-08-03 14:32:16.198927',2,NULL,5),(14,'Admin User','I agree with your points. Very helpful discussion.','2025-08-03 14:32:16.202927',2,'2025-08-03 14:32:16.202927',1,NULL,5),(15,'Alice Johnson','This is exactly what I was looking for. Thanks!','2025-08-03 14:32:16.205966',3,'2025-08-03 14:32:16.205966',12,NULL,5),(16,'Alice Johnson','Great thread! Thanks for sharing.','2025-08-03 14:32:16.209928',1,'2025-08-03 14:32:16.209928',12,NULL,6),(17,'John Smith','I agree with your points. Very helpful discussion.','2025-08-03 14:32:16.212926',2,'2025-08-03 14:32:16.212926',2,NULL,6),(18,'Admin User','This is exactly what I was looking for. Thanks!','2025-08-03 14:32:16.216933',3,'2025-08-03 14:32:16.216933',1,NULL,6),(19,'Admin User','dont know','2025-08-04 04:47:03.908573',4,'2025-08-04 04:47:03.908573',1,NULL,6),(20,'Admin User','awsome','2025-08-04 13:54:19.334591',5,'2025-08-04 13:54:19.334591',1,NULL,6);
/*!40000 ALTER TABLE `forum_reply` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forum_thread`
--

DROP TABLE IF EXISTS `forum_thread`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forum_thread` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `author_name` varchar(255) NOT NULL,
  `content` text,
  `created_at` datetime(6) NOT NULL,
  `is_locked` bit(1) NOT NULL,
  `is_pinned` bit(1) NOT NULL,
  `last_reply_at` datetime(6) NOT NULL,
  `reply_count` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `view_count` int NOT NULL,
  `author_id` bigint NOT NULL,
  `category_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKrvom3v5ddo2o6jbn3f7e7b3wn` (`author_id`),
  KEY `FKjj6vyrrb5r02985uwrdw9men6` (`category_id`),
  CONSTRAINT `FKjj6vyrrb5r02985uwrdw9men6` FOREIGN KEY (`category_id`) REFERENCES `forum_category` (`id`),
  CONSTRAINT `FKrvom3v5ddo2o6jbn3f7e7b3wn` FOREIGN KEY (`author_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forum_thread`
--

LOCK TABLES `forum_thread` WRITE;
/*!40000 ALTER TABLE `forum_thread` DISABLE KEYS */;
INSERT INTO `forum_thread` VALUES (1,'Admin User','Welcome everyone to our new forum! Feel free to start discussions and ask questions.','2025-08-03 14:32:16.116130',_binary '\0',_binary '','2025-08-03 14:32:16.116130',3,'Welcome to ePathshala Forum!','2025-08-04 04:46:31.060806',151,1,1),(2,'Alice Johnson','I\'m having trouble with calculus. Can anyone help me understand derivatives?','2025-08-03 14:32:16.122132',_binary '\0',_binary '\0','2025-08-03 14:32:16.122132',2,'Mathematics Help Needed','2025-08-03 14:32:16.122132',75,12,2),(3,'John Smith','What programming language would you recommend for someone just starting to learn coding?','2025-08-03 14:32:16.127129',_binary '\0',_binary '\0','2025-08-03 14:32:16.127129',4,'Best Programming Languages for Beginners','2025-08-03 14:32:16.127129',120,2,3),(4,'Admin User','Registration for annual sports day is now open! Events include athletics, football, basketball, and more.','2025-08-03 14:32:16.132127',_binary '\0',_binary '','2025-08-03 14:32:16.132127',5,'Annual Sports Day Registration','2025-08-03 14:32:16.132127',200,1,4),(5,'Alice Johnson','I\'m confused between choosing engineering or medical as my career path. Can anyone share their experiences?','2025-08-03 14:32:16.136127',_binary '\0',_binary '\0','2025-08-03 14:32:16.136127',6,'Engineering vs Medical - Career Advice','2025-08-03 14:32:16.136127',180,12,5),(6,'John Smith','Board exams are approaching. What are your best study strategies and tips for preparation?','2025-08-03 14:32:16.142140',_binary '\0',_binary '\0','2025-08-04 13:54:19.338586',10,'Study Tips for Board Exams','2025-08-05 08:09:38.890974',307,2,2);
/*!40000 ALTER TABLE `forum_thread` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `grade`
--

DROP TABLE IF EXISTS `grade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `grade` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `marks` double DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  `teacher_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK5secqnjjwgh9wxk4h1xwgj1n0` (`student_id`),
  KEY `FKqb6g3kbua30kxih2f8kfx2giu` (`teacher_id`),
  CONSTRAINT `FK5secqnjjwgh9wxk4h1xwgj1n0` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`),
  CONSTRAINT `FKqb6g3kbua30kxih2f8kfx2giu` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `grade`
--

LOCK TABLES `grade` WRITE;
/*!40000 ALTER TABLE `grade` DISABLE KEYS */;
INSERT INTO `grade` VALUES (1,85.14118772899872,'Mathematics',1,1),(2,94.76412267449548,'Science',1,1),(3,92.69620057570624,'English',1,1),(4,94.05496479485639,'Mathematics',2,2),(5,99.53083001125628,'Science',2,2),(6,93.27458472303955,'English',2,2),(7,92.05407874394636,'Mathematics',3,3),(8,91.22256221691025,'Science',3,3),(9,93.7084670805631,'English',3,3),(10,90.60956593246932,'Mathematics',4,1),(11,96.53789078439831,'Science',4,1),(12,90.85870288518622,'English',4,1),(13,95.38619569689055,'Mathematics',5,2),(14,90.67970674213794,'Science',5,2),(15,86.86522613029985,'English',5,2),(16,87.68936117567232,'Mathematics',6,5),(17,99.20606529893158,'Science',6,5),(18,85.6513395444691,'English',6,5),(19,87.99519165633718,'Mathematics',7,3),(20,91.4197550716541,'Science',7,3),(21,94.97231389095188,'English',7,3),(22,95.16570018588249,'Mathematics',8,5),(23,96.13714529606102,'Science',8,5),(24,90.32665635707721,'English',8,5);
/*!40000 ALTER TABLE `grade` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `leave_request`
--

DROP TABLE IF EXISTS `leave_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_request` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `from_date` date DEFAULT NULL,
  `parent_approval` varchar(255) DEFAULT NULL,
  `reason` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `teacher_approval` varchar(255) DEFAULT NULL,
  `to_date` date DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK6fy5gfkrrfvk6ql0ngf5g9h0e` (`student_id`),
  CONSTRAINT `FK6fy5gfkrrfvk6ql0ngf5g9h0e` FOREIGN KEY (`student_id`) REFERENCES `student` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leave_request`
--

LOCK TABLES `leave_request` WRITE;
/*!40000 ALTER TABLE `leave_request` DISABLE KEYS */;
INSERT INTO `leave_request` VALUES (1,'2025-08-04','Pending','Medical appointment','Pending','Pending','2025-08-05',1),(2,'2025-08-05','Pending','Family function','Pending','Pending','2025-08-06',1),(3,'2025-08-06','Pending','Personal emergency','Pending','Pending','2025-08-07',1),(4,'2025-08-04','Pending','Medical appointment','Pending','Pending','2025-08-05',2),(5,'2025-08-05','Pending','Family function','Pending','Pending','2025-08-06',2),(6,'2025-08-06','Pending','Personal emergency','Pending','Pending','2025-08-07',2),(7,'2025-08-04','Pending','Medical appointment','Pending','Pending','2025-08-05',3),(8,'2025-08-05','Pending','Family function','Pending','Pending','2025-08-06',3),(9,'2025-08-06','Pending','Personal emergency','Pending','Pending','2025-08-07',3),(10,'2025-08-04','Pending','Medical appointment','Pending','Pending','2025-08-05',4),(11,'2025-08-05','Pending','Family function','Pending','Pending','2025-08-06',4),(12,'2025-08-06','Pending','Personal emergency','Pending','Pending','2025-08-07',4),(13,'2025-08-04','Pending','Medical appointment','Pending','Pending','2025-08-05',5),(14,'2025-08-05','Pending','Family function','Pending','Pending','2025-08-06',5),(15,'2025-08-06','Pending','Personal emergency','Pending','Pending','2025-08-07',5),(16,'2025-08-04','Pending','Medical appointment','Pending','Pending','2025-08-05',6),(17,'2025-08-05','Pending','Family function','Pending','Pending','2025-08-06',6),(18,'2025-08-06','Pending','Personal emergency','Pending','Pending','2025-08-07',6),(19,'2025-08-04','Pending','Medical appointment','Pending','Pending','2025-08-05',7),(20,'2025-08-05','Pending','Family function','Pending','Pending','2025-08-06',7),(21,'2025-08-06','Pending','Personal emergency','Pending','Pending','2025-08-07',7),(22,'2025-08-04','Pending','Medical appointment','Pending','Pending','2025-08-05',8),(23,'2025-08-05','Pending','Family function','Pending','Pending','2025-08-06',8),(24,'2025-08-06','Pending','Personal emergency','Pending','Pending','2025-08-07',8),(25,'2025-08-28','Approved','Sports competition','Rejected','Approved','2025-08-22',1),(26,'2025-08-10','Pending','Personal emergency','Pending','Rejected','2025-08-04',1),(27,'2025-08-04','Pending','Sports competition','Rejected','Rejected','2025-08-19',1),(28,'2025-08-23','Approved','Family wedding ceremony','Rejected','Rejected','2025-08-04',2),(29,'2025-08-03','Pending','Family vacation','Pending','Pending','2025-08-15',2),(30,'2025-09-01','Pending','Personal emergency','Approved','Rejected','2025-08-26',2),(31,'2025-08-13','Rejected','Family wedding ceremony','Pending','Pending','2025-08-19',3),(32,'2025-08-26','Pending','Dental checkup','Pending','Approved','2025-08-23',3),(33,'2025-08-19','Pending','Academic competition','Rejected','Pending','2025-08-25',3),(34,'2025-08-05','Pending','Dental checkup','Pending','Pending','2025-08-20',4),(35,'2025-08-16','Rejected','Dental checkup','Rejected','Rejected','2025-09-02',4),(36,'2025-08-13','Pending','Dental checkup','Approved','Rejected','2025-08-25',4),(37,'2025-08-16','Pending','Academic competition','Rejected','Pending','2025-08-05',5),(38,'2025-08-25','Rejected','Sports competition','Pending','Pending','2025-08-31',5),(39,'2025-08-05','Pending','Health checkup','Pending','Pending','2025-08-30',5);
/*!40000 ALTER TABLE `leave_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notification` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action_text` varchar(255) NOT NULL,
  `action_url` text,
  `content` text NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `is_global` bit(1) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `priority` varchar(255) NOT NULL,
  `target_role` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `recipient_id` bigint DEFAULT NULL,
  `sender_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqnduwq6ix2pxx1add03905i1i` (`recipient_id`),
  KEY `FKnbt1hengkgjqru2q44q8rlc2c` (`sender_id`),
  CONSTRAINT `FKnbt1hengkgjqru2q44q8rlc2c` FOREIGN KEY (`sender_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKqnduwq6ix2pxx1add03905i1i` FOREIGN KEY (`recipient_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (1,'View Announcement','/announcements','Welcome to our new learning platform. We hope you enjoy the forum and chat features!','2025-08-03 14:32:16.298471','2025-09-02 14:32:16.294480',_binary '',_binary '\0','HIGH','ALL','Welcome to ePathshala!','ANNOUNCEMENT',NULL,1),(2,'View Thread','/forum/thread/2','A new thread \'Mathematics Help Needed\' has been created in Academic Support','2025-08-03 14:32:16.303471','2025-08-10 14:32:16.303471',_binary '\0',_binary '\0','MEDIUM','TEACHER','New Forum Thread','FORUM_THREAD',2,12),(3,'View Chat','/chat/room/1','admin mentioned you in General Chat: @teacher1 can you help with this?','2025-08-03 14:32:16.311473','2025-08-10 14:32:16.310474',_binary '\0',_binary '\0','MEDIUM','ALL','You were mentioned in chat','CHAT_MENTION',2,1),(4,'View Announcement','/announcements','kfdsgh','2025-08-04 03:47:41.482825','2025-09-03 03:47:41.480828',_binary '',_binary '\0','HIGH','ALL','fsagj','ANNOUNCEMENT',NULL,NULL),(5,'View Announcement','/announcements','kfdsgh','2025-08-04 03:47:45.955727','2025-09-03 03:47:45.955727',_binary '',_binary '\0','HIGH','ALL','fsagj','ANNOUNCEMENT',NULL,NULL),(6,'View Reply','/forum/thread/6#reply-19','Someone replied to your thread \'Study Tips for Board Exams\'','2025-08-04 04:47:03.921143','2025-08-11 04:47:03.919077',_binary '\0',_binary '\0','MEDIUM','ALL','New Reply to Your Thread','FORUM_REPLY',2,1),(7,'View Reply','/forum/thread/6#reply-20','Someone replied to your thread \'Study Tips for Board Exams\'','2025-08-04 13:54:19.341607','2025-08-11 13:54:19.339594',_binary '\0',_binary '\0','MEDIUM','ALL','New Reply to Your Thread','FORUM_REPLY',2,1);
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `online_classes`
--

DROP TABLE IF EXISTS `online_classes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `online_classes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `current_participants` int DEFAULT NULL,
  `description` text,
  `duration` int NOT NULL,
  `max_participants` int NOT NULL,
  `meeting_url` varchar(255) DEFAULT NULL,
  `room_id` varchar(255) NOT NULL,
  `scheduled_time` datetime(6) NOT NULL,
  `status` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `teacher_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKmruc8bmic7s1lnpn9eit64lpl` (`teacher_id`),
  CONSTRAINT `FKmruc8bmic7s1lnpn9eit64lpl` FOREIGN KEY (`teacher_id`) REFERENCES `teacher` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `online_classes`
--

LOCK TABLES `online_classes` WRITE;
/*!40000 ALTER TABLE `online_classes` DISABLE KEYS */;
INSERT INTO `online_classes` VALUES (1,'2025-08-04 21:05:24.989649',0,'dsafsgh',60,30,'https://meet.jit.si/epathshala-1754321724989','epathshala-1754321724989','2025-08-04 21:00:00.000000','scheduled','Mathematics','Mathematics - Class 10A','2025-08-04 21:43:26.820487',2);
/*!40000 ALTER TABLE `online_classes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `otp`
--

DROP TABLE IF EXISTS `otp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `otp` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `expires_at` datetime(6) NOT NULL,
  `is_used` bit(1) NOT NULL,
  `otp` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `otp`
--

LOCK TABLES `otp` WRITE;
/*!40000 ALTER TABLE `otp` DISABLE KEYS */;
/*!40000 ALTER TABLE `otp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent`
--

DROP TABLE IF EXISTS `parent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKl4w905h1321m2ide56ov5efb0` (`user_id`),
  CONSTRAINT `FKl4w905h1321m2ide56ov5efb0` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent`
--

LOCK TABLES `parent` WRITE;
/*!40000 ALTER TABLE `parent` DISABLE KEYS */;
INSERT INTO `parent` VALUES (1,7),(2,8),(3,9),(4,10),(5,11);
/*!40000 ALTER TABLE `parent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `session` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `expiry_time` datetime(6) NOT NULL,
  `ip_address` varchar(255) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `last_activity_time` datetime(6) NOT NULL,
  `login_time` datetime(6) NOT NULL,
  `logout_reason` varchar(255) DEFAULT NULL,
  `logout_time` datetime(6) DEFAULT NULL,
  `session_id` varchar(255) NOT NULL,
  `user_agent` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_753xnsbvb8f4rkv7airvmye2p` (`session_id`),
  KEY `FK1bi1pmqjgipw7dx3j6bl37dja` (`user_id`),
  CONSTRAINT `FK1bi1pmqjgipw7dx3j6bl37dja` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES (1,'2025-08-03 15:02:59.843675','0:0:0:0:0:0:0:1',_binary '\0','2025-08-03 14:32:59.843675','2025-08-03 14:32:59.843675','Session expired','2025-08-03 15:06:07.159577','2f46118b-4e8f-41e6-8458-5368d475d640','curl/8.14.1',1),(2,'2025-08-03 15:03:32.129954','0:0:0:0:0:0:0:1',_binary '\0','2025-08-03 14:33:32.129954','2025-08-03 14:33:32.129954','Session expired','2025-08-03 15:06:07.176510','4cfc5070-94c6-4ae1-a1f2-e7c47533f511','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12),(3,'2025-08-03 15:04:38.836927','0:0:0:0:0:0:0:1',_binary '\0','2025-08-03 14:34:38.836927','2025-08-03 14:34:38.836927','Session expired','2025-08-03 15:06:07.177508','9eb8e11b-24e1-4aac-9479-341bdcde65e3','curl/8.14.1',1),(4,'2025-08-03 15:25:39.740610','0:0:0:0:0:0:0:1',_binary '\0','2025-08-03 14:55:39.740610','2025-08-03 14:55:39.740610','Session expired','2025-08-03 15:26:49.780385','37110cf6-a1b6-45e1-8aac-1b604ca2a46b','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(5,'2025-08-03 15:38:30.621752','0:0:0:0:0:0:0:1',_binary '\0','2025-08-03 15:08:30.621752','2025-08-03 15:08:30.621752','Session expired','2025-08-03 15:42:54.615602','0f241b8b-cf35-4d84-824a-b945b9dbfd13','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(6,'2025-08-03 15:41:50.180471','0:0:0:0:0:0:0:1',_binary '\0','2025-08-03 15:11:50.180471','2025-08-03 15:11:50.180471','Session expired','2025-08-03 15:42:54.628603','e86af664-dc05-430a-8aad-b4f14a5d4f00','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(7,'2025-08-03 15:50:39.546089','0:0:0:0:0:0:0:1',_binary '\0','2025-08-03 15:20:39.546089','2025-08-03 15:20:39.546089','Session expired','2025-08-03 15:53:29.356408','830ca93d-c32b-42ad-95e9-1fba1db001d9','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(8,'2025-08-03 16:20:49.887519','0:0:0:0:0:0:0:1',_binary '\0','2025-08-03 15:50:49.887519','2025-08-03 15:50:49.887519','Admin request','2025-08-03 16:04:25.888010','78df18d8-e84b-4e4a-b912-1116d5b9260f','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(9,'2025-08-03 16:25:42.224742','0:0:0:0:0:0:0:1',_binary '\0','2025-08-03 15:55:42.224742','2025-08-03 15:55:42.224742','Admin request','2025-08-03 16:04:25.891009','1fbff278-a2e3-4181-aa1f-dfdd4f495049','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(10,'2025-08-03 16:26:17.107205','0:0:0:0:0:0:0:1',_binary '\0','2025-08-03 15:56:17.107205','2025-08-03 15:56:17.107205','User logout','2025-08-03 16:04:28.406788','7d302548-0aa8-483d-9e55-3ce871b52e46','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12),(11,'2025-08-03 16:30:11.307076','0:0:0:0:0:0:0:1',_binary '\0','2025-08-03 16:00:11.307076','2025-08-03 16:00:11.307076','Admin request','2025-08-03 16:04:25.891009','5a7e1fb5-251e-4310-a6cd-afd687213d43','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(12,'2025-08-03 16:34:10.313802','0:0:0:0:0:0:0:1',_binary '\0','2025-08-03 16:04:10.313802','2025-08-03 16:04:10.313802','Admin request','2025-08-03 16:04:25.891009','884e5a35-de0f-44f4-9ccb-0345a484d0c7','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(13,'2025-08-03 16:34:41.697564','0:0:0:0:0:0:0:1',_binary '\0','2025-08-03 16:04:41.697564','2025-08-03 16:04:41.697564','Session expired','2025-08-03 19:41:09.293574','86675449-2312-4044-b7c3-9dc7e75c2611','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(14,'2025-08-04 04:16:57.730244','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 03:46:57.730244','2025-08-04 03:46:57.730244','Session expired','2025-08-04 04:19:22.505314','27870aab-e7f9-4ce0-87e2-70e6d7e4f074','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(15,'2025-08-04 04:29:18.693828','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 03:59:18.693828','2025-08-04 03:59:18.693828','Session expired','2025-08-04 04:32:44.732093','9bacc015-7c5f-40b0-add2-42f8c934211b','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(16,'2025-08-04 04:48:16.966572','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 04:18:16.966572','2025-08-04 04:18:16.966572','Session expired','2025-08-04 13:52:24.535787','3b11b395-9322-41de-a6d3-3d19a33796b9','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12),(17,'2025-08-04 04:56:11.021322','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 04:26:11.021322','2025-08-04 04:26:11.021322','Session expired','2025-08-04 13:52:24.544820','78beecf2-be2e-4596-9b9e-00ee5b4948a6','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(18,'2025-08-04 14:23:35.036307','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 13:53:35.036307','2025-08-04 13:53:35.036307','Session expired','2025-08-04 14:32:23.803105','943cf075-434b-49bc-a6d4-c8a30df44975','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(19,'2025-08-04 16:38:19.161336','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 16:08:19.161336','2025-08-04 16:08:19.161336','Session expired','2025-08-04 16:52:43.162537','f12a4ad9-85c4-4691-8130-fa11e72c945a','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(20,'2025-08-04 17:26:58.178405','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 16:56:58.178405','2025-08-04 16:56:58.178405','Session expired','2025-08-04 17:32:15.549467','b7de69cb-df6a-4fcd-926b-44f66ff5e176','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(21,'2025-08-04 17:27:20.235816','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 16:57:20.235816','2025-08-04 16:57:20.235816','Session expired','2025-08-04 17:32:15.561469','4fec8a8e-0b41-489d-8d0d-e979e76830c9','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12),(22,'2025-08-04 17:43:50.563329','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 17:13:50.563329','2025-08-04 17:13:50.563329','Session expired','2025-08-04 20:55:00.814766','7ce653af-91d5-4c4e-b132-4ce35f563183','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(23,'2025-08-04 17:44:10.811074','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 17:14:10.811074','2025-08-04 17:14:10.811074','Session expired','2025-08-04 20:55:00.834768','b3810f69-3c1a-45a5-b3a8-ceeb17c45d1e','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12),(24,'2025-08-04 18:04:29.379120','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 17:34:29.379120','2025-08-04 17:34:29.379120','Session expired','2025-08-04 20:55:00.835769','af7c7832-3dd1-4876-9286-c36c08c3d6f1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',2),(25,'2025-08-04 18:08:04.513552','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 17:38:04.513552','2025-08-04 17:38:04.513552','Session expired','2025-08-04 20:55:00.835769','3dbd73f8-2aa4-4f6f-bbfe-f00ec842605e','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12),(26,'2025-08-04 18:10:04.041032','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 17:40:04.041032','2025-08-04 17:40:04.041032','Session expired','2025-08-04 20:55:00.835769','8f3475b3-ee59-4016-a124-f3da15399b7b','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',2),(27,'2025-08-04 21:29:13.005766','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 20:59:13.005766','2025-08-04 20:59:13.005766','User logout','2025-08-04 21:00:05.401113','4d9f10b0-9796-440a-8700-cf8ae6a61373','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(28,'2025-08-04 21:30:21.411177','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 21:00:21.411177','2025-08-04 21:00:21.411177','Session expired','2025-08-04 21:31:39.480809','3e2cbdfc-24ea-4a90-84fe-a42d77ffea45','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',2),(29,'2025-08-04 21:36:55.412639','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 21:06:55.412639','2025-08-04 21:06:55.412639','Session expired','2025-08-04 21:41:39.477506','37897e9f-9f17-4a3b-968c-f53c831dcc16','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12),(30,'2025-08-04 21:57:33.726182','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 21:27:33.726182','2025-08-04 21:27:33.726182','Session expired','2025-08-04 21:58:36.880315','c1e9b470-647f-45bd-90ef-6ba4a570bba2','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12),(31,'2025-08-04 21:58:00.322812','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 21:28:00.322812','2025-08-04 21:28:00.322812','Session expired','2025-08-04 21:58:36.892325','6cd666bc-a341-4d40-b930-c4e743431ce6','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',2),(32,'2025-08-04 22:01:34.809641','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 21:31:34.809641','2025-08-04 21:31:34.809641','Session expired','2025-08-04 22:03:49.704860','76b05942-7680-42f7-abc4-fe4e15833926','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12),(33,'2025-08-04 22:12:26.256091','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 21:42:26.256091','2025-08-04 21:42:26.256091','Session expired','2025-08-04 22:13:16.929583','0a8bc51e-91ed-4ca6-8114-8b015e02d503','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',2),(34,'2025-08-04 22:13:49.840633','0:0:0:0:0:0:0:1',_binary '\0','2025-08-04 21:43:49.840633','2025-08-04 21:43:49.840633','Session expired','2025-08-04 22:14:59.700321','a0ab48ee-dc3d-442e-9f3c-24e52deb80c1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12),(35,'2025-08-05 08:38:57.690245','0:0:0:0:0:0:0:1',_binary '\0','2025-08-05 08:08:57.690245','2025-08-05 08:08:57.690245','Session expired','2025-08-05 08:42:14.897565','975697be-43cd-46a5-b319-44e774e001dd','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(36,'2025-08-05 08:40:21.732686','0:0:0:0:0:0:0:1',_binary '\0','2025-08-05 08:10:21.732686','2025-08-05 08:10:21.732686','Session expired','2025-08-05 08:42:14.975089','0614574e-94b7-4935-93ab-65dbfb1a466d','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',2),(37,'2025-08-05 08:41:32.756459','0:0:0:0:0:0:0:1',_binary '\0','2025-08-05 08:11:32.756459','2025-08-05 08:11:32.756459','Session expired','2025-08-05 08:42:14.976094','9a31b40f-4ba7-431a-b723-342c87b6d3db','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',7),(38,'2025-08-05 09:28:07.426524','0:0:0:0:0:0:0:1',_binary '\0','2025-08-05 08:58:07.426524','2025-08-05 08:58:07.426524','Session expired','2025-08-05 11:10:17.593684','e2ae540f-fdab-4d54-ac91-2e655a3c9c50','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',1),(39,'2025-08-05 12:16:04.710199','0:0:0:0:0:0:0:1',_binary '\0','2025-08-05 11:46:04.710199','2025-08-05 11:46:04.710199','Session expired','2025-08-05 13:17:33.044863','13a5cdc7-d258-4e03-b0ed-5510f9af8f61','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',2),(40,'2025-08-05 13:54:05.957061','0:0:0:0:0:0:0:1',_binary '\0','2025-08-05 13:24:05.957061','2025-08-05 13:24:05.957061','Session expired','2025-08-05 13:55:00.003529','6a69c93e-a81f-4b14-b5e3-f52458fc6ddb','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12),(41,'2025-08-05 14:31:05.197312','0:0:0:0:0:0:0:1',_binary '\0','2025-08-05 14:01:05.197312','2025-08-05 14:01:05.197312','Session expired','2025-08-05 18:39:51.212519','e5be15ed-86e9-41db-ae8d-af58f2ec258e','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',2),(42,'2025-08-05 19:35:20.242108','0:0:0:0:0:0:0:1',_binary '\0','2025-08-05 19:05:20.242108','2025-08-05 19:05:20.242108','Session expired','2025-08-05 19:39:51.250953','92f4976b-947e-40c8-81b6-2d3be32fecf5','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12),(43,'2025-08-05 19:51:33.939627','0:0:0:0:0:0:0:1',_binary '\0','2025-08-05 19:21:33.939627','2025-08-05 19:21:33.939627','Session expired','2025-08-05 19:52:10.202780','f2675192-d670-4317-8b32-1f83caf4bd14','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12),(44,'2025-08-05 19:52:13.571983','0:0:0:0:0:0:0:1',_binary '\0','2025-08-05 19:22:13.571983','2025-08-05 19:22:13.571983','Session expired','2025-08-05 19:57:10.203942','9a40b32f-2b6c-4b94-88df-49dc98c96532','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',2),(45,'2025-08-05 20:10:31.353616','0:0:0:0:0:0:0:1',_binary '\0','2025-08-05 19:40:31.353616','2025-08-05 19:40:31.353616','Session expired','2025-08-05 20:12:12.907106','543a9071-c65c-432c-974f-227f2cdc4e5b','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',2),(46,'2025-08-05 20:22:33.052121','0:0:0:0:0:0:0:1',_binary '\0','2025-08-05 19:52:33.052121','2025-08-05 19:52:33.052121','Session expired','2025-08-05 21:23:46.070868','6697b80d-5147-4826-910e-344b23e552d1','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',2),(47,'2025-08-06 08:48:59.422923','0:0:0:0:0:0:0:1',_binary '\0','2025-08-06 08:18:59.422923','2025-08-06 08:18:59.422923','Session expired','2025-08-06 08:55:18.626921','c456859c-8406-4f4a-9599-25f4119a78d5','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',2),(48,'2025-08-06 09:26:46.379122','0:0:0:0:0:0:0:1',_binary '\0','2025-08-06 08:56:46.379122','2025-08-06 08:56:46.379122','Session expired','2025-08-06 09:27:11.468848','6ef99bc7-6e9c-403c-8274-60b3b7b0c527','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',2),(49,'2025-08-06 09:47:56.778400','0:0:0:0:0:0:0:1',_binary '\0','2025-08-06 09:17:56.778400','2025-08-06 09:17:56.778400','Session expired','2025-08-06 09:50:02.515400','4c22a981-e83e-490c-a829-b0ac5bc311d7','Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:142.0) Gecko/20100101 Firefox/142.0',12);
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `student_class` varchar(255) DEFAULT NULL,
  `parent_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKqqq09m02bgrk47qoe6fs3ht4w` (`parent_id`),
  KEY `FKk5m148xqefonqw7bgnpm0snwj` (`user_id`),
  CONSTRAINT `FKk5m148xqefonqw7bgnpm0snwj` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `FKqqq09m02bgrk47qoe6fs3ht4w` FOREIGN KEY (`parent_id`) REFERENCES `parent` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,'Class 10A',1,12),(2,'Class 10B',2,13),(3,'Class 9A',3,14),(4,'Class 10A',4,15),(5,'Class 10B',5,16),(6,'Class 11A',1,17),(7,'Class 9A',2,18),(8,'Class 11A',3,19);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `assigned_class` varchar(255) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpb6g6pahj1mr2ijg92r7m1xlh` (`user_id`),
  CONSTRAINT `FKpb6g6pahj1mr2ijg92r7m1xlh` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (1,'Class 10A','Mathematics',2),(2,'Class 10B','Science',3),(3,'Class 9A','English',4),(4,'Class 10A','History',5),(5,'Class 11A','Computer Science',6);
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `account_number` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_ob8kqyqqgmefl0aco34akdtpe` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,NULL,'admin@epathshala.com','Admin User','$2a$10$X7nc9FsIfhoR5JUn.Pop9esiH7Us8A6eW4e2TB0fOa/mYgbv52eFq','ADMIN'),(2,NULL,'teacher1@epathshala.com','John Smith','$2a$10$WYJ7uwBQApqdPDWL8QQ/0u8lgdfLmufUMXtCVpSblhyuRezYNJPYO','TEACHER'),(3,NULL,'teacher2@epathshala.com','Sarah Johnson','$2a$10$EXn2B3x8esPmUw2aCRZM3OUB3NXgoeqzr4wkgIU5sOYwL528DJGPS','TEACHER'),(4,NULL,'teacher3@epathshala.com','Mike Wilson','$2a$10$VTkC4HazRJtx3p7.NDgFJ.CDsEuBkqopzi6a9Uw9RONdKTapmMU8K','TEACHER'),(5,NULL,'teacher4@epathshala.com','Emily Davis','$2a$10$2WQ02ukOLZrdlvSJU6P94.N2c2xONLRZ5I.fJoUqzaYQR/Uynd9vW','TEACHER'),(6,NULL,'teacher5@epathshala.com','James Anderson','$2a$10$7.ZKuk4fBtvPQ/lVnYJJcOHDBxY8oXdpPvh8wKYpGgZiXez8zbK2u','TEACHER'),(7,NULL,'parent1@epathshala.com','Robert Johnson','$2a$10$1Op1d3D4s9/ag2fBrmypc.BpQAQYzkbWTYvz.6hVyDv0NJ/3NNbeO','PARENT'),(8,NULL,'parent2@epathshala.com','Mary Williams','$2a$10$yVryCYZz5U31cQ8r8OVHgOOd8ZbaSjllT1klbxALKTZUwiSQwtC0u','PARENT'),(9,NULL,'parent3@epathshala.com','David Brown','$2a$10$lNowXVRNaA2aH0CRTLFBjOzRCY68Vxf/Gjp/EKnmiCJcOdtUkiLPq','PARENT'),(10,NULL,'parent4@epathshala.com','Lisa Garcia','$2a$10$geV3fzlgMvFGeydPCyKheuoxx0AR5aab02ZIzk0RCds8KQ90aZwlG','PARENT'),(11,NULL,'parent5@epathshala.com','Michael Lee','$2a$10$S1BZHPYGCfOgb2EkGXVJU.DitgsZuL1Jt2QT.SFZmHEMR3u//8Veq','PARENT'),(12,NULL,'student1@epathshala.com','Alice Johnson','$2a$10$U0Z6p8SGmVZqGvsIBqWSze2ouwAB8lCweHra8W5aVHyLtewK2cU36','STUDENT'),(13,NULL,'student2@epathshala.com','Bob Smith','$2a$10$3zwoLKZfl0SZSxcE32xUiuirB.QtVTavqdtOVDea9vVeBUR7CiIuq','STUDENT'),(14,NULL,'student3@epathshala.com','Charlie Brown','$2a$10$Axg/7VDKSL6zafUeezX8leuFFSDENHKgJGxGrTUD6.VaXCNfxZpgW','STUDENT'),(15,NULL,'student4@epathshala.com','Diana Wilson','$2a$10$oNgWnCrYcn3EsWcgNjFYtueZcf1.6kxI4rlrA7/71o6zIlkPzK9Uu','STUDENT'),(16,NULL,'student5@epathshala.com','Eva Martinez','$2a$10$xT3YNpwdTTCujqxI4l80ku2svKNGHtETl5StU4xy.ge5vQz8VRvdC','STUDENT'),(17,NULL,'student6@epathshala.com','Frank Taylor','$2a$10$yTlubGvC5FSxZRvaUmKCO.qMqEdb9vNPmcPhhlcT17/Wf4FoD/NFu','STUDENT'),(18,NULL,'student7@epathshala.com','Grace Chen','$2a$10$6HlpOyewIN/ZpwRjsj6kQ.bX.z8aZchXPMaeGQbka2G.T9Im6AxHO','STUDENT'),(19,NULL,'student8@epathshala.com','Henry Rodriguez','$2a$10$D4mGUv6AngZIck8hxl4/9.otFWvc/cfgen.85iG58mX97rUrGIuti','STUDENT');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'epathshalaai'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-06  9:54:26

-- Fix existing assignment fileUrl fields that contain full paths
-- Extract only the filename from the full path
UPDATE assignment 
SET file_url = SUBSTRING_INDEX(file_url, '/', -1)
WHERE file_url LIKE '%/%' AND file_url NOT LIKE '%.pdf' AND file_url NOT LIKE '%.doc' AND file_url NOT LIKE '%.docx';

-- Alternative for Windows paths (if any exist)
UPDATE assignment 
SET file_url = SUBSTRING_INDEX(file_url, '\\', -1)
WHERE file_url LIKE '%\\%' AND file_url NOT LIKE '%.pdf' AND file_url NOT LIKE '%.doc' AND file_url NOT LIKE '%.docx';

-- Fix any remaining full paths by extracting just the filename
UPDATE assignment 
SET file_url = SUBSTRING_INDEX(file_url, '/', -1)
WHERE file_url LIKE 'uploads/assignments/%';

-- Also fix assignment submission fileUrl fields
UPDATE assignment_submissions 
SET submission_file_url = SUBSTRING_INDEX(submission_file_url, '/', -1)
WHERE submission_file_url LIKE '%/%' AND submission_file_url NOT LIKE '%.pdf' AND submission_file_url NOT LIKE '%.doc' AND submission_file_url NOT LIKE '%.docx';

-- Fix any remaining full paths in submissions
UPDATE assignment_submissions 
SET submission_file_url = SUBSTRING_INDEX(submission_file_url, '/', -1)
WHERE submission_file_url LIKE 'uploads/submissions/%';
