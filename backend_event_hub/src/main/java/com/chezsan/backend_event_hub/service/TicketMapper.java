package com.chezsan.backend_event_hub.service;

import com.chezsan.backend_event_hub.model.Event;
import com.chezsan.backend_event_hub.model.Ticket;

import java.util.LinkedHashMap;
import java.util.Map;

final class TicketMapper {
    private TicketMapper() {
    }

    static Map<String, Object> toMap(Ticket ticket) {
        Event event = ticket.getEvent();
        Map<String, Object> out = new LinkedHashMap<>();
        out.put("id", ticket.getId());
        out.put("eventId", event.getId());
        out.put("userId", ticket.getHolder().getId());
        out.put("eventTitle", event.getTitle());
        out.put("eventDate", event.getDate().toString());
        out.put("eventTime", event.getTime());
        out.put("location", event.getLocation());
        out.put("imageGradient", event.getImageGradient());
        out.put("coverImage", event.getCoverImage() == null ? "" : event.getCoverImage());
        out.put("coverPositionX", event.getCoverPositionX() == null ? 50 : event.getCoverPositionX());
        out.put("coverPositionY", event.getCoverPositionY() == null ? 50 : event.getCoverPositionY());
        out.put("coverZoom", event.getCoverZoom() == null ? 100 : event.getCoverZoom());
        out.put("holderName", ticket.getHolder().getName());
        out.put("holderEmail", ticket.getHolder().getEmail());
        out.put("holderAvatar", UserMapper.imageValue(ticket.getHolder().getAvatar(), ticket.getHolder().getProfilePicture()));
        out.put("holderProfilePicture", ticket.getHolder().getProfilePicture() == null ? "" : ticket.getHolder().getProfilePicture());
        out.put("issuedAt", ticket.getIssuedAt().toString());
        out.put("status", ticket.getStatus().name());
        out.put("seatInfo", ticket.getSeatInfo());
        out.put("qrData", ticket.getQrData());
        return out;
    }
}
