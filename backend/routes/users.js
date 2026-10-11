const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../database");
const requireLogin = require("../middleware/auth");

const router = express.Router();

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            error: "Name, email, and password are required."
        });
    }

    try {
        const passwordHash = await bcrypt.hash(password, 10);

        const sql = `
      INSERT INTO users (name, email, password_hash)
      VALUES (?, ?, ?)
    `;

        db.run(sql, [name, email, passwordHash], function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(409).json({
                        error: "A user with this email already exists."
                    });
                }

                return res.status(500).json({
                    error: "Unable to register user."
                });
            }

            res.status(201).json({
                message: "User registered successfully.",
                user: {
                    user_id: this.lastID,
                    name,
                    email
                }
            });
        });
    } catch (err) {
        res.status(500).json({
            error: "Unable to register user."
        });
    }
});

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            error: "Email and password are required."
        });
    }

    const sql = `
    SELECT user_id, name, email, password_hash
    FROM users
    WHERE email = ?
  `;

    db.get(sql, [email], async (err, user) => {
        if (err) {
            return res.status(500).json({
                error: "Unable to login."
            });
        }

        if (!user) {
            return res.status(401).json({
                error: "Invalid email or password."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatches) {
            return res.status(401).json({
                error: "Invalid email or password."
            });
        }

        req.session.userId = user.user_id;

        res.json({
            message: "Login successful.",
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email
            }
        });
    });
});

router.get("/profile", requireLogin, (req, res) => {
    const sql = `
    SELECT user_id, name, email, created_date
    FROM users
    WHERE user_id = ?
  `;

    db.get(sql, [req.session.userId], (err, user) => {
        if (err) {
            return res.status(500).json({
                error: "Unable to retrieve profile."
            });
        }

        if (!user) {
            return res.status(404).json({
                error: "User not found."
            });
        }

        res.json({ user });
    });
});

router.put("/profile", requireLogin, async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email) {
        return res.status(400).json({
            error: "Name and email are required."
        });
    }

    try {
        if (password) {
            const passwordHash = await bcrypt.hash(password, 10);

            const sql = `
        UPDATE users
        SET name = ?, email = ?, password_hash = ?
        WHERE user_id = ?
      `;

            db.run(
                sql,
                [name, email, passwordHash, req.session.userId],
                function (err) {
                    if (err) {
                        if (err.message.includes("UNIQUE")) {
                            return res.status(409).json({
                                error: "A user with this email already exists."
                            });
                        }

                        return res.status(500).json({
                            error: "Unable to update profile."
                        });
                    }

                    res.json({
                        message: "Profile updated successfully."
                    });
                }
            );
        } else {
            const sql = `
        UPDATE users
        SET name = ?, email = ?
        WHERE user_id = ?
      `;

            db.run(
                sql,
                [name, email, req.session.userId],
                function (err) {
                    if (err) {
                        if (err.message.includes("UNIQUE")) {
                            return res.status(409).json({
                                error: "A user with this email already exists."
                            });
                        }

                        return res.status(500).json({
                            error: "Unable to update profile."
                        });
                    }

                    res.json({
                        message: "Profile updated successfully."
                    });
                }
            );
        }
    } catch (err) {
        res.status(500).json({
            error: "Unable to update profile."
        });
    }
});

router.post("/logout", requireLogin, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                error: "Unable to logout."
            });
        }

        res.json({
            message: "Logout successful."
        });
    });
});

module.exports = router;