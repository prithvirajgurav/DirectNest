package com.directnest.user.repository;

import com.directnest.user.entity.Role;
import com.directnest.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    long countByRole(Role role);

    Page<User> findByRole(Role role, Pageable pageable);

    Page<User> findByActive(boolean active, Pageable pageable);

    Page<User> findByRoleAndActive(Role role, boolean active, Pageable pageable);
}
