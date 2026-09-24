package com.directnest;

import com.directnest.amenity.entity.Amenity;
import com.directnest.amenity.repository.AmenityRepository;
import com.directnest.common.dto.PagedResponse;
import com.directnest.property.dto.PropertyListResponse;
import com.directnest.property.dto.PropertySearchFilter;
import com.directnest.property.entity.*;
import com.directnest.property.repository.PropertyRepository;
import com.directnest.property.service.PropertyService;
import com.directnest.user.entity.Role;
import com.directnest.user.entity.User;
import com.directnest.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class PropertySearchIntegrationTest {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private AmenityRepository amenityRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Amenity parking;
    private Amenity pool;
    private Amenity gym;
    private Amenity security;
    private Amenity garden;

    private Property kolhapur3BhkLuxury;
    private Property kolhapur2BhkBudget;
    private Property kolhapur4BhkVilla;
    private Property pune2Bhk;

    @BeforeEach
    void setUp() {
        propertyRepository.deleteAll();

        // 1. Get or create amenities
        parking = getOrCreateAmenity("Covered Parking", "car", "Convenience");
        pool = getOrCreateAmenity("Swimming Pool", "pool", "Recreation");
        gym = getOrCreateAmenity("Gymnasium", "fitness", "Fitness");
        security = getOrCreateAmenity("24/7 Security", "shield", "Security");
        garden = getOrCreateAmenity("Landscaped Garden", "sun", "Eco");

        // 2. Create builder user
        User builder = userRepository.findByEmail("searchtest_builder@directnest.com").orElseGet(() ->
                userRepository.save(User.builder()
                        .email("searchtest_builder@directnest.com")
                        .password(passwordEncoder.encode("password123"))
                        .fullName("Search Test Builder")
                        .role(Role.BUILDER)
                        .active(true)
                        .build())
        );

        // 3. Create properties

        // Property A: Kolhapur, Tarabai Park, 3BHK, 85L, APARTMENT. Amenities: Parking, Pool, Gym, Security
        kolhapur3BhkLuxury = propertyRepository.save(Property.builder()
                .user(builder)
                .title("Kolhapur Tarabai Park Luxury 3BHK")
                .description("Luxury 3BHK flat in Tarabai Park")
                .city("Kolhapur")
                .locality("Tarabai Park")
                .addressLine("Royal Palms Avenue")
                .state("Maharashtra")
                .pincode("416003")
                .areaSqft(new BigDecimal("1650"))
                .propertyType(PropertyType.APARTMENT)
                .listingType(ListingType.SALE)
                .bedrooms(3)
                .bathrooms(3)
                .price(new BigDecimal("8500000"))
                .furnishingStatus(FurnishingStatus.SEMI_FURNISHED)
                .status(PropertyStatus.APPROVED)
                .verifiedAt(LocalDateTime.now())
                .amenities(Set.of(parking, pool, gym, security))
                .build());

        // Property B: Kolhapur, Rajarampuri, 2BHK, 45L, APARTMENT. Amenities: Parking, Security, Garden (NO Pool, NO Gym)
        kolhapur2BhkBudget = propertyRepository.save(Property.builder()
                .user(builder)
                .title("Kolhapur Rajarampuri Eco 2BHK")
                .description("Eco friendly 2BHK flat in Rajarampuri")
                .city("Kolhapur")
                .locality("Rajarampuri")
                .addressLine("9th Lane Rajarampuri")
                .state("Maharashtra")
                .pincode("416008")
                .areaSqft(new BigDecimal("1050"))
                .propertyType(PropertyType.APARTMENT)
                .listingType(ListingType.SALE)
                .bedrooms(2)
                .bathrooms(2)
                .price(new BigDecimal("4500000"))
                .furnishingStatus(FurnishingStatus.SEMI_FURNISHED)
                .status(PropertyStatus.APPROVED)
                .verifiedAt(LocalDateTime.now())
                .amenities(Set.of(parking, security, garden))
                .build());

        // Property C: Kolhapur, Ruikar Colony, 4BHK, 1.45Cr, VILLA. Amenities: Parking, Pool, Gym, Garden, Security
        kolhapur4BhkVilla = propertyRepository.save(Property.builder()
                .user(builder)
                .title("Kolhapur Ruikar Colony 4BHK Villa")
                .description("Luxury villa with garden and pool")
                .city("Kolhapur")
                .locality("Ruikar Colony")
                .addressLine("Bungalow 12, Serenity")
                .state("Maharashtra")
                .pincode("416005")
                .areaSqft(new BigDecimal("3200"))
                .propertyType(PropertyType.VILLA)
                .listingType(ListingType.SALE)
                .bedrooms(4)
                .bathrooms(4)
                .price(new BigDecimal("14500000"))
                .furnishingStatus(FurnishingStatus.FULLY_FURNISHED)
                .status(PropertyStatus.APPROVED)
                .verifiedAt(LocalDateTime.now())
                .amenities(Set.of(parking, pool, gym, garden, security))
                .build());

        // Property D: Pune, 2BHK, 75L, APARTMENT. Amenities: Parking, Pool, Gym
        pune2Bhk = propertyRepository.save(Property.builder()
                .user(builder)
                .title("Pune Keshav Nagar 2BHK")
                .description("Riverview flat in Pune")
                .city("Pune")
                .locality("Keshav Nagar")
                .addressLine("Tower C, Keshav Nagar")
                .state("Maharashtra")
                .pincode("411036")
                .areaSqft(new BigDecimal("1120"))
                .propertyType(PropertyType.APARTMENT)
                .listingType(ListingType.SALE)
                .bedrooms(2)
                .bathrooms(2)
                .price(new BigDecimal("7500000"))
                .furnishingStatus(FurnishingStatus.SEMI_FURNISHED)
                .status(PropertyStatus.APPROVED)
                .verifiedAt(LocalDateTime.now())
                .amenities(Set.of(parking, pool, gym))
                .build());

        // Property E: Draft property (Kolhapur) - should NEVER appear in public search
        propertyRepository.save(Property.builder()
                .user(builder)
                .title("Unapproved Draft Property")
                .description("Pending submission")
                .city("Kolhapur")
                .locality("Tarabai Park")
                .addressLine("Draft road")
                .state("Maharashtra")
                .pincode("416003")
                .areaSqft(new BigDecimal("1200"))
                .propertyType(PropertyType.APARTMENT)
                .listingType(ListingType.SALE)
                .bedrooms(3)
                .price(new BigDecimal("5000000"))
                .status(PropertyStatus.DRAFT)
                .amenities(Set.of(parking, pool))
                .build());
    }

    private Amenity getOrCreateAmenity(String name, String icon, String category) {
        return amenityRepository.findByName(name).orElseGet(() ->
                amenityRepository.save(Amenity.builder()
                        .name(name)
                        .icon(icon)
                        .category(category)
                        .build())
        );
    }

    @Test
    @DisplayName("1. Search by City: Returns only approved properties in that city")
    void testSearchByCity() {
        PropertySearchFilter filter = new PropertySearchFilter();
        filter.setCity("Kolhapur");
        filter.setStatus(PropertyStatus.APPROVED);

        PagedResponse<PropertyListResponse> result = propertyService.searchProperties(filter, 0, 10, "createdAt", "desc");
        assertEquals(3, result.getTotalElements());
        assertTrue(result.getContent().stream().allMatch(p -> p.getCity().equalsIgnoreCase("Kolhapur")));
        assertTrue(result.getContent().stream().noneMatch(p -> p.getTitle().contains("Draft")));
    }

    @Test
    @DisplayName("2. Search by Locality: Filters accurately")
    void testSearchByLocality() {
        PropertySearchFilter filter = new PropertySearchFilter();
        filter.setCity("Kolhapur");
        filter.setLocality("Tarabai Park");
        filter.setStatus(PropertyStatus.APPROVED);

        PagedResponse<PropertyListResponse> result = propertyService.searchProperties(filter, 0, 10, "createdAt", "desc");
        assertEquals(1, result.getTotalElements());
        assertEquals(kolhapur3BhkLuxury.getId(), result.getContent().get(0).getId());
    }

    @Test
    @DisplayName("3. Search by Bedrooms (BHK): Accurate BHK matching")
    void testSearchByBedrooms() {
        PropertySearchFilter filter = new PropertySearchFilter();
        filter.setBedrooms(2);
        filter.setStatus(PropertyStatus.APPROVED);

        PagedResponse<PropertyListResponse> result = propertyService.searchProperties(filter, 0, 10, "createdAt", "desc");
        // Should find Kolhapur 2BHK and Pune 2BHK
        assertEquals(2, result.getTotalElements());
        assertTrue(result.getContent().stream().allMatch(p -> p.getBedrooms() == 2));
    }

    @Test
    @DisplayName("4. Single Amenity Filter: Returns properties having that amenity")
    void testSingleAmenityFilter() {
        PropertySearchFilter filter = new PropertySearchFilter();
        filter.setAmenityIds(List.of(pool.getId()));
        filter.setStatus(PropertyStatus.APPROVED);

        PagedResponse<PropertyListResponse> result = propertyService.searchProperties(filter, 0, 10, "createdAt", "desc");
        // Properties with Pool: Kolhapur 3BHK, Kolhapur 4BHK Villa, Pune 2BHK (Total 3)
        assertEquals(3, result.getTotalElements());
        assertTrue(result.getContent().stream().anyMatch(p -> p.getId().equals(kolhapur3BhkLuxury.getId())));
        assertTrue(result.getContent().stream().anyMatch(p -> p.getId().equals(kolhapur4BhkVilla.getId())));
        assertTrue(result.getContent().stream().anyMatch(p -> p.getId().equals(pune2Bhk.getId())));
        assertFalse(result.getContent().stream().anyMatch(p -> p.getId().equals(kolhapur2BhkBudget.getId())));
    }

    @Test
    @DisplayName("5. Multi-Amenity Filter (Option A - ALL Semantics): Requires every selected amenity")
    void testMultiAmenityFilterAllSemantics() {
        // Filter by Swimming Pool AND Landscaped Garden
        // - Kolhapur 3BHK has Pool, but NOT Garden -> EXCLUDED
        // - Kolhapur 2BHK has Garden, but NOT Pool -> EXCLUDED
        // - Pune 2BHK has Pool, but NOT Garden -> EXCLUDED
        // - Kolhapur 4BHK Villa has BOTH Pool AND Garden -> INCLUDED
        PropertySearchFilter filter = new PropertySearchFilter();
        filter.setAmenityIds(List.of(pool.getId(), garden.getId()));
        filter.setStatus(PropertyStatus.APPROVED);

        PagedResponse<PropertyListResponse> result = propertyService.searchProperties(filter, 0, 10, "createdAt", "desc");
        assertEquals(1, result.getTotalElements());
        assertEquals(kolhapur4BhkVilla.getId(), result.getContent().get(0).getId());
    }

    @Test
    @DisplayName("6. Combination Filter: City + BHK + Multiple Amenities + Price Range")
    void testCombinationFilter() {
        PropertySearchFilter filter = new PropertySearchFilter();
        filter.setCity("Kolhapur");
        filter.setBedrooms(3);
        filter.setMinPrice(new BigDecimal("5000000"));
        filter.setMaxPrice(new BigDecimal("10000000"));
        filter.setAmenityIds(List.of(parking.getId(), gym.getId()));
        filter.setStatus(PropertyStatus.APPROVED);

        PagedResponse<PropertyListResponse> result = propertyService.searchProperties(filter, 0, 10, "createdAt", "desc");
        assertEquals(1, result.getTotalElements());
        assertEquals(kolhapur3BhkLuxury.getId(), result.getContent().get(0).getId());
    }
}
