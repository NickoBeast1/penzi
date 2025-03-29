-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: penzi
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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
-- Table structure for table `incomingmessages`
--

DROP TABLE IF EXISTS `incomingmessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incomingmessages` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_phone` varchar(15) NOT NULL,
  `message_text` text NOT NULL,
  `received_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `incomingmessages`
--

LOCK TABLES `incomingmessages` WRITE;
/*!40000 ALTER TABLE `incomingmessages` DISABLE KEYS */;
INSERT INTO `incomingmessages` VALUES (1,'+254712345670','PENZI','2025-03-27 07:27:28'),(2,'+254712345670','PENZI','2025-03-27 07:27:43'),(3,'0713970272','PENZI','2025-03-27 07:29:30'),(4,'0713970272','PENZI','2025-03-27 07:32:59'),(5,'+254712345671','0700112233','2025-03-27 07:35:08'),(6,'+254712345678','details#graduate#accountant#divorced#muslim#somali','2025-03-27 07:36:46'),(7,'0713970272','start#Jamal Jalang’o#29#Male#Mombasa#Bamburi','2025-03-27 07:40:50'),(8,'0713970272','details#graduate#accountant#divorced#muslim#somali','2025-03-27 07:52:05'),(9,'0713970272','MYSELF tall, dark and handsome','2025-03-27 07:58:00'),(10,'0713970272','match#26-35#Nairobi','2025-03-27 07:59:25'),(11,'0713970272','next','2025-03-27 07:59:37'),(12,'0713970272','describe 0713970272','2025-03-27 08:20:51'),(13,'0713970272','0713970272','2025-03-27 08:21:25'),(14,'+254712345674','match#26-35#Naivasha','2025-03-27 08:25:55'),(15,'0713970272','match#26-35#Naivasha','2025-03-27 08:26:24'),(16,'0713970272','match#26-35#Bamburi','2025-03-27 08:27:01'),(17,'0713970272','match#26-35#Naivasha','2025-03-27 08:28:39'),(18,'0713970272','next','2025-03-27 08:28:48'),(19,'0713970272','match#26-35#Naivasha','2025-03-27 08:29:00'),(20,'0713970272','next','2025-03-27 08:29:19'),(21,'0713970272','0719999999','2025-03-27 08:29:25'),(22,'0713970272','describe 0719999999','2025-03-27 08:29:48'),(23,'0719999999','yes','2025-03-27 08:31:18');
/*!40000 ALTER TABLE `incomingmessages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `matches`
--

DROP TABLE IF EXISTS `matches`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `matches` (
  `match_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `matched_user_id` int(11) NOT NULL,
  `match_status` enum('Pending','Accepted','Rejected') DEFAULT 'Pending',
  `match_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`match_id`),
  KEY `user_id` (`user_id`),
  KEY `matched_user_id` (`matched_user_id`),
  CONSTRAINT `matches_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `matches_ibfk_2` FOREIGN KEY (`matched_user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `matches`
--

LOCK TABLES `matches` WRITE;
/*!40000 ALTER TABLE `matches` DISABLE KEYS */;
/*!40000 ALTER TABLE `matches` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message_text` text NOT NULL,
  `sent_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`message_id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `notification_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `sent_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`notification_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `outgoingmessages`
--

DROP TABLE IF EXISTS `outgoingmessages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `outgoingmessages` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `recipient_phone` varchar(15) NOT NULL,
  `message_text` text NOT NULL,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`message_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `outgoingmessages`
--

LOCK TABLES `outgoingmessages` WRITE;
/*!40000 ALTER TABLE `outgoingmessages` DISABLE KEYS */;
INSERT INTO `outgoingmessages` VALUES (1,'+254712345670','Welcome to our dating service! To register, SMS: start#name#age#gender#county#town','2025-03-27 07:27:28'),(2,'+254712345670','Welcome to our dating service! To register, SMS: start#name#age#gender#county#town','2025-03-27 07:27:43'),(3,'0713970272','Welcome to our dating service! To register, SMS: start#name#age#gender#county#town','2025-03-27 07:29:30'),(4,'0713970272','Welcome to our dating service! To register, SMS: start#name#age#gender#county#town','2025-03-27 07:32:59'),(5,'+254712345671','No user found with that phone number.','2025-03-27 07:35:08'),(6,'+254712345678','User not found. Please register first.','2025-03-27 07:36:46'),(7,'0713970272','Your profile has been created successfully, Jamal Jalang’o. SMS: details#education#profession#maritalStatus#religion#ethnicity','2025-03-27 07:40:50'),(8,'0713970272','This is the last stage of registration. SMS a brief description of yourself to 22141 starting with MYSELF.','2025-03-27 07:52:05'),(9,'0713970272','You are now registered for dating. To search for a MPENZI, SMS match#age#town','2025-03-27 07:58:00'),(10,'0713970272','No matches found. Please try different criteria.','2025-03-27 07:59:25'),(11,'0713970272','No previous match search found. Please send a match request first.','2025-03-27 07:59:37'),(12,'0713970272','Jamal Jalang’o describes himself as tall, dark and handsome. Send NOTIFY#YOUR_PHONE#REQUESTED_PHONE to notify match','2025-03-27 08:20:51'),(13,'0713970272','Jamal Jalang’o aged 29, Mombasa County, Bamburi town, graduate, accountant, Divorced, muslim, somali. Send DESCRIBE 0713970272 to get more details about Jamal Jalang’o.','2025-03-27 08:21:25'),(14,'+254712345674','User not found. Please register first.','2025-03-27 08:25:55'),(15,'0713970272','We have 1 matches!\nHere are the first 1:\n1. Jane Wanjiru aged 30, 0719999999\nSend NEXT to receive more matches.','2025-03-27 08:26:24'),(16,'0713970272','No matches found. Please try different criteria.','2025-03-27 08:27:01'),(17,'0713970272','We have 1 matches!\nHere are the first 1:\n1. Jane Wanjiru aged 30, 0719999999\nSend NEXT to receive more matches.','2025-03-27 08:28:39'),(18,'0713970272','No more matches found.Send match phone to get more details about match','2025-03-27 08:28:48'),(19,'0713970272','We have 1 matches!\nHere are the first 1:\n1. Jane Wanjiru aged 30, 0719999999\nSend NEXT to receive more matches.','2025-03-27 08:29:00'),(20,'0713970272','No more matches found.Send match phone to get more details about match','2025-03-27 08:29:19'),(21,'0713970272','Jane Wanjiru aged 30, Nakuru County, Naivasha town, N/A, N/A, N/A, N/A, N/A. Send DESCRIBE 0719999999 to get more details about Jane Wanjiru.','2025-03-27 08:29:25'),(22,'0713970272','Jane Wanjiru has not provided a self-description.','2025-03-27 08:29:48'),(23,'0719999999','Hi Jane Wanjiru, a man called Jamal Jalang’o is interested in you and requested your details.\nHe is aged 29 based in Mombasa.\nDo you want to know more about he? Send YES to 22141','2025-03-27 08:30:21'),(24,'0719999999','Hi Jane Wanjiru, a man called Jamal Jalang’o is interested in you and requested your details.\nHe is aged 29 based in Mombasa.\nDo you want to know more about he? Send YES to 22141','2025-03-27 08:31:05'),(25,'0719999999','Jamal Jalang’o aged 29, Mombasa County, Bamburi town, Bachelor\'s Degree, Accountant, Divorced, Muslim, Somali. Send DESCRIBE the requester phone to get more details.','2025-03-27 08:31:18');
/*!40000 ALTER TABLE `outgoingmessages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `preferences`
--

DROP TABLE IF EXISTS `preferences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `preferences` (
  `preference_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `preferred_age_range` varchar(10) DEFAULT NULL,
  `preferred_gender` enum('Male','Female','Other') DEFAULT NULL,
  `preferred_county` varchar(100) DEFAULT NULL,
  `preferred_town` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`preference_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `preferences_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `preferences`
--

LOCK TABLES `preferences` WRITE;
/*!40000 ALTER TABLE `preferences` DISABLE KEYS */;
/*!40000 ALTER TABLE `preferences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profiles` (
  `profile_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `level_of_education` varchar(100) DEFAULT NULL,
  `profession` varchar(100) DEFAULT NULL,
  `marital_status` enum('Single','Married','Divorced','Widowed') DEFAULT NULL,
  `religion` varchar(50) DEFAULT NULL,
  `ethnicity` varchar(50) DEFAULT NULL,
  `self_description` text DEFAULT NULL,
  PRIMARY KEY (`profile_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES (1,1,'Bachelor\'s Degree','Accountant','Divorced','Muslim','Somali','tall, dark and handsome'),(2,2,'Diploma','Journalist','Single','Christian','Kisii','I love traveling and new experiences.'),(3,3,'Diploma','Accountant','Single','Christian','Meru','I am outgoing and love meeting new people.'),(4,4,'Certificate','Nurse','Single','Muslim','Swahili','I am caring and compassionate.'),(5,5,'Bachelor\'s Degree','Teacher','Single','Christian','Luhya','I enjoy teaching and helping others learn.'),(6,6,'Bachelor\'s Degree','Nurse','Single','Christian','Kamba','Diligent, loving, dedicated and will make you tick'),(7,7,'Diploma','Engineer','Single','Christian','Kalenjin','I love to design and create solutions.'),(8,8,'Diploma','Developer','Single','Atheist','Kikuyu','I code for fun and solve complex problems.'),(9,9,'Bachelor\'s Degree','Chef','Married','Christian','Kikuyu','I enjoy cooking and exploring new recipes.');
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `requests`
--

DROP TABLE IF EXISTS `requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `requests` (
  `request_id` int(11) NOT NULL AUTO_INCREMENT,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `request_status` enum('Pending','Accepted','Rejected') DEFAULT 'Pending',
  `request_timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`request_id`),
  KEY `sender_id` (`sender_id`),
  KEY `receiver_id` (`receiver_id`),
  CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`sender_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `requests_ibfk_2` FOREIGN KEY (`receiver_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `requests`
--

LOCK TABLES `requests` WRITE;
/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
INSERT INTO `requests` VALUES (1,1,10,'Pending','2025-03-27 08:30:21'),(2,1,10,'Accepted','2025-03-27 08:31:05');
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `serviceactivation`
--

DROP TABLE IF EXISTS `serviceactivation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `serviceactivation` (
  `activation_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `activated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`activation_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `serviceactivation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `serviceactivation`
--

LOCK TABLES `serviceactivation` WRITE;
/*!40000 ALTER TABLE `serviceactivation` DISABLE KEYS */;
INSERT INTO `serviceactivation` VALUES (1,1,'2025-03-27 07:40:50');
/*!40000 ALTER TABLE `serviceactivation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(100) NOT NULL,
  `age` int(11) NOT NULL,
  `gender` enum('Male','Female','Other') NOT NULL,
  `county` varchar(100) NOT NULL,
  `town` varchar(100) NOT NULL,
  `phone_number` varchar(15) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `phone_number` (`phone_number`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Jamal Jalang’o',29,'Male','Mombasa','Bamburi','0713970272','2025-03-27 07:40:50'),(2,'Jamal Jalang\'o',29,'Male','Mombasa','Bamburi','+254712345678','2025-03-27 08:22:49'),(3,'Linda Moraa',29,'Female','Nairobi','Westlands','0722010203','2025-03-27 08:22:49'),(4,'Dorine Gakii',26,'Female','Nairobi','Kilimani','0701223344','2025-03-27 08:22:49'),(5,'Aisha Bahati',27,'Female','Nairobi','Kasarani','0700112233','2025-03-27 08:22:49'),(6,'Pamela Nafula',26,'Female','Nairobi','Donholm','0722040506','2025-03-27 08:22:49'),(7,'Maria Mwende',28,'Female','Nairobi','Kasarani','0702556677','2025-03-27 08:22:49'),(8,'Keziah Cheptab',28,'Female','Nairobi','Roysambu','0708990011','2025-03-27 08:22:49'),(9,'John Doe',26,'Male','Nakuru','Naivasha','0712345678','2025-03-27 08:22:49'),(10,'Jane Wanjiru',30,'Female','Nakuru','Naivasha','0719999999','2025-03-27 08:22:49');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'penzi'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-27 13:49:34
