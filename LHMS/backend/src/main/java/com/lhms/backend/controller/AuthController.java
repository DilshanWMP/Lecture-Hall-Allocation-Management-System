package com.lhms.backend.controller;

import com.lhms.backend.dto.LoginRequest;
import com.lhms.backend.dto.LoginResponse;
import com.lhms.backend.entity.User;
import com.lhms.backend.service.AuthService;
import com.lhms.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AuthService authService;
    private final UserService userService;

    public AuthController(AuthenticationManager authenticationManager,
                          AuthService authService,
                          UserService userService) {
        this.authenticationManager = authenticationManager;
        this.authService = authService;
        this.userService = userService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = authService.generateToken(
                    (org.springframework.security.core.userdetails.User) authentication.getPrincipal()
            );

            Optional<User> user = userService.getUserByEmail(loginRequest.getEmail());
            boolean isAdmin = user.map(User::isAdmin).orElse(false);

            return ResponseEntity.ok(new LoginResponse(jwt, loginRequest.getEmail(), isAdmin));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        if (token != null && token.startsWith("Bearer ")) {
            String jwt = token.substring(7);
            if (authService.validateToken(jwt)) {
                return ResponseEntity.ok().body("Token is valid");
            }
        }
        return ResponseEntity.status(401).body("Invalid token");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        if (userService.getUserByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

}