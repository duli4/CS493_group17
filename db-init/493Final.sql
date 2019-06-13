-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- 主機: localhost
-- 產生時間： 2019 年 06 月 13 日 07:47
-- 伺服器版本: 10.1.26-MariaDB
-- PHP 版本： 7.1.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `493Final`
--

-- --------------------------------------------------------

--
-- 資料表結構 `assignments`
--

CREATE TABLE IF NOT EXISTS `assignments` (
  `id` int(11) NOT NULL,
  `courseid` int(11) NOT NULL,
  `title` text NOT NULL,
  `points` int(11) NOT NULL,
  `due` datetime NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `assignments`
--

INSERT INTO `assignments` (`id`, `courseid`, `title`, `points`, `due`) VALUES
(1, 2, 'Install linux on your computer', 40, '2019-06-07 00:00:00'),
(2, 2, 'Keiyh', 100, '2019-06-07 00:00:00');

-- --------------------------------------------------------

--
-- 資料表結構 `courses`
--
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `subject` text NOT NULL,
  `number` int(11) NOT NULL,
  `title` text NOT NULL,
  `term` text NOT NULL,
  `instructor` int(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- 資料表的匯出資料 `courses`
--

-- --------------------------------------------------------

--
-- 資料表結構 `enrollment`
--

CREATE TABLE IF NOT EXISTS `enrollment` (
  `id` int(11) NOT NULL,
  `courseid` int(11) NOT NULL,
  `studentid` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `enrollment` VALUES
  (0, 1, 2);

INSERT INTO `courses` VALUES
  (0,'CS',493,'Cloud Application Development','sp19',1),
  (1,'CS',492,'Mobile Application Development','sp19',1),
  (2,'CS',290,'Web Development','sp19',1),
  (3, 'CS', 150, 'CPP Program', 'SP19', 2),
  (4, 'CS', 171, 'Python', 'SP19', 2),
  (5, 'MTH', 271, 'Matrix Maths', 'SP19', 2),
  (6, 'ECE', 271, 'Digital Ocean', 'Su18', 3),
  (7, 'ECE', 291, 'CuteAnankke', 'Su18', 3);

-- --------------------------------------------------------

--
-- 資料表結構 `submissions`
--

CREATE TABLE IF NOT EXISTS `submissions` (
  `id` int(11) NOT NULL,
  `assignmentid` int(11) NOT NULL,
  `studentid` int(11) NOT NULL,
  `timestamp` datetime NOT NULL,
  `file` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



--
-- 資料表結構 `users`
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



INSERT INTO `users` VALUES
  (0,'Rob Hess','robhess@oregonstate.edu','$2a$08$Og1tNzAWbCNG1Lmsalo1guYRYsvNzLzz6VSd0ksXA50BmSaLtjYAC','instructor'),
  (1,'Zhuohong Gu','guz@oregonstate.edu','$2a$08$6xcP/PS/TRG.b6dBSyJ.M.VayiXST5L/vJd3PLmYVRJK9a27ZgWCa','admin'),
  (2,'Fetanson','fetanson@oregonstate.edu','$2a$08$Dvmcm3ur4AhttHj8VJnJVuUdTzXm8yDHdOPlATAS/tudxP7HwMkCm','student')
  ;
--
-- 已匯出資料表的索引
--

--
-- 資料表索引 `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `enrollment`
--
ALTER TABLE `enrollment`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `submissions`
--
ALTER TABLE `submissions`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `users`
--


--
-- 在匯出的資料表使用 AUTO_INCREMENT
--

--
-- 使用資料表 AUTO_INCREMENT `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=3;
--
-- 使用資料表 AUTO_INCREMENT `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=6;
--
-- 使用資料表 AUTO_INCREMENT `enrollment`
--
ALTER TABLE `enrollment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用資料表 AUTO_INCREMENT `submissions`
--
ALTER TABLE `submissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- 使用資料表 AUTO_INCREMENT `users`
--

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
