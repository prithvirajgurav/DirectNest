-- ==============================================================================
-- DirectNest - Database Schema Initialization (MySQL 8+)
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `directnest`
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

USE `directnest`;

-- Disable foreign key checks during setup
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. Users Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(20),
    `role` VARCHAR(50) NOT NULL,
    `is_active` BOOLEAN DEFAULT TRUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 2. Provider Profiles Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `provider_profiles` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL UNIQUE,
    `company_name` VARCHAR(255) NOT NULL,
    `provider_type` VARCHAR(50) NOT NULL,
    `description` TEXT,
    `experience_years` INT DEFAULT 0,
    `operating_locations` VARCHAR(500),
    `profile_image` VARCHAR(500),
    `verification_status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    `rejection_reason` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_provider_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_provider_status` (`verification_status`),
    INDEX `idx_provider_type` (`provider_type`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 3. Provider Verification Documents Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `provider_documents` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `provider_id` BIGINT NOT NULL,
    `document_type` VARCHAR(100) NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `verification_status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_provider_doc` FOREIGN KEY (`provider_id`) REFERENCES `provider_profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 4. Amenities Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `amenities` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `icon` VARCHAR(100),
    `category` VARCHAR(100),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 5. Properties Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `properties` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `provider_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT,
    `property_type` VARCHAR(50) NOT NULL,
    `price` DECIMAL(15, 2) NOT NULL,
    `is_negotiable` BOOLEAN DEFAULT FALSE,
    `city` VARCHAR(100) NOT NULL,
    `locality` VARCHAR(255) NOT NULL,
    `address` TEXT,
    `pincode` VARCHAR(10),
    `latitude` DOUBLE,
    `longitude` DOUBLE,
    `built_up_area` DOUBLE,
    `carpet_area` DOUBLE,
    `bedrooms` INT DEFAULT 0,
    `bathrooms` INT DEFAULT 0,
    `balconies` INT DEFAULT 0,
    `floor` INT,
    `total_floors` INT,
    `furnishing_status` VARCHAR(50),
    `possession_status` VARCHAR(50),
    `construction_status` VARCHAR(50),
    `parking_spaces` INT DEFAULT 0,
    `property_age` INT,
    `status` VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    `rejection_reason` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_property_provider` FOREIGN KEY (`provider_id`) REFERENCES `provider_profiles` (`id`) ON DELETE CASCADE,
    INDEX `idx_prop_city` (`city`),
    INDEX `idx_prop_status` (`status`),
    INDEX `idx_prop_type` (`property_type`),
    INDEX `idx_prop_price` (`price`),
    INDEX `idx_prop_bedrooms` (`bedrooms`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 6. Property Amenities Join Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `property_amenities` (
    `property_id` BIGINT NOT NULL,
    `amenity_id` BIGINT NOT NULL,
    PRIMARY KEY (`property_id`, `amenity_id`),
    CONSTRAINT `fk_pa_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_pa_amenity` FOREIGN KEY (`amenity_id`) REFERENCES `amenities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 7. Property Images Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `property_images` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `property_id` BIGINT NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `is_primary` BOOLEAN DEFAULT FALSE,
    `display_order` INT DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_img_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 8. Property Documents Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `property_documents` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `property_id` BIGINT NOT NULL,
    `document_type` VARCHAR(100) NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(500) NOT NULL,
    `verification_status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_doc_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 9. Favorites Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `favorites` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `property_id` BIGINT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `uq_user_property_favorite` UNIQUE (`user_id`, `property_id`),
    CONSTRAINT `fk_fav_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_fav_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 10. Enquiries Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `enquiries` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `property_id` BIGINT NOT NULL,
    `customer_id` BIGINT NOT NULL,
    `message` TEXT NOT NULL,
    `phone` VARCHAR(20),
    `status` VARCHAR(50) NOT NULL DEFAULT 'NEW',
    `response` TEXT,
    `responded_at` TIMESTAMP NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_enq_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_enq_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_enq_status` (`status`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 11. Site Visits Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_visits` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `property_id` BIGINT NOT NULL,
    `customer_id` BIGINT NOT NULL,
    `preferred_date` DATE NOT NULL,
    `preferred_time` VARCHAR(50) NOT NULL,
    `message` TEXT,
    `status` VARCHAR(50) NOT NULL DEFAULT 'REQUESTED',
    `response_note` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sv_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sv_customer` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_sv_status` (`status`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 12. Notifications Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `notifications` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `message` TEXT NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `reference_id` BIGINT,
    `is_read` BOOLEAN DEFAULT FALSE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notif_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    INDEX `idx_notif_user_read` (`user_id`, `is_read`)
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 13. Reviews Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `reviews` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `property_id` BIGINT,
    `provider_id` BIGINT,
    `rating` INT NOT NULL,
    `comment` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_rev_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_rev_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE SET NULL,
    CONSTRAINT `fk_rev_provider` FOREIGN KEY (`provider_id`) REFERENCES `provider_profiles` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- -----------------------------------------------------------------------------
-- 14. Property Reports Table
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `property_reports` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `user_id` BIGINT NOT NULL,
    `property_id` BIGINT NOT NULL,
    `reason` VARCHAR(100) NOT NULL,
    `description` TEXT NOT NULL,
    `status` VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    `admin_notes` TEXT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_rep_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_rep_property` FOREIGN KEY (`property_id`) REFERENCES `properties` (`id`) ON DELETE CASCADE,
    INDEX `idx_rep_status` (`status`)
) ENGINE=InnoDB;

SET FOREIGN_KEY_CHECKS = 1;
