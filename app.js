const express = require("express");
const bcrypt = require("bcrypt");
const { User } = require("./db");

const app = express();

app.use(express.json());

async function verifyUser(req, res, next) {
    const authHeader = req.headers.authorization;
    const base64 = authHeader.split(" ")[1];
    const usernamePassword = String(Buffer.from(base64, "base64"));
    const [username, password] = usernamePassword.split(":");
    const userRecord = await User.findOne({
        where: {
            username,
        },
    });
    if (!userRecord) {
        return res.sendStatus(404);
    }
    const passwordIsCorrect = await bcrypt.compare(
        password,
        userRecord.passwordHash
    );
    if (passwordIsCorrect) {
        next();
    } else {
        return res.sendStatus(403);
    }
}

app.get("/secrets", verifyUser, (req, res) => {
    res.send("shhhh this was secret");
});

app.post("/users", async (req, res) => {
    const { username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ username, passwordHash });
    res.sendStatus(201);
});

module.exports = app;
