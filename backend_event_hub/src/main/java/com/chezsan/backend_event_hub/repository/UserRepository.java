package com.chezsan.backend_event_hub.repository;

import com.chezsan.backend_event_hub.model.AppUser;
import com.chezsan.backend_event_hub.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<AppUser, Long> {
    Optional<AppUser> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    long countByRole(UserRole role);
    List<AppUser> findByRole(UserRole role);
}
