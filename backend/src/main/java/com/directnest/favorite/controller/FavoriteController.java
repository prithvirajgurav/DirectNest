package com.directnest.favorite.controller;

import com.directnest.common.dto.ApiResponse;
import com.directnest.common.dto.PagedResponse;
import com.directnest.favorite.dto.FavoriteResponse;
import com.directnest.favorite.service.FavoriteService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/customer/favorites")
@Tag(name = "Customer Favorites", description = "Endpoints for managing customer favorite properties")
@SecurityRequirement(name = "BearerAuth")
@PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @PostMapping("/{propertyId}")
    @Operation(summary = "Add property to favorites")
    public ResponseEntity<ApiResponse<Void>> addFavorite(@PathVariable Long propertyId) {
        favoriteService.addFavorite(propertyId);
        return ResponseEntity.ok(ApiResponse.success("Property added to favorites", null));
    }

    @DeleteMapping("/{propertyId}")
    @Operation(summary = "Remove property from favorites")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(@PathVariable Long propertyId) {
        favoriteService.removeFavorite(propertyId);
        return ResponseEntity.ok(ApiResponse.success("Property removed from favorites", null));
    }

    @GetMapping("/{propertyId}/check")
    @Operation(summary = "Check if property is favorited by current user")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkFavorite(@PathVariable Long propertyId) {
        boolean isFav = favoriteService.isFavorite(propertyId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("isFavorite", isFav)));
    }

    @GetMapping
    @Operation(summary = "Get current user's favorite properties")
    public ResponseEntity<ApiResponse<PagedResponse<FavoriteResponse>>> getMyFavorites(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PagedResponse<FavoriteResponse> response = favoriteService.getMyFavorites(page, size);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
