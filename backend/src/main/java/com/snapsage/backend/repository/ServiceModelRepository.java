package com.snapsage.backend.repository;

import com.snapsage.backend.model.ServiceModel;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ServiceModelRepository extends MongoRepository<ServiceModel, String> {
}
