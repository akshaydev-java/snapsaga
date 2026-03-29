package com.snapsage.backend.repository;

import com.snapsage.backend.model.SurveyResponse;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SurveyResponseRepository extends MongoRepository<SurveyResponse, String> {
    List<SurveyResponse> findBySurveyId(String surveyId);
}
