package com.epathshala.repository;

import com.epathshala.entity.AcademicCalendar;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AcademicCalendarRepository extends JpaRepository<AcademicCalendar, Long> {
}