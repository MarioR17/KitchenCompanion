package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/add")
    public String addUser(@RequestBody User user) {
        String sql = "INSERT INTO users(name, email) VALUES (?, ?)";
        jdbcTemplate.update(sql, user.getName(), user.getEmail());
        return "User added!";
    }

    @GetMapping
    public List<User> getUsers() {
        String sql = "SELECT * FROM users";
        return jdbcTemplate.query(sql, (rs, rowNum) -> new User(
            rs.getInt("id"),
            rs.getString("name"),
            rs.getString("email")
        ));
    }

    // ... other endpoints ...
}

// User.java (place in same package)
class User {
    private int id;
    private String name;
    private String email;
    // Constructors, getters, and setters
    public User() {}
    public User(int id, String name, String email) {
        this.id = id; this.name = name; this.email = email;
    }
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
