package com.snapsage.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "contact_inquiries")
public class ContactInquiry {
  @Id
  private String id;
  private String firstName;
  private String lastName;
  private String email;
  private String company;
  private String phoneNumber;
  private String serviceInterest;
  private String message;
  private LocalDateTime createdAt = LocalDateTime.now();

  // Getters and Setters
  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getFirstName() { return firstName; }
  public void setFirstName(String firstName) { this.firstName = firstName; }
  public String getLastName() { return lastName; }
  public void setLastName(String lastName) { this.lastName = lastName; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getCompany() { return company; }
  public void setCompany(String company) { this.company = company; }
  public String getPhoneNumber() { return phoneNumber; }
  public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
  public String getServiceInterest() { return serviceInterest; }
  public void setServiceInterest(String serviceInterest) { this.serviceInterest = serviceInterest; }
  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
