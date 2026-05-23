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

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
        if (request.containsKey("avatar")) user.setAvatar(value(request.get("avatar")));
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
