package com.chezsan.backend_event_hub.repository;

import com.chezsan.backend_event_hub.model.Event;
import com.chezsan.backend_event_hub.model.EventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {
    List<Event> findTop4ByOrderByIdDesc();
    List<Event> findByOrganizerIdOrderByDateAsc(Long organizerId);
    long countByStatus(EventStatus status);
    long countByCategoryId(String categoryId);
    Page<Event> findByFeaturedTrue(Pageable pageable);
}
