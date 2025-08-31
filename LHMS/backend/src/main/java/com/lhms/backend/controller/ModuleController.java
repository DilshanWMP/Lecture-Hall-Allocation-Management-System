package com.lhms.backend.controller;

import com.lhms.backend.entity.Module;
import com.lhms.backend.service.ModuleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/modules")
@CrossOrigin(origins = "http://localhost:3000")
public class ModuleController {

    private final ModuleService moduleService;

    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }

    @GetMapping
    public List<Module> getAllModules() {
        return moduleService.getAllModules();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Module> getModuleById(@PathVariable Long id) {
        return moduleService.getModuleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Module> searchModules(@RequestParam String query) {
        return moduleService.searchModules(query);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Module createModule(@Valid @RequestBody Module module) {
        return moduleService.createModule(module);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Module> updateModule(@PathVariable Long id, @Valid @RequestBody Module moduleDetails) {
        Module updatedModule = moduleService.updateModule(id, moduleDetails);
        if (updatedModule != null) {
            return ResponseEntity.ok(updatedModule);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteModule(@PathVariable Long id) {
        if (moduleService.getModuleById(id).isPresent()) {
            moduleService.deleteModule(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}