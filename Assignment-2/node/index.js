const express = require('express');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const SECRET = "VanshxPatel";

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const users = fs.readFileSync('users.txt', 'utf8').split('\n');

    for (let line of users) {
        const [fileUser, filePass, userId, role] = line.trim().split(',');

        if (username === fileUser && password === filePass) {

            const token = jwt.sign(
                { userId: parseInt(userId), role: role },
                SECRET,
                { expiresIn: '1h' }
            );

            return res.json({ token });
        }
    }

    res.status(401).json({ error: "Invalid login" });
});

app.listen(8000, '0.0.0.0', () => {
    console.log("Node running on port 8000");
});