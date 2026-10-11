const request = require("supertest");
const app = require("../backend/app");
const db = require("../backend/database");

const timestamp = Date.now();

const userOne = {
    name: "Jest User One",
    email: `jest-user-one-${timestamp}@example.com`,
    password: "TestPassword123"
};

const userTwo = {
    name: "Jest User Two",
    email: `jest-user-two-${timestamp}@example.com`,
    password: "TestPassword456"
};

const agentOne = request.agent(app);
const agentTwo = request.agent(app);

let userOneTaskId;

beforeAll(async () => {
    await request(app)
        .post("/api/users/register")
        .send(userOne);

    await request(app)
        .post("/api/users/register")
        .send(userTwo);

    await agentOne
        .post("/api/users/login")
        .send({
            email: userOne.email,
            password: userOne.password
        });

    await agentTwo
        .post("/api/users/login")
        .send({
            email: userTwo.email,
            password: userTwo.password
        });
});

afterAll((done) => {
    db.close(done);
});

test("health endpoint confirms the API is running", async () => {
    const response = await request(app)
        .get("/api/health");

    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe("ok");
});

test("authenticated user can access their profile", async () => {
    const response = await agentOne
        .get("/api/users/profile");

    expect(response.statusCode).toBe(200);
    expect(response.body.user.email).toBe(userOne.email);
});

test("authenticated user can create and retrieve a task", async () => {
    const createResponse = await agentOne
        .post("/api/tasks")
        .send({
            title: "Automated Test Task",
            description: "Created by Jest and Supertest",
            category: "Development",
            priority: "High",
            status: "Pending"
        });

    expect(createResponse.statusCode).toBe(201);

    userOneTaskId = createResponse.body.task_id;

    const listResponse = await agentOne
        .get("/api/tasks");

    expect(listResponse.statusCode).toBe(200);

    const taskExists = listResponse.body.tasks.some(
        (task) => task.task_id === userOneTaskId
    );

    expect(taskExists).toBe(true);
});

test("another user cannot delete a task they do not own", async () => {
    const response = await agentTwo
        .delete(`/api/tasks/${userOneTaskId}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe("Task not found.");
});

test("task creation rejects a missing title", async () => {
    const response = await agentOne
        .post("/api/tasks")
        .send({
            category: "Work",
            priority: "Low",
            status: "Pending"
        });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe("Task title is required.");
});