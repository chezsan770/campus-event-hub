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
        out.put("holderName", ticket.getHolder().getName());
        out.put("holderEmail", ticket.getHolder().getEmail());
        out.put("issuedAt", ticket.getIssuedAt().toString());
        out.put("status", ticket.getStatus().name());
        out.put("seatInfo", ticket.getSeatInfo());
        out.put("qrData", ticket.getQrData());
        return out;
    }
}
