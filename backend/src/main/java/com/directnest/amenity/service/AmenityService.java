package com.directnest.amenity.service;

import com.directnest.amenity.entity.Amenity;
import com.directnest.amenity.repository.AmenityRepository;
import com.directnest.exception.DuplicateResourceException;
import com.directnest.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AmenityService {

    private final AmenityRepository amenityRepository;

    public AmenityService(AmenityRepository amenityRepository) {
        this.amenityRepository = amenityRepository;
    }

    @Transactional(readOnly = true)
    public List<Amenity> getAllAmenities() {
        return amenityRepository.findAllByOrderByNameAsc();
    }

    @Transactional(readOnly = true)
    public Amenity getAmenityById(Long id) {
        return amenityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Amenity", "id", id));
    }

    @Transactional
    public Amenity createAmenity(Amenity amenity) {
        if (amenityRepository.existsByName(amenity.getName())) {
            throw new DuplicateResourceException("Amenity with name '" + amenity.getName() + "' already exists");
        }
        return amenityRepository.save(amenity);
    }
}
