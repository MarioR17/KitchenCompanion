# Kitchen Companion 🍳

A personalized cooking companion that helps users discover recipes, plan meals, and cook with confidence. Built with React TypeScript frontend and Spring Boot backend.

## Features

- **Personalized Recipe Generation**: AI-powered recipe suggestions based on user preferences
- **User Profiles**: Dietary restrictions, preferences, and cooking skill levels
- **Smart Recommendations**: Recipes tailored to your cooking experience
- **Modern UI**: Clean, responsive design with smooth navigation

## Tech Stack

**Frontend:**
- React 19 with TypeScript
- Vite for fast development and building
- CSS3 with modern styling

**Backend:**
- Spring Boot 3.1.5
- SQLite database
- OpenAI API integration
- RESTful API design

## Prerequisites

Before running the application, make sure you have:

- **Node.js** (version 18 or higher)
- **Java** (version 21 or higher)
- **Maven** (version 3.6 or higher)
- **OpenAI API Key** (for recipe generation)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd KitchenCompanion
```

### 2. Backend Setup

#### Navigate to backend directory:
```bash
cd backend
```

#### Set up OpenAI API Key:
```bash
# Option 1: Environment variable (recommended)
export OPEN_AI_API_KEY=your-openai-api-key-here

# Option 2: Update application.properties
# Edit src/main/resources/application.properties and replace the placeholder
```

#### Install dependencies and run:
```bash
# Install dependencies
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

### 3. Frontend Setup

#### Navigate to frontend directory:
```bash
cd ../frontend
```

#### Install dependencies and run:
```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Running the Application

1. **Start the Backend** (Terminal 1):
   ```bash
   cd backend
   mvn spring-boot:run
   ```

2. **Start the Frontend** (Terminal 2):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

## API Endpoints

### User Management
- `POST /api/users/signup` - Create new user account
- `POST /api/users/login` - User authentication
- `GET /api/users/cookingLevels` - Get available cooking levels

### Recipe Generation
- `POST /api/recipes/generate` - Generate personalized recipe
- `POST /api/recipes/suggest` - Get recipe suggestions from ingredients
- `GET /api/recipes/test-openai` - Test OpenAI API connection

## Application Structure

```
KitchenCompanion/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/          # Login/Signup components
│   │   │   ├── Dashboard/     # Main dashboard
│   │   │   ├── Landing/       # Landing page
│   │   │   └── UserProfile/   # User profile setup
│   │   ├── App.tsx           # Main app component
│   │   └── main.tsx          # Entry point
│   └── package.json
└── backend/
    ├── src/main/java/com/example/demo/
    │   ├── controllers/       # REST controllers
    │   ├── services/         # Business logic
    │   └── config/           # Configuration classes
    ├── src/main/resources/
    │   ├── application.properties
    │   └── schema.sql        # Database schema
    └── pom.xml
```

## Environment Variables

### Required
- `OPEN_AI_API_KEY` - Your OpenAI API key for recipe generation

### Optional
- `SPRING_DATASOURCE_URL` - Database URL (defaults to SQLite)

## Development Commands

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

### Backend
```bash
mvn spring-boot:run    # Start development server
mvn clean install     # Install dependencies
mvn test              # Run tests
```

## Troubleshooting

### Common Issues

**1. Backend won't start:**
- Check Java version: `java -version`
- Verify Maven installation: `mvn -version`
- Check port 8080 availability

**2. Frontend won't start:**
- Check Node.js version: `node -version`
- Clear node_modules: `rm -rf node_modules && npm install`
- Check port 5173 availability

**3. OpenAI API errors:**
- Verify API key is set correctly
- Check API key validity at OpenAI platform
- Ensure sufficient API credits

**4. Database issues:**
- Database file (`data.db`) is automatically created
- Check write permissions in the backend directory

### Getting Help

- Check console logs for detailed error messages
- Verify all prerequisites are installed
- Ensure both frontend and backend are running simultaneously

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
