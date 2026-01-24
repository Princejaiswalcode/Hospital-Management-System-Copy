-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: hospital_managment_system
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admissions`
--

DROP TABLE IF EXISTS `admissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admissions` (
  `admission_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `ward_id` int NOT NULL,
  `admission_date` date NOT NULL,
  `discharge_date` date DEFAULT NULL,
  `room_number` varchar(10) DEFAULT NULL,
  `bed_number` varchar(10) DEFAULT NULL,
  `reason` text,
  PRIMARY KEY (`admission_id`),
  KEY `fk_admission_patient` (`patient_id`),
  KEY `fk_admission_ward` (`ward_id`),
  CONSTRAINT `fk_admission_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_admission_ward` FOREIGN KEY (`ward_id`) REFERENCES `wards` (`ward_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admissions`
--

LOCK TABLES `admissions` WRITE;
/*!40000 ALTER TABLE `admissions` DISABLE KEYS */;
INSERT INTO `admissions` VALUES (1,1,6,'2026-01-20',NULL,'ICU-01','B2','Cardiac monitoring'),(2,3,7,'2026-01-22','2026-01-25','GW-A-12','A12','Knee injury'),(3,5,8,'2026-01-23',NULL,'PR-05','P5','Observation'),(4,7,9,'2026-01-24','2026-01-26','GW-B-08','B8','Severe headache'),(5,9,10,'2026-01-25',NULL,'GW-A-09','A9','Skin infection');
/*!40000 ALTER TABLE `admissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `appointment_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` varchar(20) DEFAULT 'Scheduled',
  `reason` text,
  `notes` text,
  PRIMARY KEY (`appointment_id`),
  KEY `fk_appointment_patient` (`patient_id`),
  KEY `fk_appointment_doctor` (`doctor_id`),
  CONSTRAINT `fk_appointment_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_appointment_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (11,1,61,'2026-01-25','10:30:00','Scheduled','Chest pain','Urgent checkup'),(12,2,62,'2026-01-25','11:15:00','Completed','Migraine','Prescribed medicine'),(13,3,63,'2026-01-26','09:00:00','Scheduled','Knee pain',NULL),(14,4,64,'2026-01-26','14:30:00','Cancelled','Skin allergy','Patient unavailable'),(15,5,65,'2026-01-27','16:00:00','Scheduled','Routine checkup',NULL),(16,6,61,'2026-01-27','12:00:00','Completed','Heart follow-up','Stable condition'),(17,7,62,'2026-01-28','10:45:00','Scheduled','Headache',NULL),(18,8,63,'2026-01-28','15:30:00','Scheduled','Back pain',NULL),(19,9,64,'2026-01-29','09:30:00','Completed','Rash','Cream prescribed'),(20,10,65,'2026-01-29','11:00:00','Scheduled','Pregnancy consultation',NULL);
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bills` (
  `bill_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `appointment_id` int DEFAULT NULL,
  `treatment_id` int DEFAULT NULL,
  `admission_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `payment_status` varchar(20) NOT NULL,
  `bill_date` date NOT NULL,
  `payment_date` date DEFAULT NULL,
  PRIMARY KEY (`bill_id`),
  KEY `fk_bill_patient` (`patient_id`),
  KEY `fk_bill_appointment` (`appointment_id`),
  KEY `fk_bill_treatment` (`treatment_id`),
  KEY `fk_bill_admission` (`admission_id`),
  CONSTRAINT `fk_bill_admission` FOREIGN KEY (`admission_id`) REFERENCES `admissions` (`admission_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bill_appointment` FOREIGN KEY (`appointment_id`) REFERENCES `appointments` (`appointment_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_bill_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bill_treatment` FOREIGN KEY (`treatment_id`) REFERENCES `treatments` (`treatment_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills`
--

LOCK TABLES `bills` WRITE;
/*!40000 ALTER TABLE `bills` DISABLE KEYS */;
INSERT INTO `bills` VALUES (1,1,11,NULL,NULL,800.00,'Paid','2026-01-10','2026-01-10'),(2,2,12,2,NULL,3800.00,'Paid','2026-01-12','2026-01-12'),(3,3,13,1,1,10500.00,'Pending','2026-01-11',NULL),(4,4,14,2,2,7000.00,'Paid','2026-01-15','2026-01-15'),(5,5,15,NULL,NULL,600.00,'Paid','2026-01-12','2026-01-12'),(6,6,16,3,3,4500.00,'Pending','2026-01-13',NULL),(7,7,17,NULL,NULL,900.00,'Paid','2026-01-14','2026-01-14'),(8,8,18,4,4,18500.00,'Paid','2026-01-18','2026-01-18'),(9,9,19,NULL,NULL,1200.00,'Pending','2026-01-16',NULL),(10,10,20,5,5,24000.00,'Paid','2026-01-17','2026-01-20');
/*!40000 ALTER TABLE `bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_id` int NOT NULL AUTO_INCREMENT,
  `department_name` varchar(100) NOT NULL,
  `head_doctor_id` int DEFAULT NULL,
  `floor_number` int DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `description` text,
  PRIMARY KEY (`department_id`),
  KEY `fk_department_head` (`head_doctor_id`),
  CONSTRAINT `fk_department_head` FOREIGN KEY (`head_doctor_id`) REFERENCES `doctors` (`doctor_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `departments`
--

LOCK TABLES `departments` WRITE;
/*!40000 ALTER TABLE `departments` DISABLE KEYS */;
INSERT INTO `departments` VALUES (3,'Cardiology',61,2,'022-4567890','Heart-related diagnosis and treatments');
/*!40000 ALTER TABLE `departments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctors`
--

DROP TABLE IF EXISTS `doctors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctors` (
  `doctor_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `specialization` varchar(100) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `license_number` varchar(50) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  PRIMARY KEY (`doctor_id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `fk_doctor_department` (`department_id`),
  CONSTRAINT `fk_doctor_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_doctor_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctors`
--

LOCK TABLES `doctors` WRITE;
/*!40000 ALTER TABLE `doctors` DISABLE KEYS */;
INSERT INTO `doctors` VALUES (61,6,'Arun','Mehta','Cardiology','987650001','arun.mehta@hospital.com','LIC1001','2018-06-10',3),(62,7,'Kavita','Sharma','Neurology','987650002','kavita.sharma@hospital.com','LIC1002','2019-03-12',3),(63,8,'Rohit','Verma','Orthopedics','987650003','rohit.verma@hospital.com','LIC1003','2020-01-15',3),(64,9,'Sneha','Iyer','Dermatology','987650004','sneha.iyer@hospital.com','LIC1004','2021-08-20',3),(65,10,'Rajesh','Kumar','General Medicine','987650005','rajesh.kumar@hospital.com','LIC1005','2017-11-05',3),(66,11,'Ananya','Reddy','Pediatrics','987650006','ananya.reddy@hospital.com','LIC1006','2022-02-18',3),(67,12,'Vikram','Singh','ENT','987650007','vikram.singh@hospital.com','LIC1007','2016-09-09',3),(68,13,'Pankaj','Joshi','Urology','987650008','pankaj.joshi@hospital.com','LIC1008','2019-12-01',3),(69,14,'Nitin','Kulkarni','Oncology','987650009','nitin.k@hospital.com','LIC1009','2020-07-07',3),(70,15,'Swati','Patil','Gynecology','987650010','swati.patil@hospital.com','LIC1010','2018-04-25',3);
/*!40000 ALTER TABLE `doctors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `hospitals`
--

DROP TABLE IF EXISTS `hospitals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `hospitals` (
  `hospital_id` int NOT NULL AUTO_INCREMENT,
  `hospital_name` varchar(200) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `state` varchar(100) NOT NULL,
  `country` varchar(100) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `license_number` varchar(100) NOT NULL,
  PRIMARY KEY (`hospital_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `license_number` (`license_number`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `hospitals`
--

LOCK TABLES `hospitals` WRITE;
/*!40000 ALTER TABLE `hospitals` DISABLE KEYS */;
INSERT INTO `hospitals` VALUES (1,'Tata Hospital','MG Road, Near Metro Station','Mumbai','Maharashtra','India','0224567890','Ratan@tatahospital.com','MH-HOSP-2026-001');
/*!40000 ALTER TABLE `hospitals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nurses`
--

DROP TABLE IF EXISTS `nurses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nurses` (
  `nurse_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `shift` varchar(20) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  `department_id` int DEFAULT NULL,
  PRIMARY KEY (`nurse_id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `fk_nurse_department` (`department_id`),
  CONSTRAINT `fk_nurse_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL,
  CONSTRAINT `fk_nurse_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nurses`
--

LOCK TABLES `nurses` WRITE;
/*!40000 ALTER TABLE `nurses` DISABLE KEYS */;
INSERT INTO `nurses` VALUES (21,16,'Kavita','Singh','989800001','kavita.singh@hospital.com','Morning','2020-01-10',3),(22,17,'Rina','Das','989800002','rina.das@hospital.com','Night','2019-05-22',3),(23,18,'Meena','Shah','989800003','meena.shah@hospital.com','Morning','2021-03-18',3),(24,19,'Pooja','Nair','989800004','pooja.nair@hospital.com','Evening','2022-07-11',3),(25,20,'Alka','Jain','989800005','alka.jain@hospital.com','Night','2018-10-09',3),(26,21,'Neetu','Kapoor','989800006','neetu.k@hospital.com','Morning','2020-12-12',3),(27,22,'Shalini','Roy','989800007','shalini.roy@hospital.com','Evening','2019-09-15',3),(28,23,'Deepa','Menon','989800008','deepa.m@hospital.com','Night','2021-06-21',3),(29,24,'Kiran','Joshi','989800009','kiran.j@hospital.com','Morning','2017-08-30',3),(30,25,'Sunita','Rao','989800010','sunita.rao@hospital.com','Evening','2018-02-14',3);
/*!40000 ALTER TABLE `nurses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patients` (
  `patient_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `address` text,
  `blood_group` varchar(5) DEFAULT NULL,
  `emergency_contact` varchar(15) DEFAULT NULL,
  PRIMARY KEY (`patient_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_patient_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
INSERT INTO `patients` VALUES (1,36,'Rajesh','Kumar','1985-03-15','M','900100001','rajesh.k@gmail.com','Mumbai','O+','900200001'),(2,37,'Priya','Sharma','1990-07-22','F','900100002','priya.s@gmail.com','Pune','A+','900200002'),(3,38,'Suresh','Patel','1978-11-02','M','900100003','suresh.p@gmail.com','Surat','B+','900200003'),(4,39,'Ananya','Reddy','1995-01-19','F','900100004','ananya.r@gmail.com','Hyderabad','AB+','900200004'),(5,40,'Vikram','Singh','1988-09-10','M','900100005','vikram.s@gmail.com','Delhi','O-','900200005'),(6,41,'Karan','Malhotra','1992-04-25','M','900100006','karan.m@gmail.com','Jaipur','A-','900200006'),(7,42,'Aditya','Menon','1983-12-30','M','900100007','aditya.m@gmail.com','Kochi','B-','900200007'),(8,43,'Neha','Joshi','1997-06-05','F','900100008','neha.j@gmail.com','Nagpur','O+','900200008'),(9,44,'Rohan','Gupta','1986-08-18','M','900100009','rohan.g@gmail.com','Indore','AB-','900200009'),(10,45,'Sneha','Kulkarni','1993-02-14','F','900100010','sneha.k@gmail.com','Kolhapur','A+','900200010');
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `receptionists`
--

DROP TABLE IF EXISTS `receptionists`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `receptionists` (
  `receptionist_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `shift` varchar(20) DEFAULT NULL,
  `joining_date` date DEFAULT NULL,
  PRIMARY KEY (`receptionist_id`),
  UNIQUE KEY `user_id` (`user_id`),
  CONSTRAINT `fk_receptionist_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `receptionists`
--

LOCK TABLES `receptionists` WRITE;
/*!40000 ALTER TABLE `receptionists` DISABLE KEYS */;
INSERT INTO `receptionists` VALUES (1,26,'Rahul','Verma','981100001','rahul.verma@hospital.com','Morning','2019-01-01'),(2,27,'Anita','Desai','981100002','anita.desai@hospital.com','Evening','2020-04-15'),(3,28,'Suresh','Patel','981100003','suresh.patel@hospital.com','Morning','2018-07-20'),(4,29,'Kavya','Iyer','981100004','kavya.iyer@hospital.com','Night','2021-09-10'),(5,30,'Manoj','Kulkarni','981100005','manoj.k@hospital.com','Evening','2017-11-25');
/*!40000 ALTER TABLE `receptionists` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salary_payments`
--

DROP TABLE IF EXISTS `salary_payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salary_payments` (
  `payment_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `employee_type` varchar(20) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_date` date NOT NULL,
  `payment_month` varchar(20) NOT NULL,
  `payment_year` int NOT NULL,
  `payment_method` varchar(50) NOT NULL,
  PRIMARY KEY (`payment_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salary_payments`
--

LOCK TABLES `salary_payments` WRITE;
/*!40000 ALTER TABLE `salary_payments` DISABLE KEYS */;
INSERT INTO `salary_payments` VALUES (1,61,'doctor',80000.00,'2026-01-01','January',2026,'Bank Transfer'),(2,62,'doctor',75000.00,'2026-01-01','January',2026,'Bank Transfer'),(3,63,'doctor',70000.00,'2026-01-01','January',2026,'Bank Transfer'),(4,64,'doctor',85000.00,'2026-01-01','January',2026,'Bank Transfer'),(5,65,'doctor',78000.00,'2026-01-01','January',2026,'Bank Transfer'),(6,61,'doctor',80000.00,'2026-01-01','January',2026,'Bank Transfer'),(7,62,'doctor',75000.00,'2026-01-01','January',2026,'Bank Transfer'),(8,63,'doctor',70000.00,'2026-01-01','January',2026,'Bank Transfer'),(9,64,'doctor',85000.00,'2026-01-01','January',2026,'Bank Transfer'),(10,65,'doctor',78000.00,'2026-01-01','January',2026,'Bank Transfer');
/*!40000 ALTER TABLE `salary_payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `treatments`
--

DROP TABLE IF EXISTS `treatments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `treatments` (
  `treatment_id` int NOT NULL AUTO_INCREMENT,
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  `treatment_date` date NOT NULL,
  `diagnosis` text,
  `prescription` text,
  `treatment_cost` decimal(10,2) DEFAULT NULL,
  `follow_up_date` date DEFAULT NULL,
  PRIMARY KEY (`treatment_id`),
  KEY `fk_treatment_patient` (`patient_id`),
  KEY `fk_treatment_doctor` (`doctor_id`),
  CONSTRAINT `fk_treatment_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`doctor_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_treatment_patient` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`patient_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `treatments`
--

LOCK TABLES `treatments` WRITE;
/*!40000 ALTER TABLE `treatments` DISABLE KEYS */;
INSERT INTO `treatments` VALUES (1,2,62,'2026-01-25','Migraine','Pain reliever tablets',500.00,'2026-02-05'),(2,4,64,'2026-01-26','Skin Allergy','Antihistamine cream',350.00,NULL),(3,6,61,'2026-01-27','Cardiac Checkup','Beta blockers',1200.00,'2026-02-15'),(4,9,64,'2026-01-29','Dermatitis','Moisturizing lotion',400.00,NULL),(5,3,63,'2026-01-30','Ligament Strain','Physiotherapy',1500.00,'2026-02-20');
/*!40000 ALTER TABLE `treatments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','doctor','nurse','reception','accounts','patient') NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2y$10$3LxWCF5oXjUyCl47LOGPb.3.Oh1/CiVyP4LXnEwO8ceIWdIepuK46','admin','Admin User','2026-01-24 09:38:24'),(2,'admin1','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','admin','Dr. Neha Gupta','2026-01-24 10:28:18'),(3,'admin2','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','admin','Dr. Amit Verma','2026-01-24 10:28:18'),(4,'admin3','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','admin','Dr. Ritu Malhotra','2026-01-24 10:28:18'),(5,'admin4','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','admin','Dr. Sanjay Khanna','2026-01-24 10:28:18'),(6,'admin5','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','admin','Dr. Pooja Mehta','2026-01-24 10:28:18'),(7,'doctor1','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','doctor','Dr. Arun Mehta','2026-01-24 10:28:18'),(8,'doctor2','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','doctor','Dr. Kavita Sharma','2026-01-24 10:28:18'),(9,'doctor3','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','doctor','Dr. Rohit Verma','2026-01-24 10:28:18'),(10,'doctor4','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','doctor','Dr. Sneha Iyer','2026-01-24 10:28:18'),(11,'doctor5','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','doctor','Dr. Rajesh Kumar','2026-01-24 10:28:18'),(12,'doctor6','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','doctor','Dr. Ananya Reddy','2026-01-24 10:28:18'),(13,'doctor7','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','doctor','Dr. Vikram Singh','2026-01-24 10:28:18'),(14,'doctor8','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','doctor','Dr. Pankaj Joshi','2026-01-24 10:28:18'),(15,'doctor9','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','doctor','Dr. Nitin Kulkarni','2026-01-24 10:28:18'),(16,'doctor10','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','doctor','Dr. Swati Patil','2026-01-24 10:28:18'),(17,'nurse1','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','nurse','Nurse Kavita Singh','2026-01-24 10:28:18'),(18,'nurse2','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','nurse','Nurse Rina Das','2026-01-24 10:28:18'),(19,'nurse3','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','nurse','Nurse Meena Shah','2026-01-24 10:28:18'),(20,'nurse4','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','nurse','Nurse Pooja Nair','2026-01-24 10:28:18'),(21,'nurse5','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','nurse','Nurse Alka Jain','2026-01-24 10:28:18'),(22,'nurse6','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','nurse','Nurse Neetu Kapoor','2026-01-24 10:28:18'),(23,'nurse7','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','nurse','Nurse Shalini Roy','2026-01-24 10:28:18'),(24,'nurse8','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','nurse','Nurse Deepa Menon','2026-01-24 10:28:18'),(25,'nurse9','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','nurse','Nurse Kiran Joshi','2026-01-24 10:28:18'),(26,'nurse10','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','nurse','Nurse Sunita Rao','2026-01-24 10:28:18'),(27,'reception1','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','reception','Rahul Verma','2026-01-24 10:28:18'),(28,'reception2','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','reception','Anita Desai','2026-01-24 10:28:18'),(29,'reception3','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','reception','Suresh Patel','2026-01-24 10:28:18'),(30,'reception4','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','reception','Kavya Iyer','2026-01-24 10:28:18'),(31,'reception5','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','reception','Manoj Kulkarni','2026-01-24 10:28:18'),(32,'accounts1','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','accounts','Deepak Nair','2026-01-24 10:28:18'),(33,'accounts2','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','accounts','Ramesh Iyer','2026-01-24 10:28:18'),(34,'accounts3','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','accounts','Sunil Mehta','2026-01-24 10:28:18'),(35,'accounts4','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','accounts','Pallavi Deshmukh','2026-01-24 10:28:18'),(36,'accounts5','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','accounts','Amit Kulkarni','2026-01-24 10:28:18'),(37,'patient1','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Rajesh Kumar','2026-01-24 10:28:18'),(38,'patient2','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Priya Sharma','2026-01-24 10:28:18'),(39,'patient3','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Suresh Patel','2026-01-24 10:28:18'),(40,'patient4','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Ananya Reddy','2026-01-24 10:28:18'),(41,'patient5','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Vikram Singh','2026-01-24 10:28:18'),(42,'patient6','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Karan Malhotra','2026-01-24 10:28:18'),(43,'patient7','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Aditya Menon','2026-01-24 10:28:18'),(44,'patient8','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Neha Joshi','2026-01-24 10:28:18'),(45,'patient9','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Rohan Gupta','2026-01-24 10:28:18'),(46,'patient10','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Sneha Kulkarni','2026-01-24 10:28:18'),(47,'patient11','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Manish Pandey','2026-01-24 10:28:18'),(48,'patient12','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Pallavi Shah','2026-01-24 10:28:18'),(49,'patient13','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Nikhil Verma','2026-01-24 10:28:18'),(50,'patient14','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Aarti Desai','2026-01-24 10:28:18'),(51,'patient15','$2b$10$8dH0R9KpX9QG4ZrQZyK6iO9zLJ9C5b4FZP3J1q5uZP6Xz6n6FQ6xK','patient','Mohit Agarwal','2026-01-24 10:28:18');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wards`
--

DROP TABLE IF EXISTS `wards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wards` (
  `ward_id` int NOT NULL AUTO_INCREMENT,
  `ward_name` varchar(100) NOT NULL,
  `ward_type` varchar(50) DEFAULT NULL,
  `total_beds` int NOT NULL,
  `available_beds` int NOT NULL,
  `department_id` int DEFAULT NULL,
  `floor_number` int DEFAULT NULL,
  PRIMARY KEY (`ward_id`),
  KEY `fk_ward_department` (`department_id`),
  CONSTRAINT `fk_ward_department` FOREIGN KEY (`department_id`) REFERENCES `departments` (`department_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wards`
--

LOCK TABLES `wards` WRITE;
/*!40000 ALTER TABLE `wards` DISABLE KEYS */;
INSERT INTO `wards` VALUES (6,'General Ward A','General',30,12,3,1),(7,'General Ward B','General',25,5,3,2),(8,'ICU Ward','ICU',10,2,3,3),(9,'Private Ward','Private',15,6,3,4),(10,'Emergency Ward','Emergency',20,8,3,0);
/*!40000 ALTER TABLE `wards` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-24 16:44:56
