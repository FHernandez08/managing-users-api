const express = require("express");
const { body, validationResult } = require("express-validator");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let users = [];
let userIdCounter = 1;

// Validate requests and return errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

// Gets the list of users
app.get("/users", (req, res) => {
    res.status(200).json(users);
});

// Creates the new user
app.post(
    "/users",
    [
        body("name").notEmpty().withMessage("Name is required"),
        body("email").isEmail().withMessage("Valid email is required"),
        body("age").optional().isInt({ min: 0 }).withMessage("Age must be a positive integer")
    ],
    handleValidationErrors,
    (req, res) => {
        const user = { ...req.body, id: userIdCounter++ };
        users.push(user);

        res.status(201).json({
            message: "User added successfully!",
            user
        });
    }
);

// Updates user with new user
app.put(
    "/users/:userId",
    [
        body("name").optional().notEmpty().withMessage("Name cannot be empty"),
        body("email").optional().isEmail().withMessage("Valid email is required"),
        body("age").optional().isInt({ min: 0 }).withMessage("Age must be a positive integer")
    ],
    handleValidationErrors,
    (req, res) => {
        const userId = parseInt(req.params.userId);
        const index = users.findIndex(user => user.id === userId);

        if (index === -1) {
            return res.status(404).send("User not found!");
        }

        users[index] = { ...users[index], ...req.body };

        res.status(202).json({ message: "User updated successfully!", user: users[index] });
    }
);

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