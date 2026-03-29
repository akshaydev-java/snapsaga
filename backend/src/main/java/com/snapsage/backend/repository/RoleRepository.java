package com.snapsage.backend.repository;

import com.snapsage.backend.model.ERole;
import com.snapsage.backend.model.Role;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface RoleRepository extends MongoRepository<Role, String> {
  Optional<Role> findByName(ERole name);
}
