package com.example.ridesharelist.User.Service;

import com.example.ridesharelist.User.Entity.UserEntity;
import com.example.ridesharelist.User.Repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // CREATE
    public UserEntity addUser(UserEntity user) {
        return userRepository.save(user);
    }

    // READ ALL
    public List<UserEntity> getAllUsers() {
        return userRepository.findAll();
    }

    // READ BY ID
    public Optional<UserEntity> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // UPDATE
    public UserEntity updateUser(Long id, UserEntity user) {

        UserEntity existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setName(user.getName());
        existingUser.setEmail(user.getEmail());
        existingUser.setPhone(user.getPhone());
        existingUser.setRole(user.getRole());

        return userRepository.save(existingUser);
    }

    // DELETE
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}