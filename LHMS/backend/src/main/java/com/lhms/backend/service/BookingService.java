package com.lhms.backend.service;

import com.lhms.backend.entity.Booking;
import com.lhms.backend.entity.LectureHall;
import com.lhms.backend.entity.Module;
import com.lhms.backend.entity.User;
import com.lhms.backend.repository.BookingRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final UserService userService;
    private final ModuleService moduleService;
    private final LectureHallService lectureHallService;

    public BookingService(BookingRepository bookingRepository,
                          UserService userService,
                          ModuleService moduleService,
                          LectureHallService lectureHallService) {
        this.bookingRepository = bookingRepository;
        this.userService = userService;
        this.moduleService = moduleService;
        this.lectureHallService = lectureHallService;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> getBookingsByDate(LocalDate date) {
        return bookingRepository.findByBookingDate(date);
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserUserId(userId);
    }

    public List<Booking> getBookingsByHallAndDate(Long hallId, LocalDate date) {
        return bookingRepository.findByHallAndDate(hallId, date);
    }

    public Booking createBooking(Booking booking, Long userId, Long moduleId, Long hallId) {
        Optional<User> user = userService.getUserById(userId);
        Optional<Module> module = moduleService.getModuleById(moduleId);
        Optional<LectureHall> lectureHall = lectureHallService.getLectureHallById(hallId);

        if (user.isPresent() && module.isPresent() && lectureHall.isPresent()) {
            booking.setUser(user.get());
            booking.setModule(module.get());
            booking.setLectureHall(lectureHall.get());

            // Check for conflicting bookings
            Optional<Booking> existingBooking = bookingRepository.findByHallDateAndTimeSlot(
                    hallId, booking.getBookingDate(), booking.getTimeSlot());

            if (existingBooking.isPresent()) {
                throw new RuntimeException("Time slot already booked for this hall");
            }

            return bookingRepository.save(booking);
        }
        throw new RuntimeException("Invalid user, module, or lecture hall");
    }

    public Booking updateBooking(Long id, Booking bookingDetails) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setBookingDate(bookingDetails.getBookingDate());
            booking.setTimeSlot(bookingDetails.getTimeSlot());
            booking.setStatus(bookingDetails.getStatus());
            return bookingRepository.save(booking);
        }).orElse(null);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);

    }

    public List<String> getAvailableTimeSlots(Long hallId, LocalDate date) {
        List<String> allTimeSlots = List.of(
                "8:00 - 8:55", "8:55 - 9:50", "9:50 - 10:45", "10:45 - 11:40",
                "11:40 - 12:35", "12:35 - 13:30", "13:30 - 14:25", "14:25 - 15:20",
                "15:20 - 16:15", "16:15 - 17:10", "17:10 - 18:05"
        );

        List<Booking> existingBookings = bookingRepository.findByHallAndDate(hallId, date);
        List<String> bookedTimeSlots = existingBookings.stream()
                .map(Booking::getTimeSlot)
                .toList();

        return allTimeSlots.stream()
                .filter(timeSlot -> !bookedTimeSlots.contains(timeSlot))
                .toList();
    }

    public boolean isTimeSlotAvailable(Long hallId, LocalDate date, String timeSlot) {
        Optional<Booking> existingBooking = bookingRepository.findByHallDateAndTimeSlot(hallId, date, timeSlot);
        return existingBooking.isEmpty();
    }
}