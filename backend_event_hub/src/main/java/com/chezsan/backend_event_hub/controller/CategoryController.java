package com.chezsan.backend_event_hub.controller;

import com.chezsan.backend_event_hub.service.EventService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final EventService eventService;

    public CategoryController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping
    public List<Map<String, Object>> getCategories() {
        return eventService.getCategories();
    }
}
