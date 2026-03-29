package com.snapsage.backend.controller;

import com.snapsage.backend.security.UserDetailsImpl;
import com.snapsage.backend.service.PurchaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * PurchaseController — REST API for plan activation and status.
 *
 * POST /api/purchase/activate          → logged-in user activates their own plan
 * GET  /api/purchase/status            → logged-in user checks their status
 * POST /api/purchase/admin/grant       → admin grants access to any user by email
 */
@RestController
@RequestMapping("/api/purchase")
public class PurchaseController {

  @Autowired
  private PurchaseService purchaseService;

  /**
   * Activate a plan for the currently authenticated user.
   * Body: { "plan": "Basic" | "Professional" | "Enterprise" }
   */
  @PostMapping("/activate")
  public ResponseEntity<?> activatePlan(
      @AuthenticationPrincipal UserDetailsImpl userDetails,
      @RequestBody Map<String, String> body
  ) {
    try {
      String plan = body.getOrDefault("plan", "Basic");
      Map<String, Object> result = purchaseService.activatePlan(userDetails.getId(), plan);
      return ResponseEntity.ok(result);
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }

  /**
   * Get purchase/access status for the currently authenticated user.
   */
  @GetMapping("/status")
  public ResponseEntity<?> getStatus(@AuthenticationPrincipal UserDetailsImpl userDetails) {
    try {
      Map<String, Object> result = purchaseService.getPurchaseStatus(userDetails.getId());
      return ResponseEntity.ok(result);
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }

  /**
   * Admin-only: Grant paid access to any user by email.
   * Body: { "email": "user@example.com", "plan": "Professional" }
   */
  @PostMapping("/admin/grant")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<?> adminGrant(@RequestBody Map<String, String> body) {
    try {
      String email = body.get("email");
      String plan  = body.getOrDefault("plan", "Professional");
      if (email == null || email.isBlank()) {
        return ResponseEntity.badRequest().body(Map.of("error", "Email is required."));
      }
      Map<String, Object> result = purchaseService.adminGrantAccess(email, plan);
      return ResponseEntity.ok(result);
    } catch (RuntimeException e) {
      return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
    }
  }
}
