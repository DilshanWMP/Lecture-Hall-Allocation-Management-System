package com.lhms.backend.service;

import com.lhms.backend.entity.User;
import com.lhms.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User createUser(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(userDetails.getEmail());
            if (userDetails.getPasswordHash() != null && !userDetails.getPasswordHash().isEmpty()) {
                user.setPasswordHash(passwordEncoder.encode(userDetails.getPasswordHash()));
            }
            user.setAdmin(userDetails.isAdmin());
            return userRepository.save(user);
        }).orElse(null);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}