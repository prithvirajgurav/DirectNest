-- ==============================================================================
-- DirectNest - Initial Seed Data (Development & Demo)
-- Password for all seed users is: password123
-- BCrypt Hash: $2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW
-- ==============================================================================

USE `directnest`;

-- -----------------------------------------------------------------------------
-- 1. Insert Initial Amenities
-- -----------------------------------------------------------------------------
INSERT INTO `amenities` (`id`, `name`, `icon`, `category`) VALUES
(1, 'Covered Parking', 'FiTruck', 'Convenience'),
(2, 'Lift / Elevator', 'FiArrowUp', 'Building'),
(3, '24x7 Security', 'FiShield', 'Security'),
(4, 'Swimming Pool', 'FiDroplet', 'Lifestyle'),
(5, 'Gymnasium', 'FiActivity', 'Fitness'),
(6, 'Landscaped Garden', 'FiFeather', 'Environment'),
(7, 'Club House', 'FiHome', 'Community'),
(8, 'CCTV Surveillance', 'FiVideo', 'Security'),
(9, 'Power Backup', 'FiZap', 'Utilities'),
(10, 'Children Play Area', 'FiSmile', 'Family'),
(11, 'Visitor Parking', 'FiCheckSquare', 'Convenience'),
(12, '24x7 Water Supply', 'FiDroplet', 'Utilities'),
(13, 'Intercom Facility', 'FiPhoneCall', 'Communication'),
(14, 'Fire Fighting System', 'FiAlertTriangle', 'Safety'),
(15, 'Rain Water Harvesting', 'FiCloudRain', 'Environment')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- -----------------------------------------------------------------------------
-- 2. Insert Initial Users
-- -----------------------------------------------------------------------------
INSERT INTO `users` (`id`, `email`, `password`, `full_name`, `phone`, `role`, `is_active`) VALUES
(1, 'admin@directnest.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'System Administrator', '+91 9876543210', 'ADMIN', TRUE),
(2, 'builder1@directnest.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'Rajesh Patil (Skyline Developers)', '+91 9822012345', 'BUILDER', TRUE),
(3, 'builder2@directnest.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'Amit Deshmukh (Greenfield Builders)', '+91 9823054321', 'BUILDER', TRUE),
(4, 'owner1@directnest.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'Suresh Kulkarni', '+91 9845011223', 'BUILDER', TRUE),
(5, 'customer1@directnest.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'Pooja Sharma', '+91 9765432109', 'CUSTOMER', TRUE),
(6, 'customer2@directnest.com', '$2a$10$GRLdNijSQMUvl/au9ofL.eDwmoohzzS7.rmNSJZ.0FxO/BTk76klW', 'Rahul Verma', '+91 9876501234', 'CUSTOMER', TRUE)
ON DUPLICATE KEY UPDATE `email` = VALUES(`email`);

-- -----------------------------------------------------------------------------
-- 3. Insert Provider Profiles
-- -----------------------------------------------------------------------------
INSERT INTO `provider_profiles` (`id`, `user_id`, `company_name`, `provider_type`, `description`, `experience_years`, `operating_locations`, `profile_image`, `verification_status`) VALUES
(1, 2, 'Skyline Developers & Infrastructure', 'BUILDER', 'Skyline Developers is a premier real-estate development firm with 15+ years of delivering luxury residential and commercial landmarks across Maharashtra.', 15, 'Kolhapur, Pune, Mumbai', NULL, 'VERIFIED'),
(2, 3, 'Greenfield Constructions', 'BUILDER', 'Greenfield Constructions focuses on sustainable, modern eco-friendly housing projects with world-class amenities and on-time delivery.', 8, 'Kolhapur, Sangli, Satara', NULL, 'VERIFIED'),
(3, 4, 'Suresh Kulkarni (Individual Owner)', 'OWNER', 'Direct property owner offering well-maintained residential apartments and plots in prime localities without any brokerage fees.', 5, 'Kolhapur', NULL, 'VERIFIED')
ON DUPLICATE KEY UPDATE `company_name` = VALUES(`company_name`);

-- -----------------------------------------------------------------------------
-- 4. Insert Properties
-- -----------------------------------------------------------------------------
INSERT INTO `properties` (`id`, `provider_id`, `title`, `description`, `property_type`, `price`, `is_negotiable`, `city`, `locality`, `address`, `pincode`, `latitude`, `longitude`, `built_up_area`, `carpet_area`, `bedrooms`, `bathrooms`, `balconies`, `floor`, `total_floors`, `furnishing_status`, `possession_status`, `construction_status`, `parking_spaces`, `property_age`, `status`) VALUES
(1, 1, 'Luxury 3BHK Skyline Royal Palms', 'Experience high-class living in this spacious 3BHK apartment offering panoramic city views, premium Italian marble flooring, and modular kitchen fittings.', '3BHK', 8500000.00, TRUE, 'Kolhapur', 'Tarabai Park', 'Plot 45, Royal Palms Avenue, Near Circuit House', '416003', 16.7050, 74.2433, 1650.0, 1380.0, 3, 3, 2, 5, 12, 'SEMI_FURNISHED', 'READY_TO_MOVE', 'COMPLETED', 2, 1, 'APPROVED'),
(2, 1, 'Modern 2BHK Skyline Heights', 'Well-ventilated 2BHK apartment in the heart of Nagala Park. Close to leading schools, hospitals, and shopping centers. 100% Vastu compliant.', '2BHK', 5200000.00, FALSE, 'Kolhapur', 'Nagala Park', 'Skyline Heights, Behind Collector Office', '416003', 16.7112, 74.2389, 1100.0, 920.0, 2, 2, 1, 3, 8, 'UNFURNISHED', 'READY_TO_MOVE', 'COMPLETED', 1, 0, 'APPROVED'),
(3, 2, 'Eco-friendly 2BHK Green Nest', 'Nature-inspired 2BHK flat featuring solar water heating, energy-efficient fixtures, lush green gardens, and dedicated children play zone.', '2BHK', 4500000.00, TRUE, 'Kolhapur', 'Rajarampuri', 'Lane 9, Green Nest Enclave, Rajarampuri', '416008', 16.6920, 74.2480, 1050.0, 880.0, 2, 2, 2, 2, 6, 'SEMI_FURNISHED', 'UNDER_CONSTRUCTION', 'UNDER_CONSTRUCTION', 1, 0, 'APPROVED'),
(4, 2, 'Spacious 4BHK Greenfield Villa', 'Exclusive standalone 4BHK luxury villa with private garden, terrace gazebo, and two covered car parking bays. High-end gated community.', '4BHK', 14500000.00, TRUE, 'Kolhapur', 'Ruikar Colony', 'Bungalow 12, Greenfield Serenity, Ruikar Colony', '416005', 16.7080, 74.2520, 3200.0, 2700.0, 4, 4, 3, 1, 2, 'FULLY_FURNISHED', 'READY_TO_MOVE', 'COMPLETED', 2, 2, 'APPROVED'),
(5, 3, 'Cozy 1BHK Flat Near Rankala Lake', 'Direct from owner: peaceful 1BHK apartment with scenic Rankala lake view. Ideal for small families or working professionals. Low maintenance.', '1BHK', 2800000.00, FALSE, 'Kolhapur', 'Rankala', 'Shree Ram Residency, Near Rankala Chowpatty', '416012', 16.6850, 74.2150, 620.0, 510.0, 1, 1, 1, 2, 4, 'UNFURNISHED', 'READY_TO_MOVE', 'COMPLETED', 1, 3, 'APPROVED'),
(6, 1, 'Premium 3BHK Skyline Grandeur (Draft Demo)', 'Ultra-luxury penthouse currently in draft stage for developer review before public submission.', '3BHK', 11000000.00, TRUE, 'Kolhapur', 'Tarabai Park', 'Skyline Grandeur, Tarabai Park', '416003', 16.7060, 74.2440, 2100.0, 1800.0, 3, 3, 3, 10, 10, 'FULLY_FURNISHED', 'UNDER_CONSTRUCTION', 'UNDER_CONSTRUCTION', 2, 0, 'DRAFT')
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);

-- -----------------------------------------------------------------------------
-- 5. Insert Property Amenities Mappings
-- -----------------------------------------------------------------------------
INSERT INTO `property_amenities` (`property_id`, `amenity_id`) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 11), (1, 12),
(2, 1), (2, 2), (2, 3), (2, 8), (2, 9), (2, 11), (2, 12),
(3, 1), (3, 2), (3, 3), (3, 6), (3, 8), (3, 9), (3, 10), (3, 12), (3, 15),
(4, 1), (4, 3), (4, 4), (4, 5), (4, 6), (4, 7), (4, 8), (4, 9), (4, 12),
(5, 1), (5, 3), (5, 9), (5, 12)
ON DUPLICATE KEY UPDATE `property_id` = VALUES(`property_id`);

-- -----------------------------------------------------------------------------
-- 6. Insert Sample Enquiries
-- -----------------------------------------------------------------------------
INSERT INTO `enquiries` (`id`, `property_id`, `customer_id`, `message`, `phone`, `status`, `response`, `responded_at`) VALUES
(1, 1, 5, 'Hi, I am interested in this 3BHK at Tarabai Park. Is the price slightly negotiable? Can we arrange a call this weekend?', '+91 9765432109', 'CONTACTED', 'Hello Pooja, yes we can discuss the pricing. I will call you on Saturday morning.', NOW()),
(2, 3, 6, 'What is the expected possession date for this 2BHK flat in Rajarampuri?', '+91 9876501234', 'NEW', NULL, NULL)
ON DUPLICATE KEY UPDATE `message` = VALUES(`message`);

-- -----------------------------------------------------------------------------
-- 7. Insert Sample Site Visits
-- -----------------------------------------------------------------------------
INSERT INTO `site_visits` (`id`, `property_id`, `customer_id`, `preferred_date`, `preferred_time`, `message`, `status`, `response_note`) VALUES
(1, 1, 5, '2026-09-15', '11:00 AM', 'Would like to visit the sample flat along with my family.', 'ACCEPTED', 'We look forward to meeting you at our site office on 15th Sept at 11 AM.'),
(2, 4, 6, '2026-09-18', '04:00 PM', 'Interested in inspecting the 4BHK Villa layout and parking space.', 'REQUESTED', NULL)
ON DUPLICATE KEY UPDATE `preferred_time` = VALUES(`preferred_time`);

-- -----------------------------------------------------------------------------
-- 8. Insert Sample Favorites
-- -----------------------------------------------------------------------------
INSERT INTO `favorites` (`id`, `user_id`, `property_id`) VALUES
(1, 5, 1),
(2, 5, 3),
(3, 6, 4)
ON DUPLICATE KEY UPDATE `user_id` = VALUES(`user_id`);

-- -----------------------------------------------------------------------------
-- 9. Insert Sample Reviews
-- -----------------------------------------------------------------------------
INSERT INTO `reviews` (`id`, `user_id`, `property_id`, `provider_id`, `rating`, `comment`) VALUES
(1, 5, 1, 1, 5, 'Excellent build quality, clear documentation, and completely direct dealing with Skyline team. Very smooth experience!'),
(2, 6, 4, 2, 5, 'The Greenfield villa project is top notch. Transparent terms and great customer interaction.')
ON DUPLICATE KEY UPDATE `comment` = VALUES(`comment`);

-- -----------------------------------------------------------------------------
-- 10. Insert Sample Notifications
-- -----------------------------------------------------------------------------
INSERT INTO `notifications` (`id`, `user_id`, `title`, `message`, `type`, `reference_id`, `is_read`) VALUES
(1, 2, 'Builder Profile Verified', 'Congratulations! Your builder profile for Skyline Developers has been verified by the DirectNest administration.', 'BUILDER_VERIFIED', 1, TRUE),
(2, 2, 'Property Approved', 'Your listing "Luxury 3BHK Skyline Royal Palms" has been approved and is now live for public search.', 'PROPERTY_APPROVED', 1, TRUE),
(3, 2, 'New Site Visit Request', 'Pooja Sharma requested a site visit for "Luxury 3BHK Skyline Royal Palms" on 15th Sept.', 'SITE_VISIT_REQUEST', 1, FALSE),
(4, 5, 'Site Visit Accepted', 'Skyline Developers accepted your site visit request for 15th Sept at 11:00 AM.', 'SITE_VISIT_STATUS', 1, FALSE)
ON DUPLICATE KEY UPDATE `title` = VALUES(`title`);
