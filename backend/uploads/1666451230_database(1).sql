-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 22, 2022 at 08:17 AM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `database`
--

-- --------------------------------------------------------

--
-- Table structure for table `domains`
--

CREATE TABLE `domains` (
  `id` int(11) NOT NULL,
  `domainname` char(255) NOT NULL,
  `created_at` date DEFAULT NULL,
  `updated_at` date DEFAULT NULL,
  `ads_code` char(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `domains`
--

INSERT INTO `domains` (`id`, `domainname`, `created_at`, `updated_at`, `ads_code`) VALUES
(1, 'hi.com/oops1122', '2022-10-05', '2022-10-22', '1666392926_Frame 1295 (1).png'),
(2, 'helloLALA.com', '2022-10-22', '2022-10-22', NULL),
(3, 'hi.com/lalaa', '2022-10-22', '2022-10-22', NULL),
(4, 'hi.com/lali', '2022-10-22', '2022-10-22', NULL),
(5, 'hi.com/laal', '2022-10-22', '2022-10-22', NULL),
(8, 'helloLALA.com', '2022-10-22', '2022-10-22', NULL),
(9, 'helloLALA.com', '2022-10-22', '2022-10-22', 'byo.py'),
(10, 'hi.com/oops', '2022-10-22', '2022-10-22', '1666392759_Frame 1295 (1).png');

-- --------------------------------------------------------

--
-- Table structure for table `files`
--

CREATE TABLE `files` (
  `id` int(11) NOT NULL,
  `file` varchar(256) NOT NULL,
  `commission` float NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `files`
--

INSERT INTO `files` (`id`, `file`, `commission`, `create_at`, `updated_at`) VALUES
(3, '1666297347_demoData.csv', 20, '2022-10-24 20:04:53', '2022-10-24 20:04:53');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` int(11) NOT NULL,
  `Domain_name` varchar(256) NOT NULL,
  `Ad_Requests` float NOT NULL,
  `Ad_Impressions` float NOT NULL,
  `Revenue` float NOT NULL,
  `commission` float NOT NULL,
  `create_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `Domain_name`, `Ad_Requests`, `Ad_Impressions`, `Revenue`, `commission`, `create_at`, `updated_at`) VALUES
(71, 'domain-1.com', 0, 0, 0, 20, '2022-10-24 20:04:37', '2022-10-24 20:04:37'),
(72, 'domain-2.com', 2, 2, 0, 20, '2022-10-24 20:04:37', '2022-10-24 20:04:37'),
(73, 'domain-3.com', 11316, 5347, 0.433, 20, '2022-10-24 20:04:37', '2022-10-24 20:04:37'),
(74, 'domain-4.com', 0, 2129, 0.217, 20, '2022-10-24 20:04:37', '2022-10-24 20:04:37'),
(75, 'domain-5.com', 0, 0, 0, 20, '2022-10-24 20:04:37', '2022-10-24 20:04:37'),
(76, 'domain-6.com', 3, 1, 0, 20, '2022-10-24 20:04:37', '2022-10-24 20:04:37'),
(77, 'domain-7.com', 83204, 63327, 4.85, 20, '2022-10-24 20:04:37', '2022-10-24 20:04:37'),
(78, 'domain-8.com', 0, 0, 0, 20, '2022-10-24 20:04:37', '2022-10-24 20:04:37'),
(79, 'domain-9.com', 47413, 35125, 3.111, 20, '2022-10-24 20:04:37', '2022-10-24 20:04:37'),
(80, 'domain-10.com', 289867, 103771, 23.073, 20, '2022-10-24 20:04:37', '2022-10-24 20:04:37'),
(81, 'domain-1.com', 0, 0, 0, 20, '2022-10-24 20:04:53', '2022-10-24 20:04:53'),
(82, 'domain-2.com', 2, 2, 0, 20, '2022-10-24 20:04:53', '2022-10-24 20:04:53'),
(83, 'domain-3.com', 11316, 5347, 0.433, 20, '2022-10-24 20:04:53', '2022-10-24 20:04:53'),
(84, 'domain-4.com', 0, 2129, 0.217, 20, '2022-10-24 20:04:53', '2022-10-24 20:04:53'),
(85, 'domain-5.com', 0, 0, 0, 20, '2022-10-24 20:04:53', '2022-10-24 20:04:53'),
(86, 'domain-6.com', 3, 1, 0, 20, '2022-10-24 20:04:53', '2022-10-24 20:04:53'),
(87, 'domain-7.com', 83204, 63327, 4.85, 20, '2022-10-24 20:04:53', '2022-10-24 20:04:53'),
(88, 'domain-8.com', 0, 0, 0, 20, '2022-10-24 20:04:53', '2022-10-24 20:04:53'),
(89, 'domain-9.com', 47413, 35125, 3.111, 20, '2022-10-24 20:04:53', '2022-10-24 20:04:53'),
(90, 'domain-10.com', 289867, 103771, 23.073, 20, '2022-10-24 20:04:53', '2022-10-24 20:04:53');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `type` varchar(180) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `first_name` varchar(180) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `last_name` varchar(180) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `photo` varchar(1000) NOT NULL,
  `email` varchar(180) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `enabled` tinyint(1) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL,
  `create_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `card_name` char(250) DEFAULT NULL,
  `card_number` char(250) DEFAULT NULL,
  `cvc` char(10) DEFAULT NULL,
  `expiry_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `type`, `first_name`, `last_name`, `photo`, `email`, `enabled`, `password`, `create_at`, `updated_at`, `card_name`, `card_number`, `cvc`, `expiry_date`) VALUES
(1, 'admin', 'first', 'last', '', 'admin@admin.com', 1, '38e24912471365aed567e675b107e875', NULL, NULL, NULL, NULL, NULL, NULL),
(2, 'user', 'test', 'user', '', 'user@admin.com', 1, '38e24912471365aed567e675b107e875', '2022-10-15 16:56:57', '2022-10-15 16:56:57', NULL, NULL, NULL, NULL),
(3, 'user', 'test', 'user', '1665861696_WhatsApp Image 2022-10-09 at 5.12.44 PM.jpeg', 'myuser@gmail.com', 1, '38e24912471365aed567e675b107e875', '2022-10-15 19:21:36', '2022-10-15 19:21:36', NULL, NULL, NULL, NULL),
(7, 'user', 'hihifs', 'lalaglalag', '1666418867_maxresdefault.jpg', 'you@mail.com', 1, '7fd981f1b151ced84220ed32eaa7a320', '2022-10-22 05:38:45', '2022-10-22 06:07:47', 'master', '65456532124555', '325', '2022-10-15');

-- --------------------------------------------------------

--
-- Table structure for table `users_domains`
--

CREATE TABLE `users_domains` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `domain_id` int(11) NOT NULL,
  `created_at` date DEFAULT NULL,
  `updated_at` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users_domains`
--

INSERT INTO `users_domains` (`id`, `user_id`, `domain_id`, `created_at`, `updated_at`) VALUES
(2, 1, 3, '2022-10-22', '2022-10-22'),
(3, 2, 3, '2022-10-22', '2022-10-22'),
(4, 2, 4, '2022-10-22', '2022-10-22'),
(5, 2, 5, '2022-10-22', '2022-10-22');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `domains`
--
ALTER TABLE `domains`
  ADD UNIQUE KEY `id` (`id`);

--
-- Indexes for table `files`
--
ALTER TABLE `files`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users_domains`
--
ALTER TABLE `users_domains`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `domains`
--
ALTER TABLE `domains`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `files`
--
ALTER TABLE `files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users_domains`
--
ALTER TABLE `users_domains`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
