package com.lhms.backend.dto;

public class LoginResponse {
    private String token;
    private String email;
    private boolean isAdmin;

    // Constructors
    public LoginResponse() {}

    public LoginResponse(String token, String email, boolean isAdmin) {
        this.token = token;
        this.email = email;
        this.isAdmin = isAdmin;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isAdmin() { return isAdmin; }
    public void setAdmin(boolean admin) { isAdmin = admin; }
}