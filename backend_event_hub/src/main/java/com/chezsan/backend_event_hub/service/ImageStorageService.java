package com.chezsan.backend_event_hub.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Base64;
import java.util.Map;
import java.util.UUID;

@Service
public class ImageStorageService {

    private static final Map<String, String> EXTENSIONS = Map.of(
            "image/jpeg", ".jpg",
            "image/png", ".png",
            "image/webp", ".webp",
            "image/gif", ".gif"
    );
    private static final int MAX_AVATAR_BYTES = 5 * 1024 * 1024;

    private final Path uploadRoot;
    private final HttpClient httpClient;

    public ImageStorageService(@Value("${app.upload.dir:uploads}") String uploadDir) {
        this.uploadRoot = Path.of(uploadDir).toAbsolutePath().normalize();
        this.httpClient = HttpClient.newBuilder()
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();
    }

    public String storeAvatar(String value) {
        if (value == null || value.isBlank()) {
            return "";
        }
        if (value.startsWith("/uploads/")) {
            return value;
        }
        if (value.startsWith("http://") || value.startsWith("https://")) {
            return storeRemoteAvatar(value);
        }
        if (!value.startsWith("data:image/")) {
            return "";
        }

        int comma = value.indexOf(',');
        int semicolon = value.indexOf(';');
        if (comma < 0 || semicolon < 0 || semicolon > comma) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid avatar image data");
        }

        String mediaType = value.substring("data:".length(), semicolon).toLowerCase();
        String extension = EXTENSIONS.get(mediaType);
        if (extension == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported avatar image type");
        }

        byte[] bytes;
        try {
            bytes = Base64.getDecoder().decode(value.substring(comma + 1));
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid avatar image encoding");
        }

        return saveAvatar(bytes, extension);
    }

    private String storeRemoteAvatar(String url) {
        HttpRequest request;
        try {
            request = HttpRequest.newBuilder(URI.create(url)).GET().build();
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid avatar image URL");
        }

        HttpResponse<byte[]> response;
        try {
            response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not download avatar image");
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not download avatar image");
        }

        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Could not download avatar image");
        }

        String mediaType = response.headers()
                .firstValue("content-type")
                .map(type -> type.split(";", 2)[0].trim().toLowerCase())
                .orElse("");
        String extension = EXTENSIONS.get(mediaType);
        if (extension == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported avatar image type");
        }

        return saveAvatar(response.body(), extension);
    }

    private String saveAvatar(byte[] bytes, String extension) {
        if (bytes.length > MAX_AVATAR_BYTES) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Avatar image must be 5MB or smaller");
        }

        Path avatarDir = uploadRoot.resolve("avatars").normalize();
        Path avatarFile = avatarDir.resolve(UUID.randomUUID() + extension).normalize();
        if (!avatarFile.startsWith(avatarDir)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid avatar image path");
        }

        try {
            Files.createDirectories(avatarDir);
            Files.write(avatarFile, bytes);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save avatar image");
        }

        return "/uploads/avatars/" + avatarFile.getFileName();
    }
}
