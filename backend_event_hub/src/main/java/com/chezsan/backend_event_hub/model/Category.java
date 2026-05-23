package com.chezsan.backend_event_hub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    private String id;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private String color;

    protected Category() {
    }

    public Category(String id, String label, String color) {
        this.id = id;
        this.label = label;
        this.color = color;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
