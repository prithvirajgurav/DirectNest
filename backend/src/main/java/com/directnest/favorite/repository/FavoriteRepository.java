package com.directnest.favorite.repository;

import com.directnest.favorite.entity.Favorite;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    Optional<Favorite> findByUserIdAndPropertyId(Long userId, Long propertyId);

    boolean existsByUserIdAndPropertyId(Long userId, Long propertyId);

    void deleteByUserIdAndPropertyId(Long userId, Long propertyId);

    @Query("SELECT f FROM Favorite f JOIN FETCH f.property p LEFT JOIN FETCH p.images WHERE f.user.id = :userId")
    Page<Favorite> findByUserIdWithProperty(@Param("userId") Long userId, Pageable pageable);
}
