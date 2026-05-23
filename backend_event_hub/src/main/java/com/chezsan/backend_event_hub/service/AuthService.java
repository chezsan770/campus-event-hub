package com.chezsan.backend_event_hub.service;

import com.chezsan.backend_event_hub.model.AppUser;
import com.chezsan.backend_event_hub.model.UserRole;
import com.chezsan.backend_event_hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RestClient restClient;
    private final String googleClientId;

    public AuthService(UserRepository userRepository, @Value("${google.client-id:}") String googleClientId) {
        this.userRepository = userRepository;
        this.googleClientId = googleClientId;
        this.restClient = RestClient.create("https://oauth2.googleapis.com");
    }

    public Map<String, Object> login(Map<String, Object> request) {
        String email = stringValue(request.get("email"));
        String password = stringValue(request.get("password"));
        AppUser user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!user.getPassword().equals(password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return authResponse(user);
    }

    public Map<String, Object> register(Map<String, Object> request) {
        String email = stringValue(request.get("email")).toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }

        AppUser user = new AppUser();
        user.setName(stringValue(request.get("name")));
        String[] nameParts = user.getName().trim().split("\\s+", 2);
        user.setFirstName(nameParts.length > 0 ? nameParts[0] : "");
        user.setLastName(nameParts.length > 1 ? nameParts[1] : "");
        user.setEmail(email);
        user.setPassword(stringValue(request.get("password")));
        user.setRole(parseRole(stringValue(request.getOrDefault("role", "STUDENT"))));
        user.setDepartment(stringValue(request.get("department")));
        user.setAvatar(UserMapper.initials(user.getName()));

        return authResponse(userRepository.save(user));
    }

    public Map<String, Object> googleLogin(Map<String, Object> request) {
        Map<String, Object> googleProfile = verifyGoogleToken(stringValue(request.get("idToken")));
        String email = stringValue(googleProfile.get("email")).toLowerCase();
        AppUser user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "No account exists for this Google email. Please create an account first."));
        return authResponse(user);
    }

    public Map<String, Object> googleRegister(Map<String, Object> request) {
        Map<String, Object> googleProfile = verifyGoogleToken(stringValue(request.get("idToken")));
        String email = stringValue(googleProfile.get("email")).toLowerCase();
        AppUser user = userRepository.findByEmailIgnoreCase(email).orElseGet(AppUser::new);
        boolean isNewUser = user.getId() == null;

        String firstName = stringValue(request.getOrDefault("firstName", googleProfile.get("given_name")));
        String lastName = stringValue(request.getOrDefault("lastName", googleProfile.get("family_name")));
        String profilePicture = stringValue(request.getOrDefault("profilePicture", googleProfile.get("picture")));
        boolean organizerRequested = booleanValue(request.getOrDefault("organizerRequested", false));

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setName((firstName + " " + lastName).trim());
        if (user.getName().isBlank()) {
            user.setName(stringValue(googleProfile.get("name")));
        }
        user.setEmail(email);
        if (isNewUser || user.getPassword() == null || user.getPassword().isBlank()) {
            user.setPassword("GOOGLE_AUTH");
        }
        user.setAuthProvider("GOOGLE");
        user.setGoogleSubject(stringValue(googleProfile.get("sub")));
        user.setProfilePicture(profilePicture);
        user.setAvatar(UserMapper.initials(user.getName()));
        user.setDepartment(stringValue(request.get("department")));
        user.setOrganizerRequested(organizerRequested);
        if (isNewUser || user.getOrganizerApproved() == null) {
            user.setOrganizerApproved(false);
        }
        user.setOrganizerDetails(stringValue(request.get("organizerDetails")));
        if (isNewUser) {
            user.setRole(organizerRequested ? UserRole.ORGANIZER : UserRole.STUDENT);
        } else if (organizerRequested && user.getRole() == UserRole.STUDENT) {
            user.setRole(UserRole.ORGANIZER);
        }

        return authResponse(userRepository.save(user));
    }

    public AppUser currentUser(String authorizationHeader) {
        Long userId = parseToken(authorizationHeader);
        if (userId != null) {
            return userRepository.findById(userId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid user token"));
        }

        return userRepository.findByEmailIgnoreCase("alex@campus.edu")
                .orElseGet(() -> userRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No users exist")));
    }

    public Map<String, Object> me(String authorizationHeader) {
        return UserMapper.toMap(currentUser(authorizationHeader));
    }

    private Map<String, Object> authResponse(AppUser user) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("token", "dev-token-" + user.getId());
        response.put("user", UserMapper.toMap(user));
        return response;
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> verifyGoogleToken(String idToken) {
        if (googleClientId == null || googleClientId.isBlank()) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Google login is not configured on the server");
        }
        if (idToken == null || idToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Missing Google ID token");
        }

        Map<String, Object> response;
        try {
            response = restClient.get()
                    .uri(uriBuilder -> uriBuilder.path("/tokeninfo").queryParam("id_token", idToken).build())
                    .retrieve()
                    .body(Map.class);
        } catch (RuntimeException ex) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Google account token");
        }

        if (response == null || !googleClientId.equals(stringValue(response.get("aud")))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google token audience does not match this application");
        }
        if (!booleanValue(response.get("email_verified"))) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Google email is not verified");
        }
        return response;
    }

    private Long parseToken(String authorizationHeader) {
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer dev-token-")) {
            return null;
        }
        try {
            return Long.parseLong(authorizationHeader.substring("Bearer dev-token-".length()));
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private UserRole parseRole(String value) {
        try {
            return UserRole.valueOf(value.toUpperCase());
        } catch (RuntimeException ex) {
            return UserRole.STUDENT;
        }
    }

    private boolean booleanValue(Object value) {
        if (value instanceof Boolean bool) {
            return bool;
        }
        return value != null && Boolean.parseBoolean(value.toString());
    }

    private String stringValue(Object value) {
        return value == null ? "" : value.toString();
    }
}
