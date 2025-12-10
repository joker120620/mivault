CREATE DATABASE IF NOT EXISTS db_myvault;
USE db_myvault;

-- ============================
--  TABLE: tbl_users
-- ============================
CREATE TABLE `tbl_users` (
  `id_user` int(11) NOT NULL AUTO_INCREMENT,
  `name_user` varchar(100) DEFAULT NULL,
  `email_user` varchar(150) DEFAULT NULL,
  `password_user` varchar(255) DEFAULT NULL,
  `created_at_user` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_user`),
  UNIQUE KEY `name_user_unique` (`name_user`),
  UNIQUE KEY `email_user_unique` (`email_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================
--  TABLE: tbl_documents
-- ============================
CREATE TABLE `tbl_documents` (
  `id_document` int(11) NOT NULL AUTO_INCREMENT,
  `user_id_document` int(11) NOT NULL,
  `file_name_document` varchar(255) NOT NULL,
  `mime_type_document` varchar(100) NOT NULL,
  `file_size_document` bigint(20) NOT NULL,
  `file_path_document` varchar(500) NOT NULL,
  `data_document` longblob DEFAULT NULL,
  `status_document` enum('public','private') DEFAULT 'private',
  `created_at_document` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_document`),
  KEY `tbl_documents_ibfk_1` (`user_id_document`),
  CONSTRAINT `tbl_documents_ibfk_1` FOREIGN KEY (`user_id_document`)
    REFERENCES `tbl_users` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================
--  TABLE: tbl_images
-- ============================
CREATE TABLE `tbl_images` (
  `id_image` int(11) NOT NULL AUTO_INCREMENT,
  `user_id_image` int(11) NOT NULL,
  `file_name_image` varchar(255) NOT NULL,
  `mime_type_image` varchar(100) NOT NULL,
  `file_size_image` bigint(20) NOT NULL,
  `file_path_image` varchar(500) NOT NULL,
  `data_image` longblob DEFAULT NULL,
  `status_image` enum('public','private') DEFAULT 'private',
  `created_at_image` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_image`),
  KEY `tbl_images_ibfk_1` (`user_id_image`),
  CONSTRAINT `tbl_images_ibfk_1` FOREIGN KEY (`user_id_image`)
    REFERENCES `tbl_users` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================
--  TABLE: tbl_videos
-- ============================
CREATE TABLE `tbl_videos` (
  `id_video` int(11) NOT NULL AUTO_INCREMENT,
  `user_id_video` int(11) NOT NULL,
  `file_name_video` varchar(255) NOT NULL,
  `mime_type_video` varchar(100) NOT NULL,
  `file_size_video` bigint(20) NOT NULL,
  `file_path_video` varchar(500) NOT NULL,
  `data_video` longblob DEFAULT NULL,
  `thumbnail_path_video` varchar(500) DEFAULT NULL,
  `duration_video` int(11) DEFAULT NULL,
  `status_video` enum('public','private') DEFAULT 'private',
  `created_at_video` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id_video`),
  KEY `tbl_videos_ibfk_1` (`user_id_video`),
  CONSTRAINT `tbl_videos_ibfk_1` FOREIGN KEY (`user_id_video`)
    REFERENCES `tbl_users` (`id_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;