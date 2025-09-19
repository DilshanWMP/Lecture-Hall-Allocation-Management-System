package com.lhms.backend.service;

import com.lhms.backend.entity.Booking;
import com.lhms.backend.entity.LectureHall;
import com.lhms.backend.entity.Module;
import com.lhms.backend.entity.User;
import com.lhms.backend.repository.BookingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserService userService;

    @Mock
    private ModuleService moduleService;

    @Mock
    private LectureHallService lectureHallService;

    @InjectMocks
    private BookingService bookingService;

    private Booking testBooking;
    private User testUser;
    private Module testModule;
    private LectureHall testHall;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setUserId(1L);
        testUser.setEmail("admin@eng.ruh.ac.lk");

        testModule = new Module();
        testModule.setModuleId(1L);
        testModule.setModuleCode("CS101");

        testHall = new LectureHall();
        testHall.setHallId(1L);
        testHall.setHallName("Auditorium");

        testBooking = new Booking();
        testBooking.setBookingId(1L);
        testBooking.setUser(testUser);
        testBooking.setModule(testModule);
        testBooking.setLectureHall(testHall);
        testBooking.setBookingDate(LocalDate.now());
        testBooking.setTimeSlot("8:30 - 9:30");
    }

    @Test
    void createBooking_WithValidData_ShouldReturnBooking() {
        // Arrange
        when(userService.getUserById(1L)).thenReturn(Optional.of(testUser));
        when(moduleService.getModuleById(1L)).thenReturn(Optional.of(testModule));
        when(lectureHallService.getLectureHallById(1L)).thenReturn(Optional.of(testHall));
        when(bookingRepository.findByHallDateAndTimeSlot(any(), any(), any())).thenReturn(Optional.empty());
        when(bookingRepository.save(any(Booking.class))).thenReturn(testBooking);

        // Act
        Booking createdBooking = bookingService.createBooking(testBooking, 1L, 1L, 1L);

        // Assert
        assertNotNull(createdBooking);
        assertEquals(1L, createdBooking.getBookingId());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void createBooking_WithConflict_ShouldThrowException() {
        // Arrange
        when(userService.getUserById(1L)).thenReturn(Optional.of(testUser));
        when(moduleService.getModuleById(1L)).thenReturn(Optional.of(testModule));
        when(lectureHallService.getLectureHallById(1L)).thenReturn(Optional.of(testHall));
        when(bookingRepository.findByHallDateAndTimeSlot(any(), any(), any())).thenReturn(Optional.of(testBooking));

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            bookingService.createBooking(testBooking, 1L, 1L, 1L);
        });
    }
}