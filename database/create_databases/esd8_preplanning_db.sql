-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.11 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             11.1.0.6116
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for esd8_preplanning_db
CREATE DATABASE IF NOT EXISTS `esd8_preplanning_db` /*!40100 DEFAULT CHARACTER SET utf16 */;
USE `esd8_preplanning_db`;

-- Dumping structure for table esd8_preplanning_db.construction_types
CREATE TABLE IF NOT EXISTS `construction_types` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- Dumping data for table esd8_preplanning_db.construction_types: ~6 rows (approximately)
DELETE FROM `construction_types`;
/*!40000 ALTER TABLE `construction_types` DISABLE KEYS */;
INSERT INTO `construction_types` (`id`, `name`) VALUES
	(1, 'Fire Resistive'),
	(2, 'Non-Combustible'),
	(3, 'Ordinary'),
	(4, 'Heavy Timber'),
	(5, 'Wood Frame'),
	(6, 'Light Weight Wood Truss');
/*!40000 ALTER TABLE `construction_types` ENABLE KEYS */;

-- Dumping structure for table esd8_preplanning_db.icons
CREATE TABLE IF NOT EXISTS `icons` (
  `icon_id` int(11) NOT NULL AUTO_INCREMENT,
  `file_name` varchar(256) NOT NULL DEFAULT '0',
  `icon_name` varchar(256) NOT NULL DEFAULT '0',
  PRIMARY KEY (`icon_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf16;

-- Dumping data for table esd8_preplanning_db.icons: ~1 rows (approximately)
DELETE FROM `icons`;
/*!40000 ALTER TABLE `icons` DISABLE KEYS */;
INSERT INTO `icons` (`icon_id`, `file_name`, `icon_name`) VALUES
	(1, 'edit_location_alt_FILL0_wght400_GRAD0_opsz48.png', 'Default');
/*!40000 ALTER TABLE `icons` ENABLE KEYS */;

-- Dumping structure for table esd8_preplanning_db.markers
CREATE TABLE IF NOT EXISTS `markers` (
  `marker_id` int(11) NOT NULL AUTO_INCREMENT,
  `marker_name` varchar(128) DEFAULT NULL,
  `latitude` double NOT NULL DEFAULT '0',
  `longitude` double NOT NULL DEFAULT '0',
  `icon_id` int(11) NOT NULL DEFAULT '0',
  `image` mediumtext CHARACTER SET utf16 COLLATE utf16_general_ci,
  PRIMARY KEY (`marker_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf16;

-- Dumping structure for table esd8_preplanning_db.mutual_aid
CREATE TABLE IF NOT EXISTS `mutual_aid` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- Dumping data for table esd8_preplanning_db.mutual_aid: ~4 rows (approximately)
DELETE FROM `mutual_aid`;
/*!40000 ALTER TABLE `mutual_aid` DISABLE KEYS */;
INSERT INTO `mutual_aid` (`id`, `name`) VALUES
	(1, 'Helotes FD'),
	(2, 'District 7 FD'),
	(3, 'Leon Springs FD'),
	(4, 'District 2 FD');
/*!40000 ALTER TABLE `mutual_aid` ENABLE KEYS */;

-- Dumping structure for table esd8_preplanning_db.occupancy_types
CREATE TABLE IF NOT EXISTS `occupancy_types` (
  `id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- Dumping data for table esd8_preplanning_db.occupancy_types: ~8 rows (approximately)
DELETE FROM `occupancy_types`;
/*!40000 ALTER TABLE `occupancy_types` DISABLE KEYS */;
INSERT INTO `occupancy_types` (`id`, `name`) VALUES
	(1, 'Assembly'),
	(2, 'Commercial'),
	(3, 'Educational'),
	(4, 'Hazardous'),
	(5, 'Industrial'),
	(6, 'Institutional'),
	(7, 'Mercantile'),
	(8, 'Residential'),
	(9, 'Storage');
/*!40000 ALTER TABLE `occupancy_types` ENABLE KEYS */;

-- Dumping structure for table esd8_preplanning_db.pre_planning
CREATE TABLE IF NOT EXISTS `pre_planning` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `google_formatted_address` text NOT NULL,
  `latitude` float NOT NULL DEFAULT '0',
  `longitude` float NOT NULL DEFAULT '0',
  `occupancyname` varchar(255) NOT NULL,
  `occupancyaddress` varchar(255) NOT NULL,
  `occupancycity` varchar(255) NOT NULL,
  `occupancystate` varchar(255) NOT NULL,
  `occupancyzip` varchar(255) NOT NULL,
  `occupancycountry` varchar(255) NOT NULL,
  `hazards` text CHARACTER SET utf16 COLLATE utf16_general_ci,
  `hydrant_address` varchar(255) DEFAULT NULL,
  `access` varchar(255) DEFAULT NULL,
  `electric_meter` varchar(255) DEFAULT NULL,
  `breaker_box` varchar(255) DEFAULT NULL,
  `water` varchar(255) DEFAULT NULL,
  `gas_shutoff` varchar(255) DEFAULT NULL,
  `emergency_contact_number` varchar(255) DEFAULT NULL,
  `other_notes` text CHARACTER SET utf16 COLLATE utf16_general_ci,
  `contactname` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf16;


-- Dumping structure for table esd8_preplanning_db.pre_planning_construction_types
CREATE TABLE IF NOT EXISTS `pre_planning_construction_types` (
  `pre_planning_id` int(11) NOT NULL,
  `construction_type_id` int(11) NOT NULL,
  PRIMARY KEY (`pre_planning_id`,`construction_type_id`),
  KEY `FK_pre_planning_construction_types_construction_types` (`construction_type_id`),
  CONSTRAINT `FK_pre_planning_construction_types_construction_types` FOREIGN KEY (`construction_type_id`) REFERENCES `construction_types` (`id`),
  CONSTRAINT `FK_pre_planning_construction_types_pre_planning` FOREIGN KEY (`pre_planning_id`) REFERENCES `pre_planning` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;

-- Dumping structure for table esd8_preplanning_db.pre_planning_mutual_aid
CREATE TABLE IF NOT EXISTS `pre_planning_mutual_aid` (
  `pre_planning_id` int(11) NOT NULL,
  `mutual_aid_id` int(11) NOT NULL,
  PRIMARY KEY (`pre_planning_id`,`mutual_aid_id`),
  KEY `FK__mutual_aid_2` (`mutual_aid_id`),
  CONSTRAINT `FK__mutual_aid_2` FOREIGN KEY (`mutual_aid_id`) REFERENCES `mutual_aid` (`id`),
  CONSTRAINT `FK_pre_planning_mutual_aid_pre_planning` FOREIGN KEY (`pre_planning_id`) REFERENCES `pre_planning` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;


-- Dumping structure for table esd8_preplanning_db.pre_planning_occupancy_types
CREATE TABLE IF NOT EXISTS `pre_planning_occupancy_types` (
  `pre_planning_id` int(11) NOT NULL,
  `occupancy_id` int(11) NOT NULL,
  PRIMARY KEY (`pre_planning_id`,`occupancy_id`),
  KEY `FK__occupancy_type` (`occupancy_id`),
  CONSTRAINT `FK__occupancy_type` FOREIGN KEY (`occupancy_id`) REFERENCES `occupancy_types` (`id`),
  CONSTRAINT `FK_pre_planning_occupancy_types_pre_planning` FOREIGN KEY (`pre_planning_id`) REFERENCES `pre_planning` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf16;


/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
