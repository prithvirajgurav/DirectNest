package com.directnest;

import com.directnest.admin.service.AdminService;
import com.directnest.auth.dto.LoginRequest;
import com.directnest.auth.dto.LoginResponse;
import com.directnest.auth.dto.RegisterRequest;
import com.directnest.auth.service.AuthService;
import com.directnest.builder.dto.CreateProviderProfileRequest;
import com.directnest.builder.dto.ProviderDocumentDto;
import com.directnest.builder.dto.ProviderProfileResponse;
import com.directnest.builder.dto.VerifyProviderRequest;
import com.directnest.builder.entity.ProviderType;
import com.directnest.builder.entity.VerificationStatus;
import com.directnest.builder.service.BuilderService;
import com.directnest.common.dto.PagedResponse;
import com.directnest.exception.BadRequestException;
import com.directnest.exception.DuplicateResourceException;
import com.directnest.property.dto.*;
import com.directnest.property.entity.*;
import com.directnest.property.repository.PropertyImageRepository;
import com.directnest.property.repository.PropertyRepository;
import com.directnest.property.service.PropertyService;
import com.directnest.user.entity.Role;
import com.directnest.user.entity.User;
import com.directnest.user.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class DirectNestIntegrationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private BuilderService builderService;

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyImageRepository propertyImageRepository;

    private void authenticateAs(String email, String role) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user != null) {
            com.directnest.security.UserPrincipal principal = com.directnest.security.UserPrincipal.create(user);
            UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    principal, null, List.of(new SimpleGrantedAuthority("ROLE_" + role))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
        }
    }

    @Test
    @DisplayName("1. User Auth: Register customer and login")
    void testCustomerRegisterAndLogin() {
        RegisterRequest registerRequest = RegisterRequest.builder()
                .email("customer1@directnest.com")
                .password("password123")
                .fullName("Rajesh Sharma")
                .phone("+91 9876543210")
                .role(Role.CUSTOMER)
                .build();

        LoginResponse regResponse = authService.register(registerRequest);
        assertNotNull(regResponse);
        assertNotNull(regResponse.getToken());
        assertEquals("customer1@directnest.com", regResponse.getEmail());
        assertEquals("CUSTOMER", regResponse.getRole());

        LoginRequest loginRequest = LoginRequest.builder()
                .email("customer1@directnest.com")
                .password("password123")
                .build();

        LoginResponse loginResponse = authService.login(loginRequest);
        assertNotNull(loginResponse);
        assertNotNull(loginResponse.getToken());
        assertEquals("Rajesh Sharma", loginResponse.getFullName());
    }

    @Test
    @DisplayName("2. User Auth: Prevent duplicate user registration")
    void testPreventDuplicateEmail() {
        RegisterRequest req1 = RegisterRequest.builder()
                .email("dup@directnest.com")
                .password("password123")
                .fullName("User One")
                .role(Role.CUSTOMER)
                .build();
        authService.register(req1);

        RegisterRequest req2 = RegisterRequest.builder()
                .email("dup@directnest.com")
                .password("password456")
                .fullName("User Two")
                .role(Role.BUILDER)
                .build();

        assertThrows(DuplicateResourceException.class, () -> authService.register(req2));
    }

    @Test
    @DisplayName("3. User Auth: Prevent ADMIN self-registration")
    void testPreventAdminRegistration() {
        RegisterRequest req = RegisterRequest.builder()
                .email("hacker@directnest.com")
                .password("password123")
                .fullName("Fake Admin")
                .role(Role.ADMIN)
                .build();

        assertThrows(BadRequestException.class, () -> authService.register(req));
    }

    @Test
    @DisplayName("4. Provider Profile: Create profile and verify workflow")
    void testProviderProfileWorkflow() {
        RegisterRequest builderReq = RegisterRequest.builder()
                .email("builder1@directnest.com")
                .password("password123")
                .fullName("Sobha Developers")
                .phone("+91 9880011223")
                .role(Role.BUILDER)
                .build();
        authService.register(builderReq);

        authenticateAs("builder1@directnest.com", "BUILDER");

        CreateProviderProfileRequest profileReq = new CreateProviderProfileRequest();
        profileReq.setCompanyName("Sobha Ltd");
        profileReq.setProviderType(ProviderType.BUILDER);
        profileReq.setCompanyDescription("Premier Luxury Real Estate Builder");
        profileReq.setCompanyCity("Bangalore");
        profileReq.setCompanyState("Karnataka");
        profileReq.setCompanyAddress("Sarjapur Road");
        profileReq.setCompanyPincode("560034");
        profileReq.setGstin("29ABCDE1234F1Z5");
        profileReq.setYearsOfExperience(25);

        ProviderProfileResponse profileResp = builderService.createProviderProfile(profileReq);
        assertNotNull(profileResp);
        assertEquals("Sobha Ltd", profileResp.getCompanyName());
        assertEquals(VerificationStatus.PENDING_VERIFICATION, profileResp.getVerificationStatus());

        // Admin verifies provider
        VerifyProviderRequest verifyReq = new VerifyProviderRequest(VerificationStatus.APPROVED, "Verified via RERA registry");
        ProviderProfileResponse verifiedResp = builderService.verifyProvider(profileResp.getId(), verifyReq);
        assertEquals(VerificationStatus.APPROVED, verifiedResp.getVerificationStatus());
    }

    @Test
    @DisplayName("5. Property Listing & Workflow: Create draft, submit, verify, public search isolation")
    void testPropertyWorkflowAndPublicSearch() {
        // Register builder
        RegisterRequest builderReq = RegisterRequest.builder()
                .email("builder2@directnest.com")
                .password("password123")
                .fullName("Godrej Properties")
                .role(Role.BUILDER)
                .build();
        authService.register(builderReq);

        authenticateAs("builder2@directnest.com", "BUILDER");

        // Create property
        CreatePropertyRequest propReq = new CreatePropertyRequest();
        propReq.setTitle("Godrej Splendour 3BHK Luxury");
        propReq.setDescription("Spacious 3BHK apartment in Whitefield");
        propReq.setPropertyType(PropertyType.APARTMENT);
        propReq.setListingType(ListingType.SALE);
        propReq.setPrice(new BigDecimal("12500000"));
        propReq.setPriceNegotiable(true);
        propReq.setAreaSqft(new BigDecimal("1650"));
        propReq.setBedrooms(3);
        propReq.setBathrooms(3);
        propReq.setBalconies(2);
        propReq.setFloorNumber(8);
        propReq.setTotalFloors(24);
        propReq.setFurnishingStatus(FurnishingStatus.SEMI_FURNISHED);
        propReq.setCity("Bangalore");
        propReq.setLocality("Whitefield");
        propReq.setState("Karnataka");
        propReq.setPincode("560066");

        PropertyDetailResponse propResp = propertyService.createProperty(propReq);
        assertNotNull(propResp);
        assertEquals(PropertyStatus.DRAFT, propResp.getStatus());

        // Verify public search does NOT show DRAFT properties
        PropertySearchFilter filter = new PropertySearchFilter();
        filter.setCity("Bangalore");
        PagedResponse<PropertyListResponse> publicResults = propertyService.searchProperties(filter, 0, 10, "createdAt", "desc");
        assertTrue(publicResults.getContent().stream().noneMatch(p -> p.getId().equals(propResp.getId())),
                "Draft properties must NOT be returned in public search");

        // Add a test image to satisfy submission requirements
        Property property = propertyRepository.findById(propResp.getId()).orElseThrow();
        PropertyImage testImage = PropertyImage.builder()
                .property(property)
                .imageUrl("/test/image.jpg")
                .primary(true)
                .displayOrder(1)
                .build();
        propertyImageRepository.save(testImage);

        // Builder submits property for verification
        PropertyDetailResponse submittedProp = propertyService.submitPropertyForVerification(propResp.getId());
        assertEquals(PropertyStatus.PENDING_VERIFICATION, submittedProp.getStatus());

        // Admin approves property
        VerifyPropertyRequest verifyReq = new VerifyPropertyRequest();
        verifyReq.setStatus(PropertyStatus.APPROVED);
        verifyReq.setAdminNotes("Approved for public listing");
        PropertyDetailResponse approvedProp = propertyService.verifyProperty(propResp.getId(), verifyReq);
        assertEquals(PropertyStatus.APPROVED, approvedProp.getStatus());

        // Verify public search NOW returns the APPROVED property
        PagedResponse<PropertyListResponse> publicResultsAfterApproval = propertyService.searchProperties(filter, 0, 10, "createdAt", "desc");
        assertTrue(publicResultsAfterApproval.getContent().stream().anyMatch(p -> p.getId().equals(propResp.getId())),
                "Approved properties MUST be returned in public search");
    }

    @Test
    @DisplayName("6. Builder Documents & Auto-Profile: Upload verification document before manual profile creation")
    void testBuilderDocumentUploadAutoProfile() {
        RegisterRequest builderReq = RegisterRequest.builder()
                .email("builder3@directnest.com")
                .password("password123")
                .fullName("Prestige Estates")
                .phone("+91 9900112233")
                .role(Role.BUILDER)
                .build();
        authService.register(builderReq);

        authenticateAs("builder3@directnest.com", "BUILDER");

        MockMultipartFile file = new MockMultipartFile(
                "file",
                "rera_certificate.pdf",
                "application/pdf",
                "RERA CERTIFICATE CONTENT".getBytes()
        );

        ProviderDocumentDto doc = builderService.uploadProviderDocument("RERA_CERTIFICATE", file);
        assertNotNull(doc);
        assertNotNull(doc.getId());
        assertEquals("RERA_CERTIFICATE", doc.getDocumentType());

        List<ProviderDocumentDto> docs = builderService.getMyDocuments();
        assertEquals(1, docs.size());
        assertEquals("RERA_CERTIFICATE", docs.get(0).getDocumentType());
    }

    @Test
    @DisplayName("7. Property Media & Docs: Upload image, set primary, and upload property document")
    void testPropertyMediaAndDocumentUpload() {
        RegisterRequest builderReq = RegisterRequest.builder()
                .email("builder4@directnest.com")
                .password("password123")
                .fullName("Brigade Group")
                .phone("+91 9911223344")
                .role(Role.BUILDER)
                .build();
        authService.register(builderReq);

        authenticateAs("builder4@directnest.com", "BUILDER");

        CreatePropertyRequest propReq = new CreatePropertyRequest();
        propReq.setTitle("Brigade Gateway 2BHK");
        propReq.setDescription("Modern luxury living");
        propReq.setPropertyType(PropertyType.APARTMENT);
        propReq.setListingType(ListingType.SALE);
        propReq.setPrice(new BigDecimal("9500000"));
        propReq.setAreaSqft(new BigDecimal("1200"));
        propReq.setBedrooms(2);
        propReq.setBathrooms(2);
        propReq.setCity("Bangalore");
        propReq.setLocality("Rajajinagar");

        PropertyDetailResponse propResp = propertyService.createProperty(propReq);
        assertNotNull(propResp);

        MockMultipartFile imageFile = new MockMultipartFile(
                "file",
                "living_room.jpg",
                "image/jpeg",
                "IMAGE CONTENT".getBytes()
        );

        PropertyImageDto imgDto = propertyService.uploadPropertyImage(propResp.getId(), imageFile, false);
        assertNotNull(imgDto);
        assertNotNull(imgDto.getId());

        PropertyImageDto primaryImg = propertyService.setPrimaryImage(propResp.getId(), imgDto.getId());
        assertTrue(primaryImg.isPrimary());

        MockMultipartFile docFile = new MockMultipartFile(
                "file",
                "occupancy_cert.pdf",
                "application/pdf",
                "OC CONTENT".getBytes()
        );

        PropertyDocumentDto docDto = propertyService.uploadPropertyDocument(propResp.getId(), "OCCUPANCY_CERTIFICATE", docFile);
        assertNotNull(docDto);
        assertEquals("OCCUPANCY_CERTIFICATE", docDto.getDocumentType());
    }

    @Test
    @DisplayName("8. End-to-End Workflow: Builder Create -> Builder List -> Submit -> Admin Pending -> Admin Approve -> Public Search -> Customer View Detail")
    void testEndToEndPropertyLifecycle() {
        // Step 1: Builder registers and creates property (DRAFT)
        RegisterRequest builderReq = RegisterRequest.builder()
                .email("builder5@directnest.com")
                .password("password123")
                .fullName("Puravankara Limited")
                .phone("+91 9845012345")
                .role(Role.BUILDER)
                .build();
        authService.register(builderReq);

        authenticateAs("builder5@directnest.com", "BUILDER");

        CreatePropertyRequest createReq = new CreatePropertyRequest();
        createReq.setTitle("Purva Palm Beach 3BHK");
        createReq.setDescription("Tropical beach themed apartments in Hennur");
        createReq.setPropertyType(PropertyType.APARTMENT);
        createReq.setListingType(ListingType.SALE);
        createReq.setPrice(new BigDecimal("18500000"));
        createReq.setPriceNegotiable(true);
        createReq.setAreaSqft(new BigDecimal("1980"));
        createReq.setBedrooms(3);
        createReq.setBathrooms(3);
        createReq.setBalconies(2);
        createReq.setFurnishingStatus(FurnishingStatus.SEMI_FURNISHED);
        createReq.setCity("Bangalore");
        createReq.setLocality("Hennur Road");
        createReq.setState("Karnataka");
        createReq.setPincode("560077");

        PropertyDetailResponse createdProp = propertyService.createProperty(createReq);
        assertNotNull(createdProp);
        assertEquals(PropertyStatus.DRAFT, createdProp.getStatus());

        // Step 2: Builder sees own property in My Properties
        PagedResponse<PropertyListResponse> myBuilderProps = propertyService.getMyProperties(null, 0, 10);
        assertTrue(myBuilderProps.getContent().stream().anyMatch(p -> p.getId().equals(createdProp.getId())),
                "Builder must see newly created property in their property list");

        // Builder uploads image and submits for verification
        Property property = propertyRepository.findById(createdProp.getId()).orElseThrow();
        PropertyImage coverImg = PropertyImage.builder()
                .property(property)
                .imageUrl("/uploads/purva_cover.jpg")
                .primary(true)
                .displayOrder(1)
                .build();
        propertyImageRepository.save(coverImg);

        PropertyDetailResponse submittedProp = propertyService.submitPropertyForVerification(createdProp.getId());
        assertEquals(PropertyStatus.PENDING_VERIFICATION, submittedProp.getStatus());

        // Step 3: Admin sees pending property in Moderation Queue
        PagedResponse<PropertyListResponse> adminPendingProps = adminService.getPendingProperties(0, 10);
        assertTrue(adminPendingProps.getContent().stream().anyMatch(p -> p.getId().equals(createdProp.getId())),
                "Admin must see property in PENDING_VERIFICATION queue");

        // Step 4: Admin approves property
        PropertyDetailResponse approvedProp = adminService.approveProperty(createdProp.getId());
        assertEquals(PropertyStatus.APPROVED, approvedProp.getStatus());

        // Step 5: Customer sees approved property in public search /properties
        PropertySearchFilter searchFilter = new PropertySearchFilter();
        searchFilter.setCity("Bangalore");
        searchFilter.setStatus(PropertyStatus.APPROVED);
        PagedResponse<PropertyListResponse> publicResults = propertyService.searchProperties(searchFilter, 0, 10, "createdAt", "desc");
        assertTrue(publicResults.getContent().stream().anyMatch(p -> p.getId().equals(createdProp.getId())),
                "Customer must see approved property in public search");

        // Step 6: Customer opens property details
        PropertyDetailResponse publicPropDetail = propertyService.getPropertyById(createdProp.getId());
        assertNotNull(publicPropDetail);
        assertEquals("Purva Palm Beach 3BHK", publicPropDetail.getTitle());
        assertEquals(PropertyStatus.APPROVED, publicPropDetail.getStatus());
        assertEquals("Puravankara Limited", publicPropDetail.getOwner().getFullName());
    }
}
