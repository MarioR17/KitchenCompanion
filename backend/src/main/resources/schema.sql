CREATE TABLE IF NOT EXISTS Users (
  userId INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  userPreference INTEGER, 
  cookingLevel INTEGER, 
  FOREIGN KEY (cookingLevel) REFERENCES CookingLevel(cookingId), 
  FOREIGN KEY (userPreference) REFERENCES UserPreferences(preferenceId)
);

CREATE TABLE UserPreferences (
  preferenceId INTEGER PRIMARY KEY AUTOINCREMENT, 
  dietaryRestrictions TEXT, 
  dietaryPreferences TEXT
);

CREATE TABLE IF NOT EXISTS CookingLevel (
    cookingId INTEGER PRIMARY KEY AUTOINCREMENT,
    cookingLevel TEXT NOT NULL,
    cookingDescription TEXT NOT NULL
);

INSERT OR IGNORE INTO CookingLevel (cookingLevel, cookingDescription) VALUES
('Guided Chef', 'New to cooking or rarely cooks. Needs: Detailed step-by-step instructions with photos, explanations of terms (e.g. sauté, dice), simpler recipes with fewer ingredients.'),
('Confident Chef', 'Comfortable following recipes, basic techniques mastered, experiments occasionally. Needs: Standard recipe layout without extra definitions, familiar with basic skills, may need videos or tips for advanced prep like filleting fish.'),
('Advanced Chef', 'Highly experienced home or professional cook. Needs: minimalistic instructions, advanced techniques (e.g. sous vide, confit), flavor pairing suggestions, plating guides, flexibility to modify or build recipes from ingredient suggestions.');
