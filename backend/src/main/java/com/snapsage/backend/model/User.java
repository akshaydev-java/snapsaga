package com.snapsage.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.HashSet;
import java.util.Set;
import java.time.LocalDateTime;

@Document(collection = "users")
public class User {
  @Id
  private String id;
  private String firstName;
  private String lastName;
  private String email;
  private String password;
  
  @DBRef
  private Set<Role> roles = new HashSet<>();
  
  private LocalDateTime createdAt = LocalDateTime.now();
  private boolean hasPaidAccess = false;
  private String purchasePlan;
  private String phoneNumber;
  private String profileImage;


  public User() {}

  public User(String email, String password) {
    this.email = email;
    this.password = password;
  }
  
  public User(String firstName, String lastName, String email, String password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }
  public String getLastName() { return lastName; }
  public void setLastName(String lastName) { this.lastName = lastName; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getPassword() { return password; }
  public void setPassword(String password) { this.password = password; }
  public Set<Role> getRoles() { return roles; }
  public void setRoles(Set<Role> roles) { this.roles = roles; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
  public boolean isHasPaidAccess() { return hasPaidAccess; }
  public void setHasPaidAccess(boolean hasPaidAccess) { this.hasPaidAccess = hasPaidAccess; }
  public String getPurchasePlan() { return purchasePlan; }
  public void setPurchasePlan(String purchasePlan) { this.purchasePlan = purchasePlan; }
  public String getPhoneNumber() { return phoneNumber; }
  public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
  public String getProfileImage() { return profileImage; }
  public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
}

