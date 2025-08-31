package com.lhms.backend.controller;

import com.lhms.backend.entity.LectureHall;
import com.lhms.backend.service.LectureHallService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/lecturehalls")
@CrossOrigin(origins = "http://localhost:3000")
public class LectureHallController {

    private final LectureHallService lectureHallService;

    public LectureHallController(LectureHallService lectureHallService) {
        this.lectureHallService = lectureHallService;
    }

    @GetMapping
    public List<LectureHall> getAllLectureHalls() {
        return lectureHallService.getAllLectureHalls();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LectureHall> getLectureHallById(@PathVariable Long id) {
        return lectureHallService.getLectureHallById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public LectureHall createLectureHall(@Valid @RequestBody LectureHall lectureHall) {
        return lectureHallService.createLectureHall(lectureHall);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LectureHall> updateLectureHall(@PathVariable Long id, @Valid @RequestBody LectureHall lectureHallDetails) {
        LectureHall updatedLectureHall = lectureHallService.updateLectureHall(id, lectureHallDetails);
        if (updatedLectureHall != null) {
            return ResponseEntity.ok(updatedLectureHall);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteLectureHall(@PathVariable Long id) {
        if (lectureHallService.getLectureHallById(id).isPresent()) {
            lectureHallService.deleteLectureHall(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}