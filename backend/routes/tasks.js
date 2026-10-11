const express = require("express");
const db = require("../database");
const requireLogin = require("../middleware/auth");

const router = express.Router();

/* =========================
   CREATE TASK
========================= */

router.post("/", requireLogin, (req, res) => {
    const {
        title,
        description,
        category,
        priority,
        due_date,
        status
    } = req.body;

    if (!title) {
        return res.status(400).json({
            error: "Task title is required."
        });
    }

    const taskStatus = status || "Pending";

    const sql = `
    INSERT INTO tasks (
      user_id,
      title,
      description,
      category,
      priority,
      due_date,
      status
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

    db.run(
        sql,
        [
            req.session.userId,
            title,
            description || null,
            category || null,
            priority || null,
            due_date || null,
            taskStatus
        ],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: "Unable to create task."
                });
            }

            res.status(201).json({
                message: "Task created successfully.",
                task_id: this.lastID
            });
        }
    );
});

/* =========================
   READ / SEARCH / FILTER TASKS
========================= */

router.get("/", requireLogin, (req, res) => {
    const {
        search,
        category,
        priority,
        status
    } = req.query;

    let sql = `
    SELECT
      task_id,
      title,
      description,
      category,
      priority,
      status,
      due_date,
      created_date
    FROM tasks
    WHERE user_id = ?
  `;

    const params = [req.session.userId];

    if (search) {
        sql += " AND title LIKE ?";
        params.push(`%${search}%`);
    }

    if (category) {
        sql += " AND category = ?";
        params.push(category);
    }

    if (priority) {
        sql += " AND priority = ?";
        params.push(priority);
    }

    if (status) {
        sql += " AND status = ?";
        params.push(status);
    }

    sql += " ORDER BY created_date DESC";

    db.all(sql, params, (err, tasks) => {
        if (err) {
            return res.status(500).json({
                error: "Unable to retrieve tasks."
            });
        }

        res.json({ tasks });
    });
});

/* =========================
   DASHBOARD METRICS
========================= */

router.get("/dashboard", requireLogin, (req, res) => {
    const metricsSql = `
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed,
      SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending,
      SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) AS in_progress,
      SUM(
        CASE
          WHEN due_date IS NOT NULL
            AND DATE(due_date) < DATE('now')
            AND status != 'Completed'
          THEN 1
          ELSE 0
        END
      ) AS overdue
    FROM tasks
    WHERE user_id = ?
  `;

    const categorySql = `
    SELECT
      category,
      COUNT(*) AS count
    FROM tasks
    WHERE user_id = ?
    GROUP BY category
    ORDER BY category
  `;

    db.get(
        metricsSql,
        [req.session.userId],
        (metricsErr, metrics) => {
            if (metricsErr) {
                return res.status(500).json({
                    error: "Unable to retrieve dashboard metrics."
                });
            }

            db.all(
                categorySql,
                [req.session.userId],
                (categoryErr, categories) => {
                    if (categoryErr) {
                        return res.status(500).json({
                            error: "Unable to retrieve category distribution."
                        });
                    }

                    res.json({
                        metrics: {
                            total: metrics.total || 0,
                            completed: metrics.completed || 0,
                            pending: metrics.pending || 0,
                            in_progress: metrics.in_progress || 0,
                            overdue: metrics.overdue || 0
                        },
                        category_distribution: categories
                    });
                }
            );
        }
    );
});

/* =========================
   UPDATE TASK
========================= */

router.put("/:id", requireLogin, (req, res) => {
    const {
        title,
        description,
        category,
        priority,
        due_date,
        status
    } = req.body;

    if (!title) {
        return res.status(400).json({
            error: "Task title is required."
        });
    }

    const sql = `
    UPDATE tasks
    SET
      title = ?,
      description = ?,
      category = ?,
      priority = ?,
      due_date = ?,
      status = ?
    WHERE task_id = ?
      AND user_id = ?
  `;

    db.run(
        sql,
        [
            title,
            description || null,
            category || null,
            priority || null,
            due_date || null,
            status || "Pending",
            req.params.id,
            req.session.userId
        ],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: "Unable to update task."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Task not found."
                });
            }

            res.json({
                message: "Task updated successfully."
            });
        }
    );
});

/* =========================
   DELETE TASK
========================= */

router.delete("/:id", requireLogin, (req, res) => {
    const sql = `
    DELETE FROM tasks
    WHERE task_id = ?
      AND user_id = ?
  `;

    db.run(
        sql,
        [req.params.id, req.session.userId],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: "Unable to delete task."
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: "Task not found."
                });
            }

            res.json({
                message: "Task deleted successfully."
            });
        }
    );
});

module.exports = router;