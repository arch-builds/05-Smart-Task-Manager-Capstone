# Smart Task Manager Capstone Requirements Checklist

## 1. User Management
- [x] Register user
- [x] Login
- [x] Logout
- [x] View/edit profile
- [x] Change name, email, password
- [x] Passwords stored securely
- [x] Users can only access their own tasks

## 2. Task Management
- [x] Create task
- [x] View tasks
- [x] Edit task
- [x] Delete task
- [x] Task fields:
  - Title
  - Description
  - Category
  - Priority: High / Medium / Low
  - Due Date
  - Status: Pending / In Progress / Completed

## 3. Search, Filters & Dashboard
- [x] Search by task title
- [x] Filter by category
- [x] Filter by priority
- [x] Filter by status
- [x] Total task count
- [x] Completed task count
- [x] Pending task count
- [x] Overdue task count
- [x] Category distribution

## 4. Technical Requirements
- [x] Frontend: HTML, CSS, JavaScript
- [x] Backend: Node.js + Express
- [x] REST API
- [x] SQLite database
- [x] Parameterized SQL queries
- [x] Foreign keys
- [x] Database index
- [x] Password hashing
- [x] Local secrets excluded from GitHub
- [x] `.env` used for local configuration
- [x] Automated tests
- [x] GitHub Actions CI

## 5. Required API Endpoints
- [x] POST `/api/users/register`
- [x] POST `/api/users/login`
- [x] GET `/api/tasks`
- [x] POST `/api/tasks`
- [x] PUT `/api/tasks/:id`
- [x] DELETE `/api/tasks/:id`

## 6. Required Submission Artifacts
- [x] GitHub repository
- [x] Main + dev branch history
- [x] `schema.sql`
- [x] ER diagram
- [x] AI Prompt Engineering Log with minimum 10 entries
- [x] `.github/workflows/ci.yml`
- [x] Green CI screenshot
- [x] Comprehensive `README.md`

## 7. Functional Evidence To Capture
- [x] Registration
- [x] Login
- [x] Logout/profile
- [x] Create task
- [x] Edit task
- [x] Delete task
- [x] Search/filter
- [x] Dashboard metrics
- [x] User isolation
- [x] Automated tests passing
- [x] CI passing