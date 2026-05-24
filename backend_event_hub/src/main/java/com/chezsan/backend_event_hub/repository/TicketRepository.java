package com.chezsan.backend_event_hub.repository;

import com.chezsan.backend_event_hub.model.Ticket;
import com.chezsan.backend_event_hub.model.TicketStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, String> {
    List<Ticket> findByHolderIdOrderByIssuedAtDesc(Long holderId);
    List<Ticket> findByHolderIdAndStatusOrderByIssuedAtDesc(Long holderId, TicketStatus status);
    long countByStatus(TicketStatus status);
    void deleteByEventId(Long eventId);
}
