package com.lhms.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.lang.reflect.Field;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AuthServiceTest {

    @Test
    void generateAndValidateToken() throws Exception {
        AuthService authService = new AuthService();

        // set private fields via reflection for test
        Field secret = AuthService.class.getDeclaredField("secret");
        secret.setAccessible(true);
        secret.set(authService, "01234567890123456789012345678901"); // 32 chars

        Field exp = AuthService.class.getDeclaredField("expiration");
        exp.setAccessible(true);
        exp.set(authService, 3600_000L); // 1 hour

        UserDetails ud = new User("alice@example.com", "pwd", List.of());

        String token = authService.generateToken(ud);
        assertNotNull(token);

        assertTrue(authService.validateToken(token));
        assertEquals("alice@example.com", authService.extractUsername(token));
    }
}
