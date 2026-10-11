const authSection = document.getElementById("authSection");
const appSection = document.getElementById("appSection");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginMessage = document.getElementById("loginMessage");
const registerMessage = document.getElementById("registerMessage");

const welcomeUser = document.getElementById("welcomeUser");
const logoutButton = document.getElementById("logoutButton");

const taskForm = document.getElementById("taskForm");
const taskFormTitle = document.getElementById("taskFormTitle");
const saveTaskButton = document.getElementById("saveTaskButton");
const cancelEditButton = document.getElementById("cancelEditButton");

const taskMessage = document.getElementById("taskMessage");
const taskList = document.getElementById("taskList");

const profileForm = document.getElementById("profileForm");
const profileMessage = document.getElementById("profileMessage");

let editingTaskId = null;
let currentTasks = [];


function showMessage(element, text, type = "success") {
    element.textContent = text;
    element.className = `message ${type}`;
}


function showAuthenticatedApp() {
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");
}


function showAuthentication() {
    appSection.classList.add("hidden");
    authSection.classList.remove("hidden");
}


async function apiRequest(url, options = {}) {
    const response = await fetch(url, {
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {})
        },
        ...options
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Request failed.");
    }

    return data;
}


/* =========================
   REGISTRATION
========================= */

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const data = await apiRequest("/api/users/register", {
            method: "POST",
            body: JSON.stringify({
                name: document.getElementById("registerName").value,
                email: document.getElementById("registerEmail").value,
                password: document.getElementById("registerPassword").value
            })
        });

        showMessage(registerMessage, data.message);
        registerForm.reset();

    } catch (error) {
        showMessage(registerMessage, error.message, "error");
    }
});


/* =========================
   LOGIN
========================= */

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    try {
        const data = await apiRequest("/api/users/login", {
            method: "POST",
            body: JSON.stringify({
                email: document.getElementById("loginEmail").value,
                password: document.getElementById("loginPassword").value
            })
        });

        showMessage(loginMessage, data.message);

        showAuthenticatedApp();

        await loadProfile();
        await loadTasks();
        await loadDashboard();

    } catch (error) {
        showMessage(loginMessage, error.message, "error");
    }
});


/* =========================
   LOGOUT
========================= */

logoutButton.addEventListener("click", async () => {
    try {
        await apiRequest("/api/users/logout", {
            method: "POST"
        });

        loginForm.reset();
        showAuthentication();

    } catch (error) {
        alert(error.message);
    }
});


/* =========================
   PROFILE
========================= */

async function loadProfile() {
    const data = await apiRequest("/api/users/profile");

    welcomeUser.textContent = `Welcome, ${data.user.name}`;

    document.getElementById("profileName").value =
        data.user.name;

    document.getElementById("profileEmail").value =
        data.user.email;

    document.getElementById("profilePassword").value = "";
}


profileForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const payload = {
        name: document.getElementById("profileName").value,
        email: document.getElementById("profileEmail").value
    };

    const password =
        document.getElementById("profilePassword").value;

    if (password) {
        payload.password = password;
    }

    try {
        const data = await apiRequest("/api/users/profile", {
            method: "PUT",
            body: JSON.stringify(payload)
        });

        showMessage(profileMessage, data.message);

        await loadProfile();

    } catch (error) {
        showMessage(profileMessage, error.message, "error");
    }
});


/* =========================
   TASK CRUD
========================= */

taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const task = {
        title: document.getElementById("taskTitle").value,
        description:
            document.getElementById("taskDescription").value,
        category:
            document.getElementById("taskCategory").value,
        priority:
            document.getElementById("taskPriority").value,
        due_date:
            document.getElementById("taskDueDate").value || null,
        status:
            document.getElementById("taskStatus").value
    };

    try {
        if (editingTaskId) {
            const data = await apiRequest(
                `/api/tasks/${editingTaskId}`,
                {
                    method: "PUT",
                    body: JSON.stringify(task)
                }
            );

            showMessage(taskMessage, data.message);

        } else {
            const data = await apiRequest("/api/tasks", {
                method: "POST",
                body: JSON.stringify(task)
            });

            showMessage(taskMessage, data.message);
        }

        resetTaskForm();

        await loadTasks();
        await loadDashboard();

    } catch (error) {
        showMessage(taskMessage, error.message, "error");
    }
});


function editTask(taskId) {
    const task = currentTasks.find(
        (item) => item.task_id === taskId
    );

    if (!task) return;

    editingTaskId = task.task_id;

    document.getElementById("taskTitle").value =
        task.title || "";

    document.getElementById("taskDescription").value =
        task.description || "";

    document.getElementById("taskCategory").value =
        task.category || "Work";

    document.getElementById("taskPriority").value =
        task.priority || "Medium";

    document.getElementById("taskDueDate").value =
        task.due_date || "";

    document.getElementById("taskStatus").value =
        task.status || "Pending";

    taskFormTitle.textContent = "Edit Task";
    saveTaskButton.textContent = "Update Task";

    cancelEditButton.classList.remove("hidden");

    window.scrollTo({
        top: taskForm.offsetTop - 20,
        behavior: "smooth"
    });
}


async function deleteTask(taskId) {
    const confirmed = confirm(
        "Delete this task?"
    );

    if (!confirmed) return;

    try {
        const data = await apiRequest(
            `/api/tasks/${taskId}`,
            {
                method: "DELETE"
            }
        );

        showMessage(taskMessage, data.message);

        await loadTasks();
        await loadDashboard();

    } catch (error) {
        showMessage(taskMessage, error.message, "error");
    }
}


function resetTaskForm() {
    taskForm.reset();

    editingTaskId = null;

    taskFormTitle.textContent = "Add Task";
    saveTaskButton.textContent = "Add Task";

    cancelEditButton.classList.add("hidden");
}


cancelEditButton.addEventListener(
    "click",
    resetTaskForm
);


/* =========================
   TASK SEARCH & FILTERS
========================= */

async function loadTasks() {
    const params = new URLSearchParams();

    const search =
        document.getElementById("searchInput").value;

    const category =
        document.getElementById("categoryFilter").value;

    const priority =
        document.getElementById("priorityFilter").value;

    const status =
        document.getElementById("statusFilter").value;

    if (search) params.append("search", search);
    if (category) params.append("category", category);
    if (priority) params.append("priority", priority);
    if (status) params.append("status", status);

    const query =
        params.toString()
            ? `?${params.toString()}`
            : "";

    const data = await apiRequest(
        `/api/tasks${query}`
    );

    currentTasks = data.tasks;

    renderTasks(data.tasks);
}


function renderTasks(tasks) {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML =
            "<div class='card'>No tasks found.</div>";
        return;
    }

    tasks.forEach((task) => {
        const card = document.createElement("div");

        card.className = "task-card";

        card.innerHTML = `
      <div class="task-header">
        <h3>${escapeHtml(task.title)}</h3>
        <strong>${escapeHtml(task.status)}</strong>
      </div>

      <p>${escapeHtml(task.description || "No description")}</p>

      <div class="task-meta">
        <span class="badge">${escapeHtml(task.category || "No Category")}</span>
        <span class="badge">${escapeHtml(task.priority || "No Priority")}</span>
        <span class="badge">Due: ${escapeHtml(task.due_date || "None")}</span>
      </div>

      <div class="task-actions">
        <button
          class="edit-button"
          data-id="${task.task_id}">
          Edit
        </button>

        <button
          class="delete-button"
          data-id="${task.task_id}">
          Delete
        </button>
      </div>
    `;

        card
            .querySelector(".edit-button")
            .addEventListener(
                "click",
                () => editTask(task.task_id)
            );

        card
            .querySelector(".delete-button")
            .addEventListener(
                "click",
                () => deleteTask(task.task_id)
            );

        taskList.appendChild(card);
    });
}


document
    .getElementById("applyFiltersButton")
    .addEventListener("click", loadTasks);


document
    .getElementById("clearFiltersButton")
    .addEventListener("click", async () => {
        document.getElementById("searchInput").value = "";
        document.getElementById("categoryFilter").value = "";
        document.getElementById("priorityFilter").value = "";
        document.getElementById("statusFilter").value = "";

        await loadTasks();
    });


/* =========================
   DASHBOARD
========================= */

async function loadDashboard() {
    const data = await apiRequest(
        "/api/tasks/dashboard"
    );

    document.getElementById("metricTotal").textContent =
        data.metrics.total;

    document.getElementById("metricCompleted").textContent =
        data.metrics.completed;

    document.getElementById("metricPending").textContent =
        data.metrics.pending;

    document.getElementById("metricProgress").textContent =
        data.metrics.in_progress;

    document.getElementById("metricOverdue").textContent =
        data.metrics.overdue;

    renderCategoryDistribution(
        data.category_distribution
    );
}


function renderCategoryDistribution(categories) {
    const container =
        document.getElementById(
            "categoryDistribution"
        );

    if (!categories.length) {
        container.textContent =
            "No task data yet.";
        return;
    }

    container.innerHTML = categories
        .map(
            (item) => `
        <div class="category-row">
          <span>${escapeHtml(item.category || "Uncategorized")}</span>
          <strong>${item.count}</strong>
        </div>
      `
        )
        .join("");
}


/* =========================
   SAFE DISPLAY
========================= */

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================
   INITIAL SESSION CHECK
========================= */

async function initializeApp() {
    try {
        await loadProfile();

        showAuthenticatedApp();

        await loadTasks();
        await loadDashboard();

    } catch {
        showAuthentication();
    }
}

initializeApp();