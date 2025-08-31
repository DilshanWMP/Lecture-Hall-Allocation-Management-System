package com.lhms.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "lecture_halls")
public class LectureHall {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hallId;

    @NotBlank
    @Column(unique = true)
    private String hallName;

    private Integer capacity;

    private String facilities;

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
    public LectureHall() {}

    public LectureHall(String hallName, Integer capacity, String facilities) {
        this.hallName = hallName;
        this.capacity = capacity;
        this.facilities = facilities;
    }

    // Getters and Setters
    public Long getHallId() { return hallId; }
    public void setHallId(Long hallId) { this.hallId = hallId; }

    public String getHallName() { return hallName; }
    public void setHallName(String hallName) { this.hallName = hallName; }

    public Integer getCapacity() { return capacity; }
    public void setCapacity(Integer capacity) { this.capacity = capacity; }

    public String getFacilities() { return facilities; }
    public void setFacilities(String facilities) { this.facilities = facilities; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}