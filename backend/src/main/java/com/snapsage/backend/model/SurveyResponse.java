package com.snapsage.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "survey_responses")
public class SurveyResponse {
  @Id
  private String id;
  private String surveyId;
  private String userId; // Optional
  private String videoPath;
  private LocalDateTime createdAt = LocalDateTime.now();

  // Getters and Setters
  public String getId() { return id; }
  public void setId(String id) { this.id = id; }
  public String getSurveyId() { return surveyId; }
  public void setSurveyId(String surveyId) { this.surveyId = surveyId; }
  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }
  public String getVideoPath() { return videoPath; }
  public void setVideoPath(String videoPath) { this.videoPath = videoPath; }
  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
