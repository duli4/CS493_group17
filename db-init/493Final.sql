-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2019-06-06 06:29:22
-- 服务器版本： 10.1.26-MariaDB
-- PHP Version: 7.1.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `493Final`
--

-- --------------------------------------------------------

--
-- 表的结构 `assignments`
--

CREATE TABLE IF NOT EXISTS `assignments` (
  `id` int(11) NOT NULL,
  `courseid` int(11) NOT NULL,
  `title` text NOT NULL,
  `points` int(11) NOT NULL,
  `due` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `courses`
--
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `subject` text NOT NULL,
  `number` int(11) NOT NULL,
  `title` text NOT NULL,
  `term` text NOT NULL,
  `instructor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `courses` WRITE;
INSERT INTO `courses` VALUES
  (0,'CS',493,'Cloud Application Development','sp19',1),
  (1,'CS',492,'Mobile Application Development','sp19',1),
  (2,'CS',290,'Web Development','sp19',1)
  ;
UNLOCK TABLES;
-- --------------------------------------------------------

--
-- 表的结构 `submissions`
--

CREATE TABLE IF NOT EXISTS `submissions` (
  `id` int(11) NOT NULL,
  `assignmentid` int(11) NOT NULL,
  `studentid` int(11) NOT NULL,
  `timestamp` datetime NOT NULL,
  `file` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- 表的结构 `users`
--
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
  `role` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;


LOCK TABLES `users` WRITE;
INSERT INTO `users` VALUES
  (0,'Rob Hess','robhess@oregonstate.edu','$2a$08$Og1tNzAWbCNG1Lmsalo1guYRYsvNzLzz6VSd0ksXA50BmSaLtjYAC','instructor'),
  (1,'Zhuohong Gu','guz@oregonstate.edu','$2a$08$6xcP/PS/TRG.b6dBSyJ.M.VayiXST5L/vJd3PLmYVRJK9a27ZgWCa','admin'),
  (2,'Fetanson','fetanson@oregonstate.edu','$2a$08$Dvmcm3ur4AhttHj8VJnJVuUdTzXm8yDHdOPlATAS/tudxP7HwMkCm','student')
  ;
UNLOCK TABLES;
--
-- Indexes for dumped tables
--

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--


--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `users`
--

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
