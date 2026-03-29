package com.snapsage.backend.controller;

import com.snapsage.backend.model.User;
import com.snapsage.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        String email = getAuthenticatedEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }
        return ResponseEntity.status(401).body(Map.of("error", "User not found"));
    }

    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates) {
        String email = getAuthenticatedEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (updates.containsKey("firstName")) user.setFirstName(updates.get("firstName"));
            if (updates.containsKey("lastName")) user.setLastName(updates.get("lastName"));
            if (updates.containsKey("phoneNumber")) user.setPhoneNumber(updates.get("phoneNumber"));
            if (updates.containsKey("profileImage")) user.setProfileImage(updates.get("profileImage"));
            
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(401).body(Map.of("error", "User not found"));
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        String email = getAuthenticatedEmail();
        Optional<User> userOpt = userRepository.findByEmail(email);
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String currentPassword = body.get("currentPassword");
            String newPassword = body.get("newPassword");
            
            if (currentPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Missing password fields"));
            }
            
            if (!encoder.matches(currentPassword, user.getPassword())) {
                return ResponseEntity.badRequest().body(Map.of("error", "Incorrect current password"));
            }
            
            user.setPassword(encoder.encode(newPassword));
            userRepository.save(user);
            return ResponseEntity.ok(Map.of("success", true, "message", "Password changed successfully"));
        }
        return ResponseEntity.status(401).body(Map.of("error", "User not found"));
    }

    private String getAuthenticatedEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            return ((UserDetails) principal).getUsername();
        } else {
            return principal.toString();
        }
    }
}
