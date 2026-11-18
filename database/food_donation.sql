-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 26, 2026 at 02:40 PM
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
-- Database: `food_donation`
--

-- --------------------------------------------------------

--
-- Table structure for table `donations`
--

CREATE TABLE `donations` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `volunteer_id` int(11) DEFAULT NULL,
  `food_type` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `quantity` varchar(100) NOT NULL,
  `expiry` datetime NOT NULL,
  `freshness` varchar(50) NOT NULL,
  `location` text NOT NULL,
  `map_link` text DEFAULT NULL,
  `availability_from` datetime NOT NULL,
  `availability_to` datetime NOT NULL,
  `status` varchar(20) DEFAULT 'available',
  `claimed_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `donations`
--

INSERT INTO `donations` (`id`, `user_id`, `volunteer_id`, `food_type`, `phone`, `quantity`, `expiry`, `freshness`, `location`, `map_link`, `availability_from`, `availability_to`, `status`, `claimed_by`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, 'Vegetable Biryani - 20 Packs', NULL, '15 KG', '2026-01-27 10:00:00', 'Freshly Cooked', 'https://www.google.com/maps?q=$9.2644,76.5133', 'https://www.google.com/maps?q=$9.2644,76.5133', '2026-01-26 16:00:00', '2026-01-26 21:00:00', 'claimed', 2, '2026-01-26 10:16:59', '2026-01-26 11:27:36'),
(2, 1, NULL, 'Assorted Sandwiches', NULL, '30 Units', '2026-01-26 19:00:00', 'Packaged', 'https://www.google.com/maps?q=$9.2345,76.5432', 'https://www.google.com/maps?q=$9.2345,76.5432', '2026-01-26 15:00:00', '2026-01-26 18:30:00', 'claimed', 2, '2026-01-26 10:16:59', '2026-01-26 11:27:36'),
(3, 1, NULL, 'Bread and Jam Crates', NULL, '5 Boxes', '2026-01-28 12:00:00', 'Packaged', 'https://www.google.com/maps?q=$9.2121,76.5987', 'https://www.google.com/maps?q=$9.2121,76.5987', '2026-01-26 10:00:00', '2026-01-27 10:00:00', 'claimed', 2, '2026-01-26 10:16:59', '2026-01-26 11:27:36'),
(4, 1, NULL, 'Steamed Rice & Dal', NULL, '40 KG', '2026-01-27 02:00:00', 'Freshly Cooked', 'https://www.google.com/maps?q=$9.2888,76.5222', 'https://www.google.com/maps?q=$9.2888,76.5222', '2026-01-26 17:00:00', '2026-01-26 23:00:00', 'claimed', 2, '2026-01-26 10:16:59', '2026-01-26 11:27:36'),
(5, 1, NULL, 'Milk Packets & Curd', NULL, '12 Liters', '2026-01-27 08:00:00', 'Packaged', 'https://www.google.com/maps?q=$9.2555,76.5000', 'https://www.google.com/maps?q=$9.2555,76.5000', '2026-01-26 14:00:00', '2026-01-26 20:00:00', 'claimed', 3, '2026-01-26 10:16:59', '2026-01-26 11:27:36'),
(6, 6, 3, 'test', NULL, 'set', '2026-01-26 12:02:00', 'Freshly Cooked', 'https://www.google.com/maps?q=9.250039308262412,76.49256706237794', 'https://www.google.com/maps?q=9.250039308262412,76.49256706237794', '2026-01-26 21:03:00', '2026-01-27 12:03:00', 'completed', NULL, '2026-01-26 10:21:35', '2026-01-26 11:28:55'),
(7, 1, 3, 'DELIVERY: asd to ngo1', '24y412123', '32', '0000-00-00 00:00:00', '', 'https://www.google.com/maps?q=9.249717258657055,76.52750389459001', NULL, '0000-00-00 00:00:00', '0000-00-00 00:00:00', 'completed', NULL, '2026-01-26 11:35:58', '2026-01-26 11:37:16'),
(8, 6, 3, '32', '5464649323', '213', '2026-01-27 03:02:00', 'Freshly Cooked', 'https://www.google.com/maps?q=9.237840199033508,76.51299476623537', 'https://www.google.com/maps?q=9.237840199033508,76.51299476623537', '2026-01-26 03:02:00', '2026-01-27 21:03:00', 'completed', NULL, '2026-01-26 11:41:21', '2026-01-26 11:42:45'),
(9, 6, NULL, 'Chapati and Curry Veg', '753235646523', '20 Nos', '2026-01-27 11:01:00', 'Freshly Cooked', 'https://www.google.com/maps?q=9.273928004712532,76.51754379272462', 'https://www.google.com/maps?q=9.273928004712532,76.51754379272462', '2026-01-26 23:00:00', '2026-01-27 00:00:00', 'available', NULL, '2026-01-26 13:02:13', '2026-01-26 13:02:13');

-- --------------------------------------------------------

--
-- Table structure for table `requests`
--

CREATE TABLE `requests` (
  `id` int(11) NOT NULL,
  `ngo_id` int(11) NOT NULL,
  `item_needed` varchar(255) NOT NULL,
  `quantity_needed` varchar(100) NOT NULL,
  `map_link` text DEFAULT NULL,
  `contact_number` varchar(20) NOT NULL,
  `urgency` enum('Low','Medium','High','Critical') DEFAULT 'Medium',
  `status` enum('open','fulfilled') DEFAULT 'open',
  `fulfilled_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `requests`
--

INSERT INTO `requests` (`id`, `ngo_id`, `item_needed`, `quantity_needed`, `map_link`, `contact_number`, `urgency`, `status`, `fulfilled_by`, `created_at`, `updated_at`) VALUES
(1, 2, 'test', '3', 'https://www.google.com/maps?q=9.249717258657055,76.52750389459001', '', 'Medium', 'fulfilled', 6, '2026-01-26 10:36:57', '2026-01-26 10:52:28'),
(2, 2, 'test', '213', 'https://www.google.com/maps?q=9.249717258657055,76.52750389459001', '46546546463546463465', 'Medium', 'fulfilled', 6, '2026-01-26 11:23:22', '2026-01-26 11:24:24'),
(3, 2, 'ets', '45', '', 'erwwer', 'Medium', 'fulfilled', 1, '2026-01-26 11:30:56', '2026-01-26 11:31:31'),
(4, 2, 'asd', '32', 'https://www.google.com/maps?q=9.249717258657055,76.52750389459001', '24y412123', 'Low', 'fulfilled', 1, '2026-01-26 11:35:38', '2026-01-26 11:35:58');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `role` enum('donor','ngo','volunteer','admin') NOT NULL,
  `location` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `role`, `location`, `created_at`) VALUES
(1, 'donor1', 'password123', 'donor1@example.com', 'donor', 'New York', '2026-01-26 08:49:47'),
(2, 'ngo1', 'password123', 'ngo1@example.com', 'ngo', 'Los Angeles', '2026-01-26 08:49:47'),
(3, 'volunteer1', 'password123', 'volunteer1@example.com', 'volunteer', 'Chicago', '2026-01-26 08:49:47'),
(5, 'master_admin', 'admin123', 'admin@foodbridge.com', 'admin', 'Headquarters', '2026-01-26 09:04:39'),
(6, 'vaish123', 'sergioramos4', 'vaishnavvfisc@gmail.com', 'donor', 'Kollam', '2026-01-26 09:12:36');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `donations`
--
ALTER TABLE `donations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `claimed_by` (`claimed_by`);

--
-- Indexes for table `requests`
--
ALTER TABLE `requests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ngo_id` (`ngo_id`),
  ADD KEY `fulfilled_by` (`fulfilled_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `donations`
--
ALTER TABLE `donations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `donations`
--
ALTER TABLE `donations`
  ADD CONSTRAINT `donations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `donations_ibfk_2` FOREIGN KEY (`claimed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `requests`
--
ALTER TABLE `requests`
  ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`ngo_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `requests_ibfk_2` FOREIGN KEY (`fulfilled_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
