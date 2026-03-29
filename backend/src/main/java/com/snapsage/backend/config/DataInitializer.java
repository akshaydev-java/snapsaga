package com.snapsage.backend.config;

import com.snapsage.backend.model.ERole;
import com.snapsage.backend.model.Role;
import com.snapsage.backend.model.User;
import com.snapsage.backend.model.ReviewVideo;
import com.snapsage.backend.repository.RoleRepository;
import com.snapsage.backend.repository.UserRepository;
import com.snapsage.backend.repository.ReviewVideoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Set;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReviewVideoRepository reviewVideoRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // 1. Initialize Roles
        if (roleRepository.count() == 0) {
            roleRepository.saveAll(List.of(
                new Role(ERole.ROLE_USER),
                new Role(ERole.ROLE_ADMIN)
            ));
            System.out.println("Default roles added to MongoDB.");
        }

        // 2. Initialize Admin User
        if (!userRepository.existsByEmail("admin@snapsage.com")) {
            User admin = new User("System", "Admin", "admin@snapsage.com", passwordEncoder.encode("admin123"));
            Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Role 'ROLE_ADMIN' is not found."));
            admin.setRoles(Set.of(adminRole));
            admin.setHasPaidAccess(true);
            admin.setPurchasePlan("Professional");
            userRepository.save(admin);
            System.out.println("Default admin user created: admin@snapsage.com / admin123");
        } else {
            // Ensure existing admin has proper roles and paid access for demo purposes
            userRepository.findByEmail("admin@snapsage.com").ifPresent(admin -> {
                boolean updated = false;
                
                // Ensure ROLE_ADMIN
                Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                    .orElseThrow(() -> new RuntimeException("Error: Role 'ROLE_ADMIN' is not found."));
                
                if (admin.getRoles() == null || !admin.getRoles().contains(adminRole)) {
                    admin.getRoles().add(adminRole);
                    updated = true;
                }

                if (!admin.isHasPaidAccess()) {
                    admin.setHasPaidAccess(true);
                    admin.setPurchasePlan("Professional");
                    updated = true;
                }
                
                if (updated) {
                    userRepository.save(admin);
                    System.out.println("Admin user credentials/roles synchronized.");
                }
            });
        }

        // 3. Initialize Mock Review Videos
        if (reviewVideoRepository.count() == 0) {
            userRepository.findByEmail("admin@snapsage.com").ifPresent(admin -> {
                ReviewVideo v1 = new ReviewVideo();
                v1.setUserId(admin.getId());
                v1.setCustomerName("John Doe");
                v1.setEmail("john.doe@example.com");
                v1.setPurchasePlan("Professional");
                v1.setVideoFileName("customer_feedback_01.mp4");
                v1.setVideoSizeBytes(15420000);
                v1.setTranscript("The interface is incredibly smooth and the video quality is top-notch. I love how fast the analytics work.");
                v1.setSentiment("Positive");
                v1.setKeywords(List.of("smooth", "quality", "analytics"));
                v1.setMentionedRating("5/5");
                v1.setMentionedProduct("Snapsage Pro");
                v1.setStatus("DONE");
                v1.setUploadedAt(LocalDateTime.now().minusDays(2));

                ReviewVideo v2 = new ReviewVideo();
                v2.setUserId(admin.getId());
                v2.setCustomerName("Sarah Smith");
                v2.setEmail("sarah.s@techcorp.com");
                v2.setPurchasePlan("Professional");
                v2.setVideoFileName("review_july.mov");
                v2.setVideoSizeBytes(25800000);
                v2.setTranscript("I had some trouble finding the export button at first, but once I did, the Excel report was very detailed.");
                v2.setSentiment("Neutral");
                v2.setKeywords(List.of("export", "Excel", "detailed"));
                v2.setMentionedRating("4/5");
                v2.setMentionedProduct("Snapsage Research");
                v2.setStatus("DONE");
                v2.setUploadedAt(LocalDateTime.now().minusHours(5));

                reviewVideoRepository.saveAll(List.of(v1, v2));
                System.out.println("Mock review videos added for admin@snapsage.com");
            });
        }
    }
}
