CREATE TABLE IF NOT EXISTS Users (
  userId INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL
  cookingLevel INTEGER, 
  FOREIGN KEY (cookingLevel) REFERENCES CookingLevel(cookingId)
);

CREATE TABLE IF NOT EXISTS UsersDietaryRestrictions (
  user_id INTEGER,
  restriction_id INTEGER,
  PRIMARY KEY (user_id, restriction_id),
  FOREIGN KEY (userId) REFERENCES Users(userId),
  FOREIGN KEY (restrictionId) REFERENCES DietaryRestrictions(restrictionId)
);

CREATE TABLE IF NOT EXISTS DietaryRestrictions (
  restrictionId INTEGER PRIMARY KEY AUTOINCREMENT, 
  restriction TEXT NOT NULL
);

INSERT OR IGNORE INTO DietaryRestrictions (restriction) VALUES
('Vegetarian'),
('Vegan'),
('Pescatarian'),
('Kosher'),
('Halal'),
('Paleo'),
('Keto'),
('Gluten-Free'),
('Wheat-Free'),
('Nut-Free'),
('Peanut-Free'),
('Tree Nut-Free'),
('Dairy-Free'),
('Lactose-Free'),
('Egg-Free'),
('Soy-Free'),
('Shellfish-Free'),
('Fish-Free'),
('Sesame-Free'),
('Low FODMAP'),
('Low Carb'),
('Low Sodium'),
('No Pork'),
('No Beef');

CREATE TABLE IF NOT EXISTS CookingLevel (
    cookingId INTEGER PRIMARY KEY AUTOINCREMENT,
    cookingLevel TEXT NOT NULL,
    cookingDescription TEXT NOT NULL
);

INSERT OR IGNORE INTO CookingLevel (cookingLevel, cookingDescription) VALUES
('Beginner', 'New to cooking or rarely cooks. Needs: Detailed step-by-step instructions with photos, explanations of terms (e.g. sauté, dice), simpler recipes with fewer ingredients.'),
('Confident Home Cook', 'Comfortable following recipes, basic techniques mastered, experiments occasionally. Needs: Standard recipe layout without extra definitions, familiar with basic skills, may need videos or tips for advanced prep like filleting fish.'),
('Advanced Chef', 'Highly experienced home or professional cook. Needs: minimalistic instructions, advanced techniques (e.g. sous vide, confit), flavor pairing suggestions, plating guides, flexibility to modify or build recipes from ingredient suggestions.');
