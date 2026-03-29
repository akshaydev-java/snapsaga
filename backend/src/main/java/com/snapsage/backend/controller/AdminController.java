package com.snapsage.backend.controller;

import com.snapsage.backend.model.ReviewVideo;
import com.snapsage.backend.model.User;
import com.snapsage.backend.repository.ReviewVideoRepository;
import com.snapsage.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.snapsage.backend.security.UserDetailsImpl;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewVideoRepository reviewVideoRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/grant-premium/{id}")
    public ResponseEntity<?> grantPremiumAccess(@PathVariable String id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setHasPaidAccess(true);
            user.setPurchasePlan("Enterprise"); // Defaulting
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true, "message", "Premium access granted."));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "User not found"));
    }

    @GetMapping("/videos")
    public ResponseEntity<List<ReviewVideo>> getAllVideos() {
        return ResponseEntity.ok(reviewVideoRepository.findAll());
    }

    @DeleteMapping("/videos/{id}")
    public ResponseEntity<?> deleteVideo(@PathVariable String id) {
        reviewVideoRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PostMapping("/videos/{id}/status")
    public ResponseEntity<?> updateVideoStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        Optional<ReviewVideo> rvOpt = reviewVideoRepository.findById(id);
        if (rvOpt.isPresent()) {
            ReviewVideo rv = rvOpt.get();
            String status = body.get("status");
            if (status != null) {
                rv.setStatus(status.toUpperCase()); // e.g., APPROVED, REJECTED, DONE
                reviewVideoRepository.save(rv);
            }
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.badRequest().body(Map.of("error", "Video not found"));
    }

    @PostMapping("/seed")
    public ResponseEntity<?> seedData() {
        String[] products = {"iPhone 15 Pro", "Samsung S24 Ultra", "MacBook Air M3", "Sony WH-1000XM5", "iPad Pro"};
        String[] categories = {"Feedback", "Review", "Survey"};
        String[] statuses = {"APPROVED", "PENDING", "REJECTED"};
        String[] names = {"Alice Johnson", "Bob Smith", "Charlie Brown", "David Wilson", "Eva Green"};
        
        Random random = new Random();
        List<ReviewVideo> seeded = new ArrayList<>();

        for (int i = 0; i < 15; i++) {
            ReviewVideo rv = new ReviewVideo();
            String prod = products[random.nextInt(products.length)];
            String name = names[random.nextInt(names.length)];
            rv.setProductName(prod);
            rv.setProductId("PRD-" + (1000 + random.nextInt(9000)));
            rv.setReviewerName(name);
            rv.setEmail(name.toLowerCase().replace(" ", ".") + "@example.com"); // Populate email
            rv.setRating(1.0 + random.nextInt(5));
            rv.setCategory(categories[random.nextInt(categories.length)]);
            rv.setApprovalStatus(statuses[random.nextInt(statuses.length)]);
            rv.setUploadedAt(LocalDateTime.now().minusDays(random.nextInt(30)));
            rv.setTitle("Review for " + prod);
            rv.setDescription("This is a mock review generated for analytics demonstration.");
            rv.setSentimentScore(40.0 + random.nextDouble() * 60.0);
            rv.setSentiment(rv.getSentimentScore() > 70 ? "Positive" : (rv.getSentimentScore() > 40 ? "Neutral" : "Negative"));
            rv.setStatus("DONE");
            rv.setUserId("seed-user-id"); 
            
            reviewVideoRepository.save(rv);
            seeded.add(rv);
        }

        return ResponseEntity.ok(Map.of("success", true, "count", seeded.size(), "message", "Database seeded with 15 mock reviews."));
    }
}
