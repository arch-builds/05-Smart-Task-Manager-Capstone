const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../database/smart-task-manager.db");
const schemaPath = path.join(__dirname, "../database/schema.sql");

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    const schema = fs.readFileSync(schemaPath, "utf8");
    db.exec(schema, (err) => {
        if (err) {
            console.error("Database initialization error:", err.message);
        } else {
            console.log("Database initialized successfully.");
        }
    });
});

module.exports = db;