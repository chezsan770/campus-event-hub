package com.chezsan.backend_event_hub.service;

import com.chezsan.backend_event_hub.model.AppUser;
import com.chezsan.backend_event_hub.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final ImageStorageService imageStorageService;

    public UserService(UserRepository userRepository, ImageStorageService imageStorageService) {
        this.userRepository = userRepository;
        this.imageStorageService = imageStorageService;
    }

    public List<Map<String, Object>> getUsers() {
        return userRepository.findAll().stream().map(UserMapper::toMap).toList();
    }

    public Map<String, Object> getUser(Long id) {
        return UserMapper.toMap(findUser(id));
    }

    public Map<String, Object> updateUser(Long id, Map<String, Object> request) {
        AppUser user = findUser(id);
        if (request.containsKey("name")) user.setName(value(request.get("name")));
        if (request.containsKey("email")) user.setEmail(value(request.get("email")));
        if (request.containsKey("department")) user.setDepartment(value(request.get("department")));
        if (request.containsKey("avatar")) {
            String storedAvatar = imageStorageService.storeAvatar(value(request.get("avatar")));
            user.setAvatar(storedAvatar);
            user.setProfilePicture(storedAvatar);
        }
        if (request.containsKey("profilePicture")) {
            String storedAvatar = imageStorageService.storeAvatar(value(request.get("profilePicture")));
            user.setAvatar(storedAvatar);
            user.setProfilePicture(storedAvatar);
        }
        return UserMapper.toMap(userRepository.save(user));
    }

    public Map<String, Object> deleteUser(Long id) {
        AppUser user = findUser(id);
        userRepository.delete(user);
        return Map.of("message", "User deleted", "id", id);
    }

    private AppUser findUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    private String value(Object object) {
        return object == null ? "" : object.toString();
    }
}
