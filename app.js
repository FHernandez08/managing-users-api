const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let users = [];
let userIdCounter = 1;

// Gets the list of users
app.get("/users", (req, res) => {
    res.status(200).json(users);
});

// Creates the new user
app.post("/users", (req, res) => {
    const user = req.body;
    user.id = userIdCounter++;
    users.push(user);

    // 201 - Created
    res.status(201).json({
        message: "The user has been added to the list!",
        user: user
    });
});

// Updates user with new user
app.put("/users/:userId", (req, res) => {
    try {
        const { userId } = req.params;
        const newData = req.body;

        const index = users.findIndex(user => user.id === userId);

        if (index === -1) {
            return res.status(404).send("User not found!");
        }

        users[index] = { ...users[index], ...newData };

        res.status(202).send("User updated successfully!")
    }
    catch (error) {
        console.error(error);
        res.status(500).send("The update wasn't fully processed!");
    }
});

// Deletes the user
app.delete("/users/:userId", (req, res) => {
    try {
        console.log("DELETE route hit!");
        const { userId } = req.params;

        console.log(`User ID from params: ${userId}`);
        console.log("Current users array:", users);
        
        const index = users.findIndex(user => String(user.id) === String(userId));
        if (index === -1) {
            return res.status(404).send("The user doesn't exist!");
        }

        users.splice(index, 1);
        console.log("Updated users array:", users);

        res.status(200).send("User deleted successfully!");
    }
    catch (error) {
        console.log(`User with ID ${userId} deleted!`);
        res.status(500).send("The deletion process wasn't complete.");
    }
});

app.listen(PORT, () => {
    console.log(`Now listening at http://localhost:${PORT}`);
});