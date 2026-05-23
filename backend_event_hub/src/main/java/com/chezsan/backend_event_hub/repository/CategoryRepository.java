package com.chezsan.backend_event_hub.repository;

import com.chezsan.backend_event_hub.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, String> {
}
