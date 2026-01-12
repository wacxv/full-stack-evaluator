# Full-Stack Task Manager - Implementation Notes

## Overview
A full-stack task management application with user authentication and CRUD operations, featuring a modern dark mode UI.

## What Was Implemented

### Frontend (React + Vite)
✅ **Authentication System**
- User registration with comprehensive password validation
- Login with JWT authentication
- Protected routes with authorization
- Success/error message handling
- Logout functionality

✅ **Task Management Interface**
- Create, read, update, delete tasks
- Toggle task completion status
- Inline task editing
- User-specific task filtering
- Real-time loading and error states
- Empty state handling

✅ **UI/UX**
- Dark mode theme with consistent design system
- Responsive layout for mobile/desktop
- Smooth animations and transitions
- Form validation with user feedback
- Confirmation dialogs for destructive actions

### Backend (ASP.NET Core + PostgreSQL)
✅ **User Management**
- User registration with email uniqueness validation
- Password validation (8+ chars, uppercase, lowercase, digit, special character)
- Secure password hashing (SHA256)
- JWT token generation and validation
- Role-based authorization (User/Admin)
- Email normalization (lowercase, trim)

✅ **Task Management API**
- RESTful CRUD endpoints for tasks
- User-specific task filtering
- Task ownership validation
- Automatic timestamp tracking

✅ **Security**
- JWT authentication middleware
- Authorization attributes on protected endpoints
- CORS configuration
- Password hashing
- Role-based access control

## Technical Stack

**Frontend:**
- React 18
- Vite
- React Router v6
- Axios
- Custom CSS (Grid/Flexbox)

**Backend:**
- ASP.NET Core 9
- Entity Framework Core
- PostgreSQL
- JWT Bearer Authentication

## How to Run

### Prerequisites
```bash
# Required Software
- Node.js (v18+)
- .NET SDK 9.0
- PostgreSQL 15+
```

### Backend Setup
```bash
cd backend

# Update database connection string in appsettings.json
# "DefaultConnection": "Host=localhost;Database=taskmanager;Username=postgres;Password=yourpassword"

dotnet restore
dotnet ef database update
dotnet run
# Backend runs on http://localhost:5267
```

### Frontend Setup
```bash
cd frontend

npm install
npm run dev
# Frontend runs on http://localhost:5173
```

## Testing Instructions

### 1. User Registration
- Navigate to http://localhost:5173/register
- Email: `test@example.com`
- Password: `Test123!` (must meet requirements)
- Confirm password: `Test123!`
- Click "Register"
- Should redirect to login with success message

### 2. Duplicate Email Validation
- Try registering with same email again
- Should show error: "Email is already registered. Please login instead."

### 3. Invalid Password Registration
- Try password without uppercase: `test123!`
- Should show error: "Password must contain at least one uppercase letter"
- Try password without special char: `Test1234`
- Should show error: "Password must contain at least one special character"

### 4. User Login
- Navigate to http://localhost:5173/login
- Enter registered email and password
- Click "Login"
- Should redirect to /tasks page

### 5. Task Management
- Create task: Enter text and click "Add Task"
- Edit task: Click "Edit", modify text, click "Save"
- Toggle completion: Click checkbox
- Delete task: Click "Delete", confirm dialog
- Refresh: Click "Refresh" button

### 6. Protected Routes
- Logout from tasks page
- Try accessing http://localhost:5173/tasks directly
- Should redirect to /login

### 7. Error Handling
- Stop backend server
- Try creating a task
- Should show error banner
- Click X to dismiss error

## API Endpoints

### User Endpoints
```
POST /users/register
Body: { "email": "test@example.com", "password": "Test123!" }

POST /users/login
Body: { "email": "test@example.com", "password": "Test123!" }

GET /users (Admin only)
Authorization: Bearer {token}

GET /users/{id}
Authorization: Bearer {token}

DELETE /users/{id}
Authorization: Bearer {token}
```

### Task Endpoints
```
GET /tasks
Authorization: Bearer {token}

POST /tasks
Authorization: Bearer {token}
Body: { "title": "My Task", "isDone": false, "userId": 1 }

PUT /tasks/{id}
Authorization: Bearer {token}
Body: { "title": "Updated Task", "isDone": true }

DELETE /tasks/{id}
Authorization: Bearer {token}
```

## Design Decisions

**Dark Mode Theme:** Chosen for modern aesthetic and reduced eye strain, aligning with current design trends in developer tools.

**JWT Authentication:** Stateless authentication approach enables scalability and works seamlessly with React SPA architecture.

**Password Validation:** Comprehensive client-side and server-side validation ensures strong password requirements are met.

**User-Specific Tasks:** Tasks are filtered by userId to ensure data isolation and privacy between users.

**Inline Editing:** Task editing is done inline without navigation to improve user experience and reduce clicks.

## Notes

- All tasks are associated with the authenticated user
- JWT tokens expire after 24 hours
- Passwords are hashed using SHA256 before storage
- The application includes comprehensive error handling
- CORS is configured for local development
