package com.chezsan.backend_event_hub.service;

import com.chezsan.backend_event_hub.model.AppUser;

import java.util.LinkedHashMap;
import java.util.Map;

final class UserMapper {
    private UserMapper() {
    }

    static Map<String, Object> toMap(AppUser user) {
        Map<String, Object> mapped = new LinkedHashMap<>();
        mapped.put("id", user.getId());
        mapped.put("name", user.getName());
        mapped.put("email", user.getEmail());
        mapped.put("role", user.getRole().name());
        mapped.put("avatar", user.getAvatar() == null ? initials(user.getName()) : user.getAvatar());
        mapped.put("department", user.getDepartment() == null ? "" : user.getDepartment());
        mapped.put("firstName", user.getFirstName() == null ? "" : user.getFirstName());
        mapped.put("lastName", user.getLastName() == null ? "" : user.getLastName());
        mapped.put("profilePicture", user.getProfilePicture() == null ? "" : user.getProfilePicture());
        mapped.put("authProvider", user.getAuthProvider() == null ? "LOCAL" : user.getAuthProvider());
        mapped.put("organizerRequested", Boolean.TRUE.equals(user.getOrganizerRequested()));
        mapped.put("organizerApproved", Boolean.TRUE.equals(user.getOrganizerApproved()));
        return mapped;
    }

    static String initials(String name) {
        if (name == null || name.isBlank()) {
            return "U";
        }
        String[] parts = name.trim().split("\\s+");
        String first = parts[0].substring(0, 1);
        String second = parts.length > 1 ? parts[1].substring(0, 1) : "";
        return (first + second).toUpperCase();
    }
}
