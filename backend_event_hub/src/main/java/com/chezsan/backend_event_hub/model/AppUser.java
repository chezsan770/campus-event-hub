package com.chezsan.backend_event_hub.model;

import jakarta.persistence.*;

@Entity
@Table(name = "app_users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String firstName;
    private String lastName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role = UserRole.STUDENT;

    @Column(columnDefinition = "TEXT")
    private String avatar;
    private String department;
    @Column(columnDefinition = "TEXT")
    private String profilePicture;
    private String authProvider = "LOCAL";
    private String googleSubject;
    private Boolean organizerRequested = false;
    private Boolean organizerApproved = false;

    @Column(length = 2000)
    private String organizerDetails;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getAuthProvider() {
        return authProvider;
    }

    public void setAuthProvider(String authProvider) {
        this.authProvider = authProvider;
    }

    public String getGoogleSubject() {
        return googleSubject;
    }

    public void setGoogleSubject(String googleSubject) {
        this.googleSubject = googleSubject;
    }

    public Boolean getOrganizerRequested() {
        return organizerRequested;
    }

    public void setOrganizerRequested(Boolean organizerRequested) {
        this.organizerRequested = organizerRequested;
    }

    public Boolean getOrganizerApproved() {
        return organizerApproved;
    }

    public void setOrganizerApproved(Boolean organizerApproved) {
        this.organizerApproved = organizerApproved;
    }

    public String getOrganizerDetails() {
        return organizerDetails;
    }

    public void setOrganizerDetails(String organizerDetails) {
        this.organizerDetails = organizerDetails;
    }
}
