package com.lhms.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"hall_id", "booking_date", "time_slot"})
})
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @ManyToOne
    @JoinColumn(name = "hall_id", nullable = false)
    private LectureHall lectureHall;

    private LocalDate bookingDate;

    @NotBlank
    private String timeSlot;

    private String status = "confirmed";

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public Booking() {}

    public Booking(User user, Module module, LectureHall lectureHall, LocalDate bookingDate, String timeSlot) {
        this.user = user;
        this.module = module;
        this.lectureHall = lectureHall;
        this.bookingDate = bookingDate;
        this.timeSlot = timeSlot;
    }

    // Getters and Setters
    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Module getModule() { return module; }
    public void setModule(Module module) { this.module = module; }

    public LectureHall getLectureHall() { return lectureHall; }
    public void setLectureHall(LectureHall lectureHall) { this.lectureHall = lectureHall; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}