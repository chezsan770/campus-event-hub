package com.chezsan.backend_event_hub.service;

import com.chezsan.backend_event_hub.model.*;
import com.chezsan.backend_event_hub.repository.CategoryRepository;
import com.chezsan.backend_event_hub.repository.EventRepository;
import com.chezsan.backend_event_hub.repository.TicketRepository;
import com.chezsan.backend_event_hub.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;

    public EventService(EventRepository eventRepository, CategoryRepository categoryRepository, UserRepository userRepository, TicketRepository ticketRepository) {
        this.eventRepository = eventRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.ticketRepository = ticketRepository;
    }

    public Map<String, Object> getEvents(int page, int size, String category, String search, String status) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.ASC, "date").and(Sort.by("time")));
        Page<Event> events = eventRepository.findAll(specification(category, search, status), pageable);
        return Map.of(
                "content", events.getContent().stream().map(EventMapper::toMap).toList(),
                "totalElements", events.getTotalElements(),
                "totalPages", events.getTotalPages(),
                "page", events.getNumber(),
                "size", events.getSize()
        );
    }

    public List<Map<String, Object>> getFeaturedEvents() {
        return eventRepository.findByFeaturedTrue(PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "date")))
                .getContent()
                .stream()
                .filter(event -> event.getStatus() == EventStatus.UPCOMING)
                .map(EventMapper::toMap)
                .toList();
    }

    public Map<String, Object> getEvent(Long id) {
        return EventMapper.toMap(findEvent(id));
    }

    public List<Map<String, Object>> getCategories() {
        return categoryRepository.findAll(Sort.by("label")).stream()
                .map(category -> Map.<String, Object>of(
                        "id", category.getId(),
                        "label", category.getLabel(),
                        "color", category.getColor()
                ))
                .toList();
    }

    public Map<String, Object> createEvent(Map<String, Object> request, AppUser currentUser) {
        Event event = new Event();
        apply(event, request);
        if (currentUser != null) {
            event.setOrganizer(currentUser);
            event.setStatus(currentUser.getRole() == UserRole.ADMIN ? EventStatus.UPCOMING : EventStatus.PENDING);
        } else {
            event.setStatus(EventStatus.PENDING);
        }
        return EventMapper.toMap(eventRepository.save(event));
    }

    public Map<String, Object> updateEvent(Long id, Map<String, Object> request) {
        Event event = findEvent(id);
        apply(event, request);
        return EventMapper.toMap(eventRepository.save(event));
    }

    @Transactional
    public Map<String, Object> deleteEvent(Long id, AppUser currentUser) {
        if (currentUser == null || currentUser.getRole() != UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can delete events");
        }
        Event event = findEvent(id);
        ticketRepository.deleteByEventId(id);
        eventRepository.delete(event);
        return Map.of("message", "Event deleted", "id", id);
    }

    @Transactional
    public Map<String, Object> approveEvent(Long id, AppUser currentUser) {
        if (currentUser == null || currentUser.getRole() != UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can approve events");
        }
        Event event = findEvent(id);
        event.setStatus(EventStatus.UPCOMING);
        return EventMapper.toMap(event);
    }

    @Transactional
    public Map<String, Object> rejectEvent(Long id, AppUser currentUser) {
        if (currentUser == null || currentUser.getRole() != UserRole.ADMIN) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only admins can reject events");
        }
        Event event = findEvent(id);
        event.setStatus(EventStatus.REJECTED);
        event.setFeatured(false);
        return EventMapper.toMap(event);
    }

    @Transactional
    public Event incrementRegistration(Long id) {
        Event event = findEvent(id);
        if (event.getStatus() != EventStatus.UPCOMING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This event is not approved for registration");
        }
        if (event.getRegistered() >= event.getCapacity()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Event is full");
        }
        event.setRegistered(event.getRegistered() + 1);
        return event;
    }

    public Event findEvent(Long id) {
        return eventRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found"));
    }

    private Specification<Event> specification(String category, String search, String status) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (category != null && !category.isBlank()) {
                predicates.add(cb.equal(root.get("category").get("id"), category));
            }
            if (status != null && !status.isBlank()) {
                predicates.add(cb.equal(root.get("status"), parseStatus(status)));
            } else {
                predicates.add(cb.equal(root.get("status"), EventStatus.UPCOMING));
            }
            if (search != null && !search.isBlank()) {
                String like = "%" + search.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("description")), like),
                        cb.like(cb.lower(root.get("location")), like)
                ));
            }
            return cb.and(predicates.toArray(Predicate[]::new));
        };
    }

    private void apply(Event event, Map<String, Object> request) {
        event.setTitle(value(request.get("title")));
        event.setDescription(value(request.get("description")));
        event.setCategory(categoryRepository.findById(value(request.getOrDefault("category", "tech")))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown category")));
        event.setDate(LocalDate.parse(value(request.get("date"))));
        event.setTime(value(request.get("time")));
        event.setEndTime(value(request.get("endTime")));
        event.setLocation(value(request.get("location")));
        event.setVenue(value(request.get("venue")));
        event.setCapacity(intValue(request.getOrDefault("capacity", 100)));
        event.setPrice(decimalValue(request.getOrDefault("price", 0)));
        event.setStatus(parseStatus(value(request.getOrDefault("status", "PENDING"))));
        event.setFeatured(booleanValue(request.getOrDefault("featured", false)));
        event.setTags(tags(request.get("tags")));
        event.setImageGradient(value(request.getOrDefault("imageGradient", "from-blue-600 to-purple-600")));
        event.setCoverImage(value(request.get("coverImage")));
        event.setCoverPositionX(clamp(intValue(request.getOrDefault("coverPositionX", 50)), 0, 100));
        event.setCoverPositionY(clamp(intValue(request.getOrDefault("coverPositionY", 50)), 0, 100));
        event.setCoverZoom(clamp(intValue(request.getOrDefault("coverZoom", 100)), 100, 400));

        Long organizerId = longValue(request.get("organizerId"));
        if (organizerId != null) {
            event.setOrganizer(userRepository.findById(organizerId).orElse(null));
        } else if (event.getOrganizer() == null) {
            event.setOrganizer(userRepository.findByRole(UserRole.ORGANIZER).stream().findFirst().orElse(null));
        }

        if (event.getRegistered() == null) {
            event.setRegistered(0);
        }
    }

    private EventStatus parseStatus(String value) {
        try {
            return EventStatus.valueOf(value.toUpperCase());
        } catch (RuntimeException ex) {
            return EventStatus.UPCOMING;
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> tags(Object value) {
        if (value instanceof List<?> list) {
            return list.stream().map(Object::toString).filter(tag -> !tag.isBlank()).toList();
        }
        if (value == null || value.toString().isBlank()) {
            return List.of();
        }
        return List.of(value.toString().split(",")).stream().map(String::trim).filter(tag -> !tag.isBlank()).toList();
    }

    private String value(Object object) {
        return object == null ? "" : object.toString();
    }

    private int intValue(Object object) {
        if (object instanceof Number number) return number.intValue();
        return Integer.parseInt(object.toString());
    }

    private int clamp(int value, int min, int max) {
        return Math.max(min, Math.min(max, value));
    }

    private BigDecimal decimalValue(Object object) {
        if (object instanceof BigDecimal decimal) return decimal;
        if (object instanceof Number number) return BigDecimal.valueOf(number.doubleValue());
        return new BigDecimal(object.toString());
    }

    private Boolean booleanValue(Object object) {
        if (object instanceof Boolean bool) return bool;
        return Boolean.parseBoolean(object.toString());
    }

    private Long longValue(Object object) {
        if (object == null || object.toString().isBlank()) return null;
        if (object instanceof Number number) return number.longValue();
        return Long.parseLong(object.toString());
    }
}
