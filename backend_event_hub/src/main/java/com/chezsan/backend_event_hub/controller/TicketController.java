package com.chezsan.backend_event_hub.controller;

import com.chezsan.backend_event_hub.service.AuthService;
import com.chezsan.backend_event_hub.service.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;
    private final AuthService authService;

    public TicketController(TicketService ticketService, AuthService authService) {
        this.ticketService = ticketService;
        this.authService = authService;
    }

    @GetMapping("/my")
    public List<Map<String, Object>> getMyTickets(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ticketService.getTickets(authService.currentUser(authHeader));
    }

    @GetMapping("/{id}")
    public Map<String, Object> getTicket(@PathVariable String id) {
        return ticketService.getTicket(id);
    }

    @PostMapping("/{id}/verify")
    public Map<String, Object> verifyTicket(@PathVariable String id) {
        return ticketService.verifyTicket(id);
    }
}
