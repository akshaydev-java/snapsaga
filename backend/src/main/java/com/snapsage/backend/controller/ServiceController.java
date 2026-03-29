package com.snapsage.backend.controller;

import com.snapsage.backend.model.ServiceModel;
import com.snapsage.backend.repository.ServiceModelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceModelRepository repository;

    @GetMapping
    public List<ServiceModel> getAllServices() {
        return repository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> addService(@RequestBody ServiceModel service) {
        ServiceModel saved = repository.save(service);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteService(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.ok("Service deleted successfully.");
    }
}
