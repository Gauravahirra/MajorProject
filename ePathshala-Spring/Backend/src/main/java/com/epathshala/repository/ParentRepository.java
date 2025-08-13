package com.epathshala.repository;

import com.epathshala.entity.Parent;
import com.epathshala.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ParentRepository extends JpaRepository<Parent, Long> {
    Optional<Parent> findByUser(User user);
}