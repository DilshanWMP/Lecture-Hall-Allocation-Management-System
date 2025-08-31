package com.lhms.backend.service;

import com.lhms.backend.entity.LectureHall;
import com.lhms.backend.repository.LectureHallRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class LectureHallService {

    private final LectureHallRepository lectureHallRepository;

    public LectureHallService(LectureHallRepository lectureHallRepository) {
        this.lectureHallRepository = lectureHallRepository;
    }

    public List<LectureHall> getAllLectureHalls() {
        return lectureHallRepository.findAll();
    }

    public Optional<LectureHall> getLectureHallById(Long id) {
        return lectureHallRepository.findById(id);
    }

    public Optional<LectureHall> getLectureHallByName(String hallName) {
        return lectureHallRepository.findByHallName(hallName);
    }

    public LectureHall createLectureHall(LectureHall lectureHall) {
        return lectureHallRepository.save(lectureHall);
    }

    public LectureHall updateLectureHall(Long id, LectureHall lectureHallDetails) {
        return lectureHallRepository.findById(id).map(lectureHall -> {
            lectureHall.setHallName(lectureHallDetails.getHallName());
            lectureHall.setCapacity(lectureHallDetails.getCapacity());
            lectureHall.setFacilities(lectureHallDetails.getFacilities());
            return lectureHallRepository.save(lectureHall);
        }).orElse(null);
    }

    public void deleteLectureHall(Long id) {
        lectureHallRepository.deleteById(id);
    }

    public boolean existsByHallName(String hallName) {
        return lectureHallRepository.existsByHallName(hallName);
    }
}