-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.29 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             11.0.0.5919
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Dumping database structure for esd8_preplanning_db
CREATE DATABASE IF NOT EXISTS `esd8_preplanning_db` /*!40100 DEFAULT CHARACTER SET utf16 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `esd8_preplanning_db`;

-- Dumping structure for table esd8_preplanning_db.icons
CREATE TABLE IF NOT EXISTS `icons` (
  `icon_id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(256) NOT NULL DEFAULT '0',
  `icon_name` varchar(256) NOT NULL DEFAULT '0',
  PRIMARY KEY (`icon_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf16;

-- Dumping data for table esd8_preplanning_db.icons: ~0 rows (approximately)
DELETE FROM `icons`;
/*!40000 ALTER TABLE `icons` DISABLE KEYS */;
INSERT INTO `icons` (`icon_id`, `file_name`, `icon_name`) VALUES
	(1, 'edit_location_alt_FILL0_wght400_GRAD0_opsz48.png', 'default');
/*!40000 ALTER TABLE `icons` ENABLE KEYS */;

-- Dumping structure for table esd8_preplanning_db.markers
CREATE TABLE IF NOT EXISTS `markers` (
  `marker_id` int NOT NULL AUTO_INCREMENT,
  `marker_name` varchar(128) DEFAULT NULL,
  `latitude` double NOT NULL DEFAULT '0',
  `longitude` double NOT NULL DEFAULT '0',
  `icon_id` int NOT NULL DEFAULT '0',
  `image` mediumtext CHARACTER SET utf16 COLLATE utf16_general_ci,
  PRIMARY KEY (`marker_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf16;

-- Dumping structure for table esd8_preplanning_db.pre_planning
CREATE TABLE IF NOT EXISTS `pre_planning` (
  `id` int NOT NULL AUTO_INCREMENT,
  `google_formatted_address` text NOT NULL,
  `latitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `occupancyname` varchar(255) NOT NULL,
  `mut_aid_helotesfd` int DEFAULT NULL,
  `mut_aid_d7fr` int DEFAULT NULL,
  `mut_aid_leonspringsvfd` int DEFAULT NULL,
  `mut_aid_bc2fd` int DEFAULT NULL,
  `occupancyaddress` varchar(255) NOT NULL,
  `occupancycity` varchar(255) NOT NULL,
  `occupancystate` varchar(255) NOT NULL,
  `occupancyzip` varchar(255) NOT NULL,
  `occupancycountry` varchar(255) NOT NULL,
  `constructiontype` int DEFAULT NULL,
  `hazards` varchar(255) DEFAULT NULL,
  `hydrant_address` varchar(255) DEFAULT NULL,
  `hydrant_distance` int DEFAULT NULL,
  `access` varchar(255) DEFAULT NULL,
  `electric_meter` varchar(255) DEFAULT NULL,
  `breaker_box` varchar(255) DEFAULT NULL,
  `water` varchar(255) DEFAULT NULL,
  `gas_shutoff` varchar(255) DEFAULT NULL,
  `emergency_contact_number` varchar(255) DEFAULT NULL,
  `other_notes` varchar(255) DEFAULT NULL,
  `occupancytype` varchar(255) NOT NULL,
  `contactname` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf16;

-- Dumping data for table esd8_preplanning_db.pre_planning: ~2 rows (approximately)
DELETE FROM `pre_planning`;
/*!40000 ALTER TABLE `pre_planning` DISABLE KEYS */;
INSERT INTO `pre_planning` (`id`, `google_formatted_address`, `latitude`, `longitude`, `occupancyname`, `mut_aid_helotesfd`, `mut_aid_d7fr`, `mut_aid_leonspringsvfd`, `mut_aid_bc2fd`, `occupancyaddress`, `occupancycity`, `occupancystate`, `occupancyzip`, `occupancycountry`, `constructiontype`, `hazards`, `hydrant_address`, `hydrant_distance`, `access`, `electric_meter`, `breaker_box`, `water`, `gas_shutoff`, `emergency_contact_number`, `other_notes`, `occupancytype`, `contactname`) VALUES
	(2, '1 UTSA Circle, San Antonio, TX 78249, USA', 29.5855, -98.6172, 'UTSA', 1, 2, 2, 2, '1 UTSA Circle', 'San Antonio', 'TX', '78249', 'USA', 4, 'Me', 'asdsad', 5, 'sssd', 'Supera', 'Corner', 'asgasg', 'N/A', 'asd', 'Wewedd', 'Fire Hydrant', 'sadh'),
	(3, '14333 Babcock Rd, San Antonio, TX 78249, USA', 29.5791, -98.633, 'Apartment 14112', 2, 2, 2, 2, '14333 Babcock Rd', 'San Antonio', 'TX', '78249', 'USA', 2, 'N/A', 'N/A', 2, 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'N/A', 'Apartments', 'N/A');
/*!40000 ALTER TABLE `pre_planning` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
