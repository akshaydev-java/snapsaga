package com.snapsage.backend.dto;

import com.snapsage.backend.model.ReviewVideo;
import java.util.List;
import java.util.Map;

public class DashboardAnalyticsResponse {
    private long totalVideos;
    private long activeUsers;
    private Map<String, Long> categoryDistribution;
    private Map<String, Double> sentimentTrend;
    private long totalFeedback;
    private List<ReviewVideo> recentVideos; 
    private double averageRating;
    private Map<String, Long> reviewsPerProduct;
    private long approvedReviewsCount;
    private long pendingReviewsCount;
    private long totalUniqueProducts;
    private Map<String, Long> uploadTrends;
    
    public DashboardAnalyticsResponse() {}

    public long getTotalVideos() { return totalVideos; }
    public void setTotalVideos(long totalVideos) { this.totalVideos = totalVideos; }

    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }

    public Map<String, Long> getCategoryDistribution() { return categoryDistribution; }
    public void setCategoryDistribution(Map<String, Long> categoryDistribution) { this.categoryDistribution = categoryDistribution; }

    public Map<String, Double> getSentimentTrend() { return sentimentTrend; }
    public void setSentimentTrend(Map<String, Double> sentimentTrend) { this.sentimentTrend = sentimentTrend; }

    public long getTotalFeedback() { return totalFeedback; }
    public void setTotalFeedback(long totalFeedback) { this.totalFeedback = totalFeedback; }

    public List<ReviewVideo> getRecentVideos() { return recentVideos; }
    public void setRecentVideos(List<ReviewVideo> recentVideos) { this.recentVideos = recentVideos; }

    public double getAverageRating() { return averageRating; }
    public void setAverageRating(double averageRating) { this.averageRating = averageRating; }

    public Map<String, Long> getReviewsPerProduct() { return reviewsPerProduct; }
    public void setReviewsPerProduct(Map<String, Long> reviewsPerProduct) { this.reviewsPerProduct = reviewsPerProduct; }

    public long getApprovedReviewsCount() { return approvedReviewsCount; }
    public void setApprovedReviewsCount(long approvedReviewsCount) { this.approvedReviewsCount = approvedReviewsCount; }

    public long getPendingReviewsCount() { return pendingReviewsCount; }
    public void setPendingReviewsCount(long pendingReviewsCount) { this.pendingReviewsCount = pendingReviewsCount; }

    public long getTotalUniqueProducts() { return totalUniqueProducts; }
    public void setTotalUniqueProducts(long totalUniqueProducts) { this.totalUniqueProducts = totalUniqueProducts; }

    public Map<String, Long> getUploadTrends() { return uploadTrends; }
    public void setUploadTrends(Map<String, Long> uploadTrends) { this.uploadTrends = uploadTrends; }
}
