package com.snapsage.backend.repository;

import com.snapsage.backend.model.ReviewVideo;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ReviewVideoRepository extends MongoRepository<ReviewVideo, String> {

  /** Fetch all review videos uploaded by a specific user. */
  List<ReviewVideo> findByUserId(String userId);

  /** Search by title or category */
  List<ReviewVideo> findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCase(String title, String category);

  /** Filter by category */
  List<ReviewVideo> findByCategoryContainingIgnoreCase(String category);
}
