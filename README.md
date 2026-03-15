# Taskflow

A full-stack task management application built with Spring Boot for the backend and React with TypeScript for the frontend. Taskflow allows users to register, authenticate, and manage their tasks efficiently with JWT-based security.

## Features

- **User Authentication**: Secure login and registration using JWT tokens.
- **Task Management**: Create, read, update, and delete tasks with status tracking.
- **Responsive UI**: Modern, mobile-friendly interface built with React and Tailwind CSS.
- **RESTful API**: Well-documented endpoints for seamless integration.
- **Database Integration**: Uses MySQL for persistent data storage.
- **Security**: Password encryption and JWT-based authorization.

## Tech Stack

### Backend
- **Java 17**
- **Spring Boot** (Web, Security, Data JPA, Validation)
- **MySQL** Database
- **JWT** for authentication
- **Maven** for dependency management

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Axios** for API calls

## Prerequisites

Before running the application, ensure you have the following installed:

- **Java 17** or higher
- **Node.js 16** or higher
- **MySQL 8** or higher
- **Maven 3.6** or higher
- **Git**

## Installation and Setup

### Clone the Repository
```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow
```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Configure the database:
   - Create a MySQL database named `taskflow_db`.
   - Update `src/main/resources/application.properties` with your database credentials:
     ```
     spring.datasource.username=your-username
     spring.datasource.password=your-password
     ```

3. Build and run the backend:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173` (default Vite port).

## Usage

1. Open your browser and go to `http://localhost:5173`.
2. Register a new account or log in with existing credentials.
3. Create, view, update, or delete tasks from the dashboard.
4. Tasks can be marked as pending, in progress, or completed.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT token

### Tasks (Protected)
- `GET /api/tasks` - Get all tasks for the authenticated user
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/{id}` - Update a task
- `DELETE /api/tasks/{id}` - Delete a task

Include the JWT token in the `Authorization` header as `Bearer <token>` for protected endpoints.

## Project Structure

```
taskflow/
├── backend/
│   ├── src/main/java/com/taskflow/
│   │   ├── controller/     # REST controllers
│   │   ├── dto/            # Data transfer objects
│   │   ├── exception/      # Global exception handling
│   │   ├── model/          # JPA entities
│   │   ├── repository/     # Data repositories
│   │   ├── security/       # JWT and security config
│   │   └── service/        # Business logic
│   ├── src/main/resources/
│   │   └── application.properties  # Config (not committed)
│   └── pom.xml
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API client
│   │   └── types.ts        # TypeScript types
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-feature`.
3. Commit your changes: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For questions or support, please open an issue on GitHub or contact the maintainer.