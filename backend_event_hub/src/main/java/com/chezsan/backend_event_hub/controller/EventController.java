package com.chezsan.backend_event_hub.controller;

import com.chezsan.backend_event_hub.service.AuthService;
import com.chezsan.backend_event_hub.service.EventService;
import com.chezsan.backend_event_hub.service.TicketService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;
    private final TicketService ticketService;
    private final AuthService authService;

    public EventController(EventService eventService, TicketService ticketService, AuthService authService) {
        this.eventService = eventService;
        this.ticketService = ticketService;
        this.authService = authService;
    }

    @GetMapping
    public Map<String, Object> getEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "") String category,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String status
    ) {
        return eventService.getEvents(page, size, category, search, status);
    }

    @GetMapping("/featured")
    public List<Map<String, Object>> getFeaturedEvents() {
        return eventService.getFeaturedEvents();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getEvent(@PathVariable Long id) {
        return eventService.getEvent(id);
    }

    @PostMapping
    public Map<String, Object> createEvent(
            @RequestBody Map<String, Object> request,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        return eventService.createEvent(request, authService.currentUser(authHeader));
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateEvent(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return eventService.updateEvent(id, request);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteEvent(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        return eventService.deleteEvent(id, authService.currentUser(authHeader));
    }

    @PostMapping("/{id}/register")
    public Map<String, Object> register(@PathVariable Long id, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        return ticketService.register(id, authService.currentUser(authHeader));
    }

    @PostMapping("/{id}/approve")
    public Map<String, Object> approveEvent(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        return eventService.approveEvent(id, authService.currentUser(authHeader));
    }

    @PostMapping("/{id}/reject")
    public Map<String, Object> rejectEvent(
            @PathVariable Long id,
            @RequestHeader(value = "Authorization", required = false) String authHeader
    ) {
        return eventService.rejectEvent(id, authService.currentUser(authHeader));
    }
}
