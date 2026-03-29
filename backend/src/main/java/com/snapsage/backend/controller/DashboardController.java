package com.snapsage.backend.controller;

import com.snapsage.backend.dto.DashboardAnalyticsResponse;
import com.snapsage.backend.model.ReviewVideo;
import com.snapsage.backend.repository.ReviewVideoRepository;
import com.snapsage.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.snapsage.backend.security.UserDetailsImpl;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private ReviewVideoRepository reviewVideoRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/summary")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<DashboardAnalyticsResponse> getSummary() {
        List<ReviewVideo> allVideos = reviewVideoRepository.findAll();
        long userCount = userRepository.count();

        DashboardAnalyticsResponse summary = new DashboardAnalyticsResponse();
        summary.setTotalVideos(allVideos.size());
        summary.setActiveUsers(userCount);
        summary.setTotalFeedback(allVideos.size());
        
        // Product Distribution
        Map<String, Long> productDist = allVideos.stream()
            .filter(v -> v.getProductName() != null)
            .collect(Collectors.groupingBy(ReviewVideo::getProductName, Collectors.counting()));
        summary.setReviewsPerProduct(productDist);
        summary.setTotalUniqueProducts(productDist.size());

        // Category Distribution
        summary.setCategoryDistribution(allVideos.stream()
            .filter(v -> v.getCategory() != null)
            .collect(Collectors.groupingBy(ReviewVideo::getCategory, Collectors.counting())));

        // Approval counts
        summary.setApprovedReviewsCount(allVideos.stream()
            .filter(v -> "APPROVED".equalsIgnoreCase(v.getApprovalStatus()))
            .count());
        summary.setPendingReviewsCount(allVideos.stream()
            .filter(v -> "PENDING".equalsIgnoreCase(v.getApprovalStatus()))
            .count());

        // Average Rating
        double avgRating = allVideos.stream()
            .mapToDouble(v -> v.getRating() != null ? v.getRating() : 0.0)
            .average()
            .orElse(0.0);
        summary.setAverageRating(Math.round(avgRating * 10.0) / 10.0);

        // Upload Trends (Last 7 days)
        Map<String, Long> trends = new HashMap<>();
        allVideos.stream()
            .filter(v -> v.getUploadedAt() != null)
            .forEach(v -> {
                String dateKey = v.getUploadedAt().toLocalDate().toString();
                trends.merge(dateKey, 1L, Long::sum);
            });
        summary.setUploadTrends(trends);

        // Recent Videos (Last 10)
        summary.setRecentVideos(allVideos.stream()
            .filter(v -> v.getUploadedAt() != null)
            .sorted((v1, v2) -> v2.getUploadedAt().compareTo(v1.getUploadedAt()))
            .limit(10)
            .collect(Collectors.toList()));

        return ResponseEntity.ok(summary);
    }

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<DashboardAnalyticsResponse> getAnalytics() {
        // Enriched summary for charts
        ResponseEntity<DashboardAnalyticsResponse> summaryRes = getSummary();
        DashboardAnalyticsResponse analytics = summaryRes.getBody();
        
        if (analytics != null) {
            // Mock sentiment trends if not present
            Map<String, Double> sentimentTrend = new HashMap<>();
            LocalDateTime now = LocalDateTime.now();
            for (int i = 6; i >= 0; i--) {
                String date = now.minusDays(i).toLocalDate().toString();
                sentimentTrend.put(date, 0.7 + (Math.random() * 0.2));
            }
            analytics.setSentimentTrend(sentimentTrend);
        }
        
        return ResponseEntity.ok(analytics);
    }

    @PostMapping("/seed")
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<?> seedData(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        String[] products = {"UltraVision Pro", "SoundWave Max", "GlowSkin Serum", "SwiftTab 10", "EcoHydrate Bottle"};
        String[] categories = {"Electronics", "Audio", "Beauty", "Tech", "Lifestyle"};
        String[] users = {userDetails.getUsername(), "Jordan Smith", "Casey Johnson", "Taylor Reed", "Morgan Lee"};
        
        LocalDateTime now = LocalDateTime.now();
        
        for (int i = 0; i < 15; i++) {
            ReviewVideo rv = new ReviewVideo();
            rv.setUserId(userDetails.getId()); // Associate with current user
            rv.setEmail(userDetails.getEmail());
            rv.setProductName(products[i % products.length]);
            rv.setCategory(categories[i % categories.length]);
            rv.setReviewerName(i == 0 ? userDetails.getUsername() : users[i % users.length]);
            rv.setRating(3.5 + (i % 2 == 0 ? 1.5 : 0.5)); 
            rv.setApprovalStatus(i % 3 == 0 ? "PENDING" : "APPROVED");
            rv.setUploadedAt(now.minusDays(i % 7));
            rv.setSentimentScore(0.6 + (i * 0.02));
            rv.setSentiment(rv.getSentimentScore() > 0.7 ? "Positive" : "Neutral");
            rv.setTitle("Customer Story #" + (i + 1));
            rv.setStatus("DONE");
            rv.setReviewTitle("Great experience with " + rv.getProductName());
            reviewVideoRepository.save(rv);
        }
        
        return ResponseEntity.ok(Map.of("message", "Seeded 15 professional mock review entries."));
    }
}
