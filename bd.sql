-- Adminer 4.8.0 MySQL 5.5.5-10.3.27-MariaDB-0+deb10u1 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `Ordering`;
CREATE TABLE `Ordering` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ordererName` varchar(50) NOT NULL,
  `ordererTel` int(30) NOT NULL,
  `ordererQuater` varchar(50) NOT NULL,
  `amount` int(11) NOT NULL,
  `delivery` varchar(50) NOT NULL,
  `box` varchar(50) NOT NULL,
  `perso` varchar(50) NOT NULL,
  `date` datetime NOT NULL,
  `product` int(11) NOT NULL,
  `state` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `product` (`product`),
  CONSTRAINT `Ordering_ibfk_1` FOREIGN KEY (`product`) REFERENCES `Product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `Product`;
CREATE TABLE `Product` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `type` varchar(50) NOT NULL,
  `price` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `recipe` text NOT NULL,
  `box1` varchar(50) NOT NULL,
  `box2` varchar(50) NOT NULL,
  `box3` varchar(50) NOT NULL,
  `perso1` varchar(50) NOT NULL,
  `perso2` varchar(50) NOT NULL,
  `perso3` varchar(50) NOT NULL,
  `img0` varchar(200) NOT NULL,
  `img1` varchar(200) NOT NULL,
  `img2` varchar(200) NOT NULL,
  `img3` varchar(200) NOT NULL,
  `img4` varchar(200) NOT NULL,
  `img5` varchar(200) NOT NULL,
  `imgName` varchar(200) NOT NULL,
  `creationDate` datetime NOT NULL,
  `deleted` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` varchar(40) NOT NULL,
  `password` varchar(40) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `User` (`id`, `login`, `password`) VALUES
(1,	'goddelight',	'deontaywilder');

-- 2023-11-23 06:56:47
