package com.chezsan.backend_event_hub.service;

import com.chezsan.backend_event_hub.model.AppUser;
import com.chezsan.backend_event_hub.model.Event;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

final class EventMapper {
    private EventMapper() {
    }

    static Map<String, Object> toMap(Event event) {
        Map<String, Object> out = new LinkedHashMap<>();
        AppUser organizer = event.getOrganizer();
        BigDecimal price = event.getPrice() == null ? BigDecimal.ZERO : event.getPrice();

        out.put("id", event.getId());
        out.put("title", event.getTitle());
        out.put("description", event.getDescription());
        out.put("category", event.getCategory().getId());
        out.put("categoryLabel", event.getCategory().getLabel());
        out.put("categoryColor", event.getCategory().getColor());
        out.put("date", event.getDate().toString());
        out.put("time", event.getTime());
        out.put("endTime", event.getEndTime());
        out.put("location", event.getLocation());
        out.put("venue", event.getVenue());
        out.put("capacity", event.getCapacity());
        out.put("registered", event.getRegistered());
        out.put("price", price.stripTrailingZeros());
        out.put("organizer", organizer == null ? "Campus Event Hub" : organizer.getName());
        out.put("organizerId", organizer == null ? null : organizer.getId());
        out.put("status", event.getStatus().name());
        out.put("featured", event.getFeatured());
        out.put("tags", event.getTags());
        out.put("imageGradient", event.getImageGradient());
        return out;
    }
}
