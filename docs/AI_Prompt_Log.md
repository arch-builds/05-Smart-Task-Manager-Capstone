## Prompt 1: Capstone Planning

**Prompt:**  
Review the Smart Task Manager capstone brief and identify the minimum architecture, major requirements, and required submission artifacts.

**Response:**  
Defined a lean full-stack approach using HTML/CSS/JavaScript, Node.js/Express, SQLite, Jest/Supertest, GitHub Actions CI, and the required documentation/artifacts.

**Issue Found:**  
The project could easily expand beyond the assignment scope if requirements and evidence are not tracked from the start.

**Improved Prompt:**  
Create a compact requirements and artifact checklist based only on the capstone brief and required scope.

**Solution:**  
Created `docs/Requirements_Checklist.md` as the master control sheet for requirements, evidence, and submission artifacts.



## Prompt 2: Database Design and Local Setup

**Prompt:**  
Define the minimum SQLite data model needed for the Smart Task Manager based on the capstone requirements.

**Response:**  
Created two related entities: Users and Tasks. Each task belongs to one user through a foreign key. The schema includes required task fields, constrained category/priority/status values, and an index for user and status queries.

**Issue Found:**  
The local SQLite database must remain private and should not be committed to GitHub.

**Improved Prompt:**  
Create the SQLite schema and database initialization approach while keeping the local database file excluded from version control.

**Solution:**  
Created `database/schema.sql`, added `backend/database.js`, initialized the local SQLite database successfully, and verified that the `.db` file is ignored by Git.



## Prompt 3: User Registration Endpoint

**Prompt:**  
Create a secure user registration endpoint for the Smart Task Manager using Node.js, Express, SQLite, and bcrypt. Validate required fields, hash the password, use a parameterized SQL insert, and return a safe JSON response without exposing the password.

**Response:**  
Created `POST /api/users/register` with required-field validation, bcrypt password hashing, parameterized SQLite insertion, duplicate email handling, and a response containing only the new user's ID, name, and email.

**Issue Found:**  
The first command-line registration test used `curl` syntax that PowerShell interpreted incorrectly, causing malformed JSON before the request reached the application correctly.

**Improved Prompt:**  
Provide a PowerShell-compatible command to test the registration endpoint with valid JSON.

**Solution:**  
Used `Invoke-RestMethod` with a JSON body. Registration completed successfully and returned the created user information. The successful result was captured as `01_Registration_Success.png`.



## Prompt 4: User Login and Session Setup

**Prompt:**  
Create a secure login endpoint for the Smart Task Manager using Express, SQLite, bcrypt, and sessions. Validate credentials, compare the submitted password against the stored password hash, and return only safe user information.

**Response:**  
Created `POST /api/users/login` using a parameterized database lookup, bcrypt password comparison, and an Express session storing the authenticated user's ID.

**Issue Found:**  
The session needs to persist so later endpoints can identify the logged-in user and restrict access to that user's own data.

**Improved Prompt:**  
Use the authenticated user's database ID in the session so profile and task endpoints can enforce user-specific access.

**Solution:**  
Stored `user_id` in the session after successful authentication. Login was verified using the test account and captured as `02_Login_Success.png`.




## Prompt 5: Profile Management and Logout

**Prompt:**  
Add authenticated profile and logout functionality to the Smart Task Manager. The profile should allow the logged-in user to view and update name, email, and optionally password. Access must require an authenticated session.

**Response:**  
Added protected profile retrieval and update endpoints plus a logout endpoint. Profile access uses the authenticated user ID stored in the session, and profile updates use parameterized SQL queries. Password changes, when supplied, are hashed before storage.

**Issue Found:**  
Testing authenticated routes requires the same session cookie to persist across login, profile, update, and logout requests.

**Improved Prompt:**  
Provide a PowerShell-compatible test flow that preserves the authenticated session across multiple requests.

**Solution:**  
Used a reusable PowerShell web session to log in, retrieve the profile, update the profile, verify the updated data, and log out successfully. Evidence was captured as `03_Profile_and_Logout.png`.




## Prompt 6: Task CRUD

**Prompt:**  
Add authenticated task CRUD functionality to the Smart Task Manager. Users should be able to create, retrieve, update, and delete tasks. Each operation must be restricted to the logged-in user's own tasks and use parameterized SQL queries.

**Response:**  
Added `POST /api/tasks`, `GET /api/tasks`, `PUT /api/tasks/:id`, and `DELETE /api/tasks/:id`. Each task is linked to the authenticated user's ID from the session, and update/delete operations include both task ID and user ID in the SQL conditions.

**Issue Found:**  
Task operations needed to enforce ownership so one user could not modify another user's task by guessing a task ID.

**Improved Prompt:**  
Ensure every task query is scoped to the authenticated session user and return a not-found response when the task does not belong to that user.

**Solution:**  
Implemented user-scoped CRUD queries and successfully verified create, read, update, and delete behavior. Evidence was captured as `04_Task_CRUD.png`.




## Prompt 7: Backend Refactor and Regression Check

**Prompt:**  
Refactor the growing backend so the Smart Task Manager remains easier to maintain without changing existing behavior.

**Response:**  
Split the backend into a small `server.js`, separate user and task route files, and reusable authentication middleware while retaining the existing database layer.

**Issue Found:**  
The original `server.js` had grown to more than 400 lines, making future additions harder to manage and increasing the risk of accidental changes.

**Improved Prompt:**  
Perform a minimal refactor that separates existing responsibilities while preserving all current API behavior.

**Solution:**  
Created `routes/users.js`, `routes/tasks.js`, and `middleware/auth.js`. Regression testing confirmed login, profile access, empty task retrieval, task creation, task retrieval, and task deletion still worked after the refactor.



## Prompt 8: Search, Filters, and Dashboard Metrics

**Prompt:**  
Add dynamic task search and filtering plus dashboard metrics to the Smart Task Manager. Support title keyword search, category, priority, and status filters. Also return total, completed, pending, in-progress, overdue, and category distribution metrics for the logged-in user.

**Response:**  
Updated the task routes to support query parameters for search and filters and added a dashboard endpoint that calculates task counts and category distribution from SQLite.

**Issue Found:**  
Dashboard metrics need controlled test data so the expected results can be verified accurately.

**Improved Prompt:**  
Create a known test dataset with balanced statuses, priorities, categories, and due dates so search/filter behavior and dashboard totals can be checked against expected values.

**Solution:**  
Seeded nine tasks through the API and verified the dashboard returned 9 total, 3 completed, 3 pending, 3 in progress, 2 overdue, and the expected category distribution. Search and filter queries were also verified. Evidence was captured as `05_Dashboard_Metrics.png` and `06_Search_and_Filter.png`.




## Prompt 9: User Isolation and Negative Security Testing

**Prompt:**  
Verify that authenticated users can only view and modify their own tasks. Create a second test user and attempt to access or delete another user's task.

**Response:**  
Created a second user with a separate authenticated session and task. User-specific task retrieval returned only the tasks belonging to the authenticated user.

**Issue Found:**  
A stronger security check was needed to prove that knowing another task ID does not allow cross-user modification.

**Improved Prompt:**  
Attempt to delete a task owned by User 1 while authenticated as User 2 and verify that the request is rejected.

**Solution:**  
The cross-user delete attempt returned a not-found response because the delete query requires both the task ID and the authenticated user's ID. Evidence was saved as `07_User_Isolation.png`.





## Prompt 10: Automated API Testing

**Prompt:**  
Create a compact automated test suite for the Smart Task Manager using Jest and Supertest. Cover a health check, authenticated profile access, task creation and retrieval, user-isolation security, and input validation.

**Response:**  
Created `tests/capstone.test.js` using Jest and Supertest with authenticated test agents and isolated test users. The suite verifies core API behavior and negative security handling.

**Issue Found:**  
The Express application originally started the server directly, which made automated API testing harder because the test framework needs to load the app without starting a separate listening process.

**Improved Prompt:**  
Separate Express app creation from server startup so the application can be imported safely by automated tests while preserving existing runtime behavior.

**Solution:**  
Created `backend/app.js` for Express configuration and routes, reduced `backend/server.js` to server startup only, moved the session secret into `.env`, and ran the automated suite successfully. All 5 tests passed. Evidence was captured as `08_Automated_Tests_Passing.png`.



