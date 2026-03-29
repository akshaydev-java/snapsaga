package com.snapsage.backend.repository;

import com.snapsage.backend.model.Survey;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface SurveyRepository extends MongoRepository<Survey, String> {
}
