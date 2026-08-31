-- AgriConnect Production MySQL Database Schema

CREATE DATABASE IF NOT EXISTS `agriconnect` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `agriconnect`;

-- Users Table
CREATE TABLE IF NOT EXISTS `users` (
  `id` VARCHAR(50) NOT NULL,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('seller', 'buyer') NOT NULL,
  `full_name` VARCHAR(100) DEFAULT NULL,
  `location` VARCHAR(150) DEFAULT NULL,
  `payment_type` VARCHAR(50) DEFAULT NULL,
  `payment_detail` VARCHAR(100) DEFAULT NULL,
  `buyer_type` VARCHAR(50) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products Table
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(50) NOT NULL,
  `seller_id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `category` VARCHAR(50) DEFAULT 'Vegetables',
  `quantity` DECIMAL(10,2) NOT NULL,
  `unit` VARCHAR(20) DEFAULT 'kg',
  `price` DECIMAL(10,2) NOT NULL,
  `image` VARCHAR(255) DEFAULT NULL,
  `location` VARCHAR(150) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Requests Table
CREATE TABLE IF NOT EXISTS `requests` (
  `id` VARCHAR(50) NOT NULL,
  `buyer_id` VARCHAR(50) NOT NULL,
  `seller_id` VARCHAR(50) NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `price_per_unit` DECIMAL(10,2) NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `status` ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING',
  `request_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contracts Table
CREATE TABLE IF NOT EXISTS `contracts` (
  `id` VARCHAR(50) NOT NULL,
  `request_id` VARCHAR(50) NOT NULL UNIQUE,
  `buyer_id` VARCHAR(50) NOT NULL,
  `seller_id` VARCHAR(50) NOT NULL,
  `product_name` VARCHAR(100) NOT NULL,
  `quantity` DECIMAL(10,2) NOT NULL,
  `unit` VARCHAR(20) DEFAULT 'kg',
  `price_per_unit` DECIMAL(10,2) NOT NULL,
  `total_price` DECIMAL(10,2) NOT NULL,
  `status` ENUM('ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'ACTIVE',
  `terms` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  FOREIGN KEY (`request_id`) REFERENCES `requests` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed Sample Data
INSERT IGNORE INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `full_name`, `location`) VALUES
('usr_seller_1', 'farmer_john', 'john@contrafarm.com', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe10tS/D77O9zVn/a9L4qX10tS', 'seller', 'John Doe (Green Valley Farm)', 'Kolhapur, Maharashtra'),
('usr_buyer_1', 'buyer_sarah', 'sarah@freshmart.com', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe10tS/D77O9zVn/a9L4qX10tS', 'buyer', 'Sarah Jenkins (FreshMart Retail)', 'Pune, Maharashtra');

INSERT IGNORE INTO `products` (`id`, `seller_id`, `name`, `category`, `quantity`, `unit`, `price`, `image`, `location`, `description`) VALUES
('prod_1', 'usr_seller_1', 'Fresh Organic Tomatoes', 'Vegetables', 500.00, 'kg', 35.00, 'vegetable_section_buyer/tomato.jpg', 'Kolhapur', 'Farm fresh red ripe organic tomatoes harvested daily.'),
('prod_2', 'usr_seller_1', 'Fresh Farm Carrots', 'Vegetables', 350.00, 'kg', 45.00, 'vegetable_section_buyer/carrot.jpg', 'Kolhapur', 'Crisp sweet organic orange carrots.'),
('prod_3', 'usr_seller_1', 'Green Cucumbers', 'Vegetables', 400.00, 'kg', 25.00, 'vegetable_section_buyer/cucumber.jpg', 'Kolhapur', 'Hydrating fresh cucumbers ideal for salads and wholesale.');
