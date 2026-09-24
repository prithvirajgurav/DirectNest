package com.directnest.amenity.controller;

import com.directnest.amenity.entity.Amenity;
import com.directnest.amenity.service.AmenityService;
import com.directnest.common.dto.ApiResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amenities")
@Tag(name = "Amenities", description = "Property amenities management and listing")
public class AmenityController {

    private final AmenityService amenityService;

    public AmenityController(AmenityService amenityService) {
        this.amenityService = amenityService;
    }

    @GetMapping
    @Operation(summary = "Get all available property amenities")
    public ResponseEntity<ApiResponse<List<Amenity>>> getAllAmenities() {
        List<Amenity> list = amenityService.getAllAmenities();
        return ResponseEntity.ok(ApiResponse.success("Amenities retrieved", list));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new amenity (Admin only)")
    public ResponseEntity<ApiResponse<Amenity>> createAmenity(@RequestBody Amenity amenity) {
        Amenity saved = amenityService.createAmenity(amenity);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Amenity created successfully", saved));
    }
}
