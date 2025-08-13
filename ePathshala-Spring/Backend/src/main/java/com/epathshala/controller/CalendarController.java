package com.epathshala.controller;

import com.epathshala.entity.AcademicCalendar;
import com.epathshala.repository.AcademicCalendarRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/calendar")
@Tag(name = "Academic Calendar", description = "Public academic calendar APIs for all users")
public class CalendarController {
    
    @Autowired
    private AcademicCalendarRepository academicCalendarRepository;

    @GetMapping("/events")
    @Operation(summary = "Get All Calendar Events", description = "Retrieve all academic calendar events (accessible by all authenticated users)")
    public ResponseEntity<?> getAllEvents() {
        try {
            return ResponseEntity.ok(academicCalendarRepository.findAll());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching calendar events"));
        }
    }

    @GetMapping("/events/upcoming")
    @Operation(summary = "Get Upcoming Events", description = "Retrieve upcoming academic calendar events")
    public ResponseEntity<?> getUpcomingEvents() {
        try {
            LocalDate today = LocalDate.now();
            List<AcademicCalendar> upcomingEvents = academicCalendarRepository.findAll().stream()
                .filter(event -> event.getDate().isAfter(today) || event.getDate().isEqual(today))
                .sorted(Comparator.comparing(AcademicCalendar::getDate))
                .collect(Collectors.toList());
            return ResponseEntity.ok(upcomingEvents);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", "Error fetching upcoming events"));
        }
    }
} 