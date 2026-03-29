package com.snapsage.backend.service;

import com.snapsage.backend.model.User;
import com.snapsage.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * PurchaseService — manages paid plan activation and status checks.
 *
 * Payment is simulated: calling activatePlan() immediately grants access.
 * In production, replace this with a real payment gateway (Stripe, Razorpay, etc.)
 * and only call activatePlan() after a confirmed webhook/callback.
 */
@Service
public class PurchaseService {

  @Autowired
  private UserRepository userRepository;

  /**
   * Activate a paid plan for the given user.
   * @param userId  MongoDB user ID
   * @param plan    Plan name: "Basic", "Professional", "Enterprise"
   */
  public Map<String, Object> activatePlan(String userId, String plan) {
    Optional<User> opt = userRepository.findById(userId);
    if (opt.isEmpty()) {
      throw new RuntimeException("User not found: " + userId);
    }
    User user = opt.get();
    user.setHasPaidAccess(true);
    user.setPurchasePlan(plan);
    userRepository.save(user);

    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("message", "Plan '" + plan + "' activated successfully!");
    result.put("hasPaidAccess", true);
    result.put("purchasePlan", plan);
    return result;
  }

  /**
   * Get the purchase status for a user.
   */
  public Map<String, Object> getPurchaseStatus(String userId) {
    Optional<User> opt = userRepository.findById(userId);
    if (opt.isEmpty()) {
      throw new RuntimeException("User not found: " + userId);
    }
    User user = opt.get();
    Map<String, Object> result = new HashMap<>();
    result.put("hasPaidAccess", user.isHasPaidAccess());
    result.put("purchasePlan", user.getPurchasePlan() != null ? user.getPurchasePlan() : "");
    return result;
  }

  /**
   * Admin-only: Grant paid access to any user by their email.
   */
  public Map<String, Object> adminGrantAccess(String email, String plan) {
    Optional<User> opt = userRepository.findByEmail(email);
    if (opt.isEmpty()) {
      throw new RuntimeException("No user found with email: " + email);
    }
    User user = opt.get();
    user.setHasPaidAccess(true);
    user.setPurchasePlan(plan != null ? plan : "Professional");
    userRepository.save(user);

    Map<String, Object> result = new HashMap<>();
    result.put("success", true);
    result.put("message", "Access granted to " + email);
    result.put("purchasePlan", user.getPurchasePlan());
    return result;
  }
}
