package com.lhms.backend.controller;

import com.lhms.backend.dto.BookingRequest;
import com.lhms.backend.entity.Booking;
import com.lhms.backend.entity.User;
import com.lhms.backend.service.BookingService;
import com.lhms.backend.service.UserService;
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
    private final UserService userService;


    public BookingController(BookingService bookingService, UserService userService) {
        this.bookingService = bookingService;
        this.userService = userService;
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
    // ⚠️ changed principal.id check (Spring User doesn’t expose id)
    @PreAuthorize("hasRole('ADMIN') or #userId == @userService.getUserByEmail(authentication.name).get().userId")
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
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest req, Authentication auth) {
        String email = auth.getName();  // Comes from JwtAuthenticationFilter
        User currentUser = userService.getUserByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Booking booking = new Booking();
        booking.setBookingDate(req.getBookingDate());
        booking.setTimeSlot(req.getTimeSlot());

        Booking created = bookingService.createBooking(
                booking, currentUser.getUserId(), req.getModuleId(), req.getHallId()
        );

        return ResponseEntity.ok(created);
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
