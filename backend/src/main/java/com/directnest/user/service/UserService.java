package com.directnest.user.service;

import com.directnest.auth.service.AuthService;
import com.directnest.common.dto.PagedResponse;
import com.directnest.exception.BadRequestException;
import com.directnest.exception.ResourceNotFoundException;
import com.directnest.user.dto.ChangePasswordRequest;
import com.directnest.user.dto.UpdateProfileRequest;
import com.directnest.user.dto.UserResponse;
import com.directnest.user.entity.Role;
import com.directnest.user.entity.User;
import com.directnest.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final AuthService authService;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, AuthService authService, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authService = authService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserResponse updateProfile(UpdateProfileRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone());
        user = userRepository.save(user);
        return authService.mapToUserResponse(user);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        User user = authService.getCurrentAuthenticatedUser();
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new BadRequestException("Incorrect current password");
        }
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new BadRequestException("New password cannot be the same as current password");
        }
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed for user id: {}", user.getId());
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserResponse> getAllUsers(int page, int size, Role role, Boolean active) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> userPage = userRepository.findAll(pageRequest);

        List<UserResponse> content = userPage.getContent().stream()
                .filter(u -> role == null || u.getRole() == role)
                .filter(u -> active == null || u.isActive() == active)
                .map(authService::mapToUserResponse)
                .collect(Collectors.toList());

        return PagedResponse.<UserResponse>builder()
                .content(content)
                .page(userPage.getNumber())
                .size(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .last(userPage.isLast())
                .build();
    }

    @Transactional
    public UserResponse toggleUserStatus(Long userId, boolean active) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setActive(active);
        user = userRepository.save(user);
        log.info("User {} active status set to: {}", userId, active);
        return authService.mapToUserResponse(user);
    }
}
