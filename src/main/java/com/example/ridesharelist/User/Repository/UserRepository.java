package com.example.ridesharelist.User.Repository;

import com.example.ridesharelist.User.Entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Long> {
}