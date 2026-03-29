package com.snapsage.backend.repository;

import com.snapsage.backend.model.ContactInquiry;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ContactInquiryRepository extends MongoRepository<ContactInquiry, String> {
}
