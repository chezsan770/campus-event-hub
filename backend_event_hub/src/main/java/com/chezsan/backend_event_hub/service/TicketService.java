package com.chezsan.backend_event_hub.service;

import com.chezsan.backend_event_hub.model.AppUser;
import com.chezsan.backend_event_hub.model.Event;
import com.chezsan.backend_event_hub.model.Ticket;
import com.chezsan.backend_event_hub.model.TicketStatus;
import com.chezsan.backend_event_hub.repository.TicketRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;
    private final EventService eventService;

    public TicketService(TicketRepository ticketRepository, EventService eventService) {
        this.ticketRepository = ticketRepository;
        this.eventService = eventService;
    }

    public List<Map<String, Object>> getTickets(AppUser user) {
        return ticketRepository.findByHolderIdOrderByIssuedAtDesc(user.getId()).stream()
                .map(TicketMapper::toMap)
                .toList();
    }

    public Map<String, Object> getTicket(String id) {
        return TicketMapper.toMap(findTicket(id));
    }

    @Transactional
    public Map<String, Object> register(Long eventId, AppUser user) {
        Event event = eventService.incrementRegistration(eventId);
        String id = "TKT-" + System.currentTimeMillis();
        Ticket ticket = new Ticket();
        ticket.setId(id);
        ticket.setEvent(event);
        ticket.setHolder(user);
        ticket.setIssuedAt(Instant.now());
        ticket.setStatus(TicketStatus.VALID);
        ticket.setSeatInfo("General Admission");
        ticket.setQrData("CEH-" + id + "-" + user.getEmail() + "-" + event.getId());
        return Map.of(
                "message", "Successfully registered!",
                "ticketId", ticketRepository.save(ticket).getId(),
                "eventId", eventId
        );
    }

    @Transactional
    public Map<String, Object> verifyTicket(String id) {
        Ticket ticket = findTicket(id);
        boolean valid = ticket.getStatus() == TicketStatus.VALID;
        if (valid) {
            ticket.setStatus(TicketStatus.USED);
        }
        return Map.of("valid", valid, "id", id, "message", valid ? "Ticket verified successfully" : "Ticket is not valid");
    }

    private Ticket findTicket(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ticket not found"));
    }
}
