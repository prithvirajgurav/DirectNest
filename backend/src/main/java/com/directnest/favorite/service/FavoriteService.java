package com.directnest.favorite.service;

import com.directnest.auth.service.AuthService;
import com.directnest.common.dto.PagedResponse;
import com.directnest.exception.DuplicateResourceException;
import com.directnest.exception.ResourceNotFoundException;
import com.directnest.favorite.dto.FavoriteResponse;
import com.directnest.favorite.entity.Favorite;
import com.directnest.favorite.repository.FavoriteRepository;
import com.directnest.property.dto.PropertyListResponse;
import com.directnest.property.entity.Property;
import com.directnest.property.entity.PropertyImage;
import com.directnest.property.repository.PropertyImageRepository;
import com.directnest.property.repository.PropertyRepository;
import com.directnest.user.entity.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FavoriteService {

    private static final Logger log = LoggerFactory.getLogger(FavoriteService.class);

    private final FavoriteRepository favoriteRepository;
    private final PropertyRepository propertyRepository;
    private final PropertyImageRepository propertyImageRepository;
    private final AuthService authService;

    public FavoriteService(FavoriteRepository favoriteRepository,
                           PropertyRepository propertyRepository,
                           PropertyImageRepository propertyImageRepository,
                           AuthService authService) {
        this.favoriteRepository = favoriteRepository;
        this.propertyRepository = propertyRepository;
        this.propertyImageRepository = propertyImageRepository;
        this.authService = authService;
    }

    @Transactional
    public void addFavorite(Long propertyId) {
        User user = authService.getCurrentAuthenticatedUser();
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Property", "id", propertyId));

        if (favoriteRepository.existsByUserIdAndPropertyId(user.getId(), propertyId)) {
            throw new DuplicateResourceException("Property already in favorites");
        }

        Favorite favorite = new Favorite(user, property);
        favoriteRepository.save(favorite);
        log.info("User {} favorited property {}", user.getId(), propertyId);
    }

    @Transactional
    public void removeFavorite(Long propertyId) {
        User user = authService.getCurrentAuthenticatedUser();
        Favorite favorite = favoriteRepository.findByUserIdAndPropertyId(user.getId(), propertyId)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found for property id: " + propertyId));

        favoriteRepository.delete(favorite);
        log.info("User {} removed favorite for property {}", user.getId(), propertyId);
    }

    @Transactional(readOnly = true)
    public boolean isFavorite(Long propertyId) {
        User user = authService.getCurrentAuthenticatedUser();
        return favoriteRepository.existsByUserIdAndPropertyId(user.getId(), propertyId);
    }

    @Transactional(readOnly = true)
    public PagedResponse<FavoriteResponse> getMyFavorites(int page, int size) {
        User user = authService.getCurrentAuthenticatedUser();
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Favorite> favorites = favoriteRepository.findByUserIdWithProperty(user.getId(), pageRequest);

        List<FavoriteResponse> content = favorites.getContent().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PagedResponse.<FavoriteResponse>builder()
                .content(content)
                .page(favorites.getNumber())
                .size(favorites.getSize())
                .totalElements(favorites.getTotalElements())
                .totalPages(favorites.getTotalPages())
                .last(favorites.isLast())
                .build();
    }

    private FavoriteResponse mapToResponse(Favorite favorite) {
        FavoriteResponse response = new FavoriteResponse();
        response.setId(favorite.getId());
        response.setUserId(favorite.getUser().getId());
        response.setCreatedAt(favorite.getCreatedAt());

        Property p = favorite.getProperty();
        PropertyListResponse propResp = new PropertyListResponse();
        propResp.setId(p.getId());
        if (p.getUser() != null) {
            propResp.setOwnerId(p.getUser().getId());
            propResp.setOwnerName(p.getUser().getFullName());
            propResp.setOwnerEmail(p.getUser().getEmail());
            propResp.setOwnerPhone(p.getUser().getPhone());
        }
        propResp.setTitle(p.getTitle());
        propResp.setPropertyType(p.getPropertyType());
        propResp.setListingType(p.getListingType());
        propResp.setPrice(p.getPrice());
        propResp.setPriceNegotiable(p.isPriceNegotiable());
        propResp.setAreaSqft(p.getAreaSqft());
        propResp.setBedrooms(p.getBedrooms());
        propResp.setBathrooms(p.getBathrooms());
        propResp.setFurnishingStatus(p.getFurnishingStatus());
        propResp.setLocality(p.getLocality());
        propResp.setCity(p.getCity());
        propResp.setState(p.getState());
        propResp.setStatus(p.getStatus());
        propResp.setFeatured(p.isFeatured());
        propResp.setViewsCount(p.getViewsCount());
        propResp.setCreatedAt(p.getCreatedAt());

        List<PropertyImage> images = propertyImageRepository.findByPropertyIdOrderByDisplayOrderAsc(p.getId());
        if (!images.isEmpty()) {
            PropertyImage primary = images.stream().filter(PropertyImage::isPrimary).findFirst().orElse(images.get(0));
            propResp.setPrimaryImageUrl(primary.getImageUrl());
        }

        response.setProperty(propResp);
        return response;
    }
}
