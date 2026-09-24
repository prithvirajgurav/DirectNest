package com.directnest;

import com.directnest.auth.dto.LoginRequest;
import com.directnest.auth.dto.LoginResponse;
import com.directnest.auth.dto.RegisterRequest;
import com.directnest.auth.service.AuthService;
import com.directnest.property.dto.CreatePropertyRequest;
import com.directnest.property.dto.PropertyDetailResponse;
import com.directnest.property.dto.VerifyPropertyRequest;
import com.directnest.property.entity.ListingType;
import com.directnest.property.entity.Property;
import com.directnest.property.entity.PropertyImage;
import com.directnest.property.entity.PropertyStatus;
import com.directnest.property.entity.PropertyType;
import com.directnest.property.repository.PropertyImageRepository;
import com.directnest.property.repository.PropertyRepository;
import com.directnest.property.service.PropertyService;
import com.directnest.user.entity.Role;
import com.directnest.user.entity.User;
import com.directnest.user.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AdminPropertyReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuthService authService;

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private PropertyImageRepository propertyImageRepository;

    @Autowired
    private ObjectMapper objectMapper;

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
    @DisplayName("Admin review, approval, rejection and public visibility workflow test")
    void testAdminPropertyReviewLifecycle() throws Exception {
        // 1. Create a builder and property
        RegisterRequest builderReq = RegisterRequest.builder()
                .email("testbuilder_review@directnest.com")
                .password("password123")
                .fullName("Review Builder")
                .phone("+91 9999988777")
                .role(Role.BUILDER)
                .build();
        authService.register(builderReq);

        authenticateAs("testbuilder_review@directnest.com", "BUILDER");

        CreatePropertyRequest propReq = new CreatePropertyRequest();
        propReq.setTitle("Review Test Villa");
        propReq.setDescription("Villa for admin review and audit testing");
        propReq.setPropertyType(PropertyType.VILLA);
        propReq.setListingType(ListingType.SALE);
        propReq.setPrice(new BigDecimal("25000000"));
        propReq.setAreaSqft(new BigDecimal("3200"));
        propReq.setCity("Bangalore");
        propReq.setLocality("Indiranagar");
        propReq.setState("Karnataka");
        propReq.setPincode("560038");

        PropertyDetailResponse createdProp = propertyService.createProperty(propReq);

        // Upload image
        Property property = propertyRepository.findById(createdProp.getId()).orElseThrow();
        PropertyImage img = PropertyImage.builder()
                .property(property)
                .imageUrl("/uploads/villa.jpg")
                .primary(true)
                .displayOrder(1)
                .build();
        propertyImageRepository.save(img);

        // Submit for verification
        propertyService.submitPropertyForVerification(createdProp.getId());

        // 2. Login as admin
        SecurityContextHolder.clearContext();
        LoginRequest adminLogin = LoginRequest.builder()
                .email("admin@directnest.com")
                .password("admin123")
                .build();
        LoginResponse adminResponse = authService.login(adminLogin);
        String adminToken = adminResponse.getToken();

        SecurityContextHolder.clearContext();

        // 3. Admin calls GET /api/admin/properties/{id}/review
        mockMvc.perform(get("/api/admin/properties/" + createdProp.getId() + "/review")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(createdProp.getId()))
                .andExpect(jsonPath("$.data.title").value("Review Test Villa"))
                .andExpect(jsonPath("$.data.status").value("PENDING_VERIFICATION"))
                .andExpect(jsonPath("$.data.owner.fullName").value("Review Builder"));

        // 4. Verify public customer cannot view unapproved property directly
        mockMvc.perform(get("/api/properties/" + createdProp.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        // 5. Admin approves property via PUT /api/admin/properties/{id}/approve
        mockMvc.perform(put("/api/admin/properties/" + createdProp.getId() + "/approve")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.status").value("APPROVED"));

        // 6. Verify public customer CAN now view approved property details
        mockMvc.perform(get("/api/properties/" + createdProp.getId())
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(createdProp.getId()))
                .andExpect(jsonPath("$.data.status").value("APPROVED"));
    }
}
