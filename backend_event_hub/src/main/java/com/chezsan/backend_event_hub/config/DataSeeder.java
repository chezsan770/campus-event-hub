package com.chezsan.backend_event_hub.config;

import com.chezsan.backend_event_hub.model.*;
import com.chezsan.backend_event_hub.repository.CategoryRepository;
import com.chezsan.backend_event_hub.repository.EventRepository;
import com.chezsan.backend_event_hub.repository.TicketRepository;
import com.chezsan.backend_event_hub.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;

    public DataSeeder(CategoryRepository categoryRepository, UserRepository userRepository, EventRepository eventRepository, TicketRepository ticketRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.eventRepository = eventRepository;
        this.ticketRepository = ticketRepository;
    }

    @Override
    public void run(String... args) {
        seedCategories();
        if (userRepository.count() == 0) {
            seedUsers();
        }
        if (eventRepository.count() == 0) {
            seedEvents();
        }
        if (ticketRepository.count() == 0) {
            seedTickets();
        }
    }

    private void seedCategories() {
        List.of(
                new Category("tech", "Technology", "blue"),
                new Category("social", "Social", "purple"),
                new Category("sports", "Sports", "green"),
                new Category("arts", "Arts & Music", "orange"),
                new Category("career", "Career", "blue"),
                new Category("workshop", "Workshop", "purple"),
                new Category("academic", "Academic", "green")
        ).forEach(category -> {
            if (!categoryRepository.existsById(category.getId())) {
                categoryRepository.save(category);
            }
        });
    }

    private void seedUsers() {
        userRepository.save(user("Alex Johnson", "alex@campus.edu", UserRole.STUDENT, "Computer Science"));
        userRepository.save(user("Sarah Chen", "sarah@campus.edu", UserRole.ORGANIZER, "Engineering Club"));
        userRepository.save(user("Admin User", "admin@campus.edu", UserRole.ADMIN, "Administration"));
        userRepository.save(user("Marcus Williams", "marcus@campus.edu", UserRole.STUDENT, "Business School"));
    }

    private AppUser user(String name, String email, UserRole role, String department) {
        AppUser user = new AppUser();
        user.setName(name);
        String[] parts = name.split("\\s+", 2);
        user.setFirstName(parts[0]);
        user.setLastName(parts.length > 1 ? parts[1] : "");
        user.setEmail(email);
        user.setPassword("password123");
        user.setRole(role);
        user.setDepartment(department);
        user.setAvatar(initials(name));
        user.setAuthProvider("LOCAL");
        return user;
    }

    private void seedEvents() {
        AppUser organizer = userRepository.findByEmailIgnoreCase("sarah@campus.edu").orElseThrow();
        AppUser admin = userRepository.findByEmailIgnoreCase("admin@campus.edu").orElseThrow();

        saveEvent("Annual Tech Symposium 2026", "Join industry leaders and alumni for a full day of networking, workshops, and keynote speeches on the future of AI and software engineering.", "tech", "2026-06-15", "09:00 AM", "06:00 PM", "Main Auditorium", "Engineering Building, Room 101", 500, 342, 0, organizer, EventStatus.UPCOMING, true, List.of("AI", "Networking", "Career"), "from-blue-600 to-purple-600");
        saveEvent("Business Society Networking Mixer", "Connect with fellow business majors and local entrepreneurs over light refreshments.", "social", "2026-06-18", "06:00 PM", "09:00 PM", "Business School Lounge", "Business Building, 3rd Floor", 150, 98, 5, organizer, EventStatus.UPCOMING, false, List.of("Networking", "Business", "Mixer"), "from-purple-600 to-pink-600");
        saveEvent("UI/UX Design Masterclass", "Learn the fundamentals of interface design using Figma with industry professional guest speakers.", "workshop", "2026-06-20", "10:00 AM", "01:00 PM", "Design Studio", "Arts Building, Room 204", 50, 47, 10, organizer, EventStatus.UPCOMING, true, List.of("Design", "Figma", "Workshop"), "from-orange-500 to-red-500");
        saveEvent("Campus Intramural Basketball Finals", "Top campus teams battle it out in a double-elimination basketball tournament.", "sports", "2026-06-22", "03:00 PM", "07:00 PM", "Rec Center Gym", "Recreation Center", 300, 189, 0, organizer, EventStatus.UPCOMING, false, List.of("Sports", "Basketball", "Tournament"), "from-green-500 to-teal-500");
        saveEvent("Intro to React & Tailwind CSS", "Level up your frontend skills in this intensive workshop led by student mentors.", "tech", "2026-06-28", "02:00 PM", "05:00 PM", "Computer Lab 3", "Science Building, Room 302", 40, 38, 0, organizer, EventStatus.UPCOMING, false, List.of("React", "Web Dev", "Workshop"), "from-cyan-500 to-blue-500");
        saveEvent("Annual Hackathon 2026: Innovate the Future", "A 24-hour hackathon where teams compete to build useful campus-focused solutions.", "tech", "2026-07-10", "08:00 AM", "08:00 AM", "Innovation Hub", "Student Center, Hall A & B", 200, 156, 0, organizer, EventStatus.UPCOMING, true, List.of("Hackathon", "Innovation", "Competition"), "from-violet-600 to-blue-600");
        saveEvent("Spring Arts & Music Festival", "An afternoon of music, art installations, food stalls, and live performances.", "arts", "2026-07-15", "12:00 PM", "10:00 PM", "Campus Quad", "Main Quad, Outdoor Area", 1000, 412, 0, organizer, EventStatus.UPCOMING, true, List.of("Music", "Art", "Festival"), "from-pink-500 to-orange-400");
        saveEvent("Career Fair 2026", "Meet recruiters from companies, bring your resume, and explore internships.", "career", "2026-05-10", "10:00 AM", "04:00 PM", "Main Arena", "Sports Complex, Main Arena", 800, 623, 0, admin, EventStatus.PAST, false, List.of("Career", "Jobs", "Networking"), "from-blue-700 to-indigo-600");
        saveEvent("Guest Lecture: AI Ethics", "A thought-provoking lecture on the ethical implications of artificial intelligence.", "academic", "2026-05-08", "02:30 PM", "04:00 PM", "Auditorium A", "Main Campus Auditorium", 300, 287, 0, admin, EventStatus.PAST, false, List.of("AI", "Ethics", "Lecture"), "from-slate-600 to-slate-800");
    }

    private void saveEvent(String title, String description, String categoryId, String date, String time, String endTime, String location, String venue, int capacity, int registered, int price, AppUser organizer, EventStatus status, boolean featured, List<String> tags, String imageGradient) {
        Event event = new Event();
        event.setTitle(title);
        event.setDescription(description);
        event.setCategory(categoryRepository.findById(categoryId).orElseThrow());
        event.setDate(LocalDate.parse(date));
        event.setTime(time);
        event.setEndTime(endTime);
        event.setLocation(location);
        event.setVenue(venue);
        event.setCapacity(capacity);
        event.setRegistered(registered);
        event.setPrice(BigDecimal.valueOf(price));
        event.setOrganizer(organizer);
        event.setStatus(status);
        event.setFeatured(featured);
        event.setTags(tags);
        event.setImageGradient(imageGradient);
        eventRepository.save(event);
    }

    private void seedTickets() {
        AppUser alex = userRepository.findByEmailIgnoreCase("alex@campus.edu").orElseThrow();
        List<Event> events = eventRepository.findAll();
        for (int i = 0; i < Math.min(3, events.size()); i++) {
            Event event = events.get(i);
            Ticket ticket = new Ticket();
            ticket.setId("TKT-2026-00" + (i + 1));
            ticket.setEvent(event);
            ticket.setHolder(alex);
            ticket.setIssuedAt(Instant.now().minusSeconds(86400L * (i + 1)));
            ticket.setStatus(i == 2 ? TicketStatus.USED : TicketStatus.VALID);
            ticket.setSeatInfo(i == 1 ? "Workshop Seat #12" : "General Admission");
            ticket.setQrData("CEH-" + ticket.getId() + "-" + alex.getEmail() + "-" + event.getId());
            ticketRepository.save(ticket);
        }
    }

    private String initials(String name) {
        String[] parts = name.trim().split("\\s+");
        return (parts[0].substring(0, 1) + (parts.length > 1 ? parts[1].substring(0, 1) : "")).toUpperCase();
    }
}
