package com.lhms.backend.repository;

import com.lhms.backend.entity.LectureHall;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LectureHallRepository extends JpaRepository<LectureHall, Long> {
    Optional<LectureHall> findByHallName(String hallName);
    boolean existsByHallName(String hallName);
}