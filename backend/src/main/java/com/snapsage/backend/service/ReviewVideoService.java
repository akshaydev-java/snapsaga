package com.snapsage.backend.service;

import com.snapsage.backend.model.ReviewVideo;
import com.snapsage.backend.model.User;
import com.snapsage.backend.repository.ReviewVideoRepository;
import com.snapsage.backend.repository.UserRepository;
import com.snapsage.backend.security.UserDetailsImpl;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * ReviewVideoService — handles video upload, mock processing, and Excel export.
 *
 * Processing is MOCKED (no real STT engine). The transcript field will contain
 * a placeholder. To add real speech-to-text later, replace processVideoAsync().
 */
@Service
public class ReviewVideoService {

  @Value("${app.upload.dir:uploads/review-videos}")
  private String uploadDir;

  @Autowired
  private ReviewVideoRepository reviewVideoRepository;

  @Autowired
  private UserRepository userRepository;

  // Allowed MIME types
  private static final Set<String> ALLOWED_TYPES = Set.of(
      "video/mp4", "video/quicktime", "video/x-msvideo",
      "video/webm", "video/avi", "video/mov"
  );

  // Max file size: 500 MB
  private static final long MAX_SIZE = 500L * 1024 * 1024;

  /**
   * Save the uploaded video file to disk and create a ReviewVideo record in DB.
   */
  public ReviewVideo uploadVideo(MultipartFile file, String title, String description, String category, Long duration, 
                                 String productId, String productName, String reviewerName, String reviewTitle, Double rating,
                                 UserDetailsImpl userDetails) throws IOException {
    // ── Validation ──────────────────────────────────────────────────────
    if (file == null || file.isEmpty()) {
      throw new IllegalArgumentException("No file uploaded.");
    }
    if (file.getSize() > MAX_SIZE) {
      throw new IllegalArgumentException("File exceeds 500 MB limit.");
    }
    String contentType = file.getContentType() != null ? file.getContentType() : "";
    String originalName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "unknown";
    String ext = originalName.contains(".") ? originalName.substring(originalName.lastIndexOf('.') + 1).toLowerCase() : "";
    boolean validExt = Set.of("mp4", "mov", "avi", "webm").contains(ext);
    if (!validExt && !ALLOWED_TYPES.contains(contentType)) {
      throw new IllegalArgumentException("Unsupported file format. Allowed: mp4, mov, avi, webm.");
    }

    // ── Fetch User ───────────────────────────────────────────────────────
    Optional<User> userOpt = userRepository.findById(userDetails.getId());
    User user = userOpt.orElseThrow(() -> new RuntimeException("User not found."));

    // ── Verify paid access ───────────────────────────────────────────────
    if (!user.isHasPaidAccess()) {
      throw new SecurityException("Active paid plan required. Please purchase a plan first.");
    }

    // ── Save to disk ─────────────────────────────────────────────────────
    Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
    if (!Files.exists(uploadPath)) {
        Files.createDirectories(uploadPath);
        System.out.println("Created upload directory: " + uploadPath);
    }

    String fileName = originalName.replaceAll("[^a-zA-Z0-9._-]", "_");
    String uniqueName = UUID.randomUUID() + "_" + fileName;
    Path dest = uploadPath.resolve(uniqueName);
    System.out.println("Saving video to: " + dest);
    file.transferTo(dest.toFile());

    // ── Create DB record ─────────────────────────────────────────────────
    ReviewVideo rv = new ReviewVideo();
    rv.setUserId(user.getId());
    rv.setCustomerName(user.getFirstName() + " " + user.getLastName());
    rv.setEmail(user.getEmail());
    rv.setPurchasePlan(user.getPurchasePlan());
    rv.setVideoFileName(originalName);
    rv.setVideoSizeBytes(file.getSize());
    rv.setVideoDurationSeconds(duration != null ? duration : 0);
    rv.setTitle(title);
    rv.setDescription(description);
    rv.setCategory(category);
    rv.setUploadedAt(LocalDateTime.now());
    rv.setFilePath(dest.toString());
    rv.setStatus("PROCESSING");
    
    // Product Review Fields
    rv.setProductId(productId);
    rv.setProductName(productName);
    rv.setReviewerName(reviewerName);
    rv.setReviewTitle(reviewTitle);
    rv.setRating(rating);
    rv.setApprovalStatus("PENDING");
    
    reviewVideoRepository.save(rv);

    // ── Kick off async mock processing ───────────────────────────────────
    processVideoAsync(rv.getId());

    return rv;
  }

  /**
   * Async mock processor — simulates STT/NLP analysis.
   * Replace this method body with a real STT call if needed.
   */
  @Async
  public void processVideoAsync(String reviewVideoId) {
    try {
      // Step-by-step processing simulation
      Thread.sleep(1500); // Analysis started

      Optional<ReviewVideo> opt = reviewVideoRepository.findById(reviewVideoId);
      if (opt.isEmpty()) return;
      ReviewVideo rv = opt.get();

      // Mock transcript generation based on category/title
      String cat = rv.getCategory() != null ? rv.getCategory() : "Product";
      rv.setTranscript(
          "I've been using this " + cat + " for a few weeks now. " +
          "The build quality is exceptional and it exceeded my expectations. " +
          "I particularly enjoyed the intuitive interface and the fast performance. " +
          "Overall, a solid recommendation for anyone in the market for a high-end " + cat + "."
      );

      // Extract keywords (Mock)
      List<String> keywords = new ArrayList<>(Arrays.asList("Build Quality", "Performance", "Recommendation", cat));
      rv.setKeywords(keywords);

      // Sentiment Analysis (Mock)
      rv.setSentiment("Positive");
      rv.setSentimentScore(0.85 + (Math.random() * 0.1)); // 0.85 to 0.95

      // Rating Estimation (Mock - if not provided by user)
      if (rv.getRating() == null || rv.getRating() == 0) {
          rv.setRating(4.5);
      }
      rv.setMentionedRating(rv.getRating() + "/5");

      // Short Review Summary
      rv.setRemarks("Excellent " + cat + " with premium build and top-tier performance. Highly recommended.");
      
      rv.setStatus("DONE");
      reviewVideoRepository.save(rv);
      
      System.out.println("AI Insights generated for video: " + reviewVideoId);
    } catch (InterruptedException e) {
        // ... handled
        Thread.currentThread().interrupt();
        reviewVideoRepository.findById(reviewVideoId).ifPresent(v -> {
            v.setStatus("FAILED");
            reviewVideoRepository.save(v);
        });
    }
  }

  /** Get all videos for a specific user. */
  public List<ReviewVideo> getUserVideos(String userId) {
    return reviewVideoRepository.findByUserId(userId);
  }

  /** Get ALL videos (admin). */
  public List<ReviewVideo> getAllVideos() {
    return reviewVideoRepository.findAll();
  }

  /** Delete a video */
  public void deleteVideo(String id) {
    reviewVideoRepository.deleteById(id);
  }

  /** Update video details */
  public ReviewVideo updateVideoDetails(String id, Map<String, String> updates) {
    Optional<ReviewVideo> opt = reviewVideoRepository.findById(id);
    if (opt.isEmpty()) {
      throw new IllegalArgumentException("Video not found");
    }
    ReviewVideo video = opt.get();
    if (updates.containsKey("title")) video.setTitle(updates.get("title"));
    if (updates.containsKey("description")) video.setDescription(updates.get("description"));
    if (updates.containsKey("category")) video.setCategory(updates.get("category"));
    return reviewVideoRepository.save(video);
  }

  /**
   * Generate an Excel workbook for the given list of ReviewVideos.
   * Returns raw bytes ready for HTTP response.
   */
  public byte[] generateExcel(List<ReviewVideo> videos) throws IOException {
    try (XSSFWorkbook workbook = new XSSFWorkbook();
         ByteArrayOutputStream out = new ByteArrayOutputStream()) {

      Sheet sheet = workbook.createSheet("Review Analysis");

      // ── Header style ──────────────────────────────────────────────────
      CellStyle headerStyle = workbook.createCellStyle();
      headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
      headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
      Font headerFont = workbook.createFont();
      headerFont.setColor(IndexedColors.WHITE.getIndex());
      headerFont.setBold(true);
      headerStyle.setFont(headerFont);
      headerStyle.setBorderBottom(BorderStyle.THIN);

      // ── Headers ───────────────────────────────────────────────────────
      String[] headers = {
          "Review ID", "Customer Name", "User ID", "Email", "Purchase Plan",
          "Video File Name", "Upload Date", "File Size (MB)", "Video Duration (sec)",
          "Transcript", "Keywords", "Sentiment", "Mentioned Rating",
          "Product/Service Mentioned", "Remarks", "Status"
      };

      Row headerRow = sheet.createRow(0);
      for (int i = 0; i < headers.length; i++) {
        Cell cell = headerRow.createCell(i);
        cell.setCellValue(headers[i]);
        cell.setCellStyle(headerStyle);
      }

      // ── Data rows ─────────────────────────────────────────────────────
      DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
      int rowNum = 1;
      for (ReviewVideo rv : videos) {
        Row row = sheet.createRow(rowNum++);
        row.createCell(0).setCellValue(nullSafe(rv.getId()));
        row.createCell(1).setCellValue(nullSafe(rv.getCustomerName()));
        row.createCell(2).setCellValue(nullSafe(rv.getUserId()));
        row.createCell(3).setCellValue(nullSafe(rv.getEmail()));
        row.createCell(4).setCellValue(nullSafe(rv.getPurchasePlan()));
        row.createCell(5).setCellValue(nullSafe(rv.getVideoFileName()));
        row.createCell(6).setCellValue(rv.getUploadedAt() != null ? rv.getUploadedAt().format(dtf) : "");
        row.createCell(7).setCellValue(String.format("%.2f", rv.getVideoSizeBytes() / 1_048_576.0));
        row.createCell(8).setCellValue(rv.getVideoDurationSeconds());
        row.createCell(9).setCellValue(nullSafe(rv.getTranscript()));
        row.createCell(10).setCellValue(rv.getKeywords() != null ? String.join(", ", rv.getKeywords()) : "");
        row.createCell(11).setCellValue(nullSafe(rv.getSentiment()));
        row.createCell(12).setCellValue(nullSafe(rv.getMentionedRating()));
        row.createCell(13).setCellValue(nullSafe(rv.getMentionedProduct()));
        row.createCell(14).setCellValue(nullSafe(rv.getRemarks()));
        row.createCell(15).setCellValue(nullSafe(rv.getStatus()));
      }

      // Auto-size columns
      for (int i = 0; i < headers.length; i++) {
        sheet.autoSizeColumn(i);
      }

      workbook.write(out);
      return out.toByteArray();
    }
  }

  private String nullSafe(String s) {
    return s != null ? s : "";
  }
}
