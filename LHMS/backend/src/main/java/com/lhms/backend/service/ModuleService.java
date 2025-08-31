package com.lhms.backend.service;

import com.lhms.backend.entity.Module;
import com.lhms.backend.repository.ModuleRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public ModuleService(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    public Optional<Module> getModuleById(Long id) {
        return moduleRepository.findById(id);
    }

    public Optional<Module> getModuleByCode(String moduleCode) {
        return moduleRepository.findByModuleCode(moduleCode);
    }

    public Module createModule(Module module) {
        return moduleRepository.save(module);
    }

    public Module updateModule(Long id, Module moduleDetails) {
        return moduleRepository.findById(id).map(module -> {
            module.setModuleCode(moduleDetails.getModuleCode());
            module.setModuleName(moduleDetails.getModuleName());
            module.setDescription(moduleDetails.getDescription());
            return moduleRepository.save(module);
        }).orElse(null);
    }

    public void deleteModule(Long id) {
        moduleRepository.deleteById(id);
    }

    public boolean existsByModuleCode(String moduleCode) {
        return moduleRepository.existsByModuleCode(moduleCode);
    }

    public List<Module> searchModules(String query) {
        return moduleRepository.findAll().stream()
                .filter(module -> module.getModuleCode().toLowerCase().contains(query.toLowerCase()) ||
                        module.getModuleName().toLowerCase().contains(query.toLowerCase()))
                .toList();
    }
}