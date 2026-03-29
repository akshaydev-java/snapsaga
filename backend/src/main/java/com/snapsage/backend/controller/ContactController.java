package com.snapsage.backend.controller;

import com.snapsage.backend.model.ContactInquiry;
import com.snapsage.backend.repository.ContactInquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/contact")
public class ContactController {

    @Autowired
    private ContactInquiryRepository repository;

    @PostMapping
    public ResponseEntity<?> submitContactForm(@RequestBody ContactInquiry inquiry) {
        repository.save(inquiry);
        return ResponseEntity.ok("Inquiry saved successfully.");
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<ContactInquiry> getAllInquiries() {
        return repository.findAll();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteInquiry(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.ok("Inquiry deleted successfully.");
    }
}
