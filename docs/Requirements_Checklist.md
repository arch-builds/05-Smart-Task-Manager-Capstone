# Smart Task Manager Capstone Requirements Checklist

## 1. User Management
- [ ] Register user
- [ ] Login
- [ ] Logout
- [ ] View/edit profile
- [ ] Change name, email, password
- [ ] Passwords stored securely
- [ ] Users can only access their own tasks

## 2. Task Management
- [ ] Create task
- [ ] View tasks
- [ ] Edit task
- [ ] Delete task
- [ ] Task fields:
  - Title
  - Description
  - Category
  - Priority: High / Medium / Low
  - Due Date
  - Status: Pending / In Progress / Completed

## 3. Search, Filters & Dashboard
- [ ] Search by task title
- [ ] Filter by category
- [ ] Filter by priority
- [ ] Filter by status
- [ ] Total task count
- [ ] Completed task count
- [ ] Pending task count
- [ ] Overdue task count
- [ ] Category distribution

## 4. Technical Requirements
- [ ] Frontend: HTML, CSS, JavaScript
- [ ] Backend: Node.js + Express
- [ ] REST API
- [ ] SQLite database
- [ ] Parameterized SQL queries
- [ ] Foreign keys
- [ ] Database index
- [ ] Password hashing
- [ ] Local secrets excluded from GitHub
- [ ] `.env` used for local configuration
- [ ] Automated tests
- [ ] GitHub Actions CI

## 5. Required API Endpoints
- [ ] POST `/api/users/register`
- [ ] POST `/api/users/login`
- [ ] GET `/api/tasks`
- [ ] POST `/api/tasks`
- [ ] PUT `/api/tasks/:id`
- [ ] DELETE `/api/tasks/:id`

## 6. Required Submission Artifacts
- [ ] GitHub repository
- [ ] Main + dev branch history
- [ ] `schema.sql`
- [ ] ER diagram
- [ ] AI Prompt Engineering Log with minimum 10 entries
- [ ] `.github/workflows/ci.yml`
- [ ] Green CI screenshot
- [ ] Comprehensive `README.md`

## 7. Functional Evidence To Capture
- [ ] Registration
- [ ] Login
- [ ] Logout/profile
- [ ] Create task
- [ ] Edit task
- [ ] Delete task
- [ ] Search/filter
- [ ] Dashboard metrics
- [ ] User isolation
- [ ] Automated tests passing
- [ ] CI passing