package com.chezsan.backend_event_hub.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "tickets")
public class Ticket {

    @Id
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser holder;

    @Column(nullable = false)
    private Instant issuedAt = Instant.now();

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TicketStatus status = TicketStatus.VALID;

    private String seatInfo;

    @Column(nullable = false, length = 1000)
    private String qrData;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public AppUser getHolder() {
        return holder;
    }

    public void setHolder(AppUser holder) {
        this.holder = holder;
    }

    public Instant getIssuedAt() {
        return issuedAt;
    }

    public void setIssuedAt(Instant issuedAt) {
        this.issuedAt = issuedAt;
    }

    public TicketStatus getStatus() {
        return status;
    }

    public void setStatus(TicketStatus status) {
        this.status = status;
    }

    public String getSeatInfo() {
        return seatInfo;
    }

    public void setSeatInfo(String seatInfo) {
        this.seatInfo = seatInfo;
    }

    public String getQrData() {
        return qrData;
    }

    public void setQrData(String qrData) {
        this.qrData = qrData;
    }
}
