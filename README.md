# Smart Task Manager Capstone

AI-assisted full-stack web application developed as the capstone project for the Entry-Level AI Vibe Coding Applications program.

## Overview

Smart Task Manager allows users to register, log in, manage their profile, and create, organize, search, filter, update, and delete personal tasks.

Each user's tasks are isolated from other users, and dashboard metrics provide a quick view of task status and category distribution.

## Features

### User Management
- User registration
- Secure login
- Logout
- View and update profile
- Password hashing with bcrypt
- Session-based authentication
- User-specific task isolation

### Task Management
- Create tasks
- View tasks
- Edit tasks
- Delete tasks
- Task fields:
  - Title
  - Description
  - Category
  - Priority
  - Due Date
  - Status

### Search and Filtering
- Search by task title
- Filter by category
- Filter by priority
- Filter by status

### Dashboard
- Total task count
- Completed task count
- Pending task count
- In-progress task count
- Overdue task count
- Category distribution

## Technology Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express

### Database
- SQLite

### Authentication and Security
- bcrypt password hashing
- Express sessions
- Parameterized SQL queries
- Local environment variables through `.env`
- User-scoped task access

### Testing
- Jest
- Supertest

### CI
- GitHub Actions

## Project Structure

```text
05-Smart-Task-Manager-Capstone/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── app.js
│   ├── database.js
│   ├── server.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── users.js
│       └── tasks.js
├── database/
│   └── schema.sql
├── docs/
│   ├── AI_Prompt_Log.md
│   ├── Requirements_Checklist.md
│   ├── Architecture_and_Data_Flow.png
│   └── Smart Task Manager ER Diagram.png
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── tests/
│   └── capstone.test.js
├── .gitignore
├── package.json
├── package-lock.json
└── README.md