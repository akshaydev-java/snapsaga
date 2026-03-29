package com.snapsage.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "review_videos")
public class ReviewVideo {

  @Id
  private String id;

  // User info
  private String userId;
  private String customerName;
  private String email;
  private String purchasePlan;

  // Video metadata
  private String videoFileName;
  private long videoSizeBytes;
  private long videoDurationSeconds; // client-provided or 0
  private String title;
  private String description;
  private String category;
  private double sentimentScore;
  private long views = 0L;
  
  // Product Review Fields
  private String productId;
  private String productName;
  private String reviewerName;
  private String reviewTitle;
  private Double rating; // 1-5
  private String approvalStatus = "PENDING"; // PENDING, APPROVED, REJECTED

  // Timestamps
  private LocalDateTime uploadedAt = LocalDateTime.now();

  // Extracted / analyzed data
  private String transcript;
  private List<String> keywords;
  private String sentiment;
  private String mentionedRating;
  private String mentionedProduct;
  private String remarks;

  // Processing status: PROCESSING | DONE | FAILED
  private String status = "PROCESSING";

  // Stored file path (server-side, not exposed to client)
  private String filePath;

  public ReviewVideo() {}

  // ──── Getters & Setters ────────────────────────────────────────────────

  public String getId() { return id; }
  public void setId(String id) { this.id = id; }

  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }

  public String getCustomerName() { return customerName; }
  public void setCustomerName(String customerName) { this.customerName = customerName; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getPurchasePlan() { return purchasePlan; }
  public void setPurchasePlan(String purchasePlan) { this.purchasePlan = purchasePlan; }

  public String getVideoFileName() { return videoFileName; }
  public void setVideoFileName(String videoFileName) { this.videoFileName = videoFileName; }

  public long getVideoSizeBytes() { return videoSizeBytes; }
  public void setVideoSizeBytes(long videoSizeBytes) { this.videoSizeBytes = videoSizeBytes; }

  public long getVideoDurationSeconds() { return videoDurationSeconds; }
  public void setVideoDurationSeconds(long videoDurationSeconds) { this.videoDurationSeconds = videoDurationSeconds; }

  public LocalDateTime getUploadedAt() { return uploadedAt; }
  public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }

  public String getTitle() { return title; }
  public void setTitle(String title) { this.title = title; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public String getCategory() { return category; }
  public void setCategory(String category) { this.category = category; }

  public double getSentimentScore() { return sentimentScore; }
  public void setSentimentScore(double sentimentScore) { this.sentimentScore = sentimentScore; }

  public long getViews() { return views; }
  public void setViews(long views) { this.views = views; }

  public String getTranscript() { return transcript; }
  public void setTranscript(String transcript) { this.transcript = transcript; }

  public List<String> getKeywords() { return keywords; }
  public void setKeywords(List<String> keywords) { this.keywords = keywords; }

  public String getSentiment() { return sentiment; }
  public void setSentiment(String sentiment) { this.sentiment = sentiment; }

  public String getMentionedRating() { return mentionedRating; }
  public void setMentionedRating(String mentionedRating) { this.mentionedRating = mentionedRating; }

  public String getMentionedProduct() { return mentionedProduct; }
  public void setMentionedProduct(String mentionedProduct) { this.mentionedProduct = mentionedProduct; }

  public String getRemarks() { return remarks; }
  public void setRemarks(String remarks) { this.remarks = remarks; }

  public String getStatus() { return status; }
  public void setStatus(String status) { this.status = status; }

  public String getFilePath() { return filePath; }
  public void setFilePath(String filePath) { this.filePath = filePath; }

  public String getProductId() { return productId; }
  public void setProductId(String productId) { this.productId = productId; }

  public String getProductName() { return productName; }
  public void setProductName(String productName) { this.productName = productName; }

  public String getReviewerName() { return reviewerName; }
  public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }

  public String getReviewTitle() { return reviewTitle; }
  public void setReviewTitle(String reviewTitle) { this.reviewTitle = reviewTitle; }

  public Double getRating() { return rating; }
  public void setRating(Double rating) { this.rating = rating; }

  public String getApprovalStatus() { return approvalStatus; }
  public void setApprovalStatus(String approvalStatus) { this.approvalStatus = approvalStatus; }
}
