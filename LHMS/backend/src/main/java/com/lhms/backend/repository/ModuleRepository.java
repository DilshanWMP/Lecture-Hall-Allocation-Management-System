package com.lhms.backend.repository;

import com.lhms.backend.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
    Optional<Module> findByModuleCode(String moduleCode);
    boolean existsByModuleCode(String moduleCode);
}