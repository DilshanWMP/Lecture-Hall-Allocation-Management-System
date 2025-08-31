package com.lhms.backend.controller;

import com.lhms.backend.dto.BookingRequest;
import com.lhms.backend.entity.Booking;
import com.lhms.backend.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:3000")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }

    @GetMapping("/date/{date}")
    public List<Booking> getBookingsByDate(@PathVariable LocalDate date) {
        return bookingService.getBookingsByDate(date);
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or #userId == authentication.principal.id")
    public List<Booking> getBookingsByUser(@PathVariable Long userId) {
        return bookingService.getBookingsByUser(userId);
    }

    @GetMapping("/hall/{hallId}/date/{date}")
    public List<Booking> getBookingsByHallAndDate(@PathVariable Long hallId, @PathVariable LocalDate date) {
        return bookingService.getBookingsByHallAndDate(hallId, date);
    }

    @GetMapping("/hall/{hallId}/date/{date}/available")
    public List<String> getAvailableTimeSlots(@PathVariable Long hallId, @PathVariable LocalDate date) {
        return bookingService.getAvailableTimeSlots(hallId, date);
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest bookingRequest, Authentication authentication) {
        try {
            // Get user ID from authentication (you'll need to implement this)
            // For now, using a placeholder - you'll need to modify this based on your user ID extraction
            Long userId = 1L; // Placeholder - implement proper user ID extraction

            Booking booking = new Booking();
            booking.setBookingDate(bookingRequest.getBookingDate());
            booking.setTimeSlot(bookingRequest.getTimeSlot());

            Booking createdBooking = bookingService.createBooking(
                    booking, userId, bookingRequest.getModuleId(), bookingRequest.getHallId()
            );

            return ResponseEntity.ok(createdBooking);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> updateBooking(@PathVariable Long id, @Valid @RequestBody Booking bookingDetails) {
        Booking updatedBooking = bookingService.updateBooking(id, bookingDetails);
        if (updatedBooking != null) {
            return ResponseEntity.ok(updatedBooking);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteBooking(@PathVariable Long id) {
        if (bookingService.getBookingById(id).isPresent()) {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

}