const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("./db");

const app = express();

app.use(express.json());

app.post("/users", async (req, res) => {
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash });
    res.sendStatus(201);
});

module.exports = app;
