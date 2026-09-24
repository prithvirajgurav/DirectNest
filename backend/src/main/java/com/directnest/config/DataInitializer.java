package com.directnest.config;

import com.directnest.amenity.entity.Amenity;
import com.directnest.amenity.repository.AmenityRepository;
import com.directnest.builder.entity.ProviderProfile;
import com.directnest.builder.entity.ProviderType;
import com.directnest.builder.entity.VerificationStatus;
import com.directnest.builder.repository.ProviderProfileRepository;
import com.directnest.property.entity.*;
import com.directnest.property.repository.PropertyImageRepository;
import com.directnest.property.repository.PropertyRepository;
import com.directnest.user.entity.Role;
import com.directnest.user.entity.User;
import com.directnest.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ProviderProfileRepository providerProfileRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final AmenityRepository amenityRepository;
    private final PasswordEncoder passwordEncoder;
    private final Environment environment;

    public DataInitializer(UserRepository userRepository,
                           ProviderProfileRepository providerProfileRepository,
                           PropertyRepository propertyRepository,
                           PropertyImageRepository propertyImageRepository,
                           AmenityRepository amenityRepository,
                           PasswordEncoder passwordEncoder,
                           Environment environment) {
        this.userRepository = userRepository;
        this.providerProfileRepository = providerProfileRepository;
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.amenityRepository = amenityRepository;
        this.passwordEncoder = passwordEncoder;
        this.environment = environment;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedAdminUser();
        Map<String, Amenity> amenityMap = seedAmenities();

        // Skip demo marketplace properties during unit/integration tests to prevent email collisions
        if (Arrays.asList(environment.getActiveProfiles()).contains("test")) {
            log.info("Running in 'test' profile - skipping demo property seeding");
            return;
        }

        Map<String, User> userMap = seedDemoUsersAndProviders();
        seedDemoProperties(userMap, amenityMap);
    }

    private void seedAdminUser() {
        if (!userRepository.existsByEmail("admin@directnest.com")) {
            User admin = User.builder()
                    .email("admin@directnest.com")
                    .password(passwordEncoder.encode("admin123"))
                    .fullName("DirectNest Administrator")
                    .phone("+91 9999999999")
                    .role(Role.ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("Default Admin user created: admin@directnest.com / admin123");
        }
    }

    private Map<String, Amenity> seedAmenities() {
        List<AmenityDef> defaultAmenities = List.of(
                new AmenityDef("Swimming Pool", "pool", "Recreation"),
                new AmenityDef("Gymnasium", "fitness", "Fitness"),
                new AmenityDef("24/7 Security", "shield", "Security"),
                new AmenityDef("Power Backup", "battery", "Utility"),
                new AmenityDef("Covered Parking", "car", "Convenience"),
                new AmenityDef("Clubhouse", "home", "Community"),
                new AmenityDef("Lift / Elevator", "layers", "Utility"),
                new AmenityDef("Children's Play Area", "smile", "Recreation"),
                new AmenityDef("Rainwater Harvesting", "droplet", "Eco"),
                new AmenityDef("Landscaped Garden", "sun", "Eco"),
                new AmenityDef("CCTV Surveillance", "video", "Security"),
                new AmenityDef("Intercom Facility", "phone", "Convenience")
        );

        Map<String, Amenity> map = new HashMap<>();
        for (AmenityDef def : defaultAmenities) {
            Amenity amenity = amenityRepository.findByName(def.name).orElseGet(() -> {
                Amenity newAmenity = Amenity.builder()
                        .name(def.name)
                        .icon(def.icon)
                        .category(def.category)
                        .build();
                return amenityRepository.save(newAmenity);
            });
            map.put(def.name, amenity);
        }
        log.info("Loaded {} amenities for system initialization", map.size());
        return map;
    }

    private Map<String, User> seedDemoUsersAndProviders() {
        Map<String, User> userMap = new HashMap<>();

        // 1. Builder: Skyline Developers (Kolhapur)
        User b1 = getOrCreateUser("builder1@directnest.com", "password123", "Rajesh Patil", "+91 9822012345", Role.BUILDER);
        getOrCreateProviderProfile(b1, ProviderType.BUILDER, "Skyline Developers & Infrastructure",
                "Premier real-estate development firm with 15+ years of delivering luxury residential and commercial landmarks across Maharashtra.",
                "E Ward, Station Road, Kolhapur", "Kolhapur", "Maharashtra", "416001", "27AAAAA0000A1Z5", 15, "https://skylinedevelopers.demo");
        userMap.put("builder1", b1);

        // 2. Builder: Greenfield Constructions (Kolhapur)
        User b2 = getOrCreateUser("builder2@directnest.com", "password123", "Amit Deshmukh", "+91 9823054321", Role.BUILDER);
        getOrCreateProviderProfile(b2, ProviderType.BUILDER, "Greenfield Constructions",
                "Specializing in sustainable, modern eco-friendly housing projects with world-class amenities.",
                "Rajarampuri 13th Lane, Kolhapur", "Kolhapur", "Maharashtra", "416008", "27BBBBB1111B1Z6", 8, "https://greenfieldconstructions.demo");
        userMap.put("builder2", b2);

        // 3. Builder: Mahalaxmi Promoters (Kolhapur)
        User b3 = getOrCreateUser("builder3@directnest.com", "password123", "Vikram Bhosale", "+91 9822098765", Role.BUILDER);
        getOrCreateProviderProfile(b3, ProviderType.BUILDER, "Mahalaxmi Promoters & Builders",
                "Trusted real estate developers offering premium residential complexes and commercial spaces in prime Kolhapur locations.",
                "Shahupuri 3rd Lane, Kolhapur", "Kolhapur", "Maharashtra", "416001", "27CCCCC2222C1Z7", 12, "https://mahalaxmipromoters.demo");
        userMap.put("builder3", b3);

        // 4. Owner: Suresh Kulkarni (Kolhapur)
        User o1 = getOrCreateUser("owner1@directnest.com", "password123", "Suresh Kulkarni", "+91 9845011223", Role.BUILDER);
        getOrCreateProviderProfile(o1, ProviderType.OWNER, "Suresh Kulkarni (Direct Owner)",
                "Individual property owner offering verified, clear-title residential properties without any brokerage.",
                "Tarabai Park, Kolhapur", "Kolhapur", "Maharashtra", "416003", null, 4, null);
        userMap.put("owner1", o1);

        // 5. Owner: Anand Patil (Kolhapur)
        User o2 = getOrCreateUser("owner2@directnest.com", "password123", "Anand Patil", "+91 9890123456", Role.BUILDER);
        getOrCreateProviderProfile(o2, ProviderType.OWNER, "Anand Patil (Direct Owner)",
                "Direct property owner offering rental and resale flats in central Kolhapur localities.",
                "Ramanand Nagar, Kolhapur", "Kolhapur", "Maharashtra", "416012", null, 6, null);
        userMap.put("owner2", o2);

        // 6. Builder: Prestige Estates (Bangalore)
        User b4 = getOrCreateUser("builder_prestige@directnest.com", "password123", "Prestige Group", "+91 9880011223", Role.BUILDER);
        getOrCreateProviderProfile(b4, ProviderType.BUILDER, "Prestige Estates Ltd",
                "Leading nationwide developer of iconic high-rise condominiums, luxury villas, and tech parks.",
                "Prestige Falcon Towers, Brunton Road, Bangalore", "Bangalore", "Karnataka", "560025", "29AAAAA1111A1Z1", 30, "https://prestigeconstructions.demo");
        userMap.put("builder_prestige", b4);

        // 7. Customers
        User c1 = getOrCreateUser("customer1@directnest.com", "password123", "Pooja Sharma", "+91 9765432109", Role.CUSTOMER);
        userMap.put("customer1", c1);

        User c2 = getOrCreateUser("customer2@directnest.com", "password123", "Rahul Verma", "+91 9876501234", Role.CUSTOMER);
        userMap.put("customer2", c2);

        return userMap;
    }

    private User getOrCreateUser(String email, String rawPassword, String fullName, String phone, Role role) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User u = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .fullName(fullName)
                    .phone(phone)
                    .role(role)
                    .active(true)
                    .build();
            return userRepository.save(u);
        });
    }

    private ProviderProfile getOrCreateProviderProfile(User user, ProviderType type, String companyName,
                                                       String desc, String address, String city,
                                                       String state, String pincode, String gstin,
                                                       int experience, String website) {
        return providerProfileRepository.findByUserId(user.getId()).orElseGet(() -> {
            ProviderProfile profile = ProviderProfile.builder()
                    .user(user)
                    .providerType(type)
                    .companyName(companyName)
                    .companyDescription(desc)
                    .companyAddress(address)
                    .companyCity(city)
                    .companyState(state)
                    .companyPincode(pincode)
                    .gstin(gstin)
                    .yearsOfExperience(experience)
                    .websiteUrl(website)
                    .verificationStatus(VerificationStatus.APPROVED)
                    .verifiedAt(LocalDateTime.now())
                    .verificationNotes("Auto-verified demo provider")
                    .build();
            return providerProfileRepository.save(profile);
        });
    }

    private void seedDemoProperties(Map<String, User> users, Map<String, Amenity> amenities) {
        List<PropertySeedDef> seeds = getPropertySeedList(users, amenities);

        int createdCount = 0;
        for (PropertySeedDef s : seeds) {
            // Check by title to be idempotent
            if (propertyRepository.findAll().stream().anyMatch(p -> p.getTitle().equalsIgnoreCase(s.title))) {
                continue;
            }

            Property property = Property.builder()
                    .user(s.user)
                    .title(s.title)
                    .description(s.description)
                    .propertyType(s.propertyType)
                    .listingType(s.listingType)
                    .price(s.price)
                    .priceNegotiable(s.priceNegotiable)
                    .areaSqft(s.areaSqft)
                    .bedrooms(s.bedrooms)
                    .bathrooms(s.bathrooms)
                    .balconies(s.balconies)
                    .floorNumber(s.floorNumber)
                    .totalFloors(s.totalFloors)
                    .furnishingStatus(s.furnishingStatus)
                    .possessionDate(s.possessionDate)
                    .addressLine(s.addressLine)
                    .locality(s.locality)
                    .city(s.city)
                    .state(s.state)
                    .pincode(s.pincode)
                    .latitude(s.latitude)
                    .longitude(s.longitude)
                    .status(PropertyStatus.APPROVED)
                    .verifiedAt(LocalDateTime.now())
                    .featured(s.featured)
                    .viewsCount(s.viewsCount)
                    .amenities(s.amenities)
                    .build();

            property = propertyRepository.save(property);

            if (s.imageUrl != null) {
                PropertyImage image = PropertyImage.builder()
                        .property(property)
                        .imageUrl(s.imageUrl)
                        .primary(true)
                        .displayOrder(1)
                        .build();
                propertyImageRepository.save(image);
            }

            createdCount++;
        }

        if (createdCount > 0) {
            log.info("Successfully seeded {} realistic marketplace demo properties", createdCount);
        }
    }

    private List<PropertySeedDef> getPropertySeedList(Map<String, User> users, Map<String, Amenity> a) {
        List<PropertySeedDef> list = new ArrayList<>();

        // Kolhapur Properties (15 properties across all requested localities)

        // 1. Tarabai Park - 3BHK Luxury Apartment (Skyline)
        list.add(new PropertySeedDef(
                users.get("builder1"),
                "Luxury 3BHK Skyline Royal Palms",
                "Experience royal living in this spacious 3BHK apartment offering panoramic city views, premium Italian marble flooring, and modular kitchen fittings. Located in the most prestigious neighborhood of Tarabai Park.",
                PropertyType.APARTMENT, ListingType.SALE,
                new BigDecimal("8500000"), true, new BigDecimal("1650"),
                3, 3, 2, 5, 12,
                FurnishingStatus.SEMI_FURNISHED, LocalDate.now().plusMonths(2),
                "Plot 45, Royal Palms Avenue, Near Circuit House", "Tarabai Park", "Kolhapur", "Maharashtra", "416003",
                16.7050, 74.2433, true, 128L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "Swimming Pool", "Gymnasium", "Landscaped Garden", "Clubhouse", "CCTV Surveillance", "Power Backup", "Intercom Facility"),
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80"
        ));

        // 2. Nagala Park - 2BHK Modern Apartment (Skyline)
        list.add(new PropertySeedDef(
                users.get("builder1"),
                "Modern 2BHK Skyline Heights",
                "Well-ventilated 2BHK apartment in the heart of Nagala Park. Close to leading schools, hospitals, and collector office. 100% Vastu compliant with branded sanitaryware and zero dead space design.",
                PropertyType.APARTMENT, ListingType.SALE,
                new BigDecimal("5200000"), false, new BigDecimal("1100"),
                2, 2, 1, 3, 8,
                FurnishingStatus.UNFURNISHED, LocalDate.now().minusMonths(1),
                "Skyline Heights, Behind Collector Office", "Nagala Park", "Kolhapur", "Maharashtra", "416003",
                16.7112, 74.2389, true, 94L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "CCTV Surveillance", "Power Backup", "Intercom Facility"),
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80"
        ));

        // 3. Rajarampuri - 2BHK Eco Apartment (Greenfield)
        list.add(new PropertySeedDef(
                users.get("builder2"),
                "Eco-friendly 2BHK Green Nest",
                "Nature-inspired 2BHK flat featuring solar water heating, energy-efficient LED fixtures, lush green gardens, and dedicated children play zone in vibrant Rajarampuri.",
                PropertyType.APARTMENT, ListingType.SALE,
                new BigDecimal("4600000"), true, new BigDecimal("1050"),
                2, 2, 2, 2, 6,
                FurnishingStatus.SEMI_FURNISHED, LocalDate.now().plusMonths(6),
                "Lane 9, Green Nest Enclave, Rajarampuri", "Rajarampuri", "Kolhapur", "Maharashtra", "416008",
                16.6920, 74.2480, false, 82L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "Children's Play Area", "Landscaped Garden", "Rainwater Harvesting", "Power Backup"),
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80"
        ));

        // 4. Ruikar Colony - 4BHK Luxury Villa (Greenfield)
        list.add(new PropertySeedDef(
                users.get("builder2"),
                "Spacious 4BHK Greenfield Luxury Villa",
                "Exclusive standalone 4BHK luxury villa with private landscaped garden, terrace gazebo, personal swimming pool, and two covered car parking bays in Ruikar Colony.",
                PropertyType.VILLA, ListingType.SALE,
                new BigDecimal("14500000"), true, new BigDecimal("3200"),
                4, 4, 3, 1, 2,
                FurnishingStatus.FULLY_FURNISHED, LocalDate.now().minusMonths(3),
                "Bungalow 12, Greenfield Serenity, Ruikar Colony", "Ruikar Colony", "Kolhapur", "Maharashtra", "416005",
                16.7080, 74.2520, true, 210L,
                setOf(a, "Covered Parking", "24/7 Security", "Swimming Pool", "Gymnasium", "Landscaped Garden", "Clubhouse", "CCTV Surveillance", "Power Backup"),
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&auto=format&fit=crop&q=80"
        ));

        // 5. Kalamba - 1BHK Scenic Flat (Owner Suresh Kulkarni)
        list.add(new PropertySeedDef(
                users.get("owner1"),
                "Cozy 1BHK Apartment Near Rankala",
                "Direct from owner: peaceful 1BHK apartment with scenic lake breeze in Kalamba. Ideal for small families, retirees, or working professionals. Low society maintenance and clear legal title.",
                PropertyType.APARTMENT, ListingType.SALE,
                new BigDecimal("2600000"), false, new BigDecimal("620"),
                1, 1, 1, 2, 4,
                FurnishingStatus.UNFURNISHED, LocalDate.now().minusMonths(6),
                "Shree Ram Residency, Near Kalamba Lake Road", "Kalamba", "Kolhapur", "Maharashtra", "416007",
                16.6720, 74.2250, false, 45L,
                setOf(a, "Covered Parking", "24/7 Security", "Power Backup"),
                "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&auto=format&fit=crop&q=80"
        ));

        // 6. Shahupuri - 3BHK Premium Flat (Mahalaxmi Promoters)
        list.add(new PropertySeedDef(
                users.get("builder3"),
                "Prime 3BHK Mahalaxmi Heritage",
                "Centrally located in commercial hub Shahupuri. Premium 3BHK residence walking distance to railway station, multiplex, and market. Includes clubhouse and fitness center.",
                PropertyType.APARTMENT, ListingType.SALE,
                new BigDecimal("7200000"), true, new BigDecimal("1480"),
                3, 3, 2, 4, 10,
                FurnishingStatus.FULLY_FURNISHED, LocalDate.now().plusMonths(1),
                "Heritage Tower, 3rd Lane, Shahupuri", "Shahupuri", "Kolhapur", "Maharashtra", "416001",
                16.7010, 74.2370, true, 115L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "Gymnasium", "Landscaped Garden", "CCTV Surveillance", "Power Backup", "Intercom Facility"),
                "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&auto=format&fit=crop&q=80"
        ));

        // 7. Kasaba Bawada - 2BHK Riverview Enclave (Mahalaxmi Promoters)
        list.add(new PropertySeedDef(
                users.get("builder3"),
                "Premium 2BHK Riverside Enclave",
                "Peaceful and serene 2BHK home in Kasaba Bawada overlooking Panchganga river greenery. Complete with children play zone, rainwater harvesting and 24x7 security.",
                PropertyType.APARTMENT, ListingType.SALE,
                new BigDecimal("4200000"), true, new BigDecimal("980"),
                2, 2, 1, 2, 5,
                FurnishingStatus.SEMI_FURNISHED, LocalDate.now().minusMonths(2),
                "Riverside Enclave, Near DY Patil College Road, Kasaba Bawada", "Kasaba Bawada", "Kolhapur", "Maharashtra", "416006",
                16.7320, 74.2410, false, 68L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "Children's Play Area", "Rainwater Harvesting", "Power Backup"),
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80"
        ));

        // 8. Udyam Nagar - Commercial Showroom & Office Space (Skyline)
        list.add(new PropertySeedDef(
                users.get("builder1"),
                "Modern Commercial Showroom & Office",
                "High-visibility road-facing commercial property in the premier industrial and business hub of Udyam Nagar. Ideal for corporate office, showroom, or diagnostics center.",
                PropertyType.COMMERCIAL, ListingType.SALE,
                new BigDecimal("6800000"), true, new BigDecimal("1250"),
                0, 2, 0, 1, 4,
                FurnishingStatus.UNFURNISHED, LocalDate.now().minusMonths(1),
                "Skyline Commerce Point, Main Road, Udyam Nagar", "Udyam Nagar", "Kolhapur", "Maharashtra", "416008",
                16.6950, 74.2380, false, 55L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "CCTV Surveillance", "Power Backup"),
                "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=80"
        ));

        // 9. Ramanand Nagar - 3BHK Independent Row House (Owner Anand Patil)
        list.add(new PropertySeedDef(
                users.get("owner2"),
                "Independent 3BHK Row House",
                "Direct from owner: spacious ground + 1 independent row house with private front yard and covered car porch. Beautiful quiet neighborhood in Ramanand Nagar.",
                PropertyType.ROW_HOUSE, ListingType.SALE,
                new BigDecimal("6200000"), true, new BigDecimal("1750"),
                3, 3, 2, 1, 2,
                FurnishingStatus.SEMI_FURNISHED, LocalDate.now().minusMonths(4),
                "Plot 18, Gulmohar Row Houses, Ramanand Nagar", "Ramanand Nagar", "Kolhapur", "Maharashtra", "416012",
                16.6890, 74.2310, true, 89L,
                setOf(a, "Covered Parking", "24/7 Security", "Landscaped Garden", "Power Backup", "Rainwater Harvesting"),
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=1200&auto=format&fit=crop&q=80"
        ));

        // 10. Jawaharnagar - 1RK Compact Rental Studio (Owner Anand Patil)
        list.add(new PropertySeedDef(
                users.get("owner2"),
                "Affordable 1RK Studio Apartment",
                "Clean, well-lit 1RK studio flat available for monthly rent in Jawaharnagar. Close to Shivaji University and bus stops. 24 hours water supply and security.",
                PropertyType.APARTMENT, ListingType.RENT,
                new BigDecimal("8500"), false, new BigDecimal("380"),
                1, 1, 1, 1, 3,
                FurnishingStatus.SEMI_FURNISHED, LocalDate.now().minusMonths(1),
                "Shivaji Park Road, Jawaharnagar", "Jawaharnagar", "Kolhapur", "Maharashtra", "416012",
                16.6840, 74.2510, false, 32L,
                setOf(a, "24/7 Security", "Power Backup"),
                "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&auto=format&fit=crop&q=80"
        ));

        // 11. Tarabai Park - 3BHK Penthouse with Terrace (Skyline)
        list.add(new PropertySeedDef(
                users.get("builder1"),
                "Executive 3BHK Penthouse with Terrace",
                "Top-floor duplex penthouse featuring a private 600 sqft open-air terrace garden, private jacuzzi provision, ultra-high ceilings, and 360-degree city views.",
                PropertyType.PENTHOUSE, ListingType.SALE,
                new BigDecimal("11800000"), true, new BigDecimal("2400"),
                3, 4, 3, 10, 10,
                FurnishingStatus.FULLY_FURNISHED, LocalDate.now().plusMonths(3),
                "Skyline SkyVillas, Residency Road, Tarabai Park", "Tarabai Park", "Kolhapur", "Maharashtra", "416003",
                16.7065, 74.2445, true, 160L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "Swimming Pool", "Gymnasium", "Landscaped Garden", "Clubhouse", "CCTV Surveillance", "Power Backup", "Intercom Facility"),
                "https://images.unsplash.com/photo-1567496898669-ee935f5f647a?w=1200&auto=format&fit=crop&q=80"
        ));

        // 12. Kalamba - Gated Villa Plot (Greenfield)
        list.add(new PropertySeedDef(
                users.get("builder2"),
                "Residential Villa Plot in Gated Community",
                "Clear title NA-sanctioned 2,200 sqft residential plot in a gated layout with internal tar roads, underground electricity cabling, drainage, and boundary wall.",
                PropertyType.PLOT, ListingType.SALE,
                new BigDecimal("3500000"), false, new BigDecimal("2200"),
                0, 0, 0, 0, 0,
                FurnishingStatus.UNFURNISHED, LocalDate.now().minusMonths(2),
                "Greenfield Meadows Layout, Kalamba Gargoti Road", "Kalamba", "Kolhapur", "Maharashtra", "416007",
                16.6690, 74.2230, false, 71L,
                setOf(a, "24/7 Security", "Landscaped Garden", "CCTV Surveillance", "Rainwater Harvesting"),
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&auto=format&fit=crop&q=80"
        ));

        // 13. Rajarampuri - 2BHK Rental Family Flat (Owner Suresh Kulkarni)
        list.add(new PropertySeedDef(
                users.get("owner1"),
                "Comfortable 2BHK Family Home",
                "Spacious fully-furnished 2BHK flat available for rent. Direct dealing with owner. Includes modular kitchen, wardrobes, sofa, and covered parking slot.",
                PropertyType.APARTMENT, ListingType.RENT,
                new BigDecimal("18000"), false, new BigDecimal("1020"),
                2, 2, 2, 3, 5,
                FurnishingStatus.FULLY_FURNISHED, LocalDate.now().minusMonths(1),
                "Lane 4, Rajarampuri", "Rajarampuri", "Kolhapur", "Maharashtra", "416008",
                16.6935, 74.2460, false, 64L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "Power Backup"),
                "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200&auto=format&fit=crop&q=80"
        ));

        // 14. Nagala Park - 4BHK Royal Crest Penthouse (Mahalaxmi Promoters)
        list.add(new PropertySeedDef(
                users.get("builder3"),
                "Elegant 4BHK Royal Crest Penthouse",
                "Ultra-luxury 4BHK signature residence with imported fittings, double-height living room, infinity splash pool access, and elite neighbors in Nagala Park.",
                PropertyType.PENTHOUSE, ListingType.SALE,
                new BigDecimal("16500000"), true, new BigDecimal("3100"),
                4, 4, 3, 8, 8,
                FurnishingStatus.FULLY_FURNISHED, LocalDate.now().plusMonths(4),
                "Royal Crest, Near Circuit House Road, Nagala Park", "Nagala Park", "Kolhapur", "Maharashtra", "416003",
                16.7130, 74.2405, true, 175L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "Swimming Pool", "Gymnasium", "Clubhouse", "CCTV Surveillance", "Power Backup"),
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80"
        ));

        // 15. Tarabai Park - 2BHK Near Circuit House (Skyline)
        list.add(new PropertySeedDef(
                users.get("builder1"),
                "Spacious 2BHK Near Circuit House",
                "High-demand 2BHK apartment in pristine Tarabai Park with easy access to Kawla Naka and NH4 highway. Premium construction quality with gymnasium and lift.",
                PropertyType.APARTMENT, ListingType.SALE,
                new BigDecimal("5800000"), true, new BigDecimal("1180"),
                2, 2, 2, 2, 6,
                FurnishingStatus.SEMI_FURNISHED, LocalDate.now().minusMonths(1),
                "Circuit House Enclave, Tarabai Park", "Tarabai Park", "Kolhapur", "Maharashtra", "416003",
                16.7040, 74.2420, false, 91L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "Gymnasium", "Power Backup", "Intercom Facility"),
                "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=1200&auto=format&fit=crop&q=80"
        ));

        // Other Cities Properties (Bangalore, Pune, Mumbai)

        // 16. Bangalore - Prestige Tranquility 3BHK
        list.add(new PropertySeedDef(
                users.get("builder_prestige"),
                "Prestige Tranquility 3BHK Highrise",
                "Magnificent 3BHK apartment in a 38-acre integrated township on Old Madras Road, Budigere Cross. Features world-class clubhouse, Olympic swimming pool, and sports arena.",
                PropertyType.APARTMENT, ListingType.SALE,
                new BigDecimal("16500000"), true, new BigDecimal("1750"),
                3, 3, 2, 14, 28,
                FurnishingStatus.SEMI_FURNISHED, LocalDate.now().minusMonths(5),
                "Tower 8, Prestige Tranquility, Budigere Cross", "Budigere Cross", "Bangalore", "Karnataka", "560049",
                13.0610, 77.7420, true, 195L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "Swimming Pool", "Gymnasium", "Clubhouse", "CCTV Surveillance", "Power Backup"),
                "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80"
        ));

        // 17. Bangalore - Prestige Falcon City 2BHK
        list.add(new PropertySeedDef(
                users.get("builder_prestige"),
                "Prestige Falcon City 2BHK",
                "Premium 2BHK high-rise apartment on Kanakapura Road with direct connectivity to Forum Mall and Metro Station. State of the art recreational facilities.",
                PropertyType.APARTMENT, ListingType.SALE,
                new BigDecimal("11500000"), false, new BigDecimal("1280"),
                2, 2, 1, 9, 31,
                FurnishingStatus.FULLY_FURNISHED, LocalDate.now().minusMonths(2),
                "Tower 3, Prestige Falcon City, Kanakapura Road", "Kanakapura Road", "Bangalore", "Karnataka", "560062",
                12.8910, 77.5610, true, 142L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "Swimming Pool", "Gymnasium", "Landscaped Garden", "Power Backup"),
                "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&auto=format&fit=crop&q=80"
        ));

        // 18. Pune - Godrej Infinity 2BHK
        list.add(new PropertySeedDef(
                users.get("builder1"),
                "Godrej Infinity 2BHK Riverview",
                "Scenic 2BHK residence overlooking Mula Mutha river in Keshav Nagar, Mundhwa. 5 mins drive to Magarpatta Cybercity and Kharadi IT park.",
                PropertyType.APARTMENT, ListingType.SALE,
                new BigDecimal("7800000"), true, new BigDecimal("1120"),
                2, 2, 2, 7, 22,
                FurnishingStatus.SEMI_FURNISHED, LocalDate.now().plusMonths(3),
                "Tower C, Godrej Infinity, Keshav Nagar", "Keshav Nagar", "Pune", "Maharashtra", "411036",
                18.5320, 73.9480, false, 88L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "Swimming Pool", "Gymnasium", "Landscaped Garden", "Power Backup"),
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80"
        ));

        // 19. Mumbai - Lodha Palava 3BHK Smart City
        list.add(new PropertySeedDef(
                users.get("builder2"),
                "Lodha Palava 3BHK Smart City Flat",
                "Modern 3BHK air-conditioned apartment in India's premier planned smart city. Walk to Olympic-standard sports complex, international school, and high-street retail.",
                PropertyType.APARTMENT, ListingType.SALE,
                new BigDecimal("8900000"), true, new BigDecimal("1350"),
                3, 3, 2, 11, 18,
                FurnishingStatus.SEMI_FURNISHED, LocalDate.now().minusMonths(4),
                "Casa Bella Gold, Palava Smart City, Dombivli", "Dombivli", "Mumbai", "Maharashtra", "421204",
                19.1620, 73.0820, false, 102L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "Swimming Pool", "Gymnasium", "Clubhouse", "CCTV Surveillance"),
                "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=1200&auto=format&fit=crop&q=80"
        ));

        // 20. Mumbai - Seaside 3BHK Luxury Residence
        list.add(new PropertySeedDef(
                users.get("builder1"),
                "Seaside 3BHK Luxury Residence",
                "Prestigious sea-facing 3BHK apartment in Bandra West with private elevator lobby, concierge services, temperature-controlled pool, and imported marble finish.",
                PropertyType.APARTMENT, ListingType.SALE,
                new BigDecimal("34000000"), true, new BigDecimal("1900"),
                3, 3, 3, 15, 20,
                FurnishingStatus.FULLY_FURNISHED, LocalDate.now().minusMonths(1),
                "Ocean Palms, Carter Road, Bandra West", "Bandra West", "Mumbai", "Maharashtra", "400050",
                19.0650, 72.8250, true, 230L,
                setOf(a, "Covered Parking", "Lift / Elevator", "24/7 Security", "Swimming Pool", "Gymnasium", "CCTV Surveillance", "Power Backup", "Intercom Facility"),
                "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80"
        ));

        return list;
    }

    private Set<Amenity> setOf(Map<String, Amenity> map, String... names) {
        Set<Amenity> result = new HashSet<>();
        for (String name : names) {
            Amenity a = map.get(name);
            if (a != null) {
                result.add(a);
            }
        }
        return result;
    }

    private static class AmenityDef {
        String name;
        String icon;
        String category;

        AmenityDef(String name, String icon, String category) {
            this.name = name;
            this.icon = icon;
            this.category = category;
        }
    }

    private static class PropertySeedDef {
        User user;
        String title;
        String description;
        PropertyType propertyType;
        ListingType listingType;
        BigDecimal price;
        boolean priceNegotiable;
        BigDecimal areaSqft;
        Integer bedrooms;
        Integer bathrooms;
        Integer balconies;
        Integer floorNumber;
        Integer totalFloors;
        FurnishingStatus furnishingStatus;
        LocalDate possessionDate;
        String addressLine;
        String locality;
        String city;
        String state;
        String pincode;
        Double latitude;
        Double longitude;
        boolean featured;
        Long viewsCount;
        Set<Amenity> amenities;
        String imageUrl;

        PropertySeedDef(User user, String title, String description, PropertyType propertyType,
                        ListingType listingType, BigDecimal price, boolean priceNegotiable,
                        BigDecimal areaSqft, Integer bedrooms, Integer bathrooms, Integer balconies,
                        Integer floorNumber, Integer totalFloors, FurnishingStatus furnishingStatus,
                        LocalDate possessionDate, String addressLine, String locality,
                        String city, String state, String pincode, Double latitude, Double longitude,
                        boolean featured, Long viewsCount, Set<Amenity> amenities, String imageUrl) {
            this.user = user;
            this.title = title;
            this.description = description;
            this.propertyType = propertyType;
            this.listingType = listingType;
            this.price = price;
            this.priceNegotiable = priceNegotiable;
            this.areaSqft = areaSqft;
            this.bedrooms = bedrooms;
            this.bathrooms = bathrooms;
            this.balconies = balconies;
            this.floorNumber = floorNumber;
            this.totalFloors = totalFloors;
            this.furnishingStatus = furnishingStatus;
            this.possessionDate = possessionDate;
            this.addressLine = addressLine;
            this.locality = locality;
            this.city = city;
            this.state = state;
            this.pincode = pincode;
            this.latitude = latitude;
            this.longitude = longitude;
            this.featured = featured;
            this.viewsCount = viewsCount;
            this.amenities = amenities;
            this.imageUrl = imageUrl;
        }
    }
}
