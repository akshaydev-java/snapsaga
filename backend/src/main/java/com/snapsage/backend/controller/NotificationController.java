package com.snapsage.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'USER')")
    public ResponseEntity<List<Map<String, String>>> getNotifications() {
        List<Map<String, String>> notifications = new ArrayList<>();
        
        Map<String, String> n1 = new HashMap<>();
        n1.put("id", "1");
        n1.put("title", "Analysis Complete");
        n1.put("message", "Your latest product review video has been analyzed.");
        n1.put("time", "2 hours ago");
        n1.put("type", "SUCCESS");
        
        Map<String, String> n2 = new HashMap<>();
        n2.put("id", "2");
        n2.put("title", "New Review Received");
        n2.put("message", "A new customer review for 'UltraVision Pro' is pending approval.");
        n2.put("time", "5 hours ago");
        n2.put("type", "INFO");
        
        Map<String, String> n3 = new HashMap<>();
        n3.put("id", "3");
        n3.put("title", "Export Ready");
        n3.put("message", "Your summary report for March is ready for download.");
        n3.put("time", "1 day ago");
        n3.put("type", "INFO");

        notifications.add(n1);
        notifications.add(n2);
        notifications.add(n3);

        return ResponseEntity.ok(notifications);
    }
}
