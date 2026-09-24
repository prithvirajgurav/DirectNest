package com.directnest.auth.service;

import com.directnest.auth.dto.LoginRequest;
import com.directnest.auth.dto.LoginResponse;
import com.directnest.auth.dto.RegisterRequest;
import com.directnest.exception.BadRequestException;
import com.directnest.exception.DuplicateResourceException;
import com.directnest.exception.ResourceNotFoundException;
import com.directnest.exception.UnauthorizedException;
import com.directnest.security.JwtService;
import com.directnest.security.UserPrincipal;
import com.directnest.user.dto.UserResponse;
import com.directnest.user.entity.Role;
import com.directnest.user.entity.User;
import com.directnest.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("User already exists with email: " + request.getEmail());
        }

        if (request.getRole() == Role.ADMIN) {
            throw new BadRequestException("Cannot register as ADMIN directly");
        }

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName().trim())
                .phone(request.getPhone())
                .role(request.getRole())
                .active(true)
                .build();

        user = userRepository.save(user);
        log.info("Registered new user with id: {}, role: {}", user.getId(), user.getRole());

        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String token = jwtService.generateToken(userPrincipal, user.getId(), user.getRole().name());

        return LoginResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole().name())
                .build();
    }

    public LoginResponse login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail().toLowerCase().trim(),
                            request.getPassword()
                    )
            );

            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
            User user = userRepository.findByEmail(userPrincipal.getUsername())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found"));

            if (!user.isActive()) {
                throw new UnauthorizedException("Account is deactivated. Please contact support.");
            }

            String token = jwtService.generateToken(userPrincipal, user.getId(), user.getRole().name());
            log.info("User logged in successfully: {}", user.getEmail());

            return LoginResponse.builder()
                    .token(token)
                    .id(user.getId())
                    .email(user.getEmail())
                    .fullName(user.getFullName())
                    .role(user.getRole().name())
                    .build();
        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @Transactional(readOnly = true)
    public User getCurrentAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            throw new UnauthorizedException("User is not authenticated");
        }

        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Authenticated user not found in database"));
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUserResponse() {
        User user = getCurrentAuthenticatedUser();
        return mapToUserResponse(user);
    }

    public UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
