package com.chezsan.backend_event_hub.service;

import com.chezsan.backend_event_hub.model.*;
import com.chezsan.backend_event_hub.repository.CategoryRepository;
import com.chezsan.backend_event_hub.repository.EventRepository;
import com.chezsan.backend_event_hub.repository.TicketRepository;
import com.chezsan.backend_event_hub.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;
    private final CategoryRepository categoryRepository;

    public DashboardService(UserRepository userRepository, EventRepository eventRepository, TicketRepository ticketRepository, CategoryRepository categoryRepository) {
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.ticketRepository = ticketRepository;
        this.categoryRepository = categoryRepository;
    }

    public Map<String, Object> admin() {
        long totalEvents = eventRepository.count();
        List<Map<String, Object>> topCategories = categoryRepository.findAll().stream()
                .map(category -> {
                    long count = eventRepository.countByCategoryId(category.getId());
                    long percentage = totalEvents == 0 ? 0 : Math.round((count * 100.0) / totalEvents);
                    return Map.<String, Object>of("name", category.getLabel(), "count", count, "percentage", percentage);
                })
                .sorted(Comparator.comparingLong(item -> -((Number) item.get("count")).longValue()))
                .toList();

        List<Map<String, Object>> recentEvents = eventRepository.findTop4ByOrderByIdDesc().stream().map(EventMapper::toMap).toList();

        return Map.of(
                "totalUsers", userRepository.count(),
                "activeEvents", eventRepository.countByStatus(EventStatus.UPCOMING),
                "ticketsSold", ticketRepository.count(),
                "platformRevenue", totalRevenue(),
                "monthlyGrowth", Map.of("users", "+0%", "events", "+0%", "tickets", "+0%", "revenue", "+0%"),
                "topCategories", topCategories,
                "recentActivity", recentEvents.stream().map(event -> Map.<String, Object>of(
                        "type", "EVENT_CREATED",
                        "user", event.get("organizer"),
                        "message", "Event listed: " + event.get("title"),
                        "time", "recently"
                )).toList(),
                "recentEvents", recentEvents
        );
    }

    public Map<String, Object> student(AppUser user) {
        List<Map<String, Object>> tickets = ticketRepository.findByHolderIdOrderByIssuedAtDesc(user.getId()).stream()
                .map(TicketMapper::toMap)
                .toList();
        List<Map<String, Object>> registeredEvents = ticketRepository.findByHolderIdOrderByIssuedAtDesc(user.getId()).stream()
                .map(ticket -> EventMapper.toMap(ticket.getEvent()))
                .distinct()
                .toList();
        List<Map<String, Object>> events = eventRepository.findAll().stream()
                .filter(event -> event.getStatus() == EventStatus.UPCOMING)
                .limit(3)
                .map(EventMapper::toMap)
                .toList();

        return Map.of(
                "stats", Map.of(
                        "eventsAttended", ticketRepository.findByHolderIdAndStatusOrderByIssuedAtDesc(user.getId(), TicketStatus.USED).size(),
                        "upcomingEvents", events.size(),
                        "activeTickets", ticketRepository.findByHolderIdAndStatusOrderByIssuedAtDesc(user.getId(), TicketStatus.VALID).size(),
                        "pointsEarned", tickets.size() * 40
                ),
                "upcomingEvents", events,
                "myTickets", tickets,
                "myEvents", registeredEvents
        );
    }

    public Map<String, Object> organizer(AppUser user) {
        List<Map<String, Object>> events = eventRepository.findByOrganizerIdOrderByDateAsc(user.getId()).stream().map(EventMapper::toMap).toList();
        int totalAttendees = events.stream().mapToInt(event -> ((Number) event.get("registered")).intValue()).sum();

        return Map.of(
                "stats", Map.of(
                        "totalEvents", events.size(),
                        "activeEvents", events.stream().filter(event -> "UPCOMING".equals(event.get("status"))).count(),
                        "totalAttendees", totalAttendees,
                        "avgRating", 4.8
                ),
                "myEvents", events,
                "analytics", Map.of("avgAttendanceRate", 78, "ticketScanRate", 92, "repeatAttendees", 45)
        );
    }

    private BigDecimal totalRevenue() {
        return eventRepository.findAll().stream()
                .map(event -> event.getPrice().multiply(BigDecimal.valueOf(event.getRegistered())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
