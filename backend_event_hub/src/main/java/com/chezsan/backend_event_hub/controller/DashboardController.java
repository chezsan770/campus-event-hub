package com.chezsan.backend_event_hub.controller;

import com.chezsan.backend_event_hub.service.AuthService;
import com.chezsan.backend_event_hub.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final AuthService authService;

    public DashboardController(DashboardService dashboardService, AuthService authService) {
        this.dashboardService = dashboardService;
        this.authService = authService;
    }

    @GetMapping("/admin")
    public Map<String, Object> admin(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return dashboardService.admin(authService.currentUser(authHeader));
    }

    @GetMapping("/student")
    public Map<String, Object> student(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return dashboardService.student(authService.currentUser(authHeader));
    }

    @GetMapping("/organizer")
    public Map<String, Object> organizer(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return dashboardService.organizer(authService.currentUser(authHeader));
    }
}
