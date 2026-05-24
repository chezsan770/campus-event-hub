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
        mapped.put("avatar", imageValue(user.getAvatar(), user.getProfilePicture()));
        mapped.put("department", user.getDepartment() == null ? "" : user.getDepartment());
        mapped.put("firstName", user.getFirstName() == null ? "" : user.getFirstName());
        mapped.put("lastName", user.getLastName() == null ? "" : user.getLastName());
        mapped.put("profilePicture", user.getProfilePicture() == null ? "" : user.getProfilePicture());
        mapped.put("authProvider", user.getAuthProvider() == null ? "LOCAL" : user.getAuthProvider());
        mapped.put("organizerRequested", Boolean.TRUE.equals(user.getOrganizerRequested()));
        mapped.put("organizerApproved", Boolean.TRUE.equals(user.getOrganizerApproved()));
        return mapped;
    }

    static String imageValue(String avatar, String profilePicture) {
        if (avatar != null && !avatar.isBlank()) {
            return avatar;
        }
        return profilePicture == null ? "" : profilePicture;
    }

}
