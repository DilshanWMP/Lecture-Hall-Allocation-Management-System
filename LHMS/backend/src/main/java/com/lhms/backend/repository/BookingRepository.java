package com.lhms.backend.repository;

import com.lhms.backend.entity.Booking;
import com.lhms.backend.entity.LectureHall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByBookingDate(LocalDate date);

    @Query("SELECT b FROM Booking b WHERE b.lectureHall.hallId = :hallId AND b.bookingDate = :date")
    List<Booking> findByHallAndDate(@Param("hallId") Long hallId, @Param("date") LocalDate date);

    @Query("SELECT b FROM Booking b WHERE b.lectureHall.hallId = :hallId AND b.bookingDate = :date AND b.timeSlot = :timeSlot")
    Optional<Booking> findByHallDateAndTimeSlot(@Param("hallId") Long hallId,
                                                @Param("date") LocalDate date,
                                                @Param("timeSlot") String timeSlot);

    List<Booking> findByUserUserId(Long userId);
}