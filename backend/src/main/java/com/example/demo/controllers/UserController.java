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

    // --------- SIGN UP ----------
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User newUser) {
        // 1. Make sure user doesn't already exist
        String existsSql = "SELECT count(*) FROM Users WHERE email = ?";
        Integer exists = jdbcTemplate.queryForObject(existsSql, Integer.class, newUser.getEmail());
        if (exists != null && exists > 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("User with this email already exists.");
        }

        // 2. Insert into UserPreferences
        String prefInsertSql = "INSERT INTO UserPreferences (dietaryRestrictions, dietaryPreferences) VALUES (?, ?)";
        org.springframework.jdbc.support.GeneratedKeyHolder prefKey = new org.springframework.jdbc.support.GeneratedKeyHolder();
        jdbcTemplate.update(conn -> {
            java.sql.PreparedStatement ps = conn.prepareStatement(prefInsertSql, new String[]{"preferenceId"});
            ps.setString(1, newUser.getDietaryRestrictions());
            ps.setString(2, newUser.getDietaryPreferences());
            return ps;
        }, prefKey);
        Integer userPreferenceId = prefKey.getKey().intValue();

        // 3. Insert user, refer to UserPreferences row
        String userInsertSql = "INSERT INTO Users (firstName, lastName, email, password, cookingLevel, userPreference) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(userInsertSql,
                newUser.getFirstName(),
                newUser.getLastName(),
                newUser.getEmail(),
                newUser.getPassword(),
                newUser.getCookingLevel(),
                userPreferenceId
        );
        return ResponseEntity.ok("Signup successful!");
    }

    // --------- LOGIN ----------
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
                user.setCookingLevel(rs.getInt("cookingLevel"));
                user.setUserPreference(rs.getInt("userPreference"));

                // Fetch UserPreferences
                String prefSql = "SELECT * FROM UserPreferences WHERE preferenceId = ?";
                jdbcTemplate.query(prefSql, new Object[]{user.getUserPreference()}, (prs, prow) -> {
                    user.setDietaryRestrictions(prs.getString("dietaryRestrictions"));
                    user.setDietaryPreferences(prs.getString("dietaryPreferences"));
                    return null;
                });

                return user;
            }
        );
        if (!users.isEmpty()) {
            return ResponseEntity.ok(users.get(0));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found. Please sign up.");
        }
    }

    // --------- GET ALL COOKING LEVELS ----------
    @GetMapping("/cookingLevels")
    public List<CookingLevel> getCookingLevels() {
        String sql = "SELECT cookingId, cookingLevel, cookingDescription FROM CookingLevel";
        return jdbcTemplate.query(sql,
            (rs, rowNum) -> new CookingLevel(
                rs.getInt("cookingId"),
                rs.getString("cookingLevel"),
                rs.getString("cookingDescription")
            )
        );
    }

    // --------- MODELS ---------
    public static class User {
        private Integer userId;
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private Integer cookingLevel;
        private Integer userPreference;

        // Preferences fields (for join result & signup)
        private String dietaryRestrictions;
        private String dietaryPreferences;

        public User() {}

        // Getters and setters...
        public Integer getUserId() { return userId; }
        public void setUserId(Integer userId) { this.userId = userId; }

        public String getFirstName() { return firstName; }
        public void setFirstName(String firstName) { this.firstName = firstName; }

        public String getLastName() { return lastName; }
        public void setLastName(String lastName) { this.lastName = lastName; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }

        public Integer getCookingLevel() { return cookingLevel; }
        public void setCookingLevel(Integer cookingLevel) { this.cookingLevel = cookingLevel; }

        public Integer getUserPreference() { return userPreference; }
        public void setUserPreference(Integer userPreference) { this.userPreference = userPreference; }

        public String getDietaryRestrictions() { return dietaryRestrictions; }
        public void setDietaryRestrictions(String dietaryRestrictions) { this.dietaryRestrictions = dietaryRestrictions; }

        public String getDietaryPreferences() { return dietaryPreferences; }
        public void setDietaryPreferences(String dietaryPreferences) { this.dietaryPreferences = dietaryPreferences; }
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

    public static class CookingLevel {
        private Integer cookingId;
        private String cookingLevel;
        private String cookingDescription;

        public CookingLevel() {}
        public CookingLevel(Integer id, String level, String desc) {
            this.cookingId = id;
            this.cookingLevel = level;
            this.cookingDescription = desc;
        }
        public Integer getCookingId() { return cookingId; }
        public void setCookingId(Integer cookingId) { this.cookingId = cookingId; }
        public String getCookingLevel() { return cookingLevel; }
        public void setCookingLevel(String cookingLevel) { this.cookingLevel = cookingLevel; }
        public String getCookingDescription() { return cookingDescription; }
        public void setCookingDescription(String cookingDescription) { this.cookingDescription = cookingDescription; }
    }
}