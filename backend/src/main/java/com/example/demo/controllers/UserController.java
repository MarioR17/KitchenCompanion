package com.example.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User newUser) {
        String existsSql = "SELECT count(*) FROM Users WHERE email = ?";
        int exists = jdbcTemplate.queryForObject(existsSql, Integer.class, newUser.getEmail());
        if (exists > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                .body("User with this email already exists.");
        }

        String insertSql = "INSERT INTO Users (firstName, lastName, email, password, cookingLevel) VALUES (?, ?, ?, ?, ?)";
        org.springframework.jdbc.support.GeneratedKeyHolder keyHolder = new org.springframework.jdbc.support.GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            java.sql.PreparedStatement ps = connection.prepareStatement(insertSql, new String[]{"userId"});
            ps.setString(1, newUser.getFirstName());
            ps.setString(2, newUser.getLastName());
            ps.setString(3, newUser.getEmail());
            ps.setString(4, newUser.getPassword());
            if (newUser.getCookingLevel() == null) {
                ps.setNull(5, java.sql.Types.INTEGER);
            } else {
                ps.setInt(5, newUser.getCookingLevel());
            }
            return ps;
        }, keyHolder);
        Integer newUserId = keyHolder.getKey().intValue();

        if (newUser.getDietaryRestrictionIds() != null) {
            for (Integer restrictionId : newUser.getDietaryRestrictionIds()) {
                String drSql = "INSERT INTO UsersDietaryRestrictions (user_id, restriction_id) VALUES (?, ?)";
                jdbcTemplate.update(drSql, newUserId, restrictionId);
            }
        }

        return ResponseEntity.ok("Signup successful!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String sql = "SELECT * FROM Users WHERE email = ? AND password = ?";
        List<User> users = jdbcTemplate.query(sql,
            new Object[]{loginRequest.getEmail(), loginRequest.getPassword()},
            (rs, rowNum) -> {
                User user = new User();
                user.setUserId(rs.getInt("userId"));
                user.setFirstName(rs.getString("firstName"));
                user.setLastName(rs.getString("lastName"));
                user.setEmail(rs.getString("email"));
                user.setPassword(rs.getString("password"));
                int cookingLevelVal = rs.getInt("cookingLevel");
                user.setCookingLevel(rs.wasNull() ? null : cookingLevelVal);
                return user;
            }
        );
        if (!users.isEmpty()) {
            return ResponseEntity.ok(users.get(0));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("User not found. Please sign up.");
        }
    }

    public static class User {
        private Integer userId;
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private Integer cookingLevel;
        private List<Integer> dietaryRestrictionIds;

        public User() {}

        public Integer getUserId() {
            return userId;
        }
        public void setUserId(Integer userId) {
            this.userId = userId;
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
        public Integer getCookingLevel() {
            return cookingLevel;
        }
        public void setCookingLevel(Integer cookingLevel) {
            this.cookingLevel = cookingLevel;
        }
        public List<Integer> getDietaryRestrictionIds() {
            return dietaryRestrictionIds;
        }
        public void setDietaryRestrictionIds(List<Integer> dietaryRestrictionIds) {
            this.dietaryRestrictionIds = dietaryRestrictionIds;
        }
    }

    public static class LoginRequest {
        private String email;
        private String password;

        public LoginRequest() {}
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}