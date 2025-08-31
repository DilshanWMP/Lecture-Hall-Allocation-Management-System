package com.lhms.backend.dto;

import java.time.LocalDate;

public class BookingRequest {
    private Long moduleId;
    private Long hallId;
    private LocalDate bookingDate;
    private String timeSlot;

    // Constructors
    public BookingRequest() {}

    public BookingRequest(Long moduleId, Long hallId, LocalDate bookingDate, String timeSlot) {
        this.moduleId = moduleId;
        this.hallId = hallId;
        this.bookingDate = bookingDate;
        this.timeSlot = timeSlot;
    }

    // Getters and Setters
    public Long getModuleId() { return moduleId; }
    public void setModuleId(Long moduleId) { this.moduleId = moduleId; }

    public Long getHallId() { return hallId; }
    public void setHallId(Long hallId) { this.hallId = hallId; }

    public LocalDate getBookingDate() { return bookingDate; }
    public void setBookingDate(LocalDate bookingDate) { this.bookingDate = bookingDate; }

    public String getTimeSlot() { return timeSlot; }
    public void setTimeSlot(String timeSlot) { this.timeSlot = timeSlot; }
}