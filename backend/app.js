require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");

require("./database");

const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");

const app = express();

if (!process.env.SESSION_SECRET) {
    throw new Error("SESSION_SECRET is required.");
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false
        }
    })
);

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        message: "Smart Task Manager API is running"
    });
});

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

module.exports = app;