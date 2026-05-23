package com.chezsan.backend_event_hub.controller;

import com.chezsan.backend_event_hub.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<Map<String, Object>> getUsers() {
        return userService.getUsers();
    }

    @GetMapping("/{id}")
    public Map<String, Object> getUser(@PathVariable Long id) {
        return userService.getUser(id);
    }

    @PutMapping("/{id}")
    public Map<String, Object> updateUser(@PathVariable Long id, @RequestBody Map<String, Object> request) {
        return userService.updateUser(id, request);
    }

    @DeleteMapping("/{id}")
    public Map<String, Object> deleteUser(@PathVariable Long id) {
        return userService.deleteUser(id);
    }
}
