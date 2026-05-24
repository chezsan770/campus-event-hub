package com.chezsan.backend_event_hub.controller;

import com.chezsan.backend_event_hub.service.AuthService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, Object> request) {
        return authService.login(request);
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, Object> request) {
        return authService.register(request);
    }

    @PostMapping("/google/login")
    public Map<String, Object> googleLogin(@RequestBody Map<String, Object> request) {
        return authService.googleLogin(request);
    }

    @PostMapping("/google/register")
    public Map<String, Object> googleRegister(@RequestBody Map<String, Object> request) {
        return authService.googleRegister(request);
    }

    @GetMapping("/me")
    public Map<String, Object> me(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        return authService.me(authHeader);
    }

    @PutMapping("/me/avatar")
    public Map<String, Object> updateCurrentUserAvatar(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Object> request
    ) {
        return authService.updateCurrentUserAvatar(authHeader, request);
    }

    @PostMapping("/logout")
    public Map<String, Object> logout() {
        return Map.of("message", "Logged out");
    }
}
